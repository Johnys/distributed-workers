FROM node:13.14.0

WORKDIR /opt/app

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "dist"]
