# Use the official Bun image
FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN bunx prisma generate

# Copy source code and entrypoint
COPY . .

# Ensure entrypoint is executable
RUN chmod +x entrypoint.sh

# Expose the port the app runs on
EXPOSE 3000

# Use entrypoint script to run migrations and then start the app
ENTRYPOINT ["./entrypoint.sh"]
