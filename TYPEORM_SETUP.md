# TypeORM Setup Guide

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=righttorepresent

# Environment
NODE_ENV=development
```

## Database Setup

1. Make sure PostgreSQL is running on your system
2. Create a database named `righttorepresent` (or update DB_NAME in your .env)
3. Update the database credentials in your .env file

## Features Added

- **TypeORM Integration**: Full TypeORM setup with PostgreSQL
- **User Entity**: Sample entity with common fields (id, email, firstName, lastName, phoneNumber, timestamps)
- **User Service**: Complete CRUD operations using TypeORM repositories
- **User Controller**: RESTful API endpoints for user management
- **User Module**: Properly structured NestJS module

## API Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Next Steps

1. Install `dotenv` package: `pnpm add dotenv`
2. Update your `main.ts` to load environment variables
3. Create more entities as needed
4. Add validation using class-validator
5. Implement authentication and authorization

## Notes

- `synchronize: true` is enabled in development (auto-creates tables)
- Set `NODE_ENV=production` and `synchronize: false` in production
- Logging is enabled in development mode
