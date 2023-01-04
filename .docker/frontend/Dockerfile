FROM node:16.19.0-alpine as dev

WORKDIR /srv

CMD ["npm", "run", "dev"]


# Prod builder
FROM node:16.19.0-alpine as prod_builder

COPY ./frontend /srv
WORKDIR /srv

RUN npm install
RUN npm run build-only


# Prod run
FROM nginx:stable-alpine as prod

COPY --from=prod_builder /srv/dist /usr/share/nginx/html