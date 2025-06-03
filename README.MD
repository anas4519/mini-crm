# CRM Assignment

This project is a Customer Relationship Management (CRM) system designed to help manage customer interactions, campaigns, and analytics.

## Local Setup Instructions

To set up and run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:
- Node.js (LTS version recommended)
- npm or Yarn (npm is used in these instructions)

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Start the backend server:
    ```bash
    npm run dev
    ```
    The backend server will typically run on `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies using Bun:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:8080` (or another available port).

### Full Stack Setup

1.  Open two terminal windows.
2.  In the first terminal, follow the "Backend Setup" steps.
3.  In the second terminal, follow the "Frontend Setup" steps.

## Architecture Diagram

```mermaid
graph TD
    A[Client/Browser] -->|HTTP/REST| B(Frontend - React/Vite)
    B -->|HTTP/REST| C(Backend - Node.js/Express)
    C -->|Database Queries| D[Database - MongoDB]

    subgraph Frontend
        B
    end

    subgraph Backend
        C
    end

    subgraph Data Storage
        D
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px

## Summary of AI Tools and Other Tech Used

This project leverages the following technologies and tools:

- Frontend : React with Vite for a fast and modern development experience.
- Backend : Node.js with Express.js for building robust RESTful APIs.
- Database : MongoDB for flexible NoSQL data storage.
- AI Tools : This project uses Gemini for sending personalized campaign messages. For this, the user will have to obtain a gemini api key from the Google AI Studio(it's free), the API key will be stored in secure local storage for subsequent use.

## Known Limitations or Assumptions
- Scalability : The current setup is suitable for small to medium-sized deployments. For large-scale production environments, further optimization and infrastructure scaling would be required.
- Authentication/Authorization : This project does not include a comprehensive authentication and authorization system. It calls Google OAuth at the frontend itself, which is definitely not recommended for production environments.
- Error Handling : Basic error handling is in place, but a more robust, centralized error logging and reporting mechanism could be beneficial for production.
- Testing : Unit and integration tests are not extensively covered in this initial setup.
- Real-time Features : The current communication model is request-response based. Real-time features (e.g., live chat, instant notifications) would require WebSockets or similar technologies.

## Folder Structure

This project is organized into two main directories: `backend` and `frontend`, each containing its own set of files and subdirectories.

'''
├── .gitignore
├── README.MD
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   └── src/
│       ├── app.js             # Main entry point for the backend application
│       ├── middleware/        # Express middleware functions
│       ├── models/            # Mongoose models for MongoDB schemas
│       ├── routes/            # API route definitions
│       └── services/          # Business logic and service functions
└── frontend/
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/                # Static assets (favicon, robots.txt, etc.)
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── App.css            # Main application CSS
│   ├── App.tsx            # Main React application component
│   ├── components/        # Reusable React components
│   ├── contexts/          # React Context API for global state management
│   ├── hooks/             # Custom React hooks
│   ├── index.css          # Global CSS styles
│   ├── lib/               # Utility functions and libraries
│   ├── main.tsx           # Entry point for the React application
│   ├── pages/             # Page-level React components (views)
│   ├── services/          # Frontend service functions for API calls
│   ├── types/             # TypeScript type definitions
│   └── vite-env.d.ts      # Vite environment type declarations
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
''''