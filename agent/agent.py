"""
Lezzet — canlı mutfak rehberi AI ajanı (LiveKit Agents).

Bu, UYGULAMADAN AYRI, sunucu-taraflı bir worker'dır. LiveKit'e worker olarak
kaydolur ve bir kullanıcı "Canlı mod"a girip odaya bağlandığında o odaya
dispatch edilir. Akış: kullanıcı sesi -> STT (Deepgram) -> LLM (Claude) -> TTS
(ElevenLabs) -> odaya geri ses. VAD + turn-detection ile barge-in (kullanıcı
sözü kesebilir) framework tarafından yönetilir.

ANAHTARLAR: Tüm sağlayıcı anahtarları BURADA (sunucu ortamında) kalır; mobil
uygulamaya hiçbir gizli anahtar gömülmez (CLAUDE.md). Uygulama yalnızca proxy'den
kısa ömürlü bir oda token'ı alır.

NOT: livekit-agents API'si sürümle değişir; requirements.txt'teki sürümleri
sabitle ve güncel dokümana göre uyarlamayı bekle. Bu, üretime hazır bir
başlangıç iskeletidir.
"""

from __future__ import annotations

import json
import logging

from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, RoomInputOptions
from livekit.plugins import anthropic, deepgram, elevenlabs, silero

logger = logging.getLogger("lezzet-agent")

# --- Kişilik + GIDA GÜVENLİĞİ (CLAUDE.md → kritik kural) -----------------------
# Bu yönergeler ürünün ruhudur: sıcak "anne" tonu + asla kesin pişirme hükmü yok.
BASE_INSTRUCTIONS = """\
Sen Lezzet'sin: kullanıcı yemek yaparken yanında duran, sesle yönlendiren sıcak,
sabırlı bir mutfak rehberisin. Ton: annenin mutfakta olması gibi — kısa, samimi,
cesaretlendirici cümleler. Sesli okunacağın için KISA konuş (1-3 cümle).

Görevin: adım adım yönlendirmek, kullanıcının sorularını yanıtlamak, paniğe
kapıldığında ("yaktım", "çok tuzlu oldu") sakinleştirip kurtarma önerisi vermek.

GIDA GÜVENLİĞİ — ASLA İHLAL ETME:
- "Kesinlikle pişti" ya da "yenebilir" gibi KESİN HÜKÜM VERME. Gözlem + öneri ver.
- Et/tavuk/balık/yumurtada iç sıcaklık ölçümünü öner (örn. tavukta iç sıcaklık
  74°C olmalı; kıymalı yemekte 71°C).
- Şüpheli durumda her zaman "biraz daha pişir" tarafında hata yap, "tamam" deme.
- Bu hem etik bir zorunluluk hem mağaza onayı için şarttır.

Tıbbi/alerji tavsiyesi verme; emin olmadığında güvenli tarafta kal ve kullanıcıyı
kendi duyularıyla kontrol etmeye yönlendir.
"""


def _context_instructions(metadata: str | None) -> str:
    """Oda/katılımcı metadata'sından (tarif + aktif adım) bağlam yönergesi üretir."""
    if not metadata:
        return ""
    try:
        ctx = json.loads(metadata)
    except (ValueError, TypeError):
        return ""
    parts: list[str] = []
    if ctx.get("recipeId"):
        parts.append(f"Şu an pişirilen tarif: {ctx['recipeId']}.")
    if ctx.get("step"):
        parts.append(f"Kullanıcının odaktaki adımı: {ctx['step']}")
    if ctx.get("locale") == "en":
        parts.append("Kullanıcı İngilizce konuşuyor; İngilizce yanıt ver.")
    return " ".join(parts)


async def entrypoint(ctx: JobContext) -> None:
    await ctx.connect()
    logger.info("Ajan odaya bağlandı: %s", ctx.room.name)

    # Kullanıcının token'ına gömülü bağlamı (tarif + adım) oku.
    metadata = None
    for participant in ctx.room.remote_participants.values():
        if participant.metadata:
            metadata = participant.metadata
            break

    instructions = BASE_INSTRUCTIONS
    extra = _context_instructions(metadata)
    if extra:
        instructions = f"{instructions}\n\nBağlam: {extra}"

    # Dil: tr varsayılan; metadata locale=en ise STT'yi de İngilizceye al.
    locale = "tr"
    if metadata:
        try:
            locale = json.loads(metadata).get("locale", "tr")
        except (ValueError, TypeError):
            locale = "tr"
    stt_language = "en" if locale == "en" else "tr"

    session = AgentSession(
        stt=deepgram.STT(model="nova-2", language=stt_language),
        llm=anthropic.LLM(model="claude-sonnet-4-6"),
        tts=elevenlabs.TTS(),
        vad=silero.VAD.load(),  # konuşma algılama → doğal sıra + barge-in
    )

    await session.start(
        room=ctx.room,
        agent=Agent(instructions=instructions),
        room_input_options=RoomInputOptions(),
    )

    # İlk selam — kullanıcıyı karşıla, başlatma.
    greeting = (
        "Greet the user warmly in one sentence and ask if they're ready to start."
        if locale == "en"
        else "Kullanıcıyı tek cümleyle sıcakça karşıla ve hazır olup olmadığını sor."
    )
    await session.generate_reply(instructions=greeting)


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
