# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:1.25-alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Stage 3: Development (optional)
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=builder /app .
EXPOSE 5173
ENV NODE_OPTIONS=--max_old_space_size=4096
CMD ["npx", "vite", "--host"]
