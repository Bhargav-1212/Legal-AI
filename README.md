# Legal AI Pro

A comprehensive legal practice management platform powered by NVIDIA's Llama 3.1 70B AI.

## Features

### 1. Dashboard
-   **Overview**: Quick view of active cases, documents, and billable hours.
-   **Recent Documents**: fast access to the last 3 analyzed files.

### 2. Document Analysis (`/documents`)
-   **AI-Powered Analysis**: Upload PDF, DOCX, or TXT files.
-   **Insights**: The AI provides an executive summary, risk assessment (Low/Medium/High), and identifies key legal issues.
-   **Persistence**: All analysis is saved to your local browser storage.

### 3. Legal Research (`/research`)
-   **AI Assistant**: Ask complex legal questions (e.g., "What are the requirements for a valid contract in California?").
-   **Citations**: Returns explanations with relevant legal principles and potential case law references.

### 4. Case Management (`/cases`)
-   **CRUD Functionality**: Create, Read, Update (Status), and Delete legal cases.
-   **Tracking**: Monitor case status (Discovery, Filing, etc.), deadlines, and team members.
-   **Filtering**: easily toggle between Active and Closed cases.

## Tech Stack
-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion.
-   **Backend**: Node.js, Express, Multer.
-   **AI**: NVIDIA API (Llama 3.1 70B Instruct).
-   **Storage**: Browser LocalStorage (No external database required for demo).

## How to Run

You must run **both** the frontend and backend servers.

### 1. Backend Server
Runs on port 3000. Handles file uploads and AI API calls.
```bash
npm run server
```

### 2. Frontend Application
Runs on port 5173. The user interface.
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.
