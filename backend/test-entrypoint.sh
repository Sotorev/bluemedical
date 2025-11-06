#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."

until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "MySQL is up - executing migrations"
npm run migration:run

echo "Running tests..."
npm test

