# INITIAL WORK
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Instala com base no package-lock.json (versões fixadas)
RUN npm ci

COPY . .

# Build do app
RUN npm run build

# SECOND WORK
FROM node:18-alpine3.19

WORKDIR /usr/src/app

# Copia apenas o que é necessário
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start:prod"]