# Unified Desktop Shell

This is the main container application that unifies the AI tools into a single, cohesive desktop experience. Built with [Electron](https://www.electronjs.org/), it acts as a shell that hosts and manages the individual React applications.

## 🌟 Key Features

*   **Unified Experience**: seamlessly integrates multiple web applications into one desktop window.
*   **Electron Shell**: Provides native desktop capabilities and window management.
*   **App Switching**: Easily switch between "Local NoteBook AI" and "AI Translation" tools via a sidebar.
*   **Authentication**: Centralized authentication handled via Firebase.
*   **Iframe Architecture**: Uses secure sandboxed iframes to load the separate React applications.

## 📦 Included Applications

This shell aggregates the following applications:

1.  **[Course RAG Client](https://github.com/B-Zakaria-u/course-rag-client)**: The AI notebook interface for querying your course materials.
2.  **[AI Translation](https://github.com/B-Zakaria-u/Moroccan-Dialect-Translator)**: An AI-powered translation tool (hosted in this website https://b-zakaria-u.github.io/Moroccan-Dialect-Translator/).

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS recommended)
*   All sub-applications must be running for the full development experience.

### Installation

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

To run the unified shell in development mode:

```bash
npm run electron:dev
```

This command uses `concurrently` to start the development servers for the sub-apps (if configured in `package.json` scripts) and launches the Electron window.
*Ensure that the `course-rag-client` and `react-client` (Translation app) are accessible at their expected ports (usually 5174 and 5175 respectively, or as configured in `src/App.jsx`).*

### Building

To build the executable for Windows:

```bash
npm run electron:build
```

This generates the installer/executable in the `release` directory.

## 🔗 Related Repositories

*   **Backend**: [Course RAG Backend](https://github.com/B-Zakaria-u/course-rag-backend)
*   **Frontend**: [Course RAG Client](https://github.com/B-Zakaria-u/course-rag-client)
