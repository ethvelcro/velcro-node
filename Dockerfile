FROM node:10 as builder

ENV PORT 3000
EXPOSE ${PORT}

WORKDIR /velcro-node

RUN npm install -g yarn

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

ENV NODE_ENV production

CMD ["node", "./lib/index.js"]
