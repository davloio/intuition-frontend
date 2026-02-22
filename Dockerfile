FROM node:25-alpine AS builder

ARG NODE_VERSION=24
ARG BUILDKIT_INLINE_CACHE=1

WORKDIR /app

# Update npm to latest version for security patches
RUN npm install -g npm@latest

COPY package*.json ./

RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
