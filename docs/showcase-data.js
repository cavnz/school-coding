// Student Project Submissions
// To add a new project, add an entry to this array with the following format:
//
// OPTION 1: Local project with folder
// {
//   title: "Project Name",
//   author: "Student Name or Team Name",
//   description: "What makes this version special",
//   folder: "showcase/folder-name",  // Path to the local project folder
//   jsfiddle: "https://jsfiddle.net/abc123/",  // Optional: JSFiddle link for editing
//   preview: {  // Optional: Color theme for preview
//     background: 'rgb(26, 26, 46)',
//     player: 'rgb(52, 152, 219)',
//     platform: 'rgb(149, 165, 166)',
//     accent: 'rgb(241, 196, 15)'
//   }
// }
//
// OPTION 2: JSFiddle-only project (no local folder)
// {
//   title: "Project Name",
//   author: "Student Name",
//   description: "What makes this version special",
//   jsfiddle: "https://jsfiddle.net/abc123/",  // Required: JSFiddle URL
//   preview: {  // Optional: Custom color theme (if omitted, shows generic JSFiddle link)
//     background: 'rgb(26, 26, 46)',
//     player: 'rgb(52, 152, 219)',
//     platform: 'rgb(149, 165, 166)',
//     accent: 'rgb(241, 196, 15)'
//   }
// }
//
// HOW TO EXTRACT COLORS (for local projects):
// 1. Open showcase.html in a browser
// 2. Open browser console (F12)
// 3. Run: extractProjectColors('showcase/folder-name')
// 4. Copy the output into the project entry below

const projects = [
  {
    title: "Starter Version",
    author: "Jimmy (and AI)",
    description: "The basic starting point with no effects added yet. This is where everyone begins!",
    folder: "showcase/01-starter",
    preview: {
      background: 'rgb(26, 26, 46)',
      player: 'rgb(52, 152, 219)',
      platform: 'rgb(149, 165, 166)',
      accent: 'rgb(241, 196, 15)'
    }
  },
  {
    title: "Juicy Edition",
    author: "Jimmy (and AI)",
    description: "A slightly juicier version with added effects! Enjoy screen shakes, particle effects, and sound effects to make the game more satisfying.",
    folder: "showcase/02-little-juicy",
    preview: {
      background: 'rgb(26, 26, 46)',
      player: 'rgb(52, 152, 219)',
      platform: 'rgb(149, 165, 166)',
      accent: 'rgb(241, 196, 15)'
    }
  },
  {
    title: "Ultra Juicy Edition",
    author: "Jimmy (and AI)",
    description: "An over-the-top version packed with intense effects! Dramatic screen shakes, explosive particles, and booming sounds for an adrenaline-pumping experience!",
    folder: "showcase/03-ultra-juicy",
    preview: {
      background: 'rgb(15, 15, 35)',
      player: 'rgb(255, 107, 157)',
      platform: 'rgb(107, 114, 120)',
      accent: 'rgb(255, 235, 59)'
    }
  },
  {
    title: "🚀 Space Mission Theme",
    author: "Jimmy (and AI)",
    description: "A galactic adventure! Features a spaceship player, twinkling stars, energy crystals, laser beams, and space physics with lower gravity. Colors and simple drawing show how theming transforms the game.",
    folder: "showcase/04-space-theme",
    preview: {
      background: 'rgb(5, 5, 15)',
      player: 'rgb(230, 230, 240)',
      platform: 'rgb(60, 60, 80)',
      accent: 'rgb(100, 200, 255)'
    }
  },
  {
    title: "✨💖 Superstar Theme",
    author: "Jimmy (and AI)",
    description: "A vibrant superstar inspired world! Cute character with headphones, pink hearts to collect, rainbow sparkles, lightning bolts, and pulsing effects. Shows how color gradients and CSS animations create personality.",
    folder: "showcase/05-kpop-theme",
    preview: {
      background: 'rgb(20, 15, 30)',
      player: 'rgb(255, 105, 180)',
      platform: 'rgb(138, 43, 226)',
      accent: 'rgb(255, 215, 0)'
    }
  },
  {
    title: "willem",
    author: "Willem",
    description: "Willem's game",
    folder: "showcase/06-willem",
    jsfiddle: "https://jsfiddle.net/h6zb1r3c",
    preview: {
      background: 'white',
      player: 'black',
      platform: 'black',
      accent: 'BLACK'
    }
  },
  {
    title: "alfie",
    author: "Alfie",
    description: "Alfie's game",
    folder: "showcase/07-alfie",
    jsfiddle: "https://jsfiddle.net/a6j7dxut/",
    preview: {
      background: 'rgb(112, 73, 94)',
      player: 'rgb(52, 152, 219)',
      platform: 'rgb(149, 65, 166)',
      accent: 'rgb(243, 156, 18)'
    }
  },
  {
    title: "elliot",
    author: "Elliot",
    description: "Elliot's game",
    folder: "showcase/08-elliot",
    jsfiddle: "https://jsfiddle.net/ywz12jo6/",
    preview: {
      background: 'rgb(15, 100, 35)',
      player: 'rgb(255, 10, 15)',
      platform: 'rgb(107, 114, 120)',
      accent: 'rgb(255, 217, 61)'
    }
  }
];
