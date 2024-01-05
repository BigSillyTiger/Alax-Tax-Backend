FROM node:18.16.0-alpine as build


WORKDIR /app
COPY package*.json ./
# RUN npm install -g nodemon vite ts-node
RUN npm install
COPY . .
RUN npm run build

FROM build as production
# set env
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 6464
CMD ["npm", "start"]