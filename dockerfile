FROM node:12.18.3-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app
RUN npm run build

FROM node:12.18.3-alpine AS production
WORKDIR /app

COPY package*.json ./

RUN npm install --production

ADD /src/assets /app/assets
COPY --from=build /app/dist /app

CMD [ "npm", "start" ]