# Usa una imagen base oficial de Node.js
FROM node:18

# Prepara entorno de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Crea directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios primero (mejor cache)
COPY package.json pnpm-lock.yaml ./

# Instala dependencias
RUN pnpm install

# Copia el resto del código
COPY . .

# Expone el puerto esperado por Cloud Run
EXPOSE 8080
ENV PORT=8080

# Comando para iniciar la app
CMD ["node", "server.js"]