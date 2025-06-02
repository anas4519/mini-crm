# CRM Assignment

This project is a Customer Relationship Management (CRM) system designed to help manage customer interactions, campaigns, and analytics.

## Local Setup Instructions

To set up and run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:
- Node.js (LTS version recommended)
- npm or Yarn (npm is used in these instructions)
- Bun (for frontend dependencies)

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
    npm start
    ```
    The backend server will typically run on `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies using Bun:
    ```bash
    bun install
    ```
3.  Start the frontend development server:
    ```bash
    bun dev
    ```
    The frontend application will typically run on `http://localhost:5173` (or another available port).

### Full Stack Setup

1.  Open two terminal windows.
2.  In the first terminal, follow the "Backend Setup" steps.
3.  In the second terminal, follow the "Frontend Setup" steps.

## Architecture Diagram

```mermaid
graph TD
    A[Client/Browser] -->|HTTP/REST| B(Frontend - React/Vite)
    B -->|HTTP/REST| C(Backend - Node.js/Express)
    C -->|Database Queries| D[Database - MongoDB/PostgreSQL]

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