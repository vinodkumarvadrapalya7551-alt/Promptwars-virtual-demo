FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the server file and built assets
COPY server.js ./
COPY dist/ ./dist/

# Set the environment variable for the port
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
