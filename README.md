# 🏃‍♂️ Playmate - Sports Social Platform API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-3448C5?logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-22D3EE?logo=nodemailer&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?logo=swagger&logoColor=black)

A comprehensive sports social platform API built with Node.js, Express.js, and MySQL. Playmate enables users to connect through sports, manage their athletic profiles, book venues, and engage with a community of sports enthusiasts. The platform features secure authentication, venue management, image uploads, email notifications, and a robust foundation for sport management and skill tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Codebase Structure](#codebase-structure)
  - [Routes](#routes)
  - [Controllers](#controllers)
  - [Models](#models)
  - [Middleware](#middleware)
  - [Utilities](#utilities)
- [Quick Start](#quick-start)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
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
- 🔐 **JWT Authentication**: Secure token-based authentication with configurable expiration (7 days default)
- 👤 **User Management**: 
  - Complete registration with email validation
  - Login with bcrypt password hashing
  - Profile management with image uploads
  - Password reset via OTP email
  - Password change for logged-in users
  - Phone number support in user profiles
- 🏢 **Venue Management**:
  - Venue registration and authentication
  - Venue owner profiles
  - Venue-sport associations
  - Slot-based pricing and availability
- 🖼️ **Venue Gallery**:
  - Upload and manage venue images (up to 3 per venue)
  - Cloudinary-hosted image URLs
- 📷 **Image Upload**: 
  - Cloudinary integration for optimized profile images
  - Automatic image resizing and optimization
  - Default fallback images
  - 5MB file size limit (configurable)
- 📧 **Email Notifications**: 
  - Welcome emails for new users and venues
  - Password reset with 4-digit OTP verification
  - Booking receipt email after successful payment
  - Professional HTML email templates
  - Gmail SMTP integration
- ✅ **Input Validation**: 
  - Comprehensive validation using express-validator
  - Email format validation
  - Password strength requirements
  - Name format validation
- 🗄️ **Database**: 
  - MySQL 8.0+ with connection pooling (10 connections)
  - Automatic table creation on startup
  - Transaction support for data integrity
  - Indexed queries for optimal performance
- 📊 **Health Monitoring**: 
  - Real-time health check endpoints
  - Database connectivity status
  - System metrics (memory, CPU, uptime)
  - Response time tracking
- 📱 **Standardized Responses**: Consistent API response format across all endpoints
- 🔒 **Password Security**: 
  - Bcrypt hashing with 10 salt rounds
  - Password strength validation
  - OTP-based password reset
- 🚀 **Performance**: 
  - Database connection pooling
  - Indexed database queries for fast lookups
  - Optimized image delivery via CDN
- 🏅 **Sport Management**: 
  - Complete CRUD operations for sports
  - User-sport associations with skill levels
  - Venue-sport associations (pricing via slots)
  - Sport statistics and analytics
- 🗓️ **Slot Management**:
  - Slot CRUD for venues
  - Availability by venue, date, and sport
- 🧾 **Bookings & Payments**:
  - Venue slot booking with conflict checks
  - Razorpay order creation and signature verification
  - Payment status updates and receipts
- 🕹️ **Games & Players**:
  - Auto game creation during booking
  - Join/leave games and request approvals
  - Player lists and requested players
- 📝 **Social Posts**:
  - Create posts with text or media
  - Likes and like counts
  - Recent activity feed with pagination
- 📊 **Analytics & Dashboards**:
  - Admin dashboard stats and advanced analytics
  - Venue dashboard stats and revenue/booking trends
- 📖 **API Documentation**: 
  - Swagger UI integration at `/api-docs`
  - Auto-generated API documentation
  - Interactive API testing

### Upcoming Features
- 👥 **User Matching**: Find players based on sports, location, and skill levels
- 🗓️ **Event Management**: Create and join sports events
- 💬 **Messaging**: Real-time chat between users
- 📍 **Location Services**: 
  - Find nearby players and venues
  - Geospatial search
  - Distance-based filtering
- 🏆 **Achievements**: 
  - Gamification with badges and milestones
  - User rankings and leaderboards
- 📸 **Media Gallery**: Photo and video uploads for events
- ⭐ **Ratings & Reviews**: User and venue rating system

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
- **Payments**: Razorpay
- **Environment**: dotenv
- **Development**: nodemon

### Utilities
- **Date/Time**: day.js
- **Crypto**: Built-in crypto module for OTP generation

## 🏗️ Project Architecture

Playmate follows a **Model-View-Controller (MVC)** architecture pattern with a clear separation of concerns:

```
playmate/
├── app.js                 # Application entry point
├── config/               # Configuration files
│   └── db.js            # MySQL database connection pool
├── routes/              # API route definitions
│   ├── adminRouter.js   # Admin routes
│   ├── authRouter.js    # Authentication routes
│   ├── sportRouter.js   # Sports management routes
│   ├── userRouter.js    # User profile routes
│   └── venueRouter.js   # Venue management routes
├── controllers/         # Business logic handlers
│   ├── adminControllers.js # Admin analytics and management
│   ├── authController.js    # Authentication logic
│   ├── bookingController.js # Bookings and payments
│   ├── slotController.js    # Slot management
│   ├── sportController.js   # Sports management logic
│   ├── userController.js    # User management logic
│   └── venueController.js   # Venue management logic
├── models/              # Database models (ORM layer)
│   ├── Booking.js       # Booking data model
│   ├── Games.js         # Games data model
│   ├── Post.js          # Social posts data model
│   ├── Slot.js          # Slot data model
│   ├── User.js          # User data model
│   ├── Sport.js         # Sport data model
│   ├── UserSport.js     # User-Sport relationship model
│   ├── Venue.js         # Venue data model
│   ├── VenueImages.js   # Venue images data model
│   ├── VenueSport.js    # Venue-Sport relationship model
│   └── game_player.js   # Game players data model
├── middleware/          # Express middleware
│   ├── authUser.js      # JWT authentication middleware
│   ├── validation.js    # Input validation rules
│   └── multer.js        # File upload configuration
└── utils/               # Helper utilities
    ├── AuthHelpers.js   # JWT and password hashing helpers
    ├── Cloudinary.js    # Image upload service
    ├── Mail.js          # Email service
    ├── Response.js      # Standardized API responses
    └── emailTemplates.js # HTML email templates
```

### Architecture Highlights

- **Layered Architecture**: Clear separation between routes, controllers, models, and utilities
- **Database Connection Pooling**: MySQL2 connection pool for optimal database performance
- **Transaction Management**: Database transactions for data consistency
- **Middleware Pipeline**: Authentication, validation, and file upload handling
- **Standardized Responses**: Consistent API response format across all endpoints
- **Error Handling**: Centralized error handling with proper status codes
- **Auto-Initialization**: Database tables created automatically on startup

## 📁 Codebase Structure

### Routes

The application exposes five main route groups:

#### 1. **Authentication Routes** (`/api/v1/auth`)
**File**: `routes/authRouter.js`

| Endpoint | Method | Description | Validation | Auth Required |
|----------|--------|-------------|------------|---------------|
| `/register` | POST | User registration with profile image | `validateUserRegistration` | ❌ |
| `/login` | POST | User login | `validateUserLogin` | ❌ |
| `/health` | GET | Health check endpoint | - | ❌ |
| `/check-email` | POST | Check email availability | - | ❌ |
| `/reset-password-email` | POST | Send password reset OTP | `validateResetPasswordEmail` | ❌ |
| `/reset-password` | POST | Reset password with OTP | `validateResetPassword` | ❌ |
| `/change-password` | POST | Change user password | `validateChangePassword` | ✅ |

**Features**:
- JWT token generation and verification
- Password hashing with bcrypt
- Email verification for password reset
- Profile image upload support (via Multer)
- Welcome email on registration
- Comprehensive validation

---

#### 2. **Sports Routes** (`/api/v1/sports`)
**File**: `routes/sportRouter.js`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/health` | GET | Sports service health check | ❌ |
| `/addNewSport` | POST | Create new sport | ❌ |
| `/getAllSports` | GET | Retrieve all sports | ❌ |
| `/updateSport/:sportId` | PUT | Update sport details | ❌ |
| `/deleteSport/:sportId` | DELETE | Delete a sport | ❌ |
| `/addUserSport` | POST | Add sport to user with skill level | ✅ |
| `/getUserSports/:userId` | GET | Get sports associated with a user | ✅ |
| `/deleteUserSport/:userSportId` | DELETE | Remove a user sport by ID | ✅ |

**Features**:
- CRUD operations for sports management
- Duplicate sport name prevention
- Automatic table creation
- Health monitoring with system metrics

---

#### 3. **User Routes** (`/api/v1/user`)
**File**: `routes/userRouter.js`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/updateDetails` | PUT | Update user profile with image | ✅ |
| `/userSport` | POST | Add sport to user profile | ✅ |
| `/deleteUserSport/:user_id/:sport_id` | DELETE | Remove sport from user | ✅ |
| `/profile/:userId` | GET | Get user profile with sports | ✅ |
| `/userPosts/:userId` | GET | Get user posts | ✅ |
| `/createPost/:userId` | POST | Create a post (text or media) | ✅ |
| `/deletePost/:postId/:userId` | DELETE | Delete a post by ID | ✅ |
| `/toggle/:postId/:userId` | POST | Like/unlike a post | ✅ |
| `/getPostLikes/:postId` | GET | Get post likes and likers | ✅ |
| `/recentActivities/:userId` | GET | Recent feed with pagination | ✅ |
| `/venueBooking` | POST | Book a venue slot | ✅ |
| `/payments/order` | POST | Create Razorpay order | ✅ |
| `/payments/complete/:gameId` | POST | Complete payment for booking | ✅ |
| `/allGames` | GET | Get available games | ✅ |
| `/joinedGames` | GET | Get games joined by user | ✅ |
| `/usersCreatedGames` | GET | Get games created by user | ✅ |
| `/joinGame/:userId/:gameId` | POST | Join a game | ✅ |
| `/leaveGame/:userId/:gameId` | DELETE | Leave a game | ✅ |
| `/getPlayersByGameId/:gameId` | GET | Get approved players for a game | ✅ |
| `/requestedUserList/:gameId` | GET | Get pending player requests | ✅ |
| `/updateGamePlayerStatus` | PATCH | Approve/reject player requests | ✅ |

**Features**:
- Profile management with Cloudinary image upload
- User-sport relationship management
- Skill level tracking (Beginner, Intermediate, Pro)
- Complete user profile retrieval
- Post creation, likes, and recent activity feed
- Venue booking with Razorpay payments
- Game participation and player approval flow

---

#### 4. **Venue Routes** (`/api/v1/venue`)
**File**: `routes/venueRouter.js`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/register` | POST | Register new venue | ❌ |
| `/login` | POST | Venue owner login | ❌ |
| `/venueImage/upload/:venueId` | POST | Upload venue image | ✅ |
| `/venueImages/:venueId` | GET | Get venue images | ✅ |
| `/venueImage/:venueImageId` | DELETE | Delete venue image | ✅ |
| `/profile/:venueId` | GET | Get venue profile | ✅ |
| `/profile/:venueId` | PUT | Update venue profile | ✅ |
| `/dashboard/stats/:venueId` | GET | Venue dashboard stats | ✅ |
| `/analytics/daily-booking-trend/:venueId` | GET | Daily booking trend | ✅ |
| `/analytics/monthly-revenue-trend/:venueId` | GET | Monthly revenue trend | ✅ |
| `/analytics/revenue-by-sport/:venueId` | GET | Revenue by sport | ✅ |
| `/analytics/revenue-by-slot/:venueId` | GET | Revenue by slot | ✅ |
| `/analytics/most-booked-slots/:venueId` | GET | Most booked slots | ✅ |
| `/analytics/peak-booking-hours/:venueId` | GET | Peak booking hours | ✅ |
| `/analytics/slot-usage-frequency/:venueId` | GET | Slot usage frequency | ✅ |
| `/analytics/unused-slots/:venueId` | GET | Unused slots | ✅ |
| `/analytics/unique-customers/:venueId` | GET | Unique customers | ✅ |
| `/analytics/repeat-customers/:venueId` | GET | Repeat customers | ✅ |
| `/analytics/top-customers/:venueId` | GET | Top customers | ✅ |
| `/analytics/total-games-hosted/:venueId` | GET | Total games hosted | ✅ |
| `/analytics/games-by-sport/:venueId` | GET | Games by sport | ✅ |
| `/analytics/recent-bookings/:venueId` | GET | Recent bookings | ✅ |
| `/sports/:venueId` | GET | Get sports offered by venue | ✅ |
| `/sports` | POST | Add sport to venue | ✅ |
| `/allSports` | GET | List all sports (for venue) | ✅ |
| `/sports/:venueSportId` | DELETE | Delete venue sport | ✅ |
| `/sports/:venueSportId` | PUT | Update venue sport | ✅ |
| `/bookings/:venueId` | GET | Get venue bookings | ✅ |
| `/bookings/:bookingId` | DELETE | Delete a booking | ✅ |
| `/bookings/deactivate/:game_id` | PATCH | Deactivate a booking | ✅ |
| `/bookings/payment-status/:bookingId` | PATCH | Update booking payment status | ✅ |
| `/allVenueSlots/:venueId` | GET | Get all slots for venue | ✅ |
| `/slots/available/:venueId` | GET | Get available slots by date | ❌ |
| `/slots/:slotId` | DELETE | Delete a slot | ✅ |
| `/slots/:slotId` | PATCH | Update a slot | ✅ |
| `/slots` | POST | Create a new slot | ✅ |
| `/allVenues` | GET | Get all venues | ❌ |

**Features**:
- Venue registration with owner details
- JWT authentication for venue owners
- Email verification
- Profile image support
- Venue image gallery management
- Sports, slots, and booking management
- Venue analytics and dashboards

---

#### 5. **Admin Routes** (`/api/v1/admin`)
**File**: `routes/adminRouter.js`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/admin-login` | POST | Admin login | ❌ |
| `/getAllSports` | GET | Get all sports | ✅ |
| `/addSport` | POST | Add a new sport | ✅ |
| `/updateSport/:sport_id` | PATCH | Update sport by ID | ✅ |
| `/deleteSport/:sport_id` | DELETE | Delete sport by ID | ✅ |
| `/dashboard/stats` | GET | Dashboard statistics | ✅ |
| `/dashboard/sport/metrics` | GET | Sport metrics | ✅ |
| `/dashboard/booking/metrics` | GET | Booking metrics | ✅ |
| `/dashboard/recent/activities` | GET | Recent activities | ✅ |
| `/dashboard/booking/report` | GET | Booking report | ✅ |
| `/dashboard/revenue/report` | GET | Revenue report | ✅ |
| `/dashboard/user/report` | GET | User report | ✅ |
| `/getAllUsers` | GET | Get all users | ❌ |
| `/deleteUser/:user_id` | DELETE | Delete user | ✅ |
| `/analytics/user-growth` | GET | User growth analytics | ✅ |
| `/analytics/venue-growth` | GET | Venue growth analytics | ✅ |
| `/analytics/booking-trend` | GET | Booking trend analytics | ✅ |
| `/analytics/monthly-revenue` | GET | Monthly revenue analytics | ✅ |
| `/analytics/revenue-by-venue` | GET | Revenue by venue | ✅ |
| `/analytics/revenue-by-sport` | GET | Revenue by sport | ✅ |
| `/analytics/most-played-sports` | GET | Most played sports | ✅ |
| `/analytics/most-booked-venues` | GET | Most booked venues | ✅ |
| `/analytics/peak-booking-hours` | GET | Peak booking hours | ✅ |
| `/analytics/top-users-by-bookings` | GET | Top users by bookings | ✅ |
| `/analytics/most-liked-posts` | GET | Most liked posts | ✅ |
| `/analytics/top-content-creators` | GET | Top content creators | ✅ |
| `/getVenues` | GET | Get all venues | ❌ |
| `/deleteVenue/:venue_id` | DELETE | Delete venue | ✅ |
| `/getAllPosts` | GET | Get all posts | ✅ |
| `/deletePost/:post_id` | DELETE | Delete post | ✅ |

**Features**:
- Admin authentication with JWT
- Dashboard stats, reports, and advanced analytics
- User, venue, sport, and post management

**Default Admin Credentials** (update for production):
- Email: `admin@playmate.com`
- Password: `admin@123`

---

### Controllers

Controllers contain the business logic for handling API requests.

#### 1. **adminControllers.js**
**Purpose**: Admin authentication, management, and analytics

**Functions**:
- `adminLogin(req, res)` - Admin login
- `getDashboardStats(req, res)` - Admin dashboard KPIs
- `getSportMetrics(req, res)` - Sports analytics
- `getBookingMetrics(req, res)` - Booking analytics
- `getRecentActivities(req, res)` - Recent booking activity
- `getBookingReport(req, res)` - Booking report
- `getRevenueReport(req, res)` - Revenue report
- `getUserReport(req, res)` - User growth report
- `getAllUsers(req, res)` - List users with sports
- `deleteUser(req, res)` - Delete user
- Advanced analytics (growth, trends, top venues/sports/users, posts)

---

#### 2. **authController.js**
**Purpose**: Handles all authentication and user account management

**Functions**:
- `register(req, res)` - User registration with email verification
  - Validates user data
  - Hashes password with bcrypt
  - Uploads profile image to Cloudinary
  - Sends welcome email
  - Generates JWT token
  
- `login(req, res)` - User authentication
  - Validates credentials
  - Compares hashed passwords
  - Returns JWT token
  
- `healthCheck(req, res)` - API health monitoring
  - Database connectivity check
  - Memory usage statistics
  - CPU load metrics
  - Uptime tracking
  
- `checkEmailExists(req, res)` - Email availability check
  
- `sendResetPasswordEmail(req, res)` - Password reset flow
  - Generates 4-digit OTP
  - Sends reset email with template
  
- `resetPassword(req, res)` - Password reset with OTP
  - Verifies OTP
  - Updates password
  
- `changePassword(req, res)` - Authenticated password change
  - Validates current password
  - Updates to new password

---

#### 3. **sportController.js**
**Purpose**: Manages sports catalog

**Functions**:
- `healthCheck(req, res)` - Sports service health check
- `addNewSport(req, res)` - Create new sport
  - Validates sport name (2-100 chars)
  - Checks for duplicates
  - Inserts into database
  
- `getAllSports(req, res)` - List all sports
  - Returns sorted list
  - Includes metadata (count, timestamps)
  
- `updateSport(req, res)` - Update sport by ID
  - Validates sport ID
  - Updates sport name
  
- `deleteSport(req, res)` - Delete sport
  - Checks for foreign key constraints
  - Removes from database

---

#### 4. **userController.js**
**Purpose**: User profile and sport preferences management

**Functions**:
- `updateUserDetails(req, res)` - Update user profile
  - Handles profile image upload
  - Updates first/last name
  - Uses transactions for data integrity
  
- `addUserSport(req, res)` - Add sport to user profile
  - Validates user and sport IDs
  - Prevents duplicate entries
  - Stores skill level
  
- `userProfile(req, res)` - Get user profile
  - Retrieves user details
  - Includes associated sports
  - Returns skill levels
  
- `deleteUserSport(req, res)` - Remove sport from user
  - Validates ownership
  - Removes relationship

---

#### 5. **bookingController.js**
**Purpose**: Bookings and payments

**Functions**:
- `venueBooking(req, res)` - Create booking and game
- `createPaymentOrder(req, res)` - Create Razorpay order
- `makePayment(req, res)` - Verify payment and mark booking paid
- `allCreatedGames(req, res)` - List available games
- `userJoinedGames(req, res)` - List joined games
- `userGamesCreated(req, res)` - List games hosted by user

---

#### 6. **slotController.js**
**Purpose**: Slot management for venues

**Functions**:
- `addNewSlot(req, res)` - Create slot
- `editSlot(req, res)` - Update slot
- `deleteSlot(req, res)` - Delete slot
- `getAllSlotsOfVenue(req, res)` - List venue slots
- `getAvailableSlotsByVenueAndDate(req, res)` - Availability by date

---

#### 7. **venueController.js**
**Purpose**: Venue registration and authentication

**Functions**:
- `registerVenue(req, res)` - Venue registration
  - Creates venue owner account
  - Stores venue details (name, address)
  - Sends welcome email
  - Returns JWT token
  
- `venueLogin(req, res)` - Venue authentication
  - Validates credentials
  - Returns venue details and token

---

### Models

Models represent database entities and provide an abstraction layer for database operations.

#### 1. **User.js**
**Purpose**: User account management

**Schema**:
```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NULL,
    user_password VARCHAR(61) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NULL,
    profile_image VARCHAR(165) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (user_email)
)
```

**Methods**:
- `createTable()` - Create users table
- `findByEmail(email, conn)` - Find user by email
- `save(userData, conn)` - Create new user
- `findById(userId, conn)` - Find user by ID
- `updatePassword(email, hashedPassword, conn)` - Update password
- `updateUserDetails(userDetails, conn)` - Update profile

---

#### 2. **Sport.js**
**Purpose**: Sports catalog management

**Schema**:
```sql
CREATE TABLE sports (
    sport_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sport_name (sport_name)
)
```

**Methods**:
- `createTable()` - Create sports table
- `insertDefaultSports(conn)` - Insert default sports (Cricket, Pickleball)
- `getAllSports(conn)` - Get all sports
- `addSport(sportName, conn)` - Add new sport
- `findById(sportId, conn)` - Find sport by ID
- `findByName(sportName, conn)` - Find sport by name
- `updateSport(sportId, sportName, conn)` - Update sport
- `deleteSport(sportId, conn)` - Delete sport
- `getSportsCount(conn)` - Get total count

---

#### 3. **UserSport.js**
**Purpose**: User-Sport relationship (Many-to-Many)

**Schema**:
```sql
CREATE TABLE user_sports (
    user_sport_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sport_id INT NOT NULL,
    skill_level ENUM('Beginner', 'Intermediate', 'Pro') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_sport (user_id, sport_id),
    INDEX idx_user_id (user_id),
    INDEX idx_sport_id (sport_id)
)
```

**Methods**:
- `createTable()` - Create user_sports table
- `addUserSport(userSportData, conn)` - Add sport to user
- `getUserSports(userId, conn)` - Get user's sports with details
- `getUsersBySport(sportId, skillLevel, conn)` - Find users by sport
- `updateSkillLevel(userSportId, skillLevel, conn)` - Update skill level
- `removeUserSport(userId, sportId, conn)` - Remove user sport
- `findByUserAndSport(userId, sportId, conn)` - Find relationship
- `getSportStats(sportId, conn)` - Get statistics by skill level

---

#### 4. **Venue.js**
**Purpose**: Venue management

**Schema**:
```sql
CREATE TABLE venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(61) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NULL,
    phone VARCHAR(20) NOT NULL,
    profile_image VARCHAR(160) DEFAULT 'https://...',
    venue_name VARCHAR(100) NOT NULL,
    address VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_venue_email (email),
    INDEX idx_venue_name (venue_name)
)
```

**Methods**:
- `createTable()` - Create venues table
- `save(data, conn)` - Create new venue
- `findById(id, conn)` - Find venue by ID
- `findByEmail(email, conn)` - Find venue by email
- `updateProfile(id, updates, conn)` - Update venue profile

---

#### 5. **VenueSport.js**
**Purpose**: Venue-Sport relationship

**Schema**:
```sql
CREATE TABLE venue_sports (
    venue_sport_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT NOT NULL,
    sport_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
    UNIQUE KEY unique_venue_sport (venue_id, sport_id),
    INDEX idx_venue_id (venue_id),
    INDEX idx_sport_id (sport_id)
)
```

**Methods**:
- `createTable()` - Create venue_sports table
- `save(data, conn)` - Add sport to venue
- `findById(id, conn)` - Find by ID
- `listByVenue(venueId, conn)` - Get all sports for a venue

---

#### 6. **Slot.js**
**Purpose**: Slot management for venue sports

**Schema**:
```sql
CREATE TABLE slots (
  slot_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_sport_id INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price_per_slot DECIMAL(10,2) CHECK (price_per_slot >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_sport_id) REFERENCES venue_sports(venue_sport_id) ON DELETE CASCADE
);
```

---

#### 7. **Games.js**
**Purpose**: Games created when a booking is made

**Schema**:
```sql
CREATE TABLE games (
  game_id INT AUTO_INCREMENT PRIMARY KEY,
  sport_id INT NOT NULL,
  venue_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  host_user_id INT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  status VARCHAR(45) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
  FOREIGN KEY (host_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 8. **Booking.js**
**Purpose**: Venue bookings linked to games

**Schema**:
```sql
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  slot_id INT NULL,
  venue_id INT NOT NULL,
  venue_sport_id INT NOT NULL,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  total_price DECIMAL(10,2) CHECK (total_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  UNIQUE KEY uniq_booking_slot_time (slot_id, venue_id, start_datetime, end_datetime),
  FOREIGN KEY (slot_id) REFERENCES slots(slot_id) ON DELETE SET NULL,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
  FOREIGN KEY (venue_sport_id) REFERENCES venue_sports(venue_sport_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
```

---

#### 9. **Post.js**
**Purpose**: Social posts and likes

**Schema**:
```sql
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text_content TEXT NULL,
  media_url VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE post_likes (
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 10. **game_player.js**
**Purpose**: Game player requests and approvals

**Schema**:
```sql
CREATE TABLE game_players (
  game_player_id INT NOT NULL AUTO_INCREMENT,
  game_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('Pending','Approved','Rejected') NULL,
  joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (game_player_id),
  UNIQUE KEY uniq_game_player (game_id, user_id),
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 11. **VenueImages.js**
**Purpose**: Venue gallery images

**Schema**:
```sql
CREATE TABLE venue_images (
  venue_image_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE
);
```

---

#### 12. **VenueSportCourt.js (Planned)**
**Purpose**: Court/facility management for venue sports

**Planned Schema**:
```sql
CREATE TABLE venue_sport_courts (
  court_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_sport_id INT NOT NULL,
  court_name VARCHAR(50) NOT NULL,
  status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_sport_id) REFERENCES venue_sports(venue_sport_id) ON DELETE CASCADE,
  INDEX idx_venue_sport (venue_sport_id)
);
```

---

### Middleware

#### 1. **authUser.js**
**Purpose**: JWT token verification

**Functions**:
- `verifyToken(req, res, next)` - User authentication middleware
  - Extracts JWT from `Authorization: Bearer <token>` header
  - Verifies token validity
  - Loads user data
  - Attaches `req.user` object
  
- `venueVerifyToken(req, res, next)` - Venue authentication middleware
  - Similar to `verifyToken` but for venue owners
  - Loads venue data
  - Attaches `req.user` object

**Error Handling**:
- 401: Missing or malformed token
- 401: Invalid or expired token
- 404: User/Venue not found
- 500: Token verification failed

---

#### 2. **validation.js**
**Purpose**: Input validation with express-validator

**Validation Rules**:
- `validateUserRegistration` - User signup
  - email: valid email format, max 100 chars
  - password: 8-60 chars, contains lowercase, uppercase, number, special char
  - first_name: 1-50 chars, letters/spaces/hyphens/apostrophes
  - last_name: optional, same as first_name
  
- `validateUserLogin` - User signin
  - email: valid format
  - password: 1-60 chars
  
- `validateResetPasswordEmail` - Password reset request
  - email: valid format
  
- `validateResetPassword` - Password reset with OTP
  - email: valid format
  - new_password: same as registration
  
- `validateChangePassword` - Password change
  - currentPassword: required
  - newPassword: same as registration

**Error Handler**:
- `handleValidationErrors(req, res, next)` - Returns 400 with error details

---

#### 3. **multer.js**
**Purpose**: File upload configuration

**Configuration**:
- Storage: Memory storage (for Cloudinary upload)
- File size limit: 5MB (configurable via `.env`)
- Allowed types: `image/jpeg`, `image/png`, `image/jpg`

---

### Utilities

#### 1. **AuthHelpers.js**
**Purpose**: Authentication utility functions

**Functions**:
- `hashPassword(password)` - Hash password with bcrypt (10 salt rounds)
- `isPasswordValid(storedHash, plainPassword)` - Compare passwords
- `generateToken(user)` - Create JWT token
  - Payload: `{ id: user.id, email: user.email }`
  - Expiry: 7 days (configurable)
- `verifyToken(token)` - Verify and decode JWT
- `generateOTP()` - Generate 4-digit numeric OTP
- `hashOTP(otp)` - Hash OTP for storage

---

#### 2. **Cloudinary.js**
**Purpose**: Image upload service configuration

**Function**:
- `connectCloudinary()` - Initialize Cloudinary with credentials
  - Cloud Name
  - API Key
  - API Secret

---

#### 3. **Mail.js**
**Purpose**: Email service using Nodemailer

**Functions**:
- `sendEmail(to, subject, html)` - Generic email sender
  - Uses Gmail SMTP
  - Configured via `.env`
  
- `sendWelcomeEmail(to, subject, html)` - Welcome email wrapper

**Configuration**:
- Service: Gmail
- Auth: Email + App-specific password
- From: Configurable sender name

---

#### 4. **Response.js**
**Purpose**: Standardized API response format

**Functions**:
- `success(statusCode, message, data)` - Success response
  ```json
  {
    "status": true,
    "statusCode": 200,
    "message": "Success message",
    "data": {...},
    "timestamp": "2025-01-06T12:00:00.000Z"
  }
  ```
  
- `error(statusCode, message, errors)` - Error response
  ```json
  {
    "status": false,
    "statusCode": 400,
    "message": "Error message",
    "errors": [...],
    "timestamp": "2025-01-06T12:00:00.000Z"
  }
  ```

---

#### 5. **emailTemplates.js**
**Purpose**: HTML email templates

**Templates**:
- `playmateWelcomeTemplate({ name })` - Welcome email
  - Branded design
  - Personalized greeting
  - Platform introduction
  
- `resetPasswordTemplate({ name, otp })` - Password reset email
  - OTP display
  - Security instructions
  - Expiration notice

---

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

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

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

For detailed API documentation, see [docs/API.md](docs/API.md) or visit `/api-docs` when running the server for interactive Swagger documentation.

**Swagger UI**: `http://localhost:4000/api-docs`

### API Endpoint Summary

The API is organized into four main modules:

#### Authentication & User Management
Base Path: `/api/v1/auth`

| Endpoint | Method | Description | Auth | Body/Params |
|----------|--------|-------------|------|-------------|
| `/register` | POST | Register new user | ❌ | `user_email`, `user_password`, `first_name`, `last_name?`, `profile_image?` (multipart) |
| `/login` | POST | User login | ❌ | `user_email`, `user_password` |
| `/check-email` | POST | Check email availability | ❌ | `user_email` |
| `/reset-password-email` | POST | Send password reset OTP | ❌ | `user_email` |
| `/reset-password` | POST | Reset password with OTP | ❌ | `user_email`, `new_password`, `otp` |
| `/change-password` | POST | Change password (authenticated) | ✅ | `currentPassword`, `newPassword` |
| `/health` | GET | Health check | ❌ | - |

**Authentication Headers**:
```
Authorization: Bearer <jwt_token>
```

---

#### Sports Management
Base Path: `/api/v1/sports`

| Endpoint | Method | Description | Auth | Body/Params |
|----------|--------|-------------|------|-------------|
| `/health` | GET | Sports service health check | ❌ | - |
| `/addNewSport` | POST | Create new sport | ❌ | `sport_name` |
| `/getAllSports` | GET | List all sports | ❌ | - |
| `/updateSport/:sportId` | PUT | Update sport by ID | ❌ | `sport_name` |
| `/deleteSport/:sportId` | DELETE | Delete sport by ID | ❌ | - |
| `/addUserSport` | POST | Add sport to user with skill level | ✅ | `user_id`, `sport_id`, `skill_level?` |
| `/getUserSports/:userId` | GET | Get sports for a user | ✅ | - |
| `/deleteUserSport/:userSportId` | DELETE | Remove user sport by ID | ✅ | - |

---

#### User Profile & Sports
Base Path: `/api/v1/user`

| Endpoint | Method | Description | Auth | Body/Params |
|----------|--------|-------------|------|-------------|
| `/updateDetails` | PUT | Update user profile | ✅ | `first_name?`, `last_name?`, `profile_image?` (multipart) |
| `/userSport` | POST | Add sport to user profile | ✅ | `user_id`, `sport_id`, `skill_level?` |
| `/deleteUserSport/:user_id/:sport_id` | DELETE | Remove sport from user | ✅ | - |
| `/profile/:userId` | GET | Get user profile with sports | ✅ | - |
| `/userPosts/:userId` | GET | Get posts by user | ✅ | - |
| `/createPost/:userId` | POST | Create post | ✅ | `text_content?`, `media_url?` (multipart) |
| `/deletePost/:postId/:userId` | DELETE | Delete post | ✅ | - |
| `/toggle/:postId/:userId` | POST | Like/unlike post | ✅ | - |
| `/getPostLikes/:postId` | GET | Get post likes | ✅ | - |
| `/recentActivities/:userId` | GET | Recent activity feed | ✅ | `page?`, `limit?` |
| `/venueBooking` | POST | Book a venue slot | ✅ | `sport_id`, `venue_id`, `slot_id`, `start_datetime`, `end_datetime`, `host_id`, `price`, `payment?` |
| `/payments/order` | POST | Create Razorpay order | ✅ | `amount`, `currency?`, `receipt?` |
| `/payments/complete/:gameId` | POST | Complete payment | ✅ | `payment` payload |
| `/allGames` | GET | Get all games | ✅ | - |
| `/joinedGames` | GET | Get joined games | ✅ | - |
| `/usersCreatedGames` | GET | Get user-created games | ✅ | - |
| `/joinGame/:userId/:gameId` | POST | Join game | ✅ | - |
| `/leaveGame/:userId/:gameId` | DELETE | Leave game | ✅ | - |
| `/getPlayersByGameId/:gameId` | GET | Get approved players | ✅ | - |
| `/requestedUserList/:gameId` | GET | Get pending player requests | ✅ | - |
| `/updateGamePlayerStatus` | PATCH | Approve/reject player | ✅ | `game_player_id`, `user_id`, `status` |

**Skill Levels**: `Beginner`, `Intermediate`, `Pro`

---

#### Venue Management
Base Path: `/api/v1/venue`

| Endpoint | Method | Description | Auth | Body/Params |
|----------|--------|-------------|------|-------------|
| `/register` | POST | Register new venue | ❌ | `email`, `password`, `first_name`, `last_name?`, `phone`, `venue_name`, `address`, `profile_image?` |
| `/login` | POST | Venue login | ❌ | `email`, `password` |
| `/venueImage/upload/:venueId` | POST | Upload venue image | ✅ | `venue_image` (multipart) |
| `/venueImages/:venueId` | GET | Get venue images | ✅ | - |
| `/venueImage/:venueImageId` | DELETE | Delete venue image | ✅ | - |
| `/profile/:venueId` | GET | Get venue profile | ✅ | - |
| `/profile/:venueId` | PUT | Update venue profile | ✅ | `first_name?`, `last_name?`, `phone?`, `venue_name?`, `address?`, `profile_image?` |
| `/dashboard/stats/:venueId` | GET | Venue dashboard stats | ✅ | - |
| `/analytics/daily-booking-trend/:venueId` | GET | Daily booking trend | ✅ | - |
| `/analytics/monthly-revenue-trend/:venueId` | GET | Monthly revenue trend | ✅ | - |
| `/analytics/revenue-by-sport/:venueId` | GET | Revenue by sport | ✅ | - |
| `/analytics/revenue-by-slot/:venueId` | GET | Revenue by slot | ✅ | - |
| `/analytics/most-booked-slots/:venueId` | GET | Most booked slots | ✅ | - |
| `/analytics/peak-booking-hours/:venueId` | GET | Peak booking hours | ✅ | - |
| `/analytics/slot-usage-frequency/:venueId` | GET | Slot usage frequency | ✅ | - |
| `/analytics/unused-slots/:venueId` | GET | Unused slots | ✅ | - |
| `/analytics/unique-customers/:venueId` | GET | Unique customers | ✅ | - |
| `/analytics/repeat-customers/:venueId` | GET | Repeat customers | ✅ | - |
| `/analytics/top-customers/:venueId` | GET | Top customers | ✅ | - |
| `/analytics/total-games-hosted/:venueId` | GET | Total games hosted | ✅ | - |
| `/analytics/games-by-sport/:venueId` | GET | Games by sport | ✅ | - |
| `/analytics/recent-bookings/:venueId` | GET | Recent bookings | ✅ | `limit?` |
| `/sports/:venueId` | GET | Get venue sports | ✅ | - |
| `/sports` | POST | Add sport to venue | ✅ | `venue_id`, `sport_id` |
| `/allSports` | GET | List all sports | ✅ | - |
| `/sports/:venueSportId` | PUT | Update venue sport | ✅ | `sport_id` |
| `/sports/:venueSportId` | DELETE | Delete venue sport | ✅ | - |
| `/bookings/:venueId` | GET | Get venue bookings | ✅ | - |
| `/bookings/:bookingId` | DELETE | Delete booking | ✅ | - |
| `/bookings/deactivate/:game_id` | PATCH | Deactivate booking | ✅ | - |
| `/bookings/payment-status/:bookingId` | PATCH | Update booking payment | ✅ | - |
| `/allVenueSlots/:venueId` | GET | Get venue slots | ✅ | - |
| `/slots/available/:venueId` | GET | Get available slots by date | ❌ | `date`, `sportId` |
| `/slots` | POST | Create slot | ✅ | `venue_sport_id`, `start_time`, `end_time`, `price_per_slot` |
| `/slots/:slotId` | PATCH | Update slot | ✅ | `venue_sport_id?`, `start_time?`, `end_time?`, `price_per_slot?` |
| `/slots/:slotId` | DELETE | Delete slot | ✅ | - |
| `/allVenues` | GET | Get all venues | ❌ | - |

---

#### Admin Management & Analytics
Base Path: `/api/v1/admin`

| Endpoint | Method | Description | Auth | Body/Params |
|----------|--------|-------------|------|-------------|
| `/admin-login` | POST | Admin login | ❌ | `email`, `password` |
| `/getAllSports` | GET | Get all sports | ✅ | - |
| `/addSport` | POST | Add a sport | ✅ | `sport_name` |
| `/updateSport/:sport_id` | PATCH | Update sport | ✅ | `sport_name` |
| `/deleteSport/:sport_id` | DELETE | Delete sport | ✅ | - |
| `/dashboard/stats` | GET | Dashboard stats | ✅ | - |
| `/dashboard/sport/metrics` | GET | Sport metrics | ✅ | - |
| `/dashboard/booking/metrics` | GET | Booking metrics | ✅ | - |
| `/dashboard/recent/activities` | GET | Recent activities | ✅ | - |
| `/dashboard/booking/report` | GET | Booking report | ✅ | - |
| `/dashboard/revenue/report` | GET | Revenue report | ✅ | - |
| `/dashboard/user/report` | GET | User report | ✅ | - |
| `/getAllUsers` | GET | Get all users | ❌ | - |
| `/deleteUser/:user_id` | DELETE | Delete user | ✅ | - |
| `/analytics/user-growth` | GET | User growth report | ✅ | - |
| `/analytics/venue-growth` | GET | Venue growth report | ✅ | - |
| `/analytics/booking-trend` | GET | Booking trend report | ✅ | - |
| `/analytics/monthly-revenue` | GET | Monthly revenue report | ✅ | - |
| `/analytics/revenue-by-venue` | GET | Revenue by venue | ✅ | - |
| `/analytics/revenue-by-sport` | GET | Revenue by sport | ✅ | - |
| `/analytics/most-played-sports` | GET | Most played sports | ✅ | - |
| `/analytics/most-booked-venues` | GET | Most booked venues | ✅ | - |
| `/analytics/peak-booking-hours` | GET | Peak booking hours | ✅ | - |
| `/analytics/top-users-by-bookings` | GET | Top users by bookings | ✅ | - |
| `/analytics/most-liked-posts` | GET | Most liked posts | ✅ | - |
| `/analytics/top-content-creators` | GET | Top content creators | ✅ | - |
| `/getVenues` | GET | Get all venues | ❌ | - |
| `/deleteVenue/:venue_id` | DELETE | Delete venue | ✅ | - |
| `/getAllPosts` | GET | Get all posts | ✅ | - |
| `/deletePost/:post_id` | DELETE | Delete post | ✅ | - |

---

### Response Format

#### Success Response
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data
  },
  "timestamp": "2025-01-06T12:00:00.000Z"
}
```

#### Error Response
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ],
  "timestamp": "2025-01-06T12:00:00.000Z"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Validation error or invalid input
- **401 Unauthorized**: Missing, invalid, or expired token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource (e.g., email already exists)
- **500 Internal Server Error**: Server error

---

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

**Token Expiration**: 7 days (configurable via `JWT_EXPIRES_IN` in `.env`)

**Obtaining Token**:
1. Register: `POST /api/v1/auth/register`
2. Login: `POST /api/v1/auth/login`
3. Venue Login: `POST /api/v1/venue/login`

Both return:
```json
{
  "status": true,
  "statusCode": 200,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🗄️ Database Schema

The Playmate API uses MySQL 8.0+ with a relational database schema designed for scalability and data integrity.

### Database Configuration

**Connection Pool Settings** (in `config/db.js`):
```javascript
{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}
```

### Entity Relationship Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Users     │◄───────►│ User_Sports  │◄───────►│   Sports    │
└─────────────┘         └──────────────┘         └─────────────┘
  │   ▲                                         ▲
  │   │                                         │
  │   └───────────────┐                         │
  │                   │                         │
┌─────────────┐     ┌──────────────┐         ┌──────────────┐
│   Posts     │◄────│  Post_Likes  │         │ Venue_Sports │◄──────────────┐
└─────────────┘     └──────────────┘         └──────────────┘               │
  ▲                                                     ▲               │
  │                                                     │               │
┌─────────────┐                                         ┌─────────────┐    │
│ GamePlayers │◄────────────┐                           │   Slots     │    │
└─────────────┘             │                           └─────────────┘    │
  ▲                      │                                   ▲          │
  │                      │                                   │          │
┌─────────────┐     ┌─────────────┐                       ┌─────────────┐   │
│   Games     │◄────│  Bookings   │──────────────────────►│   Venues    │◄──┘
└─────────────┘     └─────────────┘                       └─────────────┘
                        ▲
                        │
                       ┌─────────────┐
                       │ VenueImages │
                       └─────────────┘
```

### Tables

#### 1. **users**
Stores user account information and authentication credentials.

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(15) NULL,
    user_password VARCHAR(61) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NULL,
    profile_image VARCHAR(165) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (user_email)
);
```

**Columns**:
- `user_id`: Primary key, auto-increment
- `user_email`: Unique email address, indexed for fast lookups
- `user_password`: Bcrypt hashed password (60 chars + 1 for null terminator)
- `first_name`: Required, 1-50 characters
- `last_name`: Optional, 1-50 characters
- `phone_number`: Optional contact number
- `profile_image`: Cloudinary URL or default image
- `created_at`: Registration timestamp

**Indexes**:
- PRIMARY KEY on `user_id`
- UNIQUE INDEX on `user_email`

---

#### 2. **sports**
Catalog of available sports.

```sql
CREATE TABLE sports (
    sport_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sport_name (sport_name)
);
```

**Columns**:
- `sport_id`: Primary key, auto-increment
- `sport_name`: Unique sport name, indexed
- `created_at`: Creation timestamp

**Indexes**:
- PRIMARY KEY on `sport_id`
- UNIQUE INDEX on `sport_name`

**Default Sports**: Cricket, Pickleball

---

#### 3. **user_sports**
Many-to-many relationship between users and sports with skill level tracking.

```sql
CREATE TABLE user_sports (
    user_sport_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sport_id INT NOT NULL,
    skill_level ENUM('Beginner', 'Intermediate', 'Pro') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_sport (user_id, sport_id),
    INDEX idx_user_id (user_id),
    INDEX idx_sport_id (sport_id)
);
```

**Columns**:
- `user_sport_id`: Primary key, auto-increment
- `user_id`: Foreign key to users table
- `sport_id`: Foreign key to sports table
- `skill_level`: Enum - Beginner, Intermediate, or Pro
- `created_at`: Association timestamp

**Indexes**:
- PRIMARY KEY on `user_sport_id`
- FOREIGN KEY on `user_id` → `users.user_id` (CASCADE DELETE)
- FOREIGN KEY on `sport_id` → `sports.sport_id` (CASCADE DELETE)
- UNIQUE COMPOSITE on `(user_id, sport_id)`
- INDEX on `user_id`
- INDEX on `sport_id`

**Constraints**:
- A user can only add a sport once (enforced by unique composite key)
- Deleting a user removes all their sport associations
- Deleting a sport removes all user associations

---

#### 4. **venues**
Stores venue/facility information and owner details.

```sql
CREATE TABLE venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(61) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NULL,
    phone VARCHAR(20) NOT NULL,
    profile_image VARCHAR(160) DEFAULT 'https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764845539/avatar_wcaknk.png',
    venue_name VARCHAR(100) NOT NULL,
    address VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_venue_email (email),
    INDEX idx_venue_name (venue_name)
);
```

**Columns**:
- `venue_id`: Primary key, auto-increment
- `email`: Unique owner email, indexed
- `password`: Bcrypt hashed password
- `first_name`: Owner's first name
- `last_name`: Owner's last name (optional)
- `phone`: Contact phone number
- `profile_image`: Cloudinary URL with default fallback
- `venue_name`: Facility name, indexed
- `address`: Physical location
- `created_at`: Registration timestamp

**Indexes**:
- PRIMARY KEY on `venue_id`
- UNIQUE INDEX on `email`
- INDEX on `venue_name`

---

#### 5. **venue_sports**
Many-to-many relationship between venues and sports.

```sql
CREATE TABLE venue_sports (
    venue_sport_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT NOT NULL,
    sport_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
    UNIQUE KEY unique_venue_sport (venue_id, sport_id),
    INDEX idx_venue_id (venue_id),
    INDEX idx_sport_id (sport_id)
);
```

**Columns**:
- `venue_sport_id`: Primary key, auto-increment
- `venue_id`: Foreign key to venues table
- `sport_id`: Foreign key to sports table
- `created_at`: Association timestamp

**Indexes**:
- PRIMARY KEY on `venue_sport_id`
- FOREIGN KEY on `venue_id` → `venues.venue_id` (CASCADE DELETE)
- FOREIGN KEY on `sport_id` → `sports.sport_id` (CASCADE DELETE)
- UNIQUE COMPOSITE on `(venue_id, sport_id)`
- INDEX on `venue_id`
- INDEX on `sport_id`

**Constraints**:
- A venue can only offer a sport once
- Deleting a venue removes all sport associations

---

#### 6. **slots**
Time slots associated with venue sports.

```sql
CREATE TABLE slots (
  slot_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_sport_id INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price_per_slot DECIMAL(10,2) CHECK (price_per_slot >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_sport_id) REFERENCES venue_sports(venue_sport_id) ON DELETE CASCADE
);
```

---

#### 7. **games**
Game sessions created for bookings.

```sql
CREATE TABLE games (
  game_id INT AUTO_INCREMENT PRIMARY KEY,
  sport_id INT NOT NULL,
  venue_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  host_user_id INT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  status VARCHAR(45) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
  FOREIGN KEY (host_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 8. **bookings**
Bookings linked to games and slots.

```sql
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  slot_id INT NULL,
  venue_id INT NOT NULL,
  venue_sport_id INT NOT NULL,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  total_price DECIMAL(10,2) CHECK (total_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  UNIQUE KEY uniq_booking_slot_time (slot_id, venue_id, start_datetime, end_datetime),
  FOREIGN KEY (slot_id) REFERENCES slots(slot_id) ON DELETE SET NULL,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
  FOREIGN KEY (venue_sport_id) REFERENCES venue_sports(venue_sport_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
```

---

#### 9. **posts** and **post_likes**
Social posts and likes.

```sql
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text_content TEXT NULL,
  media_url VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE post_likes (
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 10. **game_players**
Players and approvals for games.

```sql
CREATE TABLE game_players (
  game_player_id INT NOT NULL AUTO_INCREMENT,
  game_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('Pending','Approved','Rejected') NULL,
  joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (game_player_id),
  UNIQUE KEY uniq_game_player (game_id, user_id),
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 11. **venue_images**
Venue gallery images.

```sql
CREATE TABLE venue_images (
  venue_image_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE
);
```

---

#### 12. **venue_sport_courts**
Court/facility management for venue sports (implementation in progress).

**Purpose**: Tracks individual courts/fields within a venue for a specific sport.

**Planned Schema**:
```sql
CREATE TABLE venue_sport_courts (
    court_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_sport_id INT NOT NULL,
    court_name VARCHAR(50) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_sport_id) REFERENCES venue_sports(venue_sport_id) ON DELETE CASCADE,
    INDEX idx_venue_sport (venue_sport_id)
);
```

---

### Database Initialization

Tables are automatically created on application startup via model methods:

```javascript
// In each model file
User.createTable().catch(console.error);
Sport.createTable().catch(console.error);
UserSport.createTable().catch(console.error);
Venue.createTable().catch(console.error);
VenueSport.createTable().catch(console.error);
Slot.createTable().catch(console.error);
Games.createTable().catch(console.error);
Booking.createTable().catch(console.error);
Post.createTable().catch(console.error);
VenueImages.createTable().catch(console.error);
GamePlayer.createTable().catch(console.error);
```

### Migration Strategy

**Current**: Auto-creation on startup (suitable for development)

**Recommended for Production**:
- Use migration tools (e.g., `knex.js`, `sequelize migrations`)
- Version control for schema changes
- Rollback capabilities
- Separate migration environment

### Performance Optimizations

1. **Indexes**:
   - All primary keys are indexed by default
   - Email columns indexed for authentication lookups
   - Foreign keys indexed for JOIN operations
   - Unique constraints prevent duplicates and improve lookup speed

2. **Connection Pooling**:
   - 10 concurrent connections
   - Reuses connections for better performance
   - Automatic connection management

3. **Prepared Statements**:
   - All queries use parameterized statements
   - Prevents SQL injection
   - Improves query execution plan caching

4. **Foreign Key Cascades**:
   - `ON DELETE CASCADE` for automatic cleanup
   - Maintains referential integrity
   - Reduces manual cleanup queries

---

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

### Current Implementation Highlights
- [x] Sport management endpoints
- [x] User sports endpoints
- [x] Profile updates with image upload
- [x] Bookings, payments, and slots
- [x] Social posts and likes
- [x] Admin and venue analytics

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

*Last Updated: January 2026*