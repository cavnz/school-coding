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

# Fetch actual code from JSFiddle
print_info "Attempting to fetch code from JSFiddle..."
print_warning "JSFiddle doesn't provide a public API to extract code."
print_info "You'll need to manually copy the code from JSFiddle."
echo ""
echo "Please follow these steps:"
echo "  1. Open ${JSFIDDLE_URL} in your browser"
echo "  2. Copy the HTML from the HTML panel"
echo "  3. Copy the CSS from the CSS panel"
echo "  4. Copy the JavaScript from the JavaScript panel"
echo "  5. Paste them into the respective files in ${FOLDER_PATH}/"
echo ""
print_info "Creating template files..."

# Create template index.html
cat > "$FOLDER_PATH/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juicy Platformer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- TODO: Paste HTML from JSFiddle here -->
  <div class="game-container">
    <canvas id="gameCanvas" width="600" height="500"></canvas>
    <div id="score">Score: 0</div>
  </div>
  <script src="game.js"></script>
</body>
</html>
EOF

# Create template style.css
cat > "$FOLDER_PATH/style.css" << 'EOF'
/* TODO: Paste CSS from JSFiddle here */
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a2e;
  font-family: 'Courier New', monospace;
}

.game-container {
  position: relative;
}

#gameCanvas {
  border: 3px solid #0f3460;
  display: block;
  background: #1a1a2e;
}

#score {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #f1c40f;
  font-size: 36px;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
EOF

# Create template game.js
cat > "$FOLDER_PATH/game.js" << 'EOF'
// TODO: Paste JavaScript from JSFiddle here
console.log('Please copy code from JSFiddle');
EOF

print_success "Created template files"

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
echo "  1. Copy code from JSFiddle to the template files:"
echo "     - Open ${JSFIDDLE_URL}"
echo "     - Copy HTML panel → ${FOLDER_PATH}/index.html (body content only)"
echo "     - Copy CSS panel → ${FOLDER_PATH}/style.css"
echo "     - Copy JS panel → ${FOLDER_PATH}/game.js"
echo ""
echo "  2. Re-run this script to extract colors (or extract manually):"
echo "     ./scripts/add-fiddle.sh \"${JSFIDDLE_URL}\" \"${PROJECT_NAME}\" \"${AUTHOR}\" \"${DESCRIPTION}\""
echo "     (It will detect existing folder and only extract colors)"
echo ""
echo "  3. Add this project to docs/showcase-data.js:"
echo ""
echo -e "  {"
echo "    title: \"${PROJECT_NAME}\","
echo "    author: \"${AUTHOR}\","
echo "    description: \"${DESCRIPTION}\","
echo "    folder: \"showcase/${FOLDER_NAME}\","
echo -e "    jsfiddle: \"${JSFIDDLE_URL}\"${PREVIEW_SECTION}"
echo "  }"
echo ""
echo "  4. Commit and push:"
echo "     git add ."
echo "     git commit -m \"Add ${PROJECT_NAME} by ${AUTHOR} to showcase\""
echo "     git push"
echo ""
print_success "Done!"
