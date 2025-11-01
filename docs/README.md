# GitHub Pages Site

This folder contains the GitHub Pages website for the Juicy Platformer coding session.

## Files

- **index.html** - Main landing page with instructions and CodePen setup
- **showcase.html** - Student project gallery
- **showcase-data.js** - Student project data (edit this to add submissions)
- **style.css** - Styling for the site
- **game.js** - Copy of the game code for students to reference
- **game-style.css** - Original game styling
- **demo.html** - Playable demo of the game

## Adding Student Projects

To add a student's project to the showcase:

1. Edit `showcase-data.js`
2. Add a new entry to the `projects` array:

```javascript
{
  title: "Project Name",
  author: "Student Name or Team Name",
  description: "Brief description of what makes it special",
  codepenUrl: "https://codepen.io/username/pen/xxxxx"
}
```

3. Commit and push the changes
4. The showcase will automatically update!

## GitHub Pages Setup

The site is configured to deploy from the `docs/` folder on the `main` branch.

To enable GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages (in the left sidebar)
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main` and folder: `/docs`
5. Click Save

The site will be available at: `https://cavnz.github.io/school-coding/`

## Local Testing

To test the site locally:

```bash
cd docs
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```
