FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all frontend code
COPY . .

EXPOSE 5173

# Start Vite dev server for local Docker testing
CMD ["npm", "run", "dev", "--", "--host"]
