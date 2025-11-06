FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081 19000 19001 19002

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

CMD ["npm", "start", "--", "--host", "0.0.0.0"]

