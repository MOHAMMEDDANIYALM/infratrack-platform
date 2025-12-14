# Production Dockerfile for InfraTrack (Node 20)
FROM node:20-alpine AS base
WORKDIR /app

# Install shared tools
RUN corepack enable

# ----- Build frontend -----
FROM base AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend ./
RUN npm run build

# ----- Build backend -----
FROM base AS backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci
COPY backend ./

# Copy built frontend into backend public folder
COPY --from=frontend /app/frontend/dist /app/backend/public

# ----- Runtime -----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app/backend

# Copy backend from build stage (includes node_modules)
COPY --from=backend /app/backend /app/backend

# Expose default container port (informational)
EXPOSE 8080

# Default PORT if not provided
ENV PORT=8080

# Start using npm start
CMD ["npm", "start"]
