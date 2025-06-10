# Stage 1: сборка
FROM node:18-alpine AS builder

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем все зависимости (dev + prod)
RUN npm ci

# Копируем схему Prisma и генерим клиент
COPY prisma ./prisma
# При этом DATABASE_URL берётся из переменной окружения на этапе сборки,
# но если во время сборки не нужно подключаться к БД, prisma generate вполне сработает без активного подключения.
RUN npx prisma generate

# Копируем остальные файлы проекта
COPY tsconfig.json nest-cli.json ./
COPY src ./src

# Собираем TypeScript в JavaScript
RUN npm run build

# Stage 2: финальный образ для запуска
FROM node:18-alpine AS runner

WORKDIR /app

# Устанавливаем только prod-зависимости.
# Но поскольку нам нужен сгенерированный Prisma-клиент из этапа builder,
# мы не делаем npm ci здесь, а копируем node_modules целиком из builder.
# Если хочется поменьше вес, можно вручную установить @prisma/client и остальные prod-зависимости,
# но тогда нужно дополнительно скопировать сгенерированный код клиента.
# Здесь проще: копируем всё node_modules из builder.
COPY --from=builder /app/node_modules ./node_modules

# Копируем скомпилированный код
COPY --from=builder /app/dist ./dist

# Копируем Prisma schema (необязательно, т.к. клиент уже сгенерирован, но может пригодиться для отладки)
COPY prisma ./prisma

# Устанавливаем NODE_ENV
ENV NODE_ENV=production

# Порт, на котором будет слушать Nest. По умолчанию 3000, но в Railway можно прокинуть другой через переменную PORT.
# Чтобы учесть переменную PORT от Railway, в основном коде Nest можно слушать process.env.PORT || 3000.
EXPOSE 3000

# Команда запуска: запускаем скомпилированный бандл
CMD ["node", "dist/main.js"]

