# Notes App

A simple notes web application built for learning backend development using NestJS, Prisma and PostgreSQL.
Users can register, log in, and manage their own notes and tags. Authentication is implemented manually using JWTs and HttpOnly cookies, without relying on Passport.

---

## Features
- User registration and login
- JWT authentication (without Passport)
- HttpOnly cookie authentication
- Protected routes using a custom JWT guard
- Authorization to ensure users can only access their own notes and tags
- CRUD operations for notes and tags
- PostgreSQL database with Prisma ORM


## Tech Stack
- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- EJS
- Docker and Docker compose

---

## Getting Started

## Prerequisites
Before running the application, make sure you have installed:
- Node.js
- npm
- PostgreSQL

You'll also need to create a PostgreSQL database.

### Clone the repository

```bash
git clone https://github.com/taran-95/notes-app.git
cd notes-app
```


### Install dependencies

```bash
npm install
```


### Configure environment variables

Rename `.env.example` to `.env` and update the following variables: 
```env
DATABASE_URL="postgresql://username:password@localhost:5432/notes_app"
JWT_SECRET="your-secret-key"
```


### Generate Prisma Client

```bash
npx prisma generate
```


### Run Prisma migrations

```bash
npx prisma migrate dev
```


### Start the application

```bash
npm run start:dev
```
The application will be available at http://localhost:3000

---

## Running with Docker

### Build the Docker image
```bash
docker compose build
```

### Start the application
```bash
docker compose up -d
```

### Apply Database migrations
```bash
docker compose exec api npx prisma migrate deploy
```
The application will be available at http://localhost:3000.

## Authentication

Authentication was implemented manually without using Passport.

- Passwords are hashed using bcrypt.
- JWTs are signed using NestJS's JwtService.
- Tokens are stored in HttpOnly cookies.
- Protected routes are secured using a custom JwtAuthGuard.


---

## Database

Main entities:
- User
- Note
- Tag
- Note_Tag (many-to-many relationship)

## Screenshots

### Login
![Login](screenshots/login.png)

### Notes
![Notes](screenshots/notes.png)

### Edit Note
![Edit Note](screenshots/updateNote.png)


---

## What I Learned

This project helped me understand:

- NestJS architecture
- Prisma ORM
- PostgreSQL relationships
- JWT authentication
- Cookie-based authentication
- Authentication vs. authorization
- Route protection using custom NestJS guards
- Docker and Docker compose
- Multi-stage Docker builds
- Containerizing a full-stack backend application

