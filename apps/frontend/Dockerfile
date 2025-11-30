FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de workspaces (raíz y frontend)
COPY ../../package.json ../../yarn.lock ./
COPY ../../domain ./domain
COPY . .

# Instalar dependencias con Yarn
RUN yarn install --frozen-lockfile

# Build del frontend
RUN yarn build

FROM nginx:alpine AS production

# Copiar build output al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración básica de Nginx (opcional, para SPA routing)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]