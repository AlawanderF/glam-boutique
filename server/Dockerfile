# Dockerfile para o backend Node/Express
# Build:   docker build -t glam-boutique-api .
# Run:     docker run -d --name glam-api -p 3333:3333 --env-file .env glam-boutique-api

FROM node:20-alpine

WORKDIR /app

# Instala só deps de produção para imagem menor
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o código fonte
COPY src ./src
COPY scripts ./scripts

# Variáveis de ambiente (use --env-file .env ou docker-compose em produção)
ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

# Healthcheck simples
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3333/api/health || exit 1

CMD ["node", "src/index.js"]
