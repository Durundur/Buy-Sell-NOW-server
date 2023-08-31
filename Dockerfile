FROM node:alpine

WORKDIR /usr/buy-sell-now-api

COPY ["package*.json","./"]

RUN npm install

COPY ./ ./

CMD ["npm", "start"]