FROM docker.io/library/alpine:latest

COPY jewels /app/jewels

CMD ["/app/jewels", "serve"]
