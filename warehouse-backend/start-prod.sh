#!/bin/bash
# Start the backend in production mode (Supabase PostgreSQL)
# Reads credentials from .env in the same directory

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "ERROR: .env file not found. Copy .env.example and fill in your values."
  exit 1
fi

echo "Loading environment from .env..."
set -a
source "$SCRIPT_DIR/.env"
set +a

echo "Starting Warehouse Ops backend (production mode)..."
cd "$SCRIPT_DIR"
mvn spring-boot:run
