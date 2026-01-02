#!/bin/bash
set -e

# Function to wait for database
wait_for_db() {
  echo "Waiting for database to be ready..."
  # Extract host and port from DATABASE_URL
  # Assuming format: postgresql://user:pass@host:port/dbname
  DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||')
  DB_PORT=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|.*:||' -e 's|/.*||')
  
  max_retries=30
  count=0
  while ! exec 6<>/dev/tcp/$DB_HOST/$DB_PORT; do
    echo "Database at $DB_HOST:$DB_PORT is not reachable. Retrying ($count/$max_retries)..."
    sleep 2
    count=$((count + 1))
    if [ $count -ge $max_retries ]; then
      echo "Error: Database timed out."
      exit 1
    fi
  done
  exec 6>&-
  echo "Database is up!"
}

# Run wait function
wait_for_db

# Run migrations
echo "Running database migrations..."
bunx prisma migrate deploy

# Start the application
echo "Starting application..."
exec bun run index.ts

