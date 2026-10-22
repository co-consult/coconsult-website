FROM node:22-alpine
WORKDIR /app
RUN mkdir -p /app/server && chown 65534:65534 /app/server && chmod 755 /app/server
COPY --chown=65534:65534 --chmod=644 server/contact.mjs /app/server/contact.mjs
USER 65534:65534
ENV CONTACT_BIND=0.0.0.0
ENV CONTACT_PORT=3602
ENV CONTACT_SEND_ENABLED=false
EXPOSE 3602
CMD ["node", "server/contact.mjs"]
