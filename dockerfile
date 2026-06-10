FROM node:20.20.2 AS build
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm

RUN pnpm install

COPY src ./
COPY tsconfig.production.json ./tsconfig.json
RUN pnpm run build

FROM node:20.20.2-alpine
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm

RUN pnpm install --prod --no-lockfile

COPY --from=build /app/dist ./

CMD pnpm run start