# BenGift Clothing Backend API

Complete backend API for the BenGift Clothing Tailor Management System.

## Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, Rate Limiting, Input Validation
- **SMS**: Twilio API

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` file in backend folder:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
SUPABASE_URL=https://ewnaxjfovtgnalpmqwht.supabase.co
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PORT=5000
NODE_ENV=development
```

### 3. Setup Database

Run the SQL in `COMPLETE_SETUP.sql` in your Supabase SQL Editor to create all tables and the admin user.

### 4. Start Backend Server

```bash
npm run dev
```

Server will run on: http://localhost:5000

### 5. Login Credentials

- **Username**: admin
- **Password**: Admin123

## API Endpoints

### Authentication (Public)
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Protected Endpoints (Require JWT Token)

All endpoints below require `Authorization: Bearer <token>` header.

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `PATCH /api/jobs/:id/status` - Update job status
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/meta/next-job-number` - Get next job number
- `GET /api/jobs/meta/stats` - Get dashboard statistics

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Workers
- `GET /api/workers` - Get all workers
- `POST /api/workers` - Create worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Fabrics
- `GET /api/fabrics` - Get all fabrics
- `POST /api/fabrics` - Create fabric
- `PUT /api/fabrics/:id` - Update fabric
- `DELETE /api/fabrics/:id` - Delete fabric

### Shop
- `GET /api/shop` - Get shop info
- `PUT /api/shop` - Update shop info

### SMS
- `POST /api/sms/send` - Send single SMS
- `POST /api/sms/send-bulk` - Send bulk SMS

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt (10 salt rounds)
- Rate limiting (100 requests/15min, 5 login attempts/15min)
- Input validation and sanitization
- Helmet security headers
- SQL injection prevention via parameterized queries
- Role-based access control (admin, staff, viewer)

## Database Schema

See `COMPLETE_SETUP.sql` for the complete database schema including:
- users (authentication)
- refresh_tokens (JWT refresh tokens)
- audit_logs (security audit trail)
- customers
- jobs
- workers
- fabrics
- shops

## Testing API

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example:
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `SUPABASE_URL` and `SUPABASE_KEY` with production credentials
3. Generate strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
4. Deploy to: Render, Railway, or DigitalOcean
5. Update frontend `VITE_API_URL` to production URL
6. Enable CORS for your production frontend domain

## Documentation

- `SECURITY_IMPLEMENTATION.md` - Complete security implementation guide
- `COMPLETE_SETUP.sql` - Database setup SQL script

## Support

For issues or questions, contact: +233209609002
