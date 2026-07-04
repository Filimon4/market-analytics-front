# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:docker

# Stage 2: Production
FROM nginx:1.27-alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем свою конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Для продакшена используем 80 порт
EXPOSE 5173
