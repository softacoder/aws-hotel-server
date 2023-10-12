# Version 1
# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /AWS-HOTEL-SERVER

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy your application source code to the container
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3000

# Define the command to run your Node.js app
CMD [ "node", "app.js" ]
