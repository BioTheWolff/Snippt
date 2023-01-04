FROM node:16.19.0-alpine as dev

WORKDIR /srv

CMD ["npm", "run", "dev"]


# Prod builder
FROM node:16.19.0-alpine as prod_builder

COPY ./frontend /srv
WORKDIR /srv

RUN npm ci
RUN npm run build-only


# Prod run
FROM nginx:stable-alpine as prod

COPY ./.docker/frontend/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=prod_builder /srv/dist /usr/share/nginx/html
RUN chmod -R a+r /usr/share/nginx/html