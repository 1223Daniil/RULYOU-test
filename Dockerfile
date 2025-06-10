FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

COPY tsconfig.json nest-cli.json ./
COPY src ./src

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

COPY prisma ./prisma

ENV NODE_ENV=production


EXPOSE 3000

CMD ["node", "dist/main.js"]

