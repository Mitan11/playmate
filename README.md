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
- 📷 **Image Upload** - Multer file handling with Cloudinary integration
- 🌥️ **Cloud Storage** - Automatic image optimization and CDN delivery

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

**Content-Type**: `multipart/form-data`

**Form Fields**:
```
user_email: john.doe@example.com
user_password: SecurePass123!
first_name: John
last_name: Doe
profile_image: [FILE] (optional - image file)
```

**cURL Example**:
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -F "user_email=john.doe@example.com" \
  -F "user_password=SecurePass123!" \
  -F "first_name=John" \
  -F "last_name=Doe" \
  -F "profile_image=@/path/to/your/image.jpg"
```

**Image Upload Details**:
- **Accepted formats**: JPG, PNG, GIF, WebP
- **File size limit**: 10MB
- **Processing**: Automatically uploaded to Cloudinary CDN
- **Default avatar**: Provided if no image uploaded
- **Storage**: Cloudinary secure URLs saved in database

**Success Response (201)**:
```json
{
    "status": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
        "user_id": 1,
        "user_email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile_image": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/user_profiles/abc123.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "timestamp": "2025-12-05T10:30:00.000Z"
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
# Server Configuration
PORT=4000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=playmate_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

# Email Configuration
EMAIL=abc@gmail.com
EMAIL_PASSWORD=qwq qwe qwe
EMAIL_SERVICE=Gmail
```

### Image Upload Flow

1. **Frontend**: User selects image file in form
2. **Multer**: Receives and temporarily stores uploaded file
3. **Validation**: Checks file type and size limits
4. **Cloudinary**: Uploads image to cloud storage
5. **Database**: Stores Cloudinary URL in user profile
6. **Response**: Returns user data with image URL

### Default Profile Image

If no image is uploaded, users automatically receive:
```
https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764845539/avatar_wcaknk.png
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
├── uploads/              # Temporary multer storage
├── config/
│   └── db.js             # Database connection
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   ├── multer.js         # File upload handling
│   └── validation.js     # Input validation
├── models/
│   └── User.js          # User model
├── routes/
│   └── authRouter.js    # API routes
└── utils/
    ├── AuthHelpers.js   # Auth utilities
    ├── Cloudinary.js    # Cloud storage config
    └── Response.js      # Response formatter
```

### Dependencies

```json
{
  "multer": "^2.0.2",           // File upload handling
  "cloudinary": "^2.8.0",      // Cloud image storage
  "bcrypt": "^6.0.0",           // Password hashing
  "jsonwebtoken": "^9.0.3",     // JWT authentication
  "express-validator": "^7.3.1", // Input validation
  "mysql2": "^3.15.3"           // MySQL database driver
}
```

## 📞 Contact

[![Email](https://img.shields.io/badge/Email-mitantank00@gmail.com-red?logo=gmail)](mailto:mitantank00@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/mitan-tank-986076247)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-purple?logo=instagram)](https://www.instagram.com/__.mituu._)

---

**Built with ❤️ by [Mitan Tank](https://github.com/Mitan11)**
