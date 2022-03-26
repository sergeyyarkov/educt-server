ARG NODE_IMAGE=node:14.17.3-alpine3.11

FROM ${NODE_IMAGE} AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

FROM base as builder
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN node ace build --production

FROM base as production
ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0
WORKDIR /home/node/app
COPY --chown=node:node --from=builder /home/node/app/build .
RUN npm ci --production

EXPOSE 3333
CMD ["dumb-init", "node", "server.js"]