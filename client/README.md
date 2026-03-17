# Jawuan GPT Client

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#%EF%B8%8F-installation)
- [Usage](#%EF%B8%8F-usage)
- [Next Steps](#-next-steps)

## 🧠 Project Overview

Frontend client for my personal AI-powered chatbot, **_Jawuan GPT_**. This React application provides the user interface for conversing with OpenAI's GPT models, communicating with a separate [backend API](https://github.com/jawuanlewis/jawuan-gpt-api) to manage chat state. Users can:

1. Start new conversations and receive AI-generated responses
2. Manage multiple chat sessions from the sidebar
3. Rename conversations for easy reference

## 🚀 Live Demo

- Application live here: [Jawuan GPT](https://gpt.jawuanlewis.dev)
- Initial designs available here: [Figma Designs](https://www.figma.com/design/7L2M9WD2Lmsjke14rtwscX/Chatbot?node-id=0-1&t=gsJwMsjE6Q6RSxH0-1)

## 💻 Tech Stack

- **UI Framework:** React 19 (Vite)
- **Language:** TypeScript
- **HTTP Client:** Axios
- **Styling:** CSS
- **Linting/Formatting:** ESLint, Prettier
- **Deployment:** Vercel

## 📁 Project Structure

```text
jawuan-gpt-client/
├── src/
│   ├── assets/            # Fonts and icons
│   ├── components/        # UI components (ChatArea, SideBar, etc.)
│   ├── services/          # API client and chat service
│   ├── styles/            # CSS stylesheets
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Application entry point
│
├── index.html
├── package.json
└── vite.config.ts         # Vite configuration
```

## ⚙️ Installation

### Prerequisites

- **Node.js** (>=20.0.0)
- **pnpm** — install via `npm install -g pnpm`
- A running instance of the [Jawuan GPT API](https://github.com/jawuanlewis/jawuan-gpt-api) for full functionality

> This is a frontend-only project. Setup instructions are provided below for reference.

### Clone the repository

```bash
git clone https://github.com/jawuanlewis/jawuan-gpt-client.git
```

### Install dependencies

```bash
cd jawuan-gpt-client
pnpm install
```

### Set up environment variables

Create a `.env` file in the root directory that contains the following variable:

- **VITE_API_URL:** URL of the Jawuan GPT API (e.g., `http://localhost:3000`)

### Run the development server

```bash
pnpm dev
```

## ▶️ Usage

Once the application is running, you can:

1. Navigate to `http://localhost:5173` in your browser.
2. Start a conversation by typing a message in the input box.
3. Press **Enter** or click the send button to receive an AI-generated response.
4. View all previous conversations in the sidebar.
5. Use the sidebar to switch between or rename chat sessions.
6. Click the new chat button to start a fresh conversation.

## 🔮 Next Steps

### Future Features

- Add user authentication
- Chat export or download
- Add customization support & menu options
- Continuous visual improvements
