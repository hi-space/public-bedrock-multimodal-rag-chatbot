FROM node:21

WORKDIR /app
COPY . /app

EXPOSE 9500

RUN yarn install
RUN yarn build
CMD ["yarn", "start"]
