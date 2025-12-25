FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ENV NODE_ENV=production
ENV clientUrl=""
ENV databaseUrl=""
ENV port=""
ENV jwtPrivateKey=""
ENV cloudinary_cloud_name=""
ENV cloudinary_api_key=""
ENV cloudinary_api_secret=""
ENV STRIPE_SECRET_KEY=""
ENV STRIPE_PUBLISHABLE_KEY=""
ENV STRIPE_WEBHOOK_SECRET=""
ENV STRIPE_MONTHLY_PRICE_ID=""
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
