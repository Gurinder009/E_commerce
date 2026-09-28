# Frontend Dockerfile for ShopSphere Client
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY shared ./shared

RUN npm install --workspace=client

COPY client ./client
RUN npm run build --workspace=client

# Production Nginx Server
FROM nginx:alpine AS runner

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
