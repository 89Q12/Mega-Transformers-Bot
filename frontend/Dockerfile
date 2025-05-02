
# Stage 1: Build the Node.js project
FROM node:20 as build

WORKDIR /app

COPY . .
RUN yarn install --network-timeout 100000 \
    && yarn run build 

# Stage 2: Serve the built files using Nginx
FROM nginx:1.28.0-alpine3.21-slim

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
