FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install && npm run build
COPY public ./public
COPY src ./src
EXPOSE 3000
CMD ["npx","serve","-s","dist","-l","3000"]
