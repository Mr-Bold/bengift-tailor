# BenGift Clothing Frontend

React-based frontend application for the BenGift Clothing Tailor Management System.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env` file in frontend folder:

```bash
cp .env.example .env
```

Edit `.env` with your backend URL:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will run on: http://localhost:3001

### 4. Login Credentials

- **Username**: admin
- **Password**: Admin123

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable React components
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── SkeletonLoader.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NewJobCard.jsx
│   │   ├── JobRegister.jsx
│   │   ├── Reports.jsx
│   │   ├── Masters.jsx
│   │   ├── ShopInfo.jsx
│   │   ├── Settings.jsx
│   │   └── About.jsx
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── styles/          # CSS files
│   │   └── responsive.css
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── App.css          # Main app styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── images/              # Application images
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies

```

## Features

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- User session management

### Pages
- **Dashboard**: Overview of jobs, revenue, and statistics
- **New Job Card**: Create new tailoring jobs
- **Job Register**: View and manage all jobs
- **Reports**: Generate and view reports
- **Masters**: Manage customers, workers, and fabrics
- **Shop Info**: Update shop information
- **Settings**: Application settings
- **About**: About the application

### Mobile Responsiveness
- Fully responsive design for all screen sizes
- Touch-friendly buttons (44x44px minimum)
- Optimized layouts for mobile devices
- iOS zoom prevention on inputs
- Horizontal scroll for wide tables

### Data Management
- Hybrid storage (API + localStorage fallback)
- Automatic data synchronization
- Offline capability with localStorage backup

## API Integration

The frontend communicates with the backend API through the `api.js` service layer:

```javascript
import { authAPI, jobsAPI, customersAPI, workersAPI, fabricsAPI, shopAPI } from './services/api'
```

### Available APIs
- `authAPI` - Authentication (login, logout, register, refresh)
- `jobsAPI` - Job management
- `customersAPI` - Customer management
- `workersAPI` - Worker management
- `fabricsAPI` - Fabric management
- `shopAPI` - Shop information

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

1. Use React DevTools for debugging
2. Check browser console for API errors
3. Use Network tab to monitor API calls
4. Test on mobile devices using browser DevTools

## Support

For issues or questions: +233209609002
