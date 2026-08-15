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
| GET | `/clients` | Returns all clients |
| POST | `/api/clients` | Creates a new client |
| PUT | `/api/clients/:id` | Updates an existing client |
| DELETE | `/api/clients/:id` | Deletes a client |
| GET | `/db-test` | Checks the PostgreSQL connection |

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Czernex1989/BPxS-Project.git
cd BPxS-Project
```

### 2. Install the backend dependencies

```bash
cd backend
npm install
```

### 3. Configure PostgreSQL

Create a `.env` file inside the `backend` directory:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

The `.env` file contains private database credentials and is not included in the repository.

### 4. Start the application

Run this command from the `backend` directory:

```bash
node server.js
```

Open the application in your browser:

```text
http://localhost:3000
```

### 5. Run the Playwright test

Open another terminal in the main project directory:

```bash
npm install
npx playwright test
```

## Testing

The project includes:

- Manual CRUD testing
- PostgreSQL connection testing
- REST API testing
- Playwright end-to-end testing

Detailed manual test cases are available in [Testing.md](Testing.md).