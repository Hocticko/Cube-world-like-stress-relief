# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**To run the game:**
- Simply open `index.html` in a web browser (no build required)
- The game runs directly in the browser using ES modules from CDN

## Project Overview

**Cube World** is a React-based pixel art animation simulator featuring two autonomous stickman characters ("Strum" and "Flex") that roam, interact, and perform various animations.

## Architecture

### File Structure
- `index.html` — Single-file standalone HTML (one-click run)
- `sim.jsx` — Original React component file (~540 lines with emotion captions)

### Core Components

**Pixel Rendering System**
- `dot()` - Draws individual pixels with boundary checking
- `drawGround()` - Renders the terrain with three vertical gradient layers
- `drawMan()` - Main dispatcher that routes to behavior-specific renderers
- `drawIdle()`, `drawWalk()`, `drawRun()`, `drawJump()`, `drawWave()`, `drawSit()`, `drawSpin()`, `drawPushup()`, `drawDance()`, `drawGreet()`, `drawLift()`, `drawGuitar()` - Individual character pose renderers using absolute pixel positioning

**Emotion Captions System**
- `ACTION_CAPTIONS` - Maps actions to caption arrays (e.g., "chillin", "waving", "dancing")
- `drawCaption()` - Renders 5x6 pixel art text above characters
- Each caption shows for 60-120 frames, updates on action change or meetings

**Character State**
- `chars` array with properties: `cubeIdx` (0 or 1), `x` (position), `dir` (direction: 1 or -1), `action`, `actionTimer`, `velocity`, `caption`, `captionTimer`

**Behavior System**
- `SOLO_BEHAVIORS` - Pool of actions when alone
- `MEET_BEHAVIORS` - Actions when characters meet
- `randomBehavior()` - Picks random action excluding current one
- State machine handles action transitions and movement

### Animation Timing
- Frame update: ~12 FPS (80ms per frame)
- Walk cycle: 4 frames
- Run cycle: 6 frames
- Jump cycle: 12 frames
- Dance cycle: 8 beats

### Interaction
- Characters roam between x=3 and x=37 boundaries
- When connected (see "CONNECT" button), characters can teleport between cubes
- Pressing a cube's button forces a random action on that character

**Emotion Captions**
- `ACTION_CAPTIONS` - Maps each action to a pool of caption strings
- `drawCaption()` - Renders pixel art text above characters
- Characters display random caption for their current action for 60-120 frames
- Captions update on action change, meetings, and button presses
