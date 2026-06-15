# Lezzet — Canlı Ses AI Ajanı

Bu dizin, **canlı (full-duplex) ses** modunun sunucu ayağıdır: kullanıcının
LiveKit odasına katılıp gerçek zamanlı konuşan AI rehber. Mobil uygulamadan ve
`server/` proxy'sinden **ayrı** bir servistir.

> CLAUDE.md: canlı mod v1'de `flags.liveVoice = false` ile KAPALIDIR. Bu iskelet,
> altyapı hazır olduğunda açmak içindir.

## Akış

```
Kullanıcı (mobil) ──ses──▶ LiveKit Oda ◀──ses── AI Ajanı (bu servis)
                                              │
                          Deepgram STT ◀──────┤
                          Claude LLM   ◀──────┤  (pişirme bağlamı + gıda güvenliği)
                          ElevenLabs TTS ◀────┘
```

- Uygulama, proxy'nin `POST /voice-token` ucundan **kısa ömürlü** bir oda token'ı
  alır (anahtar uygulamaya gömülmez).
- Ajan, LiveKit'e **worker** olarak kaydolur ve oda açılınca otomatik dispatch
  edilir.
- VAD + turn-detection ile **barge-in** (kullanıcı ajanın sözünü kesebilir)
  framework tarafından yönetilir.

## Anahtarlar

Tüm sağlayıcı anahtarları (Deepgram / Anthropic / ElevenLabs) ve LiveKit
secret'ı **yalnızca bu servisin ortamında** durur. Mobil uygulama hiçbirini
görmez.

## Çalıştırma (yerel)

```bash
cd agent
cp .env.example .env        # anahtarları doldur
pip install -r requirements.txt
python agent.py dev         # geliştirme worker'ı
```

## Docker

```bash
# Repo kökünden:
docker build -f agent/Dockerfile -t lezzet-agent .
docker run --env-file agent/.env lezzet-agent
```

## Gıda güvenliği (kritik)

`agent.py` içindeki sistem yönergesi, CLAUDE.md gıda güvenliği kuralını gömer:
ajan **asla** "kesinlikle pişti / yenebilir" demez; gözlem + öneri verir, riskli
pişirmede iç sıcaklık ölçümünü önerir ve şüphede "biraz daha pişir" tarafında
hata yapar. Bu yönergeyi zayıflatma — hem etik hem mağaza onayı için şarttır.

## Bağlam (tarif + adım)

Uygulama, oda token'ına `{ recipeId, step, locale }` metadata'sını gömer; ajan
bunu okuyup yanıtlarını o tarife/adıma göre temellendirir. Adım değişimini canlı
yansıtmak için bir sonraki adım: LiveKit **data channel** üzerinden gelen
güncellemeleri dinlemek (uygulamada `voiceSessionStore.updateContext`’e karşılık;
şu an iskelette başlangıç metadata'sıyla temellendirme yapılır).

## Maliyet / gecikme notları

- Hedef tur gecikmesi < ~1.5 sn (akışlı STT/LLM/TTS). Model/ses seçimini buna
  göre ayarla.
- Oturum başına maliyet anlamlıdır (STT + LLM token + TTS karakter + LiveKit
  dakika). Öneri: yalnızca abonelere aç, oturum süre sınırı koy, opt-in tut.

## Sürüm uyarısı

`livekit-agents` API'si hızlı evrilir. `requirements.txt` sürümlerini sabitle ve
güncel [LiveKit Agents dokümanına](https://docs.livekit.io/agents/) göre
`AgentSession` / plugin imzalarını doğrula.
