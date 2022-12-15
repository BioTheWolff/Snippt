FROM node:alpine

WORKDIR /srv

RUN npm install -g @nestjs/cli

RUN chown -R 1000:1000 "/root/.npm"

CMD ["npm", "install"]
CMD ["npm", "run", "start:dev"]