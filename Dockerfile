FROM node:18.16.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY ./src ./src
COPY nodemon.json ./
COPY tsconfig.json ./
RUN npm install -g nodemon vite ts-node
RUN npm install --only=production
CMD npm start