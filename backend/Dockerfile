# Base image
FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
# Install app dependencies
RUN yarn install

# Creates a "dist" folder with the production build
RUN yarn run build
EXPOSE 3000
# Start the server using the production build
CMD [ "node", "dist/main.js" ]