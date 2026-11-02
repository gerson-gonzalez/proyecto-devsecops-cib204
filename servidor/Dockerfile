# Imagen base con version definida y menor superficie de ataque
FROM node:20-slim

WORKDIR /app

# Instalar dependencias de manera reproducible
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar el codigo de la aplicacion
COPY --chown=node:node . .

# Ejecutar con un usuario sin privilegios
USER node

EXPOSE 3000

CMD ["node", "servidor.js"]
