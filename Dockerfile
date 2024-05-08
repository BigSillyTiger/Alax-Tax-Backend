FROM node:alpine as build

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM build as production
# set env
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["npm", "start"]