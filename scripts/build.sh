#!/bin/bash
set -e

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 1. Build Frontend
echo ">>> Building Frontend..."
cd "$ROOT_DIR/frontend"
bun install
bun run build

# 2. Sync to Backend Public
echo ">>> Copying build artifacts to backend/public..."
mkdir -p "$ROOT_DIR/backend/public"
# Clean backend/public first
rm -rf "$ROOT_DIR/backend/public/*"
# Copy contents
cp -r build/* "$ROOT_DIR/backend/public/"

# 3. Build Backend Docker Image
# echo ">>> Building Backend Docker Image..."
# cd "$ROOT_DIR/backend"
# docker build -t backend-app:latest .

# echo ">>> Build and Package Complete!"
