# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL
ARG VITE_API_BASE_URL_API
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_BASE_URL_API=$VITE_API_BASE_URL_API

RUN npm run build:docker

# Stage 2: Production
FROM nginx:1.27-alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем свою конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Для продакшена используем 80 порт
EXPOSE 5173
