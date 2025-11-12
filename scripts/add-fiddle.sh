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
if [ "$#" -lt 2 ]; then
    print_error "Missing arguments"
    echo ""
    echo "Usage: $0 <jsfiddle-url> <student-name> [description]"
    echo ""
    echo "Examples:"
    echo "  $0 https://jsfiddle.net/abc123/ \"Willem\""
    echo "  $0 https://jsfiddle.net/abc123/ \"Team Awesome\" \"Rainbow particles everywhere!\""
    echo ""
    echo "Arguments:"
    echo "  jsfiddle-url   : Full JSFiddle URL (e.g., https://jsfiddle.net/abc123/)"
    echo "  student-name   : Student or team name (used for author, title, and folder)"
    echo "  description    : Optional: Brief description (defaults to '\${name}'s game')"
    exit 1
fi

JSFIDDLE_URL="$1"
AUTHOR="$2"
DEFAULT_DESC="${AUTHOR}'s game"
DESCRIPTION="${3:-$DEFAULT_DESC}"

# Generate project name from author (lowercase, replace spaces with hyphens)
PROJECT_NAME=$(echo "$AUTHOR" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

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

# Fetch actual code from JSFiddle using jsfiddle-downloader
print_info "Downloading JSFiddle content..."

# Check if jsfiddle-downloader is installed
if ! command -v jsfiddle-downloader &> /dev/null; then
    print_warning "jsfiddle-downloader not found, installing..."
    npm install -g jsfiddle-downloader
fi

# Create temp directory for download
TEMP_DOWNLOAD_DIR=$(mktemp -d)

# Download the fiddle (change to temp dir first since -o doesn't work as expected)
cd "$TEMP_DOWNLOAD_DIR"
if jsfiddle-downloader -l "$JSFIDDLE_URL" > /dev/null 2>&1; then
    cd - > /dev/null
    print_success "Downloaded JSFiddle content"

    # Find the downloaded HTML file
    DOWNLOADED_HTML=$(find "$TEMP_DOWNLOAD_DIR" -name "*.html" | head -1)

    if [ -f "$DOWNLOADED_HTML" ]; then
        print_info "Extracting HTML, CSS, and JavaScript..."

        # Extract CSS (between <style id="compiled-css"> and </style>)
        CSS_CONTENT=$(sed -n '/<style id="compiled-css"/,/<\/style>/p' "$DOWNLOADED_HTML" | sed '1d;$d' | sed '/^\s*\/\*/d' | sed '/EOS/d')

        # Extract JavaScript (between <script type="text/javascript"> and </script>)
        JS_CONTENT=$(sed -n '/<script type="text\/javascript">/,/<\/script>/p' "$DOWNLOADED_HTML" | sed '1d;$d')

        # Extract HTML body content (between <body> and </body>, excluding scripts)
        BODY_CONTENT=$(sed -n '/<body>/,/<\/body>/p' "$DOWNLOADED_HTML" | sed '1d;$d' | grep -v '<script' | grep -v '</script>' | sed 's/^[[:space:]]*//')

        # Create index.html with extracted content
        cat > "$FOLDER_PATH/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juicy Platformer - ${AUTHOR}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${BODY_CONTENT}
  <script src="game.js"></script>
</body>
</html>
EOF

        # Create style.css
        echo "$CSS_CONTENT" > "$FOLDER_PATH/style.css"

        # Create game.js
        echo "$JS_CONTENT" > "$FOLDER_PATH/game.js"

        print_success "Extracted and created project files"
    else
        print_error "Could not find downloaded HTML file"
        rm -rf "$TEMP_DOWNLOAD_DIR"
        exit 1
    fi

    # Clean up temp directory
    rm -rf "$TEMP_DOWNLOAD_DIR"
else
    cd - > /dev/null
    print_error "Failed to download JSFiddle content"
    rm -rf "$TEMP_DOWNLOAD_DIR"
    exit 1
fi

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

# Extract colors from game.js
print_info "Extracting color theme from game.js..."

GAME_JS_PATH="$FOLDER_PATH/game.js"
BACKGROUND_COLOR=""
PLAYER_COLOR=""
PLATFORM_COLOR=""
ACCENT_COLOR=""

if [ -f "$GAME_JS_PATH" ]; then
    # Extract BACKGROUND_COLOR
    BACKGROUND_COLOR=$(grep -oP "BACKGROUND_COLOR\s*=\s*['\"]([^'\"]+)['\"]" "$GAME_JS_PATH" | grep -oP "['\"]([^'\"]+)['\"]" | tr -d "'" | tr -d '"' | head -1)

    # Extract PLAYER_COLOR
    PLAYER_COLOR=$(grep -oP "PLAYER_COLOR\s*=\s*['\"]([^'\"]+)['\"]" "$GAME_JS_PATH" | grep -oP "['\"]([^'\"]+)['\"]" | tr -d "'" | tr -d '"' | head -1)

    # Extract PLATFORM_COLOR or PLATFORM_COLOR_START
    PLATFORM_COLOR=$(grep -oP "PLATFORM_COLOR(?:_START)?\s*=\s*['\"]([^'\"]+)['\"]" "$GAME_JS_PATH" | grep -oP "['\"]([^'\"]+)['\"]" | tr -d "'" | tr -d '"' | head -1)

    # Extract COIN_COLOR or SCORE_COLOR for accent
    COIN_COLOR=$(grep -oP "COIN_COLOR\s*=\s*['\"]([^'\"]+)['\"]" "$GAME_JS_PATH" | grep -oP "['\"]([^'\"]+)['\"]" | tr -d "'" | tr -d '"' | head -1)
    SCORE_COLOR=$(grep -oP "SCORE_COLOR\s*=\s*['\"]([^'\"]+)['\"]" "$GAME_JS_PATH" | grep -oP "['\"]([^'\"]+)['\"]" | tr -d "'" | tr -d '"' | head -1)
    ACCENT_COLOR="${COIN_COLOR:-$SCORE_COLOR}"
fi

# Build preview object
PREVIEW_SECTION=""
if [ -n "$BACKGROUND_COLOR" ] || [ -n "$PLAYER_COLOR" ] || [ -n "$PLATFORM_COLOR" ] || [ -n "$ACCENT_COLOR" ]; then
    print_success "Colors extracted!"
    PREVIEW_SECTION=",\n    preview: {"
    [ -n "$BACKGROUND_COLOR" ] && PREVIEW_SECTION="${PREVIEW_SECTION}\n      background: '${BACKGROUND_COLOR}',"
    [ -n "$PLAYER_COLOR" ] && PREVIEW_SECTION="${PREVIEW_SECTION}\n      player: '${PLAYER_COLOR}',"
    [ -n "$PLATFORM_COLOR" ] && PREVIEW_SECTION="${PREVIEW_SECTION}\n      platform: '${PLATFORM_COLOR}',"
    [ -n "$ACCENT_COLOR" ] && PREVIEW_SECTION="${PREVIEW_SECTION}\n      accent: '${ACCENT_COLOR}'"
    PREVIEW_SECTION="${PREVIEW_SECTION}\n    }"
else
    print_warning "No colors found in game.js (placeholder file created)"
fi

print_success "Showcase folder created successfully!"
echo ""
print_info "Next steps:"
echo ""
echo "  1. Add this project to docs/showcase-data.js:"
echo ""
echo -e "  {"
echo "    title: \"${PROJECT_NAME}\","
echo "    author: \"${AUTHOR}\","
echo "    description: \"${DESCRIPTION}\","
echo "    folder: \"showcase/${FOLDER_NAME}\","
echo -e "    jsfiddle: \"${JSFIDDLE_URL}\"${PREVIEW_SECTION}"
echo "  }"
echo ""
echo "  2. Test the game:"
echo "     Open http://localhost:8000/docs/showcase/${FOLDER_NAME}/index.html"
echo ""
echo "  3. Commit and push:"
echo "     git add ."
echo "     git commit -m \"Add ${PROJECT_NAME} by ${AUTHOR} to showcase\""
echo "     git push"
echo ""
print_success "Done!"
