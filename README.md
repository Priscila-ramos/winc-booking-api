
# Booking API — Winc Academy Final Back-End Project

A REST API for a booking application, developed as the final back-end project for Winc Academy.

## Technologies

- Node.js
- Express.js
- Prisma ORM
- SQLite
- JSON Web Tokens (JWT)
- Sentry
- Newman (Postman automated tests)

## Features

- User authentication with JWT
- CRUD operations for users, hosts, properties, bookings, and reviews
- Protected POST, PUT, and DELETE requests
- Request data validation
- Request duration logging
- Global error handling
- Error monitoring with Sentry

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root, using `.env.example` as a template:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET_KEY="replace-with-your-own-secret-key"
SENTRY_DSN=""
```

Replace the authentication secret with your own secure value.

To enable Sentry error monitoring, provide a valid Sentry DSN.

## Database Setup

Create the SQLite database and populate it with the initial data:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

## Running the API

Start the development server:

```bash
npm run dev
```

The API will be available at:

http://localhost:3000

## API Endpoints

Authentication:

- `POST /login`

Resources:

| Resource | Available methods |
| --- | --- |
| `/users` | GET, POST |
| `/users/:id` | GET, PUT, DELETE |
| `/hosts` | GET, POST |
| `/hosts/:id` | GET, PUT, DELETE |
| `/properties` | GET, POST |
| `/properties/:id` | GET, PUT, DELETE |
| `/bookings` | GET, POST |
| `/bookings/:id` | GET, PUT, DELETE |
| `/reviews` | GET, POST |
| `/reviews/:id` | GET, PUT, DELETE |

GET requests are public. POST, PUT, and DELETE requests require a valid JWT, except for `/login`.

## Authentication

Send a POST request to `/login` with a valid username and password:

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

The response contains a JWT.

For protected requests, include:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Automated Testing

The project includes Postman collections executed with Newman.

Create the file:

`postman/environments/Local.postman_environment.json`

Use `Local.postman_environment.example.json` as a template.

Configure:

- `baseUrl`: `http://localhost:3000`
- `bearerToken`: `Bearer YOUR_JWT_TOKEN`

To reset and seed the database before testing:

```bash
npx prisma db push --force-reset
npx prisma db seed
```

Start the server, then run:

```bash
npm test
```

You can also run the collections individually:

```bash
npm run test-positive
npm run test-negative
```

Run the positive tests before the negative tests, as the collections may depend on database changes made by previous requests.

## Security

The following files are excluded from version control:

- `.env`
- Local SQLite database files
- Local Postman environment containing authentication tokens
- `node_modules`

Do not commit authentication secrets or JWTs to the repository.

## Project Status

The API passed the provided automated test collections during local development:

- Positive tests: 49 passed, 0 failed
- Negative tests: 22 passed, 0 failed

Total: 71 passed, 0 failed.
