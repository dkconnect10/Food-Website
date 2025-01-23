# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the .env file into the container
COPY .env ./

# Then copy other application files
COPY . ./


# Expose the port the app will run on
EXPOSE 4040

# Command to run the application
CMD [ "npm", "run", "dev" ]



# FROM node:latest
# COPY . . 
# COPY package*.json ./
# COPY .env ./
# RUN npm i 
# EXPOSE 4040
# CMD [ "nodemon","src/index.js" ]