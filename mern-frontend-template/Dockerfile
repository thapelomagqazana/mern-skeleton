# Use an official Node.js image as the base
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the entire project into the container
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight web server (nginx) to serve the frontend
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default port
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
