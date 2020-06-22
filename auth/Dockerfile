FROM node:12-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY ./package*.json ./
RUN npm ci
COPY ./ ./
# RUN rm -f .npmrc
CMD ["npm", "start"]
