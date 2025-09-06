# Battery Management System - Complete Setup & Feature Guide

## 📋 **Requirements**
- Node.js (>=18)
- npm (>=9)
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

---

## 🚀 **1. Quick Setup**

### Clone & Extract Project
```bash
unzip bms-fullstack-project.zip
cd bms-fullstack-project
```

### Backend Setup
```bash
cd backend
npm install
docker compose up -d
psql postgres://postgres:postgres@localhost:5432/bms -f sql/init.sql
psql postgres://postgres:postgres@localhost:5432/bms -f sql/seed.sql
npm run dev
```
Backend runs at: `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🎯 **2. Implemented Features**

### **Authentication System**
- ✅ **JWT Authentication** with 12-hour token expiry
- ✅ **User Registration** with email/password validation
- ✅ **Login/Logout** functionality
- ✅ **Password Visibility Toggle** (👁️/🙈) in login and register forms
- ✅ **Session Management** with automatic logout

### **User Roles & Permissions**
- ✅ **Role-based Access Control** (user/admin)
- ✅ **Admin-only Routes** with middleware protection
- ✅ **Dynamic UI** based on user role
- ✅ **Secure Admin Panel** access

### **Admin Dashboard**
- ✅ **User Management** - View all users in table format
- ✅ **User Count Display** - Total registered users
- ✅ **Password Visibility** - Plain text passwords displayed for admins
- ✅ **User Details** - ID, Email, Password, Role, Created Date
- ✅ **Role-based Navigation** - Admin tab only visible to admins

### **Battery Management**
- ✅ **Battery Data Ingestion** - Store voltage, current, temperature readings
- ✅ **Real-time Charts** - Interactive Chart.js visualizations
- ✅ **Data Filtering** - By battery ID, field type, time range
- ✅ **Pagination Support** - Handle large datasets efficiently
- ✅ **Time-based Queries** - Historical data analysis

### **Security Features**
- ✅ **Password Hashing** with bcrypt (12 rounds)
- ✅ **Input Validation** with Zod schemas
- ✅ **Rate Limiting** (120 requests per 15 minutes)
- ✅ **CORS Protection** with configurable origins
- ✅ **Helmet Security Headers**
- ✅ **Request Logging** with Morgan

### **Database Features**
- ✅ **PostgreSQL Integration** with connection pooling
- ✅ **User Table** with roles and plain text passwords
- ✅ **Battery Readings Table** with indexed queries
- ✅ **Docker Containerization** for easy deployment
- ✅ **Adminer Integration** for database management

---

## 🔗 **3. API Endpoints**

### **Authentication**
```
POST /api/auth/login          - User login
POST /api/auth/register       - User registration
GET  /api/auth/me            - Get current user info
```

### **Admin Only**
```
GET  /api/auth/admin/users       - List all users (admin only)
GET  /api/auth/admin/user-count  - Get user count (admin only)
```

### **Battery Management**
```
POST /api/battery/data           - Ingest battery reading
GET  /api/battery/{id}          - Get all readings for battery
GET  /api/battery/{id}/{field}  - Get specific field data
```

### **System**
```
GET  /health                     - Health check endpoint
```

---

## 👥 **4. User Roles & Test Accounts**

### **Available Test Users**
| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `demo@bms.dev` | `demo123` | user | Regular user account |
| `admin@bms.dev` | `admin123` | admin | Admin account with full access |
| `user1@bms.dev` | `demo123` | user | Additional test user |
| `user2@bms.dev` | `demo123` | user | Additional test user |
| `manager@bms.dev` | `demo123` | admin | Additional admin account |

### **Role Permissions**
- **User Role**: Can view battery data, manage own account
- **Admin Role**: All user permissions + user management, view all passwords

### **Available Battery Data**
| Battery ID | Data Points | Time Range | Description |
|------------|-------------|------------|-------------|
| `1001` | 180 | Last 3 hours | Standard battery data |
| `1002` | 120 | Last 2 hours | Variable current patterns |
| `1003` | 240 | Last 4 hours | High voltage battery |
| `2001` | 1440 | Last 24 hours | Historical data |
| `2002` | 720 | Last 12 hours | Medium-term data |
| `3001` | 360 | Last 6 hours | Data with anomalies |
| `4001` | 360 | Last 1 hour | High-frequency data (10s intervals) |

---

## 🧪 **5. Testing Scenarios**

### **Authentication Testing**
1. **Login with valid credentials**
2. **Login with invalid credentials**
3. **Register new user**
4. **Password visibility toggle**
5. **Session persistence**

### **Admin Panel Testing**
1. **Access admin panel as admin user**
2. **View user list with passwords**
3. **Check user count display**
4. **Attempt admin access as regular user** (should fail)

### **Battery Data Testing**
1. **Test different battery IDs**: Try `1001`, `1002`, `1003`, `2001`, `2002`, `3001`, `4001`
2. **View battery charts** for each battery ID
3. **Filter by time range** - test with different start/end dates
4. **Switch between voltage/current/temperature** fields
5. **Test high-frequency data** with battery `4001` (10-second intervals)
6. **Test anomaly detection** with battery `3001` (contains occasional spikes)
7. **Test historical data** with batteries `2001` and `2002`

### **Security Testing**
1. **Rate limiting** (try 120+ requests/minute)
2. **Invalid JWT tokens**
3. **Unauthorized admin access**
4. **Input validation** (try invalid data)

---

## 🔒 **6. Security Considerations**

### **⚠️ Important Security Notes**
- **Plain Text Passwords**: Currently stored for admin visibility (NOT recommended for production)
- **JWT Secret**: Change in production environment
- **CORS Origins**: Configure properly for production
- **Rate Limiting**: Adjust limits based on requirements
- **Password Hashing**: bcrypt with 12 rounds (production ready)

### **Production Recommendations**
- Remove plain text password storage
- Use environment-specific secrets
- Implement password policies
- Add account lockout mechanisms
- Enable HTTPS/TLS
- Regular security audits

---

## 🗄️ **7. Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  plain_password TEXT,  -- For admin visibility
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Battery Readings Table**
```sql
CREATE TABLE battery_readings (
  id SERIAL PRIMARY KEY,
  battery_id TEXT NOT NULL,
  current DECIMAL,
  voltage DECIMAL,
  temperature DECIMAL,
  time TIMESTAMP NOT NULL
);
```

---

## 🎨 **8. Frontend Features**

### **UI Components**
- ✅ **Responsive Design** with Tailwind CSS
- ✅ **Interactive Charts** with Chart.js
- ✅ **Form Validation** with real-time feedback
- ✅ **Loading States** and error handling
- ✅ **Navigation** between dashboard and admin
- ✅ **Password Toggle** buttons in forms

### **User Experience**
- ✅ **Intuitive Navigation** with role-based menus
- ✅ **Real-time Data Updates**
- ✅ **Error Messages** with helpful feedback
- ✅ **Mobile Responsive** design
- ✅ **Accessibility** considerations

---

## 🐳 **9. Docker & Deployment**

### **Services**
- **PostgreSQL**: Database server
- **Adminer**: Web-based database management
- **Backend**: Node.js API server
- **Frontend**: React development server

### **Ports**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Adminer: `http://localhost:8081`
- PostgreSQL: `localhost:5432`

---

## 📚 **10. Development Notes**

### **Tech Stack**
- **Backend**: Node.js, Express, PostgreSQL, JWT, bcrypt, Zod
- **Frontend**: React, Vite, Axios, Tailwind CSS, Chart.js
- **DevOps**: Docker, Docker Compose, Adminer
- **Documentation**: OpenAPI/Swagger, Mermaid UML

### **Key Libraries**
- **Security**: `helmet`, `express-rate-limit`, `cors`
- **Validation**: `zod` for schema validation
- **Database**: `pg` for PostgreSQL integration
- **Authentication**: `jsonwebtoken`, `bcryptjs`

---

## 🎯 **Quick Start Commands**

```bash
# Start everything
docker compose up -d
cd backend && npm run dev &
cd frontend && npm run dev &

# Database operations
psql postgres://postgres:postgres@localhost:5432/bms

# Test admin access
curl -X GET http://localhost:8080/api/auth/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚀 **You're Ready!**

The Battery Management System is now fully configured with:
- ✅ Complete authentication system
- ✅ Role-based admin panel
- ✅ Password visibility features
- ✅ Battery data management
- ✅ Security best practices
- ✅ Comprehensive documentation

**Access the application at:** `http://localhost:5173`

**Login with demo account:**
- Email: `demo@bms.dev`
- Password: `demo123`

**Login with admin account:**
- Email: `admin@bms.dev`
- Password: `admin123`
