# 🎮 Virtual Console Hub

> **"Play as you Go"**

Virtual Console Hub is a next-generation cloud gaming platform concept. It allows users to rent high-end virtual machines or retro console emulators on-demand, enabling gameplay on any device via low-latency streaming.

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech](https://img.shields.io/badge/Tech-React_|_Vite_|_Tailwind-0ff0fc)
![AI](https://img.shields.io/badge/AI-Gemini_2.0-e94560)

---

## 🚀 Features

### 🕹️ Console Marketplace
- **Rent on Demand**: Spin up PS5, Xbox, or High-End PC rigs instantly.
- **Retro Emulation**: Access NES, SNES, N64, Sega, and PS1/PS2 classics.
- **Tiered Performance**: Choose between Standard, Pro, and Ultra streaming tiers.

### 📺 Active Session Stream
- **Interactive Overlay**: Virtual touch controllers and input visualization.
- **AI Coaching**: Real-time gameplay analysis and strategy tips powered by **Google Gemini**.
- **P2P Peering**: Connect with friends or lobby members for virtual couch co-op.
- **Retro Features**: CRT Filters, Save States, and Rewind capabilities.
- **Stats HUD**: Monitor FPS, Latency, and Bitrate in real-time.

### 💰 Virtual Wallet
- **Crypto & Fiat**: Simulate deposits via Bitcoin/Solana or Credit Card.
- **Transaction History**: Track rentals and tournament prizes.

### 🏆 Social & Competitive
- **Tournaments**: Host or join Tag Team and Squad events.
- **Leaderboards**: Global rankings with tiered progression.
- **Chat**: Real-time party chat with system alerts.

---

## 🛠️ Getting Started

Follow these steps to run the application locally.

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository** (if applicable) or download the source code.
   ```bash
   git clone https://github.com/your-username/virtual-console-hub.git
   cd virtual-console-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   To use the AI Coaching feature, you need a Google Gemini API Key.
   
   Create a `.env` file in the root directory:
   ```env
   # .env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```
   *Note: If you don't have a key, the app will fall back to generic coaching messages.*

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal).

---

## 📖 User Guide

### 1. Authentication
- **Sign Up**: You must be **16 years or older** to create an account.
- **Login**: Use any credentials for the prototype (e.g., `user` / `password`).

### 2. The Dashboard
- Customize your **Persona** (Avatar & Title) by clicking your profile card.
- View your weekly activity stats and active quests.
- Claim **Daily Rewards** to boost your XP.

### 3. Renting a Console
1. Navigate to **Rentals**.
2. Filter by **Modern**, **Retro**, or **PC**.
3. Select a console (e.g., "Nintendo 64").
4. Choose a game from the supported library (e.g., "GoldenEye 007").
5. Click **Deploy**.

### 4. In-Game Controls (Active Session)
- **AI Coach**: Click the "Ask AI" bot icon to analyze the current game state and get tips.
- **Controls**:
  - **Keyboard**: Standard WASD/Arrow keys.
  - **Virtual**: Toggle the `Gamepad` icon to show on-screen touch controls.
  - **Physical**: Connect a Bluetooth controller via the `Plug` icon menu.
- **Microphone**: Toggle the Mic icon to simulate voice chat.
- **Save State**: (Retro Only) Click the Save icon to store your progress to the cloud.

### 5. Peer-to-Peer (Multiplayer)
1. In a session, click the **Peers** button.
2. Scan for players on similar consoles.
3. Click **Connect** to link sessions (simulates local multiplayer over IP).

---

## 📂 Project Structure

- **`/components`**: All React UI components (Navbar, ActiveSession, Market, etc.).
- **`/services`**: External API integrations (Gemini AI service).
- **`/contexts`**: Global state providers (Toast Notifications).
- **`constants.ts`**: Mock data for Games, Consoles, and Leaderboards.
- **`types.ts`**: TypeScript interfaces for type safety.

---

## 🎨 Design System

The app uses a "Cyber-Gamer" aesthetic:
- **Primary**: Deep Navy (`#0f0e17`)
- **Neon**: Cyan (`#0ff0fc`)
- **Accent**: Red/Pink (`#e94560`)
- **Retro**: Orange (`#ff8e3c`)

---

## 📜 License

This project is a concept prototype. All game images and titles are property of their respective owners and used for demonstration purposes.
