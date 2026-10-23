FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Public guide is omitted unless this build argument is exactly true.
ARG PUBLIC_ASSISTANT=false
ENV PUBLIC_ASSISTANT=$PUBLIC_ASSISTANT
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build --chown=101:101 /app/dist/ /usr/share/nginx/html/
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
