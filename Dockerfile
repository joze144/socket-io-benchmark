# Common build stage
FROM node:20.2.0-alpine3.17

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3000

ENV NODE_ENV production

RUN npm run build
CMD [ "npm", "run", "start" ]
