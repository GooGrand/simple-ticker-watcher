FROM node:18.16.0-alpine as base

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY src ./src
COPY tsconfig.json ./tsconfig.json

RUN npm run build

FROM node:18.16.0-alpine

RUN apk update && apk add bash 
COPY package.json ./
COPY .env ./
COPY migrations ./migrations

COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist

EXPOSE 3000
CMD ["dist/index.js"]