FROM node:18-alpine AS base

# Instalar dependencias del sistema para Prisma
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de workspaces (raíz y backend)
COPY ../../package.json ../../yarn.lock ./
COPY ../../domain ./domain
COPY . .

# Instalar dependencias con Yarn (resuelve workspaces)
RUN yarn install --frozen-lockfile

# Generar Prisma client y migrar DB (asume que la DB está disponible en build)
RUN yarn prisma:generate
RUN yarn prisma:migrate

# Build del backend
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]