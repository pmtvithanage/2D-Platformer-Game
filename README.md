# 2D Web Platformer Game

A fun 2D platformer game built with Node.js, Express, and Canvas API.

## Features

- **2D Platformer Gameplay**: Navigate platforms and collect coins
- **Multiple Levels**: Progressive difficulty with different platform layouts
- **Score System**: Earn points by collecting coins
- **Physics Engine**: Realistic gravity and jumping mechanics
- **Responsive Design**: Works on desktop and tablets

## Installation

1. Make sure you have Node.js installed
2. Navigate to the project directory:
   ```bash
   cd Game-Engine/2D-Web-Platformer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Game

### Start the server:
```bash
npm start
```

### For development with auto-reload:
```bash
npm run dev
```

Then open your browser and navigate to:
```
http://localhost:3000
```

## How to Play

- **Left Arrow / Right Arrow**: Move left and right
- **Space**: Jump
- **Objective**: Collect all yellow coins to advance to the next level
- **Avoid falling**: If you fall off the platforms, you lose 5 points and restart

## Game Mechanics

- **Physics**: Smooth gravity and jumping physics for responsive gameplay
- **Platforms**: Navigate across colored platforms to reach coins
- **Collectibles**: Yellow circles give you 10 points each
- **Scoring**: Complete levels and collect coins to increase your score
- **Lives**: No traditional lives, but falling deducts points and resets you

## Project Structure

```
2D-Web-Platformer/
├── server.js           # Express server
├── package.json        # Dependencies and scripts
├── public/
│   ├── index.html      # Game UI
│   ├── game.js         # Game logic and Canvas rendering
│   └── style.css       # Styling
└── README.md           # This file
```

## Customization

### Adding More Levels

Edit `public/game.js` and add new level objects to the `levels` array:

```javascript
{
  platforms: [
    new Platform(x, y, width, height, color),
    // ... more platforms
  ],
  collectibles: [
    new Collectible(x, y),
    // ... more collectibles
  ]
}
```

### Adjusting Game Physics

Modify these variables in `game.js`:
- `GRAVITY`: Affects how quickly the player falls
- `player.speed`: Player horizontal movement speed
- `player.jumpPower`: How high the player can jump

### Customizing Colors

Change the player color and platform colors:
- `player.color`: The main character color
- `Platform` constructor: Pass a color parameter (default is `#4ECDC4`)

## Future Enhancements

- Add enemies and obstacles
- Implement sound effects and background music
- Add more visual effects (particles, animations)
- Create a difficulty selector
- Add multiplayer support with WebSockets
- Add mobile touch controls
- Create a level editor

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5 Canvas, CSS3, Vanilla JavaScript
- **Other**: ES6+ JavaScript features

## License

ISC

## Author

PMT Vithanage

Enjoy the game! 🎮
