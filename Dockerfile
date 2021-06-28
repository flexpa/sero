FROM node:16-alpine AS packages

ADD package.json /app/package.json

WORKDIR /app

# Installing packages witout devDependencies
RUN npm install --only=prod

FROM packages

ADD . /app

# Building TypeScript files
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]