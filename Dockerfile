FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci
COPY src ./src
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
