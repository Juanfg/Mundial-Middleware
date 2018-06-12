FROM node:8

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

#RUN rm -rf node_modules
#RUN npm cache clear
#RUN rm package.lock.json
#RUN npm install

EXPOSE 8081
CMD ["npm", "run", "dev"]
