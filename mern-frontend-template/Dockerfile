# Use an official Node.js image as the base for building the app
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the entire project into the container
COPY . .

# Run TypeScript compilation first to generate .d.ts files
RUN npx tsc --build --force

# Build the frontend (React + Vite)
RUN npm run build

# Use a lightweight web server (nginx) to serve the frontend
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
