# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

### Database Configuration

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/righttorepresent
```

### JWT Configuration

```env
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### Environment

```env
NODE_ENV=development
PORT=3000
```

## JWT Secret Generation

Generate a strong JWT secret using one of these methods:

### Method 1: Node.js

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 2: OpenSSL

```bash
openssl rand -hex 64
```

### Method 3: Online Generator

Use a secure online random string generator (not recommended for production)

## Security Notes

1. **Never commit your `.env` file** to version control
2. **Use different secrets** for development, staging, and production
3. **Make JWT secrets long** (at least 32 characters, preferably 64+)
4. **Rotate secrets regularly** in production environments
5. **Use HTTPS** in production to protect tokens in transit

## Example .env File

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/righttorepresent

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Environment
NODE_ENV=development
PORT=3000
```

## Testing the Configuration

After setting up your environment variables, test the configuration:

1. **Start the application**: `pnpm run start:dev`
2. **Check GraphQL Playground**: Visit `http://localhost:3000/graphql`
3. **Test authentication**: Try the login/register mutations
4. **Verify JWT tokens**: Check that tokens are generated and valid

## Troubleshooting

### Common Issues

1. **JWT_SECRET not set**: Application will fail to start
2. **Invalid DATABASE_URL**: Database connection will fail
3. **Port already in use**: Change PORT in .env file
4. **Permission denied**: Check file permissions for .env

### Validation

The application validates environment variables on startup. Missing or invalid variables will cause startup failures with clear error messages.
