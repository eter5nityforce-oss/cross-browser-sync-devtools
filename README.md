# Cross-Browser Sync DevTools

**크로스 브라우저 동기화 개발 도구**

This project is a sophisticated, real-time, and collaborative cross-browser debugging and development environment. The core functionality is to enable developers to connect multiple browser instances to a central Node.js server, which acts as an orchestrator and synchronizer for live debugging sessions.

## Key Features

- **Unified DevTools Interface**: A custom, browser-based single-page application (SPA) that acts as a central hub for interacting with a consolidated DevTools-like interface.
- **Multi-Browser Connection & Control**: The Node.js backend facilitates connecting to and controlling multiple browser instances.
- **Real-time State Synchronization**: Any change made in the central UI is immediately mirrored across all connected browser instances.
- **Aggregated Console & Network Monitoring**: A unified console panel that collects and displays logs, warnings, and errors from all connected browsers.

## Architecture

- **Node.js Backend**: Manages WebSocket connections, acts as a proxy for DevTools protocol messages, runs the synchronization engine, handles session state, and provides an API for the frontend.
- **WebSocket Server**: A high-performance WebSocket server implemented in Node.js for real-time, bi-directional communication.
- **Browser Instrumentation Layer**: Node.js modules that abstract away browser-specific DevTools protocols.
- **Synchronization Engine**: A sophisticated Node.js module capable of analyzing changes and intelligently applying them to all connected browsers.
- **Frontend**: A modern, responsive, and interactive SPA built with React.

## Demo - Running the Project Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Google Chrome](https://www.google.com/chrome/) or [Chromium](https://www.chromium.org/chromium-projects/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/cross-browser-sync-devtools.git
    cd cross-browser-sync-devtools
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

The backend server runs on port `3001` by default. If you need to change this, you can modify the `PORT` environment variable in `backend/index.js`.

The frontend application connects to the backend WebSocket server at `ws://localhost:3001`. This can be configured in `frontend/src/App.js`.

### Usage

1.  **Start the backend server:**

    ```bash
    cd backend
    node index.js
    ```

    You should see the following output in your terminal:

    ```
    Server is listening on port 3001
    ```

2.  **Start the frontend development server:**

    In a new terminal window:

    ```bash
    cd frontend
    npm start
    ```

    This will open a new browser tab with the Cross-Browser DevTools UI.

3.  **Start Debugging:**

    - Open the UI in your browser (usually `http://localhost:3000`).
    - Any changes you make in the CSS editor will be reflected in the controlled browser instance in real-time.
    - Console logs from the controlled browser instance will be displayed in the console panel.
