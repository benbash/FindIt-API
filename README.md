# FindIt API

FindIt API is a Node.js, Express, and MongoDB backend for:

- user authentication
- password reset
- user profile management
- reporting lost items
- reporting found items
- searching items
- creating and managing claims

## Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Run

```bash
npm install
npm run dev
```

## Main routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `PATCH /api/auth/reset-password/:token`
- `GET /api/auth/me`

### Users

- `GET /api/users/profile`
- `PATCH /api/users/profile`

### Lost items

- `GET /api/lost-items`
- `GET /api/lost-items/:id`
- `POST /api/lost-items`
- `PATCH /api/lost-items/:id`
- `DELETE /api/lost-items/:id`

### Found items

- `GET /api/found-items`
- `POST /api/found-items`
- `PATCH /api/found-items/:id`
- `DELETE /api/found-items/:id`

### Search

- `GET /api/items/search`

### Claims

- `POST /api/claims`
- `GET /api/claims`
- `PATCH /api/claims/:id`
