FROM node:19-alpine as dev

WORKDIR /srv

CMD ["npm", "run", "start:dev"]


FROM node:19-alpine as prod

COPY ./api /srv
WORKDIR /srv

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prod"]