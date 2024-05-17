FROM library/node:alpine

WORKDIR /app
COPY . .

EXPOSE 3000

RUN npm install --force
RUN npm run build

RUN chmod +x /app/console

ENTRYPOINT node build/index.js
