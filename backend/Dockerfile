# Base image
FROM node:24

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
# Install app dependencies
RUN yarn install --immutable --offline-install && \
    yarn run build && \
    yarn run prisma generate
EXPOSE 3000
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
