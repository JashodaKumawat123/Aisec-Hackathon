FROM node:21.1

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Use pnpm to install dependencies
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install

COPY . .


EXPOSE 3000

CMD ["node", "server.js"]
