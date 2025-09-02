# Authentication and Authorization Setup

This document describes the JWT-based authentication and role-based authorization system implemented in the NestJS GraphQL application.

## Overview

The application now includes a comprehensive authentication and authorization system:

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Fine-grained access control based on user roles
- **GraphQL Integration**: Seamless integration with GraphQL resolvers
- **Guards and Decorators**: Easy-to-use protection mechanisms
- **Token Refresh**: Automatic token refresh capability

## Features

### 1. JWT Authentication

- **Access Tokens**: Short-lived tokens (1 hour) for API access
- **Refresh Tokens**: Long-lived tokens (7 days) for token renewal
- **Secure Storage**: Tokens stored in HTTP-only cookies or Authorization header
- **Automatic Validation**: JWT validation on every protected request

### 2. Role-Based Authorization

- **User Roles**: ADMIN, RECRUITER, CANDIDATE
- **Role Guards**: Protect endpoints based on user roles
- **Flexible Permissions**: Multiple roles can access the same endpoint
- **Context-Aware**: User information available in GraphQL context

### 3. GraphQL Integration

- **Context Factory**: JWT tokens automatically parsed and validated
- **User Context**: Authenticated user available in all resolvers
- **Protected Queries/Mutations**: Easy to protect GraphQL operations
- **Error Handling**: Proper GraphQL error responses for auth failures

## Architecture

### Components

1. **Auth Module** (`src/auth/auth.module.ts`)
   - JWT configuration
   - Passport strategies
   - Service providers

2. **Auth Service** (`src/auth/auth.service.ts`)
   - User validation
   - Token generation
   - Registration logic

3. **JWT Strategy** (`src/auth/strategies/jwt.strategy.ts`)
   - Token validation
   - User extraction
   - Passport integration

4. **Local Strategy** (`src/auth/strategies/local.strategy.ts`)
   - Username/password validation
   - Local authentication

5. **Guards** (`src/auth/guards/`)
   - JWT authentication guard
   - Role-based authorization guard
   - Local authentication guard

6. **Decorators** (`src/auth/decorators/`)
   - Role requirements
   - Current user extraction

## Usage Examples

### 1. Authentication Mutations

#### Login

```graphql
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      role
    }
  }
}
```

#### Register

```graphql
mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      role
    }
  }
}
```

#### Refresh Token

```graphql
mutation RefreshToken($refreshTokenInput: RefreshTokenInput!) {
  refreshToken(refreshTokenInput: $refreshTokenInput) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      role
    }
  }
}
```

### 2. Protected Queries

#### Admin-Only Endpoint

```typescript
@Query(() => [UserResponse], { name: 'users' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async findAll(): Promise<UserResponse[]> {
  // Only ADMIN users can access this
  return this.usersService.findAll();
}
```

#### Multi-Role Endpoint

```typescript
@Query(() => UserResponse, { name: 'user' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
async findOne(@Args('id') id: string): Promise<UserResponse> {
  // ADMIN, RECRUITER, and CANDIDATE users can access this
  return this.usersService.findOne(id);
}
```

#### Authenticated User Endpoint

```typescript
@Query(() => UserResponse, { name: 'me' })
@UseGuards(JwtAuthGuard)
async getCurrentUser(@AuthUser()user: any): Promise<UserResponse> {
  // Any authenticated user can access this
  return this.usersService.findOne(user.id);
}
```

### 3. Using Current User

```typescript
@Mutation(() => UserResponse)
@UseGuards(JwtAuthGuard)
async updateProfile(
  @AuthUser()user: any,
  @Args('updateUserInput') updateUserInput: UpdateUserInput
): Promise<UserResponse> {
  // user object contains: { id, email, role }
  return this.usersService.update(user.id, updateUserInput);
}
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### JWT Configuration

JWT is configured in the AuthModule:

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  }),
}),
```

## Security Features

### 1. Token Security

- **Short Expiry**: Access tokens expire in 1 hour
- **Refresh Mechanism**: Automatic token renewal
- **Secure Storage**: Tokens stored in Authorization header
- **Validation**: Every request validates JWT signature

### 2. Role-Based Access Control

- **Granular Permissions**: Different roles have different access levels
- **Guard Protection**: Endpoints automatically protected
- **Context Validation**: User roles validated on every request
- **Flexible Configuration**: Easy to modify role requirements

### 3. Error Handling

- **Unauthorized Access**: Proper 401 responses for invalid tokens
- **Forbidden Access**: Proper 403 responses for insufficient roles
- **GraphQL Integration**: Errors formatted for GraphQL clients
- **Logging**: All authentication attempts logged

## Client Integration

### 1. Setting Authorization Header

```typescript
// After login, store the token
const token = response.data.login.accessToken;

// Set in HTTP headers
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### 2. GraphQL Client Setup

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### 3. Token Refresh

```typescript
// When access token expires, use refresh token
const refreshToken = localStorage.getItem('refreshToken');

const response = await client.mutate({
  mutation: REFRESH_TOKEN,
  variables: { refreshTokenInput: { refreshToken } },
});

// Update stored tokens
localStorage.setItem('accessToken', response.data.refreshToken.accessToken);
localStorage.setItem('refreshToken', response.data.refreshToken.refreshToken);
```

## Testing

### 1. Authentication Testing

```typescript
describe('AuthResolver', () => {
  it('should login with valid credentials', async () => {
    const result = await authResolver.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});
```

### 2. Authorization Testing

```typescript
describe('UsersResolver', () => {
  it('should allow admin to access all users', async () => {
    // Mock admin user
    const adminUser = { id: '1', role: UserRole.ADMIN };

    // Test protected endpoint
    const result = await usersResolver.findAll();
    expect(result).toBeDefined();
  });
});
```

## Best Practices

### 1. Security

- **Strong JWT Secret**: Use a long, random secret key
- **Token Expiry**: Keep access tokens short-lived
- **HTTPS Only**: Always use HTTPS in production
- **Token Storage**: Store tokens securely (not in localStorage for production)

### 2. Performance

- **Guard Ordering**: Place JwtAuthGuard before RolesGuard
- **Caching**: Cache user information when possible
- **Database Queries**: Minimize database calls in guards

### 3. Error Handling

- **Graceful Degradation**: Handle auth failures gracefully
- **User Feedback**: Provide clear error messages
- **Logging**: Log authentication attempts and failures

## Troubleshooting

### Common Issues

1. **Token Not Working**: Check JWT_SECRET environment variable
2. **Role Access Denied**: Verify user has required role
3. **Context Not Available**: Ensure GraphQL context is properly configured
4. **Guard Not Working**: Check guard order and imports

### Debug Mode

Enable debug logging for authentication:

```typescript
// In your environment configuration
LOG_LEVEL = debug;
```

## Next Steps

1. **Password Reset**: Implement password reset functionality
2. **Email Verification**: Add email verification for new users
3. **OAuth Integration**: Add social login options
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Audit Logging**: Add comprehensive audit logging
6. **Multi-Factor Authentication**: Implement 2FA for enhanced security
