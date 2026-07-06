# Cube World Like

A digital recreation of the **Cube World** electronic toy series by Radica Games/Mattel (2005–2009).

## Original Toy

The original Cube World featured:
- Magnetic cubes containing animated stick figures
- Each cube had unique animations (playing instruments, lifting weights, etc.)
- Gyroscope for motion-based animation when tilted
- Built-in games and interactive features
- Cubes connect to enable figure interactions
- Up to four figures moving across a 16-cube network
- Slogan: **"Stick people sticking together."**

## This Digital Version

This React-based simulation recreates the core experience:

### Features
- **Two autonomous stickmen** ("Strum" and "Flex") that roam and interact
- **12 distinct animations**: idle, walk, run, jump, wave, sit, spin, pushup, dance, greet, lift, guitar
- **Emotion captions** showing what each character is doing
- **Cube connection system** allowing characters to teleport between cubes
- **Interactive buttons** to force random actions on each character
- **Character meetings** trigger special behaviors when they encounter each other

### How to Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173/ in your browser.

### Architecture

- **Pixel Rendering System** - Custom canvas-based renderer using `dot()` for individual pixels
- **Behavior System** - State machine handling action transitions and movement
- **Emotion Captions** - DOM-based overlay for crisp text display

## Development

Built with:
- React 19
- Vite
- HTML5 Canvas

## Inspiration

This project is inspired by the Cube World electronic toy series, aiming to capture the charm of "stick people sticking together" in a web-based format.

## License

MIT License - see LICENSE file for details.
