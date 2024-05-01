FROM node:alpine as build

WORKDIR /home/node/app

COPY package.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]