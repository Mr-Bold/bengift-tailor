# BenGift Clothing Backend API

Complete backend API for the BenGift Clothing Tailor Management System.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **SMS**: Hubtel API (Ghana)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier)
4. Get connection string
5. Add to `.env` file

**Option B: Local MongoDB**
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

### 3. Configure Environment

Create `.env` file in backend folder:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
MONGODB_URI=mongodb://localhost:27017/bengift_tailor
PORT=5000
HUBTEL_CLIENT_ID=your_client_id
HUBTEL_CLIENT_SECRET=your_client_secret
```

### 4. Start Backend Server

```bash
npm run dev
```

Server will run on: http://localhost:5000

### 5. Configure Frontend

Create `.env` file in root folder:

```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

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
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `POST /api/customers/search` - Advanced search

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get single worker
- `POST /api/workers` - Create worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Fabrics
- `GET /api/fabrics` - Get all fabrics
- `GET /api/fabrics/:id` - Get single fabric
- `POST /api/fabrics` - Create fabric
- `PUT /api/fabrics/:id` - Update fabric
- `DELETE /api/fabrics/:id` - Delete fabric

### Shop
- `GET /api/shop` - Get shop info
- `PUT /api/shop` - Update shop info

### SMS
- `POST /api/sms/send` - Send single SMS
- `POST /api/sms/send-bulk` - Send bulk SMS

## Database Schema

### Jobs Collection
```javascript
{
  jobNo: String,
  customerName: String,
  customerId: ObjectId,
  orderDate: Date,
  deliveryDate: Date,
  trialDate: Date,
  workerId: ObjectId,
  items: Array,
  totalAmount: Number,
  advancePaid: Number,
  balance: Number,
  status: String,
  cancelled: Boolean
}
```

### Customers Collection
```javascript
{
  name: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  totalOrders: Number,
  totalSpent: Number
}
```

### Workers Collection
```javascript
{
  name: String,
  phone: String,
  salary: Number,
  status: String,
  specialization: Array
}
```

## Migration from localStorage

To migrate existing data from localStorage to MongoDB, use the migration script:

```bash
npm run migrate
```

## Testing API

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example:
```bash
curl http://localhost:5000/api/health
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas for database
3. Deploy to: Heroku, Railway, Render, or DigitalOcean
4. Update frontend `VITE_API_URL` to production URL

## Support

For issues or questions, contact: +233209609002
