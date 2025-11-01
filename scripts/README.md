# Scripts

Helper scripts for managing the Juicy Platformer project.

## add-fiddle.sh

Automatically adds a student's JSFiddle to the showcase.

### Usage

```bash
./scripts/add-fiddle.sh <jsfiddle-url> <project-name> <author> <description>
```

### Parameters

- **jsfiddle-url**: Full JSFiddle URL (e.g., `https://jsfiddle.net/abc123/`)
- **project-name**: Folder name (lowercase, use hyphens, no spaces)
- **author**: Student or team name (use quotes if it contains spaces)
- **description**: Brief description of what makes this version special (use quotes)

### Example

```bash
./scripts/add-fiddle.sh \
  https://jsfiddle.net/abc123/ \
  rainbow-explosion \
  "Team Awesome" \
  "Rainbow particles with crazy gravity effects!"
```

### What It Does

1. ✅ Extracts the fiddle ID from the URL
2. ✅ Finds the next available showcase number (e.g., `03-`, `04-`, etc.)
3. ✅ Creates a new folder: `docs/showcase/XX-project-name/`
4. ✅ Generates files:
   - `index.html` - Embeds the JSFiddle via iframe
   - `style.css` - Minimal styling
   - `game.js` - Placeholder
   - `README.md` - Project documentation
5. ✅ Prints instructions for updating `showcase-data.js`

### After Running

The script will output instructions like this:

```javascript
// Add this to docs/showcase-data.js:
{
  title: "rainbow-explosion",
  author: "Team Awesome",
  description: "Rainbow particles with crazy gravity effects!",
  folder: "showcase/03-rainbow-explosion",
  jsfiddle: "https://jsfiddle.net/abc123/"
}
```

Then commit and push:

```bash
git add .
git commit -m "Add rainbow-explosion by Team Awesome to showcase"
git push
```

### Requirements

- `bash` (any modern version)
- `curl` (for downloading JSFiddle content)
- `sed` (for text processing)

### Notes

- The script uses iframe embedding to display JSFiddle projects
- Students can still click "Edit on JSFiddle" to fork and modify
- The JSFiddle URL is preserved and displayed in the showcase
- Folder numbers are automatically incremented (01, 02, 03, etc.)
