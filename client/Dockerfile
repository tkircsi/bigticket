FROM node:12-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY ./ ./
RUN npm ci
CMD ["npm", "run", "dev"]
