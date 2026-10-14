# Discord Auto Typer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![discord.js-selfbot-v13](https://img.shields.io/badge/discord.js--selfbot--v13-^3.7.1-blue.svg)](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)

A lightweight, automated Discord messaging tool that sends scheduled messages to specified channels across servers and direct messages with customizable intervals and safe delays.

---

## ✨ Features

- 🔄 **Sequential Multi-Channel Messaging:** Send messages sequentially across multiple channels and servers.
- ⏱️ **Customizable Intervals & Delays:** Configure the interval between complete cycles as well as pauses between individual channels to maintain smooth delivery.
- 🎨 **Modern Console UI:** Clean, color-coded logging interface with timestamps, progress tracking, and statistics.
- 🛡️ **Fault-Tolerant:** Automatic error recovery if channels are inaccessible, permissions are missing, or temporary network drops occur.
- 🛑 **Graceful Shutdown:** Handles `Ctrl+C` (`SIGINT`) cleanly, displaying active uptime and delivery summary statistics.
- ⚙️ **Simple Configuration:** Easily managed via `.env` and `config.json` templates.

---

## 📋 Prerequisites

- **Node.js** version 16.0.0 or higher
- **npm** (comes bundled with Node.js)
- A Discord user account token

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/lawerth/discord-auto-typer.git
cd discord-auto-typer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `.env` and add your Discord user token:
```env
DISCORD_TOKEN=your_user_token_here
```

### 4. Configure Channels and Message
Copy `config.example.json` to `config.json` (if not already created):
```bash
cp config.example.json config.json
```
Edit `config.json`:
```json
{
  "channels": [
    "123456789012345678",
    "987654321098765432"
  ],
  "message": "Hello from Discord Auto Typer!",
  "interval": 600000,
  "channelDelay": 10000
}
```

### 5. Run the Application
```bash
npm start
```

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `channels` | `string[]` | `[]` | Array of Discord Channel IDs where messages will be sent. |
| `message` | `string` | `"Hello from Discord Auto Typer!"` | The text message content to send. |
| `interval` | `number` | `600000` | Delay in milliseconds (ms) between each full cycle (e.g. `600000` = 10 minutes). |
| `channelDelay` | `number` | `10000` | Delay in milliseconds (ms) between sending to each subsequent channel. |

---

## 🔍 How to Find Channel IDs

1. Open Discord Settings (**User Settings** ⚙️).
2. Go to **Advanced** in the sidebar.
3. Enable **Developer Mode**.
4. Right-click on any text channel or DM and select **Copy Channel ID**.
5. Paste the ID into the `channels` array inside `config.json`.

---

## 🔑 How to Get Your Discord User Token

> ⚠️ **SECURITY WARNING:** Never share your Discord token with anyone. Anyone with your token has full access to your account.

1. Open Discord in your web browser (e.g. Chrome, Firefox) or the desktop app.
2. Press `Ctrl + Shift + I` (Windows/Linux) or `Cmd + Option + I` (Mac) to open Developer Tools.
3. Switch to the **Network** tab.
4. Send any message or interact with any channel.
5. In the Network tab filter list, click on any `messages` request or Discord API request.
6. Look under **Request Headers** for the `Authorization` header.
7. Copy the value (this is your user token) and paste it into `.env`.

---

## ⚠️ Disclaimer & Terms of Service

- Automating user accounts (Selfbots) is against the **Discord Terms of Service**.
- Using this software may lead to account restrictions or termination if abused.
- This software is created solely for educational and personal automation purposes.
- The developers assume no liability for misuse, account suspensions, or bans. Use at your own risk.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.