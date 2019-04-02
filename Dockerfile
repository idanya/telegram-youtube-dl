FROM node:11.13.0-stretch-slim
COPY . /app
WORKDIR /app
RUN npm install --production && npm run build

FROM node:11.13.0-stretch-slim
COPY --from=0 /app/dist /app/dist
COPY --from=0 /app/node_modules /app/node_modules
CMD NODE_PATH=/app/dist/ node /app/dist/bot.js

