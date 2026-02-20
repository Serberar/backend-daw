FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependencias del sistema necesarias para bcryptjs y prisma
RUN apk add --no-cache openssl

# ── Etapa de dependencias ──────────────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ── Etapa de desarrollo ────────────────────────────────────────────────────────
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
CMD ["npm", "run", "dev"]

# ── Etapa de producción ────────────────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src

EXPOSE 3000
CMD ["node", "src/main.js"]
