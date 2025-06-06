# CRM Assignment

This project is a Customer Relationship Management (CRM) system designed to help manage customer interactions, campaigns, and analytics.

[Deployed Link](https://xenocrmassignment.netlify.app/)

[Demo Video](https://youtu.be/nuAdANhALOY)

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
```

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

```bash
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
```

-----

## API Documentation

This document outlines the available API endpoints for managing campaigns and customers.

-----

### Campaigns API

The Campaigns API allows you to manage marketing campaigns, including creating new campaigns, retrieving existing ones, and viewing communication logs.

**Base URL:** `https://mini-crm-lp2n.onrender.com/api/campaigns`

| Endpoint    | Method | Description                                                                   | Request Body Example | Response Example |
| :---------- | :----- | :---------------------------------------------------------------------------- | :------------------- | :--------------- |
| `/`         | `GET`  | **Get All Campaigns** \<br\> Retrieves a list of all campaigns, sorted by creation date in descending order. | N/A | See GET All Campaigns Response Example |
| `/`         | `POST` | **Create a New Campaign** \<br\> Creates a new marketing campaign.              | See Create Campaign Request Example | See Create Campaign Response Example |
| `/:id/logs` | `GET`  | **Get Campaign Logs** \<br\> Retrieves communication logs associated with a specific campaign ID. | N/A | `[{"_id": "...", "campaignId": "...", "customerId": "...", "message": "...", "status": "sent", "timestamp": "..."}]` |

**Examples for Campaigns API:**

**GET All Campaigns Response Example:**

```json
[
    {
        "_id": "683ea09957ae2a099bf60ee7",
        "name": "Summer Sale 2025",
        "segmentName": "High-Value Customers - Last 30 Days",
        "segmentRules": [
            {
                "field": "totalOrders",
                "operator": "greaterThan",
                "value": "5",
                "_id": "683ea09957ae2a099bf60ee8"
            },
            {
                "field": "lastPurchaseDate",
                "operator": "withinLastDays",
                "value": "30",
                "_id": "683ea09957ae2a099bf60ee9"
            }
        ],
        "audienceSize": 15000,
        "status": "PENDING",
        "totalSent": 0,
        "totalFailed": 0,
        "createdAt": "2025-06-03T07:13:29.984Z",
        "updatedAt": "2025-06-03T07:13:29.984Z",
        "__v": 0
    },
    {
        "_id": "683e05b96ec6e8df71543488",
        "name": "Campaign for T Series Music",
        "segmentName": "T Series Music",
        "segmentRules": [
            {
                "field": "spend",
                "operator": ">",
                "value": "10000",
                "_id": "683e05b96ec6e8df71543489"
            },
            {
                "field": "age",
                "operator": "<",
                "value": "18",
                "_id": "683e05b96ec6e8df7154348a"
            },
            {
                "field": "spend",
                "operator": ">",
                "value": "",
                "_id": "683e05b96ec6e8df7154348b"
            }
        ],
        "audienceSize": 0,
        "status": "PENDING",
        "totalSent": 0,
        "totalFailed": 0,
        "createdAt": "2025-06-02T20:12:41.504Z",
        "updatedAt": "2025-06-02T20:12:41.504Z",
        "__v": 0
    },
    {
        "_id": "683e01006ec6e8df71543442",
        "name": "Campaign for Myntra",
        "segmentName": "Myntra",
        "segmentRules": [
            {
                "field": "spend",
                "operator": ">",
                "value": "10000",
                "_id": "683e01006ec6e8df71543443"
            }
        ],
        "audienceSize": 0,
        "status": "PENDING",
        "totalSent": 0,
        "totalFailed": 0,
        "createdAt": "2025-06-02T19:52:32.781Z",
        "updatedAt": "2025-06-02T19:52:32.781Z",
        "__v": 0
    }
]
```

**Create Campaign Request Example:**

```json
{
    "name": "Summer Sale 2023",
    "segmentName": "High-Value Customers - Last 30 Days",
    "segmentRules": [
        {
            "field": "totalOrders",
            "operator": "greaterThan",
            "value": 5
        },
        {
            "field": "lastPurchaseDate",
            "operator": "withinLastDays",
            "value": 30
        }
    ],
    "audienceSize": 15000
}
```

**Create Campaign Response Example:**

```json
{
    "name": "Summer Sale 2023",
    "segmentName": "High-Value Customers - Last 30 Days",
    "segmentRules": [
        {
            "field": "totalOrders",
            "operator": "greaterThan",
            "value": "5",
            "_id": "683eaf4a85ca602272882206"
        },
        {
            "field": "lastPurchaseDate",
            "operator": "withinLastDays",
            "value": "30",
            "_id": "683eaf4a85ca602272882207"
        }
    ],
    "audienceSize": 15000,
    "status": "PENDING",
    "totalSent": 0,
    "totalFailed": 0,
    "_id": "683eaf4a85ca602272882205",
    "createdAt": "2025-06-03T08:16:10.167Z",
    "updatedAt": "2025-06-03T08:16:10.167Z",
    "__v": 0
}
```

-----

### Customers API

The Customers API allows you to manage customer records, including creating new customers and retrieving existing ones.

**Base URL:** `https://mini-crm-lp2n.onrender.com/api/customers`

| Endpoint | Method | Description | Request Body Example | Response Example |
| :------- | :----- | :---------- | :------------------- | :--------------- |
| `/` | `GET` | **Get All Customers** \<br\> Retrieves a list of all customer records. | N/A | See GET All Customers Response Example |
| `/` | `POST` | **Create a New Customer** \<br\> Creates a new customer record. | See Create Customer Request Example | See Create Customer Response Example |

**Examples for Customers API:**

**GET All Customers Response Example:**

```json
[
    {
        "_id": "683dd9b96ec6e8df7154343d",
        "name": "Anas",
        "email": "anas.test@example.com",
        "spend": 100,
        "visits": 10,
        "lastActive": "2025-06-02T16:50:00.000Z",
        "createdAt": "2025-06-02T17:04:57.866Z",
        "updatedAt": "2025-06-02T17:04:57.866Z",
        "__v": 0
    },
    {
        "_id": "683e9f1c57ae2a099bf60eba",
        "name": "John",
        "email": "john.test@example.com",
        "spend": 100,
        "visits": 10,
        "lastActive": "2025-06-02T16:50:00.000Z",
        "createdAt": "2025-06-03T07:07:08.566Z",
        "updatedAt": "2025-06-03T07:07:08.566Z",
        "__v": 0
    }
]
```

**Create Customer Request Example:**

```json
{
    "name": "John",
    "email": "john.test@aaaaaaaaa.com",
    "spend": 100,
    "visits": 10,
    "lastActive": "2025-06-02T16:50:00.000Z"
}
```

**Create Customer Response Example:**

```json
{
    "name": "John",
    "email": "john.test@aaaaaaaaa.com",
    "spend": 100,
    "visits": 10,
    "lastActive": "2025-06-02T16:50:00.000Z",
    "_id": "683eb1ec85ca602272882220",
    "createdAt": "2025-06-03T08:27:24.106Z",
    "updatedAt": "2025-06-03T08:27:24.106Z",
    "__v": 0
}
```
