# Weather Project

This is a full-stack weather application consisting of a React frontend and a Node./Express backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (ensure it is installed and added to your PATH).

## Project Structure

- `client/`: React application (Vite)
- `server/`: Node.js Express API

## Quick Start (Any Editor)

You will need to run the client and server in **separate terminals**.

### 1. Setup Backend (Server)

Open a terminal, navigate to the `server` folder, install dependencies, and start it:

```bash
cd server
npm install
# Create .env file
cp .env.example .env
# Open .env and add your MONGO_URI
npm run dev
```

*The server will typically run on `http://localhost:3000` or `http://localhost:5000` depending on configuration.*

### 2. Setup Frontend (Client)

Open a **second** terminal, navigate to the `client` folder, install dependencies, and start it:

```bash
cd client
npm install
npm run dev
```

*The client will typically run on `http://localhost:5173`.*

### 3. Open in Browser

Once both are running, open your browser and go to:
[http://localhost:5173](http://localhost:5173)

---

## Editor-Specific Tips

### VS Code / Cursor
1.  Open the root `weatherproject` folder.
2.  Open the integrated terminal (`Ctrl + ~`).
3.  Split the terminal (click the `+` or split icon).
4.  In the left terminal: `cd server` -> `npm run dev`.
5.  In the right terminal: `cd client` -> `npm run dev`.

### WebStorm / IntelliJ
1.  Open the project.
2.  Open the Terminal tool window.
3.  Open two terminal tabs.
4.  Run the commands as described above.

### Sublime Text / Atom / Notepad++
These editors might not have built-in terminals (or require plugins).
1.  Open the project files.
2.  Open your computer's standalone terminal app (Command Prompt, PowerShell, Terminal).
3.  Open two separate windows/tabs of your terminal app.
4.  Navigate to the project folder in both and follow the "Quick Start" steps.
# WeatherApp
