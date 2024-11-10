FROM library/alpine:latest

COPY jewels /app/jewels

CMD ["/app/jewels", "serve"]
