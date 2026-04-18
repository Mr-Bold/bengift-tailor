# BenGift Clothing - Tailor Management System

A complete web-based management system for tailoring businesses, built with React and Node.js.

## 🎯 Features

- **Job Management**: Create, track, and manage tailoring orders
- **Customer Database**: Store customer information and order history
- **Worker Management**: Track workers and their assignments
- **Fabric Inventory**: Manage fabric stock and pricing
- **Reports & Analytics**: Generate business insights and reports
- **Excel Export**: Export all data to Excel with multiple sheets
- **Mobile Responsive**: Works seamlessly on all devices (PWA enabled)
- **Secure Authentication**: JWT-based login system with role-based access
- **SMS Notifications**: Send order updates to customers (Twilio)
- **Toast Notifications**: Modern, user-friendly notifications

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Supabase account (free tier works)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "ben-gift clothings"
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Setup Database**
- Go to your Supabase project
- Open SQL Editor
- Run the SQL from `COMPLETE_SETUP.sql`

5. **Start the Application**

**Option A: Using batch files (Windows)**
- Double-click `start-backend.bat`
- Double-click `start-frontend.bat`

**Option B: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Login**
- Open http://localhost:3000
- Username: `admin`
- Password: `Admin123`

## 📁 Project Structure

```
ben-gift clothings/
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, security
│   ├── models/          # Database models (Supabase)
│   ├── routes/          # API endpoints
│   ├── services/        # External services (Twilio)
│   └── server.js        # Entry point
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API integration
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main app component
│   └── index.html       # HTML template
├── COMPLETE_SETUP.sql   # Database schema
└── TWILIO_SMS_SETUP.md  # SMS configuration guide
```

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios (API calls)
- React Hot Toast (notifications)
- XLSX (Excel export)
- Vite (build tool)
- Vite PWA Plugin

### Backend
- Node.js + Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- bcryptjs (password hashing)
- Helmet (security headers)
- Express Rate Limit
- Express Validator
- Twilio (SMS)

## 📚 Documentation

- [Backend Documentation](backend/README.md) - API endpoints and setup
- [Frontend Documentation](frontend/README.md) - Development guide
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment
- [Netlify Fix Summary](NETLIFY_FIX_SUMMARY.md) - Netlify deployment fix details
- [Netlify Environment Variables](NETLIFY_ENV_VARS.md) - Quick Netlify setup
- [Twilio SMS Setup](TWILIO_SMS_SETUP.md) - SMS configuration
- [Cleanup Summary](CLEANUP_SUMMARY.md) - Code cleanup details

## 🔐 Security Features

- JWT authentication with access & refresh tokens
- Password hashing with bcrypt (10 salt rounds)
- Rate limiting (100 requests/15min, 5 login attempts/15min)
- Input validation and sanitization
- SQL injection prevention
- Security headers with Helmet
- Role-based access control
- Audit logging

## 📱 Mobile & PWA Support

- Fully responsive design for all screen sizes
- Touch-friendly interface (44x44px minimum touch targets)
- iOS zoom prevention (16px font on inputs)
- PWA enabled (installable on mobile devices)
- Install prompt for first-time visitors
- Offline-ready with service worker
- Home screen icon support

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

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

### SMS
- `POST /api/sms/send` - Send single SMS
- `POST /api/sms/send-bulk` - Send bulk SMS

More details in [Backend Documentation](backend/README.md)

## 💾 Data Export

Export all your business data to Excel with one click:
- **Summary Sheet**: Financial overview and statistics
- **Jobs Sheet**: All job cards with details
- **Customers Sheet**: Customer database
- **Workers Sheet**: Worker information
- **Job Items Sheet**: Detailed measurements and items

## 🚀 Deployment

### Quick Deploy to Production

**Frontend (Netlify)**:
1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
4. Deploy automatically

**Backend (Render)**:
1. Connect repository to Render
2. Set root directory to `backend`
3. Configure environment variables (Supabase, JWT secrets)
4. Deploy automatically

**Detailed Instructions**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Configuration Files

- `netlify.toml` - Netlify configuration (build settings, redirects, headers)
- `backend/.env.example` - Backend environment template
- `frontend/.env.production` - Frontend production config

## 📞 Support

For issues or questions:
- Phone: +233209609002
- Email: support@bengiftclothing.com

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for BenGift Clothing**
