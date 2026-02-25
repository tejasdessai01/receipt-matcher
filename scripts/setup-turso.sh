#!/bin/bash
# ReceiptMatch — One-command Turso database setup
# Usage: bash scripts/setup-turso.sh

set -e

DB_NAME="receiptmatch"

echo "Setting up Turso database for ReceiptMatch..."
echo ""

# Check if turso CLI is installed
if ! command -v turso &> /dev/null; then
  echo "Installing Turso CLI..."
  curl -sSfL https://get.tur.so/install.sh | bash
  export PATH="$HOME/.turso:$PATH"
fi

# Check if logged in
if ! turso auth status &> /dev/null 2>&1; then
  echo "Please sign up / log in to Turso (free):"
  turso auth signup
fi

# Create database
echo "Creating database '$DB_NAME'..."
turso db create "$DB_NAME" 2>/dev/null || echo "Database already exists."

# Get URL and token
DB_URL=$(turso db show "$DB_NAME" --url)
DB_TOKEN=$(turso db tokens create "$DB_NAME")

echo ""
echo "Database ready!"
echo ""
echo "Add these to your Vercel environment variables:"
echo "  TURSO_DATABASE_URL=$DB_URL"
echo "  TURSO_AUTH_TOKEN=$DB_TOKEN"
echo ""

# Push schema
echo "Pushing schema to database..."
DATABASE_URL="$DB_URL" TURSO_DATABASE_URL="$DB_URL" TURSO_AUTH_TOKEN="$DB_TOKEN" \
  npx prisma db push --accept-data-loss

echo ""
echo "Done! Your database is ready for production."
