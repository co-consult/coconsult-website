# Separate from the site image and from the contact service.
# ASSISTANT_ENABLED and ASSISTANT_MODEL_ENABLED stay false here.
# assistant.env, outside Git, is the only place that may turn them on.
# No host port. Do not attach this service to proxy-network or the contact network.
FROM node:22-alpine
WORKDIR /app
RUN mkdir -p /app/server /app/src/assistant \
  && chown -R 65534:65534 /app \
  && chmod 755 /app /app/server /app/src /app/src/assistant
COPY --chown=65534:65534 --chmod=644 server/assistant.mjs /app/server/assistant.mjs
COPY --chown=65534:65534 --chmod=644 src/assistant/guide.mjs /app/src/assistant/guide.mjs
COPY --chown=65534:65534 --chmod=644 src/assistant/knowledge.mjs /app/src/assistant/knowledge.mjs
USER 65534:65534
ENV ASSISTANT_BIND=10.230.23.10
ENV ASSISTANT_PORT=3603
ENV ASSISTANT_ENABLED=false
ENV ASSISTANT_MODEL_ENABLED=false
EXPOSE 3603
CMD ["node", "server/assistant.mjs"]
