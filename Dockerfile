FROM node:24-alpine AS builder

ARG NODE_VERSION=24
ARG BUILDKIT_INLINE_CACHE=1

WORKDIR /app

COPY package*.json ./

RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

FROM node:24-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
