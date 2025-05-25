FROM oven/bun:1.1-alpine

WORKDIR /app

# Install Node and PM2
RUN apk add --no-cache nodejs npm && \
    npm install -g pm2

# Copy dependency files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy drizzle config + schema
COPY drizzle.config.ts ./
COPY src/db ./src/db

# Generate Drizzle SQL migrations
RUN bunx drizzle-kit generate

# Copy the rest of the app and build it
COPY . .

# Run build script
RUN bun run build

# Start app using PM2
CMD ["pm2-runtime", "dist/main.js"]
