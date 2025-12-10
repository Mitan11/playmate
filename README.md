# 🏃‍♂️ Playmate - Sports Social Platform API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-3448C5?logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-22D3EE?logo=nodemailer&logoColor=white)

A sports social platform API built with Node.js, Express.js, and MySQL. It features authentication with image uploads, email notifications, and standardized responses. Models for Sports and UserSports are included to support upcoming features like sport management and skill tracking.

## 📋 Table of Contents

- Features
- Quick Start
- API Documentation
- Database Schema
- Models & Future Endpoints
- Environment Setup
- Contact

## ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📷 Cloudinary Image Uploads
- 📧 Nodemailer Emails (Welcome + Password Reset)
- ✅ Input Validation with express-validator
- 🗄️ MySQL with connection pooling
- 📊 Health Check endpoint
- 📱 Standardized API responses

## 🚀 Quick Start

Prerequisites:
- Node.js 16+
- MySQL 8.0+
- npm/yarn

Installation:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or production
npm start
```

Base URL: `http://localhost:4000`

Auth API Prefix: `/api/v1/auth`

## 📖 API Documentation

### Endpoints (Implemented)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/register` | POST | Register new user (multipart/form-data) | ❌ |
| `/login` | POST | Login and receive JWT | ❌ |
| `/check-email` | POST | Check email availability | ❌ |
| `/reset-password-email` | POST | Send password reset OTP email | ❌ |
| `/reset-password` | POST | Reset password with new password | ❌ |
| `/change-password` | POST | Change password | ✅ |
| `/health` | GET | Auth service health check | ❌ |

Note: `/verify-otp` is not implemented currently and has been removed from docs.

### Standard Response Format

Success:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "token": "jwt_token",
  "timestamp": "2025-12-04T10:30:00.000Z"
}
```

Error:
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [],
  "timestamp": "2025-12-04T10:30:00.000Z"
}
```

### User Registration

POST `/api/v1/auth/register` (multipart/form-data)

Fields:
- user_email
- user_password
- first_name
- last_name (optional)
- profile_image (optional file)

Cloudinary upload is used if an image is provided; otherwise, a default avatar is assigned.

### User Login

POST `/api/v1/auth/login`

Body:
```json
{
  "user_email": "john.doe@example.com",
  "user_password": "SecurePass123!"
}
```

Returns user info and JWT token.

### Password Reset

- Send OTP Email: `POST /api/v1/auth/reset-password-email`
- Reset Password: `POST /api/v1/auth/reset-password`
- Change Password (JWT required): `POST /api/v1/auth/change-password`

Password rules:
- 8–60 characters
- At least one lowercase, uppercase, number, and special character

### Health Check

GET `/api/v1/auth/health` returns DB connectivity, system metrics, and uptime.

## 🗄️ Database Schema

Users:
```sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(100) NOT NULL UNIQUE,
  user_password VARCHAR(61) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NULL,
  profile_image VARCHAR(165) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_email (user_email)
);
```

Sports:
```sql
CREATE TABLE sports (
  sport_id INT AUTO_INCREMENT PRIMARY KEY,
  sport_name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sport_name (sport_name)
);
```

User Sports:
```sql
CREATE TABLE user_sports (
  user_sport_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sport_id INT NOT NULL,
  skill_level ENUM('Beginner','Intermediate','Pro') NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_sport (user_id, sport_id),
  INDEX idx_user_id (user_id),
  INDEX idx_sport_id (sport_id)
);
```

Default sports inserted on first run:
- Cricket
- Pickleball

## 📦 Models & Future Endpoints

Current models:
- Users: see [`models/User.js`](models/User.js)
- Sports: see [`models/Sport.js`](models/Sport.js)
- UserSports: see [`models/UserSport.js`](models/UserSport.js)

Planned endpoints to leverage existing models:

Sports Management:
- GET `/api/v1/sports` → list all sports
- GET `/api/v1/sports/:id` → get sport by ID
- POST `/api/v1/sports` → add sport (admin)
- GET `/api/v1/sports/:id/stats` → aggregated user skill stats

User Sports:
- POST `/api/v1/users/sports` → add sport to user
- GET `/api/v1/users/sports` → list user’s sports
- PUT `/api/v1/users/sports/:userSportId` → update skill level
- DELETE `/api/v1/users/sports/:userSportId` → remove sport
- GET `/api/v1/sports/:sportId/users` → users by sport (+ optional skill filter)

User Profile:
- GET `/api/v1/users/profile` → current user
- PUT `/api/v1/users/profile` → update profile
- POST `/api/v1/users/profile/image` → upload/update image
- GET `/api/v1/users/:userId` → public profile

## ⚙️ Environment Setup

`.env`:
```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=playmate
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
EMAIL=abc@gmail.com
EMAIL_PASSWORD=app_specific_password
EMAIL_SERVICE=Gmail
```

## 📁 Project Structure

```
playmate/
├── app.js
├── package.json
├── .env
├── .gitignore
├── config/
│   └── db.js
├── controllers/
│   └── authController.js
├── middleware/
│   ├── authUser.js
│   ├── multer.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Sport.js
│   └── UserSport.js
├── routes/
│   └── authRouter.js
└── utils/
    ├── AuthHelpers.js
    ├── Cloudinary.js
    ├── Mail.js
    ├── emailTemplates.js
    └── Response.js
```

## 📞 Contact

- Email: mitantank00@gmail.com
- LinkedIn: https://www.linkedin.com/in/mitan-tank-986076247
- Instagram: https://www.instagram.com/__.mituu._