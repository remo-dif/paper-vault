# Use Node.js 18 image as the base for the development stage
FROM node:18 AS dev

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Set environment variable for development
ENV NODE_ENV=development

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Start the application 
CMD ["ts-node-dev", "--respawn", "--transpile-only", "--inspect=0.0.0.0:9229", "src/main.ts"]

# Use Node.js 18 image as the base for the production stage
FROM node:18 AS production

# Set build argument and environment variable for production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy built files and dependencies from the development stage
COPY --from=dev /usr/src/app/ .

# Expose port 8080 for the application
EXPOSE 8080

# Start the application
CMD [ "node", "dist/main" ]
