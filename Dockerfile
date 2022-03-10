# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:17-alpine

FROM ${NODE_IMAGE} as base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base as dependencies
COPY --chown=node:none ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies as build
RUN node ace build --production --ignore-ts-errors

FROM base as production

ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0

COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE 3333
CMD [ "dumb-init", "node", "server.js" ]