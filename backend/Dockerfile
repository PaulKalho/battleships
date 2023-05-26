FROM node:carbon as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#NGINX 

FROM nginx:alpine as production-build

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app /usr/share/nginx/html

EXPOSE 3001

ENTRYPOINT ["nginx", "-g", "daemon off;"]