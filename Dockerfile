# In development, the dockerfile is run to this point only
FROM node:16.14-alpine
COPY . /app
WORKDIR /app
RUN yarn install --frozen-lockfile
RUN yarn run lint
RUN CI=true yarn test
