# Users Module

This module provides comprehensive user management functionality with TypeORM integration.

## Features

- **User CRUD Operations**: Create, read, update, and delete users
- **Password Security**: Automatic password hashing using bcrypt
- **Email Validation**: Ensures unique email addresses
- **Role Management**: Support for ADMIN, RECRUITER, and CANDIDATE roles
- **Data Protection**: Passwords are excluded from public queries by default

## Service Methods

### Core Operations

- `create(createUserInput: CreateUserInput)`: Create a new user with hashed password
- `findAll()`: Get all users (passwords excluded)
- `findOne(id: string)`: Get user by ID (password excluded)
- `update(id: string, updateUserInput: UpdateUserInput)`: Update user information
- `remove(id: string)`: Delete a user

### Utility Methods

- `findByEmail(email: string)`: Find user by email (includes password)
- `findOneWithPassword(id: string)`: Get user with password for authentication
- `validateUser(email: string, password: string)`: Authenticate user credentials
- `count()`: Get total number of users
- `exists(id: string)`: Check if user exists
- `findByRole(role: UserRole)`: Find users by role

## GraphQL Operations

### Queries

- `users`: Get all users
- `user(id: string)`: Get user by ID

### Mutations

- `createUser(createUserInput: CreateUserInput)`: Create new user
- `updateUser(id: string, updateUserInput: UpdateUserInput)`: Update user
- `removeUser(id: string)`: Delete user

## Data Transfer Objects

- `CreateUserInput`: For creating new users
- `UpdateUserInput`: For updating existing users
- `UserResponse`: For API responses (password excluded)

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Proper HTTP exceptions for various error scenarios
- **Data Sanitization**: Sensitive data (passwords) are excluded from public queries

## Usage Example

```typescript
// In a controller or resolver
@Post()
async createUser(@Body() createUserInput: CreateUserInput) {
  return this.usersService.create(createUserInput);
}

@Get(':id')
async getUser(@Param('id') id: string) {
  return this.usersService.findOne(id);
}

@Put(':id')
async updateUser(@Param('id') id: string, @Body() updateUserInput: UpdateUserInput) {
  return this.usersService.update(id, updateUserInput);
}
```

## Dependencies

- `@nestjs/typeorm`: TypeORM integration
- `typeorm`: Database ORM
- `bcrypt`: Password hashing
- `class-validator`: Input validation
- `@nestjs/graphql`: GraphQL support
