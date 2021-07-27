FROM node:14.17.1 AS packages

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

WORKDIR /app

# Installing packages witout devDependencies
RUN npm ci --only=prod

ENV NODE_ENV production

FROM packages as build

ADD . /app

# Building TypeScript files
RUN npm run build

FROM build

EXPOSE 8080

CMD ["node", "dist/index.js"]