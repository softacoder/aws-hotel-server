# Version 1
# Use the official Node.js runtime as the base image
# FROM node:18-alpine
FROM aws-hotel-server-docker-image
# Set the working directory inside the container
# WORKDIR /AWS-HOTEL-SERVER
WORKDIR /aws-hotel-server-docker-container
# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy your application source code to the container
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3000

# Define the command to run your Node.js app
CMD [ "node", "server.js" ]
