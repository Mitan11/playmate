# 🏃‍♂️ Playmate - Sports Social Platform API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-3448C5?logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-22D3EE?logo=nodemailer&logoColor=white)

A comprehensive sports social platform API built with Node.js, Express.js, and MySQL. Playmate enables users to connect through sports, manage their athletic profiles, and engage with a community of sports enthusiasts. The platform features secure authentication, image uploads, email notifications, and a robust foundation for sport management and skill tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

Playmate is designed to bridge the gap between sports enthusiasts by providing a platform where users can:
- Create and manage their sports profiles
- Track their skill levels across multiple sports
- Connect with other players based on sport preferences
- Receive personalized notifications and updates
- Manage their athletic journey with secure, reliable tools

The API follows RESTful principles, implements JWT-based authentication, and uses industry-standard security practices to protect user data.

## ✨ Features

### Current Features
- 🔐 **JWT Authentication**: Secure token-based authentication with configurable expiration
- 👤 **User Management**: Complete registration, login, and profile management
- 📷 **Image Upload**: Cloudinary integration for optimized profile images with automatic resizing
- 📧 **Email Notifications**: 
  - Welcome emails for new users
  - Password reset with OTP verification
  - Professional HTML email templates
- ✅ **Input Validation**: Comprehensive validation using express-validator
- 🗄️ **Database**: MySQL with connection pooling for optimal performance
- 📊 **Health Monitoring**: Real-time health check endpoint with system metrics
- 📱 **Standardized Responses**: Consistent API response format across all endpoints
- 🔒 **Password Security**: Bcrypt hashing with salt rounds
- 🚀 **Performance**: Indexed database queries for fast lookups

### Upcoming Features
- 🏅 **Sport Management**: Add, update, and manage sports
- 📈 **Skill Tracking**: Track and update skill levels
- 👥 **User Matching**: Find players based on sports and skill levels
- 🗓️ **Event Management**: Create and join sports events
- 💬 **Messaging**: Real-time chat between users
- 📍 **Location Services**: Find nearby players and venues
- 🏆 **Achievements**: Gamification with badges and milestones

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 5.2.1
- **Database**: MySQL 8.0+ with mysql2
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

### Services & Tools
- **Image CDN**: Cloudinary
- **Email Service**: Nodemailer (Gmail SMTP)
- **File Upload**: Multer
- **Environment**: dotenv
- **Development**: nodemon

### Utilities
- **Date/Time**: day.js
- **Crypto**: Built-in crypto module for OTP generation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (18.x recommended)
- MySQL 8.0+
- npm or yarn package manager
- Cloudinary account (free tier available)
- Gmail account with app-specific password

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd playmate

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Initialize database
# Run the SQL scripts in docs/DATABASE.md

# Start development server
npm run dev

# Or start production server
npm start
```

**Base URL**: `http://localhost:4000`

**Auth API Prefix**: `/api/v1/auth`

## 📖 Installation Guide

### 1. System Requirements

**Minimum Requirements**:
- CPU: 2 cores
- RAM: 2GB
- Storage: 10GB
- OS: Linux, macOS, or Windows

**Recommended Requirements**:
- CPU: 4+ cores
- RAM: 4GB+
- Storage: 20GB SSD
- OS: Ubuntu 20.04 LTS or later

### 2. Database Setup

```bash
# Install MySQL (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE playmate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'playmate_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON playmate.* TO 'playmate_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run schema creation (see docs/DATABASE.md for complete schema)
mysql -u playmate_user -p playmate < schema.sql
```

### 3. Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Navigate to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env` file

### 4. Email Setup

```bash
# For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate App-Specific Password:
   - Go to Google Account > Security
   - Select "App passwords"
   - Generate password for "Mail"
3. Use this password in EMAIL_PASSWORD
```

### 5. Environment Configuration

Create `.env` file in root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=playmate_user
DB_PASSWORD=your_secure_password
DB_NAME=playmate
DB_CONNECTION_LIMIT=10

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

# Email Configuration
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_SERVICE=Gmail
EMAIL_FROM_NAME=Playmate

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Rate Limiting (optional)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 6. Verification

```bash
# Test database connection
npm run test:db

# Test email service
npm run test:email

# Start server
npm run dev

# Check health endpoint
curl http://localhost:4000/api/v1/auth/health
```

## 📖 API Documentation

For detailed API documentation, see [docs/API.md](docs/API.md)

### Quick Reference

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/register` | POST | Register new user | ❌ |
| `/login` | POST | Login and receive JWT | ❌ |
| `/check-email` | POST | Check email availability | ❌ |
| `/reset-password-email` | POST | Send password reset OTP | ❌ |
| `/reset-password` | POST | Reset password with OTP | ❌ |
| `/change-password` | POST | Change password | ✅ |
| `/health` | GET | Health check | ❌ |

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Endpoint Documentation

### 1. User Registration

**POST** `/api/v1/auth/register`

Register a new user account with optional profile image upload.

#### Request

**Content-Type**: `multipart/form-data`

**Fields**:

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| user_email | string | ✅ Yes | 100 | Valid email address (must be unique) |
| user_password | string | ✅ Yes | 60 | Strong password (see requirements below) |
| first_name | string | ✅ Yes | 50 | User's first name |
| last_name | string | ❌ No | 50 | User's last name |
| profile_image | file | ❌ No | 5MB | Profile image (JPG, JPEG, PNG) |

**Password Requirements**:
- 8-60 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 digit (0-9)
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

#### Response

**Success (201 Created)**:
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
    "profile_image": "https://res.cloudinary.com/demo/image/upload/v1/playmate/user_1.jpg",
    "created_at": "2025-01-04T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Email Exists (409 Conflict)**:
```json
{
  "status": false,
  "statusCode": 409,
  "message": "User with this email already exists",
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Validation Failed (400 Bad Request)**:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "user_email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "user_password",
      "message": "Password must contain at least one uppercase letter"
    }
  ],
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -F "user_email=john.doe@example.com" \
  -F "user_password=SecurePass123!" \
  -F "first_name=John" \
  -F "last_name=Doe" \
  -F "profile_image=@/path/to/image.jpg"
```

**JavaScript Example**:
```javascript
const formData = new FormData();
formData.append('user_email', 'john.doe@example.com');
formData.append('user_password', 'SecurePass123!');
formData.append('first_name', 'John');
formData.append('last_name', 'Doe');
formData.append('profile_image', fileInput.files[0]);

const response = await fetch('http://localhost:4000/api/v1/auth/register', {
  method: 'POST',
  body: formData
});

const data = await response.json();
if (data.status) {
  localStorage.setItem('authToken', data.token);
  console.log('Registration successful!');
}
```

**Features**:
- ✅ Automatic email validation
- ✅ Password strength validation
- ✅ Duplicate email detection
- ✅ Profile image upload to Cloudinary
- ✅ Default avatar if no image provided
- ✅ Welcome email sent automatically
- ✅ JWT token generated and returned

---

### 2. User Login

**POST** `/api/v1/auth/login`

Authenticate user credentials and receive JWT token.

#### Request

**Content-Type**: `application/json`

**Body**:
```json
{
  "user_email": "john.doe@example.com",
  "user_password": "SecurePass123!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_email | string | ✅ Yes | Registered email address |
| user_password | string | ✅ Yes | User's password |

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user_id": 1,
    "user_email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_image": "https://res.cloudinary.com/demo/image/upload/v1/playmate/user_1.jpg",
    "created_at": "2025-01-04T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Invalid Credentials (400 Bad Request)**:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Invalid email or password",
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "john.doe@example.com",
    "user_password": "SecurePass123!"
  }'
```

**JavaScript Example**:
```javascript
const response = await fetch('http://localhost:4000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_email: 'john.doe@example.com',
    user_password: 'SecurePass123!'
  })
});

const data = await response.json();
if (data.status) {
  // Store token securely (use httpOnly cookie in production)
  sessionStorage.setItem('authToken', data.token);
  console.log('Login successful!');
}
```

**Features**:
- ✅ Secure password comparison using bcrypt
- ✅ Returns complete user profile
- ✅ JWT token with 7-day expiration (configurable)
- ✅ Failed login attempts logged for security

---

### 3. Check Email Availability

**POST** `/api/v1/auth/check-email`

Check if an email address is available for registration.

#### Request

**Content-Type**: `application/json`

**Body**:
```json
{
  "user_email": "john.doe@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_email | string | ✅ Yes | Email address to check |

#### Response

**Email Available (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Email is available",
  "data": {
    "available": true,
    "email": "john.doe@example.com"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Email Taken (409 Conflict)**:
```json
{
  "status": false,
  "statusCode": 409,
  "message": "Email is already registered",
  "data": {
    "available": false,
    "email": "john.doe@example.com"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"user_email": "john.doe@example.com"}'
```

**JavaScript Example (Real-time Validation)**:
```javascript
let emailCheckTimeout;

emailInput.addEventListener('input', (e) => {
  clearTimeout(emailCheckTimeout);
  
  emailCheckTimeout = setTimeout(async () => {
    const email = e.target.value;
    
    if (email && isValidEmail(email)) {
      const response = await fetch('http://localhost:4000/api/v1/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email })
      });
      
      const data = await response.json();
      
      if (data.statusCode === 409) {
        showError('This email is already registered');
      } else {
        showSuccess('✓ Email is available');
      }
    }
  }, 500); // Debounce: Wait 500ms after user stops typing
});
```

**Use Cases**:
- ✅ Real-time email validation in registration forms
- ✅ Prevent duplicate registrations
- ✅ Improve user experience with instant feedback
- ✅ Verify email before password reset

---

### 4. Request Password Reset

**POST** `/api/v1/auth/reset-password-email`

Send a password reset OTP to user's email.

#### Request

**Content-Type**: `application/json`

**Body**:
```json
{
  "user_email": "john.doe@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_email | string | ✅ Yes | Registered email address |

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Password reset email sent successfully",
  "data": {
    "email_sent": true,
    "email": "john.doe@example.com",
    "otp_expires_in": "15 minutes"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Email Not Found (404 Not Found)**:
```json
{
  "status": false,
  "statusCode": 404,
  "message": "No account found with this email address",
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/reset-password-email \
  -H "Content-Type: application/json" \
  -d '{"user_email": "john.doe@example.com"}'
```

**JavaScript Example**:
```javascript
const requestPasswordReset = async (email) => {
  try {
    const response = await fetch('http://localhost:4000/api/v1/auth/reset-password-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: email })
    });
    
    const data = await response.json();
    
    if (data.status) {
      alert('Password reset email sent! Check your inbox.');
      window.location.href = '/reset-password?email=' + encodeURIComponent(email);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
};
```

**Features**:
- ✅ Generates 6-digit numeric OTP
- ✅ OTP valid for 15 minutes
- ✅ Professional HTML email template
- ✅ Previous OTPs automatically invalidated
- ✅ Email includes clear instructions

**Email Content**:
```
Subject: Reset Your Playmate Password

Hi John,

We received a request to reset your password.

Your OTP: 123456

This OTP will expire in 15 minutes.

If you didn't request this, please ignore this email.

Best regards,
Playmate Team
```

---

### 5. Reset Password

**POST** `/api/v1/auth/reset-password`

Reset password using OTP received via email.

#### Request

**Content-Type**: `application/json`

**Body**:
```json
{
  "user_email": "john.doe@example.com",
  "otp": "123456",
  "new_password": "NewSecurePass123!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_email | string | ✅ Yes | Registered email address |
| otp | string | ✅ Yes | 6-digit OTP from email |
| new_password | string | ✅ Yes | New password (must meet requirements) |

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Password reset successful",
  "data": {
    "password_updated": true,
    "email": "john.doe@example.com"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Invalid OTP (400 Bad Request)**:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Invalid or expired OTP",
  "data": {
    "otp_valid": false
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Validation Failed (400 Bad Request)**:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "new_password",
      "message": "Password must be at least 8 characters long"
    },
    {
      "field": "new_password",
      "message": "Password must contain at least one uppercase letter"
    }
  ],
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "john.doe@example.com",
    "otp": "123456",
    "new_password": "NewSecurePass123!"
  }'
```

**JavaScript Example**:
```javascript
const resetPasswordForm = document.getElementById('resetPasswordForm');

resetPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    user_email: document.getElementById('email').value,
    otp: document.getElementById('otp').value,
    new_password: document.getElementById('newPassword').value
  };
  
  try {
    const response = await fetch('http://localhost:4000/api/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.status) {
      alert('Password reset successful! Redirecting to login...');
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
});
```

**Features**:
- ✅ OTP validation with expiration check
- ✅ Password strength validation
- ✅ OTP can only be used once
- ✅ Password immediately hashed with bcrypt
- ✅ Automatic OTP invalidation after use

**Password Reset Flow**:
```
1. User requests OTP → Email sent with 6-digit code
2. User receives email → Valid for 15 minutes
3. User submits OTP + new password → OTP validated
4. Password updated → OTP invalidated
5. User redirected to login
```

---

### 6. Change Password

**POST** `/api/v1/auth/change-password`

Change password for authenticated user (requires JWT token).

#### Request

**Content-Type**: `application/json`

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Body**:
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewSecurePass123!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| old_password | string | ✅ Yes | Current password for verification |
| new_password | string | ✅ Yes | New password (must meet requirements) |

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": {
    "password_updated": true,
    "user_id": 1
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Wrong Current Password (400 Bad Request)**:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Current password is incorrect",
  "data": {
    "password_valid": false
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error - Unauthorized (401 Unauthorized)**:
```json
{
  "status": false,
  "statusCode": 401,
  "message": "Invalid or expired token",
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "old_password": "OldPass123!",
    "new_password": "NewSecurePass123!"
  }'
```

**JavaScript Example**:
```javascript
const changePassword = async (oldPassword, newPassword) => {
  const token = sessionStorage.getItem('authToken');
  
  if (!token) {
    alert('Please login first');
    window.location.href = '/login';
    return;
  }
  
  try {
    const response = await fetch('http://localhost:4000/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      })
    });
    
    const data = await response.json();
    
    if (data.status) {
      alert('Password changed successfully!');
      // Optional: Force re-login for security
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    } else {
      if (data.statusCode === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        alert(data.message);
      }
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
};
```

**Features**:
- ✅ Requires authentication (JWT token)
- ✅ Validates current password before change
- ✅ Ensures new password meets requirements
- ✅ New password immediately hashed
- ✅ User session remains valid after change
- ✅ Recommended: Send email notification about password change

**Security Best Practices**:
- Require re-authentication for sensitive operations
- Don't allow new password to match old password
- Consider invalidating all sessions after password change
- Log password change events for security monitoring
- Send email notification to user

---

### 7. Health Check

**GET** `/api/v1/auth/health`

Check API and database health status with system metrics.

#### Request

**No body or authentication required**

#### Response

**Healthy (200 OK)**:
```json
{
  "status": "healthy",
  "statusCode": 200,
  "message": "Auth service is running",
  "data": {
    "service": "playmate-auth",
    "version": "1.0.0",
    "uptime": "2 hours 34 minutes 12 seconds",
    "timestamp": "2025-01-04T10:30:00.000Z",
    "database": {
      "status": "connected",
      "responseTime": "12ms",
      "connections": {
        "active": 3,
        "idle": 7,
        "total": 10
      }
    },
    "memory": {
      "used": "45.2 MB",
      "total": "512 MB",
      "percentage": "8.8%",
      "heapUsed": "32.1 MB",
      "heapTotal": "64 MB"
    },
    "cpu": {
      "usage": "15.3%",
      "cores": 4
    },
    "environment": "development"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Unhealthy (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "statusCode": 503,
  "message": "Service unavailable - Database connection failed",
  "data": {
    "service": "playmate-auth",
    "version": "1.0.0",
    "database": {
      "status": "disconnected",
      "error": "Connection timeout after 30 seconds",
      "lastAttempt": "2025-01-04T10:29:30.000Z"
    }
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Example Request

```bash
curl -X GET http://localhost:4000/api/v1/auth/health
```

**JavaScript Example (Monitoring)**:
```javascript
const checkHealth = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/v1/auth/health');
    const data = await response.json();
    
    if (data.status === 'healthy') {
      console.log('✅ Service is healthy');
      console.log(`Database: ${data.data.database.status}`);
      console.log(`Uptime: ${data.data.uptime}`);
      console.log(`Memory: ${data.data.memory.percentage}`);
    } else {
      console.error('❌ Service is unhealthy');
      console.error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('❌ Service is unreachable');
  }
};

// Check health every 30 seconds
setInterval(checkHealth, 30000);
```

**Use Cases**:
- ✅ Load balancer health checks
- ✅ Monitoring and alerting systems
- ✅ DevOps deployment verification
- ✅ Quick service status check during development
- ✅ API uptime monitoring

**Metrics Provided**:
- Service name and version
- Uptime duration
- Database connectivity and response time
- Connection pool status
- Memory usage (used, total, percentage)
- CPU usage and core count
- Environment (development/production)

---

## 🔐 Password Requirements

All password fields must meet these security requirements:

### Requirements

| Requirement | Rule | Example |
|-------------|------|---------|
| **Length** | 8-60 characters | `MyPass123!` ✅ |
| **Uppercase** | At least 1 (A-Z) | `mypass123!` ❌ → `Mypass123!` ✅ |
| **Lowercase** | At least 1 (a-z) | `MYPASS123!` ❌ → `MyPass123!` ✅ |
| **Digit** | At least 1 (0-9) | `MyPassword!` ❌ → `MyPass123!` ✅ |
| **Special** | At least 1 special char | `MyPass123` ❌ → `MyPass123!` ✅ |

### Allowed Special Characters

```
! @ # $ % ^ & * ( ) _ + - = [ ] { } | ; : , . < > ?
```

### Valid Examples ✅

```
SecurePass123!
MyP@ssw0rd
C0mpl3x#Pass
Str0ng!P@ssw0rd
Test123!@#
Player$2025
G00d_P@ss
MySecure#123
```

### Invalid Examples ❌

```
short1!           → Too short (minimum 8 characters)
nouppercase123!   → No uppercase letter
NOLOWERCASE123!   → No lowercase letter
NoNumbers!        → No digit
NoSpecial123      → No special character
weak              → Multiple requirements missing
```

### Password Strength Indicator (JavaScript)

```javascript
const getPasswordStrength = (password) => {
  let strength = 0;
  
  // Basic requirements
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  if (password.length >= 16) strength++;
  
  // Return strength level
  if (strength <= 2) return { level: 'Weak', color: 'red', score: strength };
  if (strength <= 4) return { level: 'Medium', color: 'orange', score: strength };
  if (strength <= 5) return { level: 'Strong', color: 'green', score: strength };
  return { level: 'Very Strong', color: 'darkgreen', score: strength };
};

// Usage
const result = getPasswordStrength('MyPass123!');
console.log(result); // { level: 'Strong', color: 'green', score: 6 }
```

---

### Standard Response Format

**Success Response**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Optional
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

**Error Response**:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Specific error message"
    }
  ],
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

### HTTP Status Codes Used

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful request |
| 201 | Created | Resource created (registration) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not Found | Resource not found (email) |
| 409 | Conflict | Duplicate resource (email exists) |
| 500 | Internal Server Error | Server/database error |
| 503 | Service Unavailable | Service/database down |

## 🗄️ Database Schema

For complete database documentation, see [docs/DATABASE.md](docs/DATABASE.md)

### Tables Overview

**users**: Core user information
- Primary Key: `user_id`
- Unique: `user_email`
- Indexes: `idx_user_email`

**sports**: Available sports catalog
- Primary Key: `sport_id`
- Unique: `sport_name`
- Indexes: `idx_sport_name`

**user_sports**: User-sport associations with skill levels
- Primary Key: `user_sport_id`
- Foreign Keys: `user_id`, `sport_id`
- Unique: `(user_id, sport_id)`
- Indexes: `idx_user_id`, `idx_sport_id`

### Relationships
```
users (1) ----< (N) user_sports (N) >---- (1) sports
```

## 🏗️ Architecture

### Project Structure

```
playmate/
├── app.js                    # Application entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (gitignored)
├── .gitignore               # Git ignore rules
├── config/
│   └── db.js                # Database connection pool
├── controllers/
│   └── authController.js    # Authentication business logic
├── middleware/
│   ├── authUser.js          # JWT verification middleware
│   ├── multer.js            # File upload configuration
│   └── validation.js        # Request validation rules
├── models/
│   ├── User.js              # User data access layer
│   ├── Sport.js             # Sport data access layer
│   └── UserSport.js         # UserSport data access layer
├── routes/
│   └── authRouter.js        # Authentication routes
├── utils/
│   ├── AuthHelpers.js       # Authentication helper functions
│   ├── Cloudinary.js        # Cloudinary upload utility
│   ├── Mail.js              # Email sending utility
│   ├── emailTemplates.js    # HTML email templates
│   └── Response.js          # Standardized response builder
└── docs/
    ├── API.md               # Detailed API documentation
    ├── DATABASE.md          # Database schema and design
    ├── DEPLOYMENT.md        # Deployment guide
    └── CONTRIBUTING.md      # Contribution guidelines
```

### Design Patterns

**MVC Pattern**: Model-View-Controller separation
- **Models**: Database interaction layer
- **Controllers**: Business logic
- **Routes**: API endpoints (View equivalent)

**Middleware Chain**: Request processing pipeline
```
Request → Multer → Validation → Auth → Controller → Response
```

**Repository Pattern**: Models abstract database operations

**Factory Pattern**: Response utility creates consistent responses

## 🔒 Security

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Password strength requirements enforced
   - No plain text password storage

2. **JWT Security**
   - Tokens signed with secret key
   - Configurable expiration
   - Secure token storage recommended (httpOnly cookies)

3. **Input Validation**
   - express-validator for all inputs
   - SQL injection prevention via parameterized queries
   - XSS prevention through input sanitization

4. **Email Security**
   - OTP-based password reset
   - Time-limited OTPs (typically 10-15 minutes)
   - Rate limiting on email endpoints (recommended)

5. **File Upload Security**
   - File type restrictions
   - File size limits
   - Cloudinary automatic malware scanning

6. **Database Security**
   - Connection pooling
   - Environment-based credentials
   - Prepared statements for queries

### Security Best Practices

```javascript
// Recommended additions:
// 1. Helmet for HTTP headers
const helmet = require('helmet');
app.use(helmet());

// 2. Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// 3. CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

// 4. Request logging
const morgan = require('morgan');
app.use(morgan('combined'));
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Authentication"

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure

```
tests/
├── unit/
│   ├── models/
│   ├── utils/
│   └── middleware/
├── integration/
│   └── routes/
└── e2e/
    └── auth.test.js
```

### Manual Testing

Use the provided Postman collection or cURL commands from API documentation.

## 🚀 Deployment

For detailed deployment guide, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Quick Deploy Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up process manager (PM2)
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Enable automated backups
- [ ] Configure CDN for static assets

## 🗺️ Roadmap

### Version 1.1.0 (Q1 2025)
- [ ] Sport management endpoints
- [ ] User sports endpoints
- [ ] Enhanced user profile management
- [ ] Profile image update endpoint

### Version 1.2.0 (Q2 2025)
- [ ] User matching algorithm
- [ ] Advanced search filters
- [ ] Real-time notifications
- [ ] WebSocket support

### Version 2.0.0 (Q3 2025)
- [ ] Event management system
- [ ] Messaging system
- [ ] Location-based services
- [ ] Mobile app support

## 📦 Models & Future Endpoints

### Current Models

**User Model** (`models/User.js`):
- findByEmail(email)
- findById(id)
- create(userData)
- update(userId, userData)
- validatePassword(inputPassword, hashedPassword)

**Sport Model** (`models/Sport.js`):
- findAll()
- findById(id)
- findByName(name)
- create(sportData)

**UserSport Model** (`models/UserSport.js`):
- create(userSportData)
- findByUserId(userId)
- findBySportId(sportId)
- update(userSportId, data)
- delete(userSportId)

### Planned Endpoints

**Sports Management** (Admin):
```
GET    /api/v1/sports              # List all sports
GET    /api/v1/sports/:id          # Get sport details
POST   /api/v1/sports              # Create new sport
PUT    /api/v1/sports/:id          # Update sport
DELETE /api/v1/sports/:id          # Delete sport
GET    /api/v1/sports/:id/stats    # Sport statistics
```

**User Sports**:
```
POST   /api/v1/users/sports                  # Add sport to profile
GET    /api/v1/users/sports                  # Get user's sports
PUT    /api/v1/users/sports/:userSportId     # Update skill level
DELETE /api/v1/users/sports/:userSportId     # Remove sport
GET    /api/v1/sports/:sportId/users         # Users by sport
```

**User Profile**:
```
GET    /api/v1/users/profile                 # Current user profile
PUT    /api/v1/users/profile                 # Update profile
POST   /api/v1/users/profile/image           # Update profile image
DELETE /api/v1/users/profile/image           # Remove profile image
GET    /api/v1/users/:userId                 # Public profile view
```

## 🤝 Contributing

We welcome contributions! Please see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style

- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

**Mitan Tank**
- 📧 Email: mitantank00@gmail.com
- 💼 LinkedIn: [mitan-tank-986076247](https://www.linkedin.com/in/mitan-tank-986076247)
- 📸 Instagram: [@__.mituu._](https://www.instagram.com/__.mituu._)

## 🙏 Acknowledgments

- Express.js community for excellent documentation
- Cloudinary for image management
- All contributors and testers

---

**Made with ❤️ by Mitan Tank**

*Last Updated: December 2024*