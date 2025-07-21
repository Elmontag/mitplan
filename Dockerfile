# Build frontend
FROM node:20 AS build
WORKDIR /app
COPY client ./client
RUN cd client && npm install && npm run build

# Build backend
FROM node:20
WORKDIR /app
COPY server ./server
COPY --from=build /app/client/dist ./public
WORKDIR /app/server
RUN npm install --omit=dev
ENV PORT=3001
CMD ["node", "server.js"]
EXPOSE 3001
