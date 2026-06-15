# Lezzet proxy — sıfır bağımlılık (saf Node). İmaj küçük: yalnızca server/ kopyalanır.
# Build (repo kökünden):  docker build -f server/Dockerfile -t lezzet-proxy .
# Çalıştır:               docker run -p 8787:8787 --env-file .env lezzet-proxy
FROM node:20-alpine

WORKDIR /app
COPY server/ ./server/

ENV PORT=8787
EXPOSE 8787
USER node

# Basit sağlık kontrolü: /health 200 dönmeli.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" || exit 1

CMD ["node", "server/proxy.mjs"]
