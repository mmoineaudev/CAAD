#!/bin/bash
# CAAD - Antenna CAD Launcher
# Launches the FDTD electromagnetic simulation application

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================================"
echo "  CAAD - Antenna CAD Application"
echo "  Finite-Difference Time-Domain (FDTD) Simulator"
echo "============================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo ""
fi

# Check if Electron is installed
if ! command -v electron &> /dev/null && [ ! -f "node_modules/.bin/electron" ]; then
  echo "Error: Electron not found. Run 'npm install' first."
  exit 1
fi

# Launch the application
echo "Starting CAAD..."
echo "============================================================"
echo ""

if command -v electron &> /dev/null; then
  electron .
else
  ./node_modules/.bin/electron .
fi
