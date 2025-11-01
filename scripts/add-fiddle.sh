#!/bin/bash

# Script to add a JSFiddle to the showcase
# Usage: ./scripts/add-fiddle.sh <jsfiddle-url> <project-name> <author> <description>
#
# Example:
#   ./scripts/add-fiddle.sh https://jsfiddle.net/abc123/ "rainbow-game" "Team Awesome" "Rainbow particles everywhere!"

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Check arguments
if [ "$#" -lt 4 ]; then
    print_error "Missing arguments"
    echo ""
    echo "Usage: $0 <jsfiddle-url> <project-name> <author> <description>"
    echo ""
    echo "Example:"
    echo "  $0 https://jsfiddle.net/abc123/ rainbow-game \"Team Awesome\" \"Rainbow particles everywhere!\""
    echo ""
    echo "Arguments:"
    echo "  jsfiddle-url   : Full JSFiddle URL (e.g., https://jsfiddle.net/abc123/)"
    echo "  project-name   : Folder name (lowercase, hyphens, no spaces)"
    echo "  author         : Student or team name (use quotes if spaces)"
    echo "  description    : Brief description (use quotes if spaces)"
    exit 1
fi

JSFIDDLE_URL="$1"
PROJECT_NAME="$2"
AUTHOR="$3"
DESCRIPTION="$4"

# Validate JSFiddle URL
if [[ ! "$JSFIDDLE_URL" =~ ^https?://jsfiddle\.net/ ]]; then
    print_error "Invalid JSFiddle URL: $JSFIDDLE_URL"
    echo "URL must start with https://jsfiddle.net/"
    exit 1
fi

# Extract fiddle ID from URL
# Examples: https://jsfiddle.net/abc123/ or https://jsfiddle.net/user/abc123/
FIDDLE_ID=$(echo "$JSFIDDLE_URL" | sed -E 's|https?://jsfiddle\.net/([^/]+/)?([^/]+)/?.*|\2|')

if [ -z "$FIDDLE_ID" ]; then
    print_error "Could not extract fiddle ID from URL"
    exit 1
fi

print_info "Fiddle ID: $FIDDLE_ID"

# Find the next available number
SHOWCASE_DIR="docs/showcase"
NEXT_NUM=$(ls -d "$SHOWCASE_DIR"/*-* 2>/dev/null | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1)
NEXT_NUM=$((NEXT_NUM + 1))
NEXT_NUM_PADDED=$(printf "%02d" $NEXT_NUM)

# Create folder name
FOLDER_NAME="${NEXT_NUM_PADDED}-${PROJECT_NAME}"
FOLDER_PATH="${SHOWCASE_DIR}/${FOLDER_NAME}"

print_info "Creating showcase folder: $FOLDER_NAME"

# Create the folder
if [ -d "$FOLDER_PATH" ]; then
    print_error "Folder already exists: $FOLDER_PATH"
    exit 1
fi

mkdir -p "$FOLDER_PATH"
print_success "Created folder: $FOLDER_PATH"

# Download files from JSFiddle
# JSFiddle provides content at /show/ endpoint
SHOW_URL="https://jsfiddle.net/${FIDDLE_ID}/show/"
print_info "Fetching JSFiddle content from: $SHOW_URL"

# Create a temporary file to store the full page
TEMP_HTML=$(mktemp)

# Download the fiddle
if ! curl -s -L "$SHOW_URL" -o "$TEMP_HTML"; then
    print_error "Failed to download JSFiddle"
    rm -rf "$FOLDER_PATH"
    rm -f "$TEMP_HTML"
    exit 1
fi

print_success "Downloaded JSFiddle content"

# JSFiddle embeds code in the page source, we need to extract it
# For now, we'll create a simple embedded version that uses iframe
print_info "Creating showcase files..."

# Create index.html that embeds the fiddle
cat > "$FOLDER_PATH/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>Juicy Platformer - ${AUTHOR}</title>
  <link rel="stylesheet" href="style.css?v=1">
</head>
<body>
  <div style="text-align: center; padding: 20px; background: #34495e; color: white;">
    <h1>Juicy Platformer</h1>
    <p>by ${AUTHOR}</p>
    <p><em>${DESCRIPTION}</em></p>
    <p>
      <a href="${JSFIDDLE_URL}" target="_blank" style="color: #3498db;">Edit on JSFiddle →</a>
    </p>
  </div>

  <iframe
    src="${SHOW_URL}"
    style="width: 100%; height: calc(100vh - 150px); border: none;"
    allowfullscreen
  ></iframe>
</body>
</html>
EOF

# Create a minimal style.css
cat > "$FOLDER_PATH/style.css" << 'EOF'
body {
  margin: 0;
  padding: 0;
  font-family: 'Courier New', monospace;
}
EOF

# Create a placeholder game.js
cat > "$FOLDER_PATH/game.js" << 'EOF'
// This project is hosted on JSFiddle
// The code is embedded via iframe
console.log('JSFiddle project loaded');
EOF

print_success "Created showcase files"

# Create README.md
cat > "$FOLDER_PATH/README.md" << EOF
# ${PROJECT_NAME}

**Author:** ${AUTHOR}
**Description:** ${DESCRIPTION}

## JSFiddle

This project is hosted on JSFiddle: ${JSFIDDLE_URL}

## What's Special

${DESCRIPTION}

## How to Edit

Click the "Edit on JSFiddle" link to fork and modify this project!
EOF

print_success "Created README.md"

# Clean up
rm -f "$TEMP_HTML"

print_success "Showcase folder created successfully!"
echo ""
print_info "Next steps:"
echo "  1. Add this project to docs/showcase-data.js:"
echo ""
echo "  {"
echo "    title: \"${PROJECT_NAME}\","
echo "    author: \"${AUTHOR}\","
echo "    description: \"${DESCRIPTION}\","
echo "    folder: \"showcase/${FOLDER_NAME}\","
echo "    jsfiddle: \"${JSFIDDLE_URL}\""
echo "  }"
echo ""
echo "  2. Commit and push:"
echo "     git add ."
echo "     git commit -m \"Add ${PROJECT_NAME} by ${AUTHOR} to showcase\""
echo "     git push"
echo ""
print_success "Done!"
