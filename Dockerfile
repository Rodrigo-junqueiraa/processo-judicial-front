FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o código fonte
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Iniciar em modo dev com host exposto para Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
