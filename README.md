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

## n8n Automation

The project includes an n8n workflow that automatically adds a new client to the mini-CRM.

### How It Works

1. A user submits the n8n form.
2. The **Edit Fields** node prepares the client data.
3. The **HTTP Request** node sends a POST request to the CRM API.
4. The backend validates the data and saves the client in PostgreSQL.
5. The new client appears in the mini-CRM interface.

### Workflow

```text
n8n Form → Edit Fields → POST /api/clients → Express API → PostgreSQL → CRM
```

The workflow sends the following data:

```json
{
  "name": "Example Company",
  "email": "contact@example.com",
  "note": "Client interested in process automation.",
  "status": "NOWY",
  "priority": "ŚREDNI"
}
```

### Running the Automation Locally

The backend and n8n must run at the same time in separate terminals.

Start the backend:

```bash
cd backend
node server.js
```

Start n8n in a second terminal:

```bash
npx n8n
```

Open n8n:

```text
http://localhost:5678
```

The HTTP Request node sends client data to:

```text
POST http://localhost:3000/api/clients
```

### Importing the Workflow

The exported workflow is available in:

```text
n8n/BPxS CRM - Add client.json
```

To use it:

1. Open n8n.
2. Import the workflow JSON file.
3. Start the CRM backend.
4. Publish the workflow.
5. Open the production form URL and submit a new client.

> The current workflow uses localhost addresses and works while the backend and n8n are running locally.