FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app ./app
EXPOSE 8080
CMD ["node", "app/server.js"]
