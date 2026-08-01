# ArifChat

A full-stack chat application built with React, Vite, Express, MongoDB, and Socket.io.

## Features

- User signup and login with validation
- JWT access token + refresh token authentication
- Google OAuth login flow
- Real-time chat using Socket.io
- User list and online presence
- Message sending, editing, deleting, and unread counts
- Separate backend and frontend projects

## Project structure

- `backend/` - Express API, authentication, MongoDB models, Socket.io server, and routers
- `frontend/` - React application built with Vite, authentication pages, chat UI, and socket client

## Requirements

- Node.js 18+ (or compatible)
- npm
- MongoDB Atlas or local MongoDB instance

## Backend setup

1. Open a terminal and navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend/` with values found in .env.example:

4. Start the backend server:

```bash
node index.js
```

## Frontend setup

1. Open a terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `frontend/` with:

```env
VITE_BASE_URL=http://localhost:5000
```

4. Start the frontend development server:

```bash
npm run dev
```

5. Open the app in the browser at the URL shown by Vite (typically `http://localhost:5173`).

## API endpoints

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Log in an existing user
- `POST /api/auth/logout` — Log out and clear refresh token cookie
- `POST /api/auth/refresh` — Refresh access token using refresh cookie
- `GET /api/users` — Get other users (authenticated)
- `GET /api/messages/:id` — Get chat messages with a user
- `GET /api/messages/unread/count` — Get unread message count
- `POST /api/messages` — Create a new message
- `PUT /api/messages/mark-read` — Mark messages as read
- `DELETE /api/messages/:id` — Delete a message

## Socket.io

- Socket server is started in `backend/sockets/index.js`
- Client socket connections use the current JWT access token
- Real-time events are handled in `backend/sockets/handlers/`

## License

This project is provided as-is.
