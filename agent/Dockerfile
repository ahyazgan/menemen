# Lezzet canlı ses ajanı — bağımsız worker (uygulamadan ve proxy'den ayrı).
FROM python:3.12-slim

WORKDIR /app

# Bağımlılıkları önce kur (katman önbelleği).
COPY agent/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Silero VAD model dosyalarını önceden indir (ilk istek gecikmesini azalt).
COPY agent/agent.py ./agent.py
RUN python agent.py download-files || true

# LiveKit'e worker olarak kaydol ve odalara dispatch'i bekle.
CMD ["python", "agent.py", "start"]
