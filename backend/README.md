# Luminous CRM Backend

A TypeScript-based Express.js backend for the Luminous CRM application with authentication, multi-tenancy support, and Railway deployment configuration.

## Features Implemented

### ✅ Phase 1 & 2: Authentication + Multi-tenancy
- ✅ **Multi-tenant Architecture**: Full organization-based data isolation
- ✅ **Authentication System**: JWT-based authentication with organization context
- ✅ **User Management**: Registration creates organization + user as owner
- ✅ **Organization Management**: Complete CRUD operations for organizations
- ✅ **Role-based Access**: Owner, Admin, Manager, Member roles with permissions
- ✅ **User Invitations**: Add users to existing organizations
- ✅ **Security**: Helmet, CORS, rate limiting, password hashing
- ✅ **Database**: PostgreSQL with Prisma ORM and proper relationships
- ✅ **Validation**: Comprehensive input validation with express-validator
- ✅ **Error Handling**: Centralized error handling middleware
- ✅ **TypeScript**: Full TypeScript support with proper types
- ✅ **Railway Ready**: Configured for Railway deployment

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create organization and user (as owner)
- `POST /api/auth/join-organization` - Join existing organization as member
- `POST /api/auth/login` - User login (optional organization slug)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile with organization
- `POST /api/auth/refresh-token` - Refresh access token

### Organizations
- `GET /api/organizations/public/:slug` - Get public organization info
- `GET /api/organizations/current` - Get current user's organization (with users)
- `PUT /api/organizations/current` - Update organization (Owner/Admin only)
- `DELETE /api/organizations/current` - Deactivate organization (Owner only)
- `POST /api/organizations/users` - Add user to organization (Owner/Admin only)
- `DELETE /api/organizations/users/:userId` - Remove user (Owner/Admin only)
- `PUT /api/organizations/users/:userId/role` - Update user role (Owner only)
- `GET /api/organizations/stats` - Get organization statistics

### Health Check
- `GET /api/health` - API health status

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luminous_crm?schema=public"

# JWT Secrets
JWT_SECRET="your-super-secure-jwt-secret"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup database:**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Deployment (Railway)

### Prerequisites
- Railway account
- GitHub repository

### Deployment Steps

1. **Connect to Railway:**
   - Create new Railway project
   - Connect GitHub repository
   - Set root directory to `/backend`

2. **Add PostgreSQL Service:**
   - Add PostgreSQL service to Railway project
   - Copy connection string to `DATABASE_URL`

3. **Environment Variables:**
   Set the following in Railway dashboard:
   ```
   DATABASE_URL=<your-railway-postgres-url>
   JWT_SECRET=<secure-random-string>
   JWT_REFRESH_SECRET=<secure-random-string>
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy:**
   - Push to main branch
   - Railway will automatically build and deploy

## Database Schema

### Users Table
- `id` - Unique identifier (CUID)
- `email` - User email (unique per organization)
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `phone` - Optional phone number
- `role` - User role (OWNER, ADMIN, MANAGER, MEMBER)
- `isActive` - Account status
- `organizationId` - Reference to organization (required)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Organizations Table
- `id` - Unique identifier (CUID)
- `name` - Organization name
- `slug` - Unique slug for organization
- `description` - Optional description
- `website` - Optional website URL
- `phone` - Optional organization phone
- `address` - Optional physical address
- `city` - Optional city
- `country` - Optional country
- `timezone` - Organization timezone (default: UTC)
- `currency` - Organization currency (default: USD)
- `isActive` - Organization status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### User Roles
- **OWNER**: Full access, can manage organization and all users
- **ADMIN**: Can manage users and organization settings (except deletion)
- **MANAGER**: Can manage data but limited user management
- **MEMBER**: Basic access to organization data

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── validation/     # Input validation schemas
│   ├── app.ts         # Express app configuration
│   └── index.ts       # Server entry point
├── prisma/
│   └── schema.prisma  # Database schema
├── .env.example       # Environment variables template
├── railway.json       # Railway deployment config
└── package.json       # Dependencies and scripts
```

## Next Steps (Phase 3+)

- WhatsApp Business API integration
- Real-time chat with Socket.io
- Product catalog management
- Order management system
- Template management
- Campaign management
- Customer management
- Dashboard & Analytics
- Financial management

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with secure secrets and organization context
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection via Prisma ORM
- Role-based access control

## API Usage Examples

### 1. Create Organization and User (Registration)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@company.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "organization": {
      "name": "My Company",
      "slug": "my-company",
      "description": "A great company",
      "website": "https://mycompany.com"
    }
  }'
```

### 2. Join Existing Organization
```bash
curl -X POST http://localhost:3000/api/auth/join-organization \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "SecurePass123",
    "firstName": "Jane",
    "lastName": "Smith",
    "organizationSlug": "my-company"
  }'
```

### 3. Login with Organization Context
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@company.com",
    "password": "SecurePass123",
    "organizationSlug": "my-company"
  }'
```

### 4. Get Current Organization
```bash
curl -X GET http://localhost:3000/api/organizations/current \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Add User to Organization (Owner/Admin only)
```bash
curl -X POST http://localhost:3000/api/organizations/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@company.com",
    "firstName": "Bob",
    "lastName": "Wilson",
    "role": "MEMBER"
  }'
```