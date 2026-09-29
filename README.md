# ⚓ Battleship

A responsive, installable **Battleship** game built with Vanilla JavaScript as part of **The Odin Project**.

## 🎮 Live Preview

👉 **[Play Battleship](https://hadiswebpro.github.io/Battleship-odin/)**

The game is designed to work as a **Progressive Web App (PWA)**, so it can be installed from a supported browser and launched as a standalone app.

## ✨ Features

- ⚓ Battleship gameplay against the computer
- 🚢 Place five ships on a 10×10 board
- 🔄 Tap a placed ship to rotate it
- 🖱️ Drag and drop ships with mouse
- 📱 Touch-friendly ship dragging on phones and tablets
- ↔️ Responsive portrait and landscape layouts
- 🎯 Hit and miss markers
- 🤖 Computer opponent
- 🏆 Win detection and restart flow
- 🔊 Background music and game sound effects
- 📲 Installable PWA
- 📴 Offline app-shell caching with a Service Worker

## 🧩 How ship placement works

1. Select a ship.
2. Place it on the board.
3. Tap an already placed ship to rotate it.
4. Drag a placed ship to move it.
5. If a rotation or placement would go outside the board or overlap another ship, the game shows an error instead of changing the position.

On touch devices, a short tap is treated as **rotate**, while an actual drag is treated as **move**.

## 🛠️ Built With

- HTML
- CSS
- Vanilla JavaScript (ES6 modules)
- Webpack
- Babel
- Jest
- Progressive Web App APIs

## 🧠 What I Practiced

This project helped me practice:

- Modular JavaScript architecture
- Factory/classes and game logic
- DOM manipulation
- Event handling
- Pointer Events for touch interaction
- Drag-and-drop interactions
- Responsive CSS
- State management
- Unit testing with Jest
- Webpack bundling
- Service Workers and offline caching
- PWA manifests and installability

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

## 🚀 Run Locally

```bash
git clone https://github.com/hadiswebpro/Battleship-odin.git
cd Battleship-odin
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## 📌 The Odin Project

Built while following **The Odin Project JavaScript curriculum**, with a focus on game architecture, testing, and maintainable modular code.

## 👩🏻‍💻 Author

**Hadis Rezaee**

GitHub: [@hadiswebpro](https://github.com/hadiswebpro)
