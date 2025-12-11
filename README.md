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
| `/sports/health` | GET | Sports service health | ❌ |
| `/sports/addNewSport` | POST | Create sport | ✅ (admin) |
| `/sports/getAllSports` | GET | List sports | ❌ |
| `/sports/updateSport/:sportId` | PUT | Update sport | ✅ (admin) |
| `/sports/deleteSport/:sportId` | DELETE | Delete sport | ✅ (admin) |
| `/users/updateDetails` | PUT | Update user details (with image) | ✅ |
| `/users/userSport` | POST | Add sport to user | ✅ |
| `/users/deleteUserSport/:user_id/:sport_id` | DELETE | Remove sport from user | ✅ |
| `/users/profile/:userId` | GET | Get user profile | ✅ |

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Endpoint Documentation

<!-- Already documented above: Change Password (Section 6) and Health Check (Section 7) -->
<!-- Reference:
6. Change Password  → POST /api/v1/auth/change-password
7. Health Check     → GET  /api/v1/auth/health
-->

### 8. List Sports

**GET** `/api/v1/sports`

Retrieve all available sports.

#### Request

No body or authentication required.

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Sports fetched successfully",
  "data": [
    { "sport_id": 1, "sport_name": "Football", "description": "Team field sport", "created_at": "2025-01-04T10:00:00.000Z", "updated_at": "2025-01-04T10:00:00.000Z" },
    { "sport_id": 2, "sport_name": "Basketball", "description": "Indoor team sport", "created_at": "2025-01-04T10:00:00.000Z", "updated_at": "2025-01-04T10:00:00.000Z" }
  ],
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 500 Internal Server Error:
```json
{ "status": false, "statusCode": 500, "message": "Server error while fetching sports", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X GET http://localhost:4000/api/v1/sports
```

#### Special Notes

- Consider pagination for large catalogs via query params (page, limit).
- Responses are indexed-friendly; ensure DB index on sport_name.

---

### 9. Create Sport

**POST** `/api/v1/sports`

Create a new sport entry.

#### Request

**Headers**:
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Body**:
```json
{
  "sport_name": "Badminton",
  "description": "Racquet sport played by two or four players"
}
```

**Validation Rules**:
- sport_name: required, string, 2-100 chars, unique (case-insensitive)
- description: optional, max 255 chars

**Role Requirements**:
- Admin only

#### Response

**Success (201 Created)**:
```json
{
  "status": true,
  "statusCode": 201,
  "message": "Sport created successfully",
  "data": {
    "sport_id": 12,
    "sport_name": "Badminton",
    "description": "Racquet sport played by two or four players",
    "created_at": "2025-01-04T10:30:00.000Z"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 400 Validation Failed:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "sport_name", "message": "Sport name is required" }],
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```
- 401 Unauthorized / 403 Forbidden:
```json
{ "status": false, "statusCode": 403, "message": "Admin access required", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 409 Conflict (duplicate):
```json
{ "status": false, "statusCode": 409, "message": "Sport with this name already exists", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X POST http://localhost:4000/api/v1/sports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -d '{
    "sport_name": "Badminton",
    "description": "Racquet sport played by two or four players"
  }'
```

#### Special Notes

- Unique constraint enforced on sport_name.
- All writes audited via timestamps.

---

### 10. Update Sport

**PUT** `/api/v1/sports/:id`

Update sport details by ID.

#### Request

**Headers**:
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Params**:
- id: number (sport ID)

**Body**:
```json
{
  "sport_name": "Badminton",
  "description": "Updated description"
}
```

**Validation Rules**:
- sport_name: optional, if present 2-100 chars, unique if changed
- description: optional, max 255 chars

**Role Requirements**:
- Admin only

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Sport updated successfully",
  "data": { "sport_id": 12, "updated_fields": ["description"] },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 400 Validation Failed:
```json
{ "status": false, "statusCode": 400, "message": "Validation failed", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 401/403 Unauthorized/Forbidden:
```json
{ "status": false, "statusCode": 403, "message": "Admin access required", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 404 Not Found:
```json
{ "status": false, "statusCode": 404, "message": "Sport not found", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 409 Conflict (duplicate name):
```json
{ "status": false, "statusCode": 409, "message": "Sport name already in use", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X PUT http://localhost:4000/api/v1/sports/12 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -d '{
    "description": "Updated description"
  }'
```

#### Special Notes

- Partial updates supported; only provided fields are updated.
- Name change triggers uniqueness check.

---

### 11. Delete Sport

**DELETE** `/api/v1/sports/:id`

Delete a sport by ID.

#### Request

**Headers**:
```
Authorization: Bearer <admin_jwt_token>
```

**URL Params**:
- id: number (sport ID)

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Sport deleted successfully",
  "data": { "sport_id": 12, "deleted": true },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 401/403 Unauthorized/Forbidden:
```json
{ "status": false, "statusCode": 403, "message": "Admin access required", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 404 Not Found:
```json
{ "status": false, "statusCode": 404, "message": "Sport not found", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 409 Conflict (referential integrity):
```json
{ "status": false, "statusCode": 409, "message": "Cannot delete sport in use", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X DELETE http://localhost:4000/api/v1/sports/12 \
  -H "Authorization: Bearer <admin_jwt_token>"
```

#### Special Notes

- Deletions may be blocked if referenced by user_sports (FK constraint).
- Consider soft-deletion if needed.

---

### 12. Get User Profile

**GET** `/api/v1/users/profile/:userId`

Get a user's profile including their sports.

#### Request

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**URL Params**:
- userId: number

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "User profile fetched",
  "data": {
    "user_id": 1,
    "user_email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_image": "https://res.cloudinary.com/demo/image/upload/v1/playmate/user_1.jpg",
    "sports": [
      { "sport_id": 2, "sport_name": "Basketball", "skill_level": "intermediate" }
    ],
    "created_at": "2025-01-04T10:00:00.000Z",
    "updated_at": "2025-01-04T10:20:00.000Z"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 401 Unauthorized:
```json
{ "status": false, "statusCode": 401, "message": "Invalid or expired token", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 404 Not Found:
```json
{ "status": false, "statusCode": 404, "message": "User not found", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X GET http://localhost:4000/api/v1/users/profile/1 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Special Notes

- Only authenticated users can access; consider restricting to self or admin.
- Ensure minimal PII leakage.

---

### 13. Update User Details

**PUT** `/api/v1/users/updateDetails`

Update user details with optional profile image upload.

#### Request

**Headers**:
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data)**:
- first_name: string (optional, max 50)
- last_name: string (optional, max 50)
- profile_image: file (optional; JPG/JPEG/PNG; ≤5MB)

**Validation Rules**:
- Names trimmed; only letters, spaces, hyphens, apostrophes
- profile_image: types: image/jpeg, image/png, image/jpg; size ≤ MAX_FILE_SIZE

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "User details updated",
  "data": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "profile_image": "https://res.cloudinary.com/demo/image/upload/v1/playmate/user_1.jpg",
    "updated_at": "2025-01-04T10:30:00.000Z"
  },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 400 Validation Failed:
```json
{ "status": false, "statusCode": 400, "message": "Validation failed", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 401 Unauthorized:
```json
{ "status": false, "statusCode": 401, "message": "Invalid or expired token", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X PUT http://localhost:4000/api/v1/users/updateDetails \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "first_name=John" \
  -F "last_name=Doe" \
  -F "profile_image=@/path/to/image.jpg"
```

#### Special Notes

- Images uploaded to Cloudinary; previous image may be replaced.
- Server enforces file-type and size checks via Multer + Cloudinary.

---

### 14. Add User Sport

**POST** `/api/v1/users/userSport`

Add a sport to the authenticated user with optional skill level.

#### Request

**Headers**:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body**:
```json
{
  "sport_id": 2,
  "skill_level": "beginner"
}
```

**Validation Rules**:
- sport_id: required, numeric, must exist
- skill_level: optional; one of ["beginner","intermediate","advanced","pro"]

#### Response

**Success (201 Created)**:
```json
{
  "status": true,
  "statusCode": 201,
  "message": "User sport added",
  "data": { "user_id": 1, "sport_id": 2, "skill_level": "beginner" },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 400 Validation Failed:
```json
{ "status": false, "statusCode": 400, "message": "Validation failed", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 401 Unauthorized:
```json
{ "status": false, "statusCode": 401, "message": "Invalid or expired token", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 404 Not Found (sport missing):
```json
{ "status": false, "statusCode": 404, "message": "Sport not found", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 409 Conflict (duplicate mapping):
```json
{ "status": false, "statusCode": 409, "message": "Sport already added for this user", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X POST http://localhost:4000/api/v1/users/userSport \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{ "sport_id": 2, "skill_level": "beginner" }'
```

#### Special Notes

- Uniqueness enforced on (user_id, sport_id).
- Skill level may be normalized to lowercase.

---

### 15. Delete User Sport

**DELETE** `/api/v1/users/deleteUserSport/:user_id/:sport_id`

Remove a sport from a user.

#### Request

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**URL Params**:
- user_id: number
- sport_id: number

**Validation Rules**:
- Call must be by the same user (user_id == JWT.sub) or admin.

#### Response

**Success (200 OK)**:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "User sport removed",
  "data": { "user_id": 1, "sport_id": 2 },
  "timestamp": "2025-01-04T10:30:00.000Z"
}
```

#### Error Responses

- 401 Unauthorized / 403 Forbidden:
```json
{ "status": false, "statusCode": 403, "message": "Not allowed to modify this resource", "timestamp": "2025-01-04T10:30:00.000Z" }
```
- 404 Not Found:
```json
{ "status": false, "statusCode": 404, "message": "User sport not found", "timestamp": "2025-01-04T10:30:00.000Z" }
```

#### cURL Example

```bash
curl -X DELETE http://localhost:4000/api/v1/users/deleteUserSport/1/2 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Special Notes

- Deletion is idempotent; deleting a non-existent mapping returns 404.
- Audit logs recommended for user activity.

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