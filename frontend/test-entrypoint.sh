#!/bin/sh
set -e

echo "Running frontend tests..."
npm run test:coverage

echo "Tests completed successfully!"

