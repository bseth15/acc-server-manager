# Dockerfile for Node Express Backend api (development)

FROM node:alpine

# Create App Directory 
WORKDIR /opt/accsm

# Install Dependencies
COPY package*.json ./
RUN npm install
ENV PATH /opt/accsm/node_modules/.bin:$PATH

# Create Code Directory and Copy App Source Code
WORKDIR /opt/accsm/code
COPY . .
