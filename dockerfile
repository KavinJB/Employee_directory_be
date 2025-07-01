# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /src /public

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy Public folder
COPY public ./public

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app (adjust this if you're not using dist/index.js)
CMD ["node", "dist/index.js"]
