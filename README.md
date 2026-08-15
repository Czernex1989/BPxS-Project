# BPxS Mini CRM

A full-stack mini CRM application created to learn how frontend, backend, REST API and PostgreSQL work together.

The application allows users to manage potential customers and stores their data in a PostgreSQL database.

## Features

- Display all customers
- Add a new customer
- Edit customer information
- Delete a customer
- PostgreSQL database integration
- REST API with full CRUD operations
- Manual API and application testing
- End-to-end test created with Playwright

## Technologies

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- Playwright
- Git and GitHub

## Project Structure

```text
BPxS-Project/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   └── index.html
├── tests/
│   └── crm.spec.js
├── .gitignore
├── package.json
├── README.md
└── Testing.md
```

## How It Works

1. The frontend sends HTTP requests to the REST API.
2. The backend receives and processes the requests.
3. The backend communicates with the PostgreSQL database.
4. PostgreSQL stores and returns customer data.
5. The backend sends a response to the frontend.
6. The frontend displays the updated customer list.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/customers` | Returns all customers |
| POST | `/customers` | Creates a new customer |
| PUT | `/customers/:id` | Updates an existing customer |
| DELETE | `/customers/:id` | Deletes a customer |