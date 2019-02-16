FROM node:10 as builder

ENV PORT 3000
EXPOSE ${PORT}

WORKDIR /velcro-node

RUN npm install -g yarn

COPY . .
RUN yarn
RUN yarn dist

FROM node:10-alpine

WORKDIR /velcro-node
COPY --from=builder /velcro-node/dist/bundle.umd.js ./velcro-node.js
CMD ["node", "./velcro-node.js"]