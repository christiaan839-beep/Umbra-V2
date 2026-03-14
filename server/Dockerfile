FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the server source code
COPY ws.ts ./

# Create a dummy .env if none exists (for local testing, prod should use cloud env variables)
RUN touch .env

# Expose the WebSocket port
EXPOSE 3011

# Start the server using ts-node
CMD ["npm", "start"]
