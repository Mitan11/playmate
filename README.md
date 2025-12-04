# Playmate Authentication API 🔐

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

A secure and robust REST API for user authentication built with Node.js, Express.js, and MySQL. Features user registration, login, email validation, and JWT-based authentication.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Setup](#environment-setup)
- [Contact](#contact)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 📧 **Email Validation** - Real-time email availability checking
- 🔑 **Password Security** - bcrypt hashing with strong password requirements
- ✅ **Input Validation** - Comprehensive validation using express-validator
- 🗄️ **MySQL Integration** - Database with connection pooling
- 🛡️ **Security** - CORS, input sanitization, SQL injection prevention

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm/yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd playmate

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start server
npm start
```

**Base URL:** `http://localhost:3000/api/v1/auth`

## 📖 API Documentation

### Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/register` | POST | Register new user | ❌ |
| `/login` | POST | User login | ❌ |
| `/check-email` | POST | Check email availability | ❌ |
| `/health` | GET | API health check | ❌ |

### Standard Response Format

```json
{
    "status": true,
    "statusCode": 200,
    "message": "Success message",
    "data": {},
    "token": "jwt_token",
    "timestamp": "2025-12-04T10:30:00.000Z"
}
```

### User Registration

**POST** `/api/v1/auth/register`

```json
{
    "user_email": "user@example.com",
    "user_password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "profile_image": "https://example.com/image.jpg"
}
```

**Success Response (201):**
```json
{
    "status": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
        "user_id": 1,
        "user_email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "timestamp": "2025-12-04T10:30:00.000Z"
}
```

### User Login

**POST** `/api/v1/auth/login`

```json
{
    "user_email": "user@example.com",
    "user_password": "SecurePass123!"
}
```

### Check Email Availability

**POST** `/api/v1/auth/check-email`

```json
{
    "user_email": "user@example.com"
}
```

### Health Check

**GET** `/api/v1/auth/health`

Returns API status and version information.

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(61) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NULL,
    profile_image VARCHAR(165) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (user_email)
);
```

## ⚙️ Environment Setup

Create `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=playmate_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
```

### Password Requirements

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character (@$!%*?&)

### Project Structure

```
playmate/
├── app.js                 # Main application
├── package.json          # Dependencies
├── config/
│   └── db.js             # Database connection
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── validation.js     # Input validation
├── models/
│   └── User.js          # User model
├── routes/
│   └── authRouter.js    # API routes
└── utils/
    ├── AuthHelpers.js   # Auth utilities
    └── Response.js      # Response formatter
```

## 📞 Contact

[![Email](https://img.shields.io/badge/Email-mitantank00@gmail.com-red?logo=gmail)](mailto:mitantank00@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/mitan-tank-986076247)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-purple?logo=instagram)](https://www.instagram.com/__.mituu._)

---

**Built with ❤️ by [Mitan Tank](https://github.com/Mitan11)**
