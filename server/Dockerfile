# Dockerfile for Node Express Backend api (development)

FROM node:15.4.0-alpine3.12

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json ./
COPY yarn.lock ./
RUN rm -rf node_modules && yarn install --frozen-lockfile

# Copy app source code
COPY . .
