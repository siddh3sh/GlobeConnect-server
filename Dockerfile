FROM node:alpine

WORKDIR /app

COPY . .

EXPOSE 9669

CMD node app.js