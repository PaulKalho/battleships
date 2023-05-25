FROM node:carbon

WORKDIR /app

COPY package.json ./

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]