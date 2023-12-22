FROM node:latest

WORKDIR /src/app

RUN apt-get update && apt-get install -y sudo
RUN sudo apt-get install -y nodejs npm

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
