FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]