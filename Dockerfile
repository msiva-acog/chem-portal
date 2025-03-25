# Base image with Node.js (using Alpine for smaller size)
FROM node:latest

# Create a directory for the app
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

#Build the production code
RUN npm run build

# Expose port 3001 (you can use any port you prefer)
EXPOSE 3005

# Start the development server
CMD ["npm", "start"]