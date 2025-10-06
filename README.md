# 🌱 Solidify Backend - SME Carbon Management Platform

A comprehensive Node.js/Express/MongoDB backend for helping Small and Medium Enterprises (SMEs) in Ghana achieve Net Zero Carbon Emissions.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Deployment](#deployment)

## ✨ Features

### Core Features
- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 💬 **Real-time Chat** - Socket.io powered messaging between SMEs
- 📚 **Knowledge Base** - Educational resources on sustainability
- 📰 **News Section** - Latest updates on carbon emissions and Net Zero
- 📊 **Carbon Footprint Tracker** - 3-level sustainability system with tracking

### Additional Features
- 🏢 **Organization Management** - Multi-tenant SME profiles
- 🎯 **Sustainability Roadmap** - 6-milestone progress tracking
- 🎯 **Goal Setting** - Set and track carbon reduction goals
- 📤 **File Uploads** - Cloudinary integration for images and documents
- 📧 **Email Notifications** - Gmail SMTP for transactional emails
- 📖 **API Documentation** - Swagger/OpenAPI docs

## 🛠 Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (Atlas - FREE tier)
- **ODM:** Mongoose
- **Real-time:** Socket.io
- **Authentication:** JWT (jsonwebtoken)
- **File Storage:** Cloudinary (FREE tier)
- **Email:** Nodemailer + Gmail SMTP (FREE)
- **Validation:** Joi + express-validator
- **Security:** Helmet, bcryptjs, express-mongo-sanitize
- **Logging:** Winston
- **API Docs:** Swagger

## 📁 Project Structure

```
shopify-be/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   └── cloudinary.ts
│   ├── models/           # Mongoose models
│   │   ├── User.ts
│   │   ├── Organization.ts
│   │   ├── Conversation.ts
│   │   ├── Message.ts
│   │   ├── KnowledgeArticle.ts
│   │   ├── NewsArticle.ts
│   │   ├── CarbonEntry.ts
│   │   ├── EmissionFactor.ts
│   │   ├── SustainabilityRoadmap.ts
│   │   └── SustainabilityGoal.ts
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── validators/       # Input validation
│   ├── utils/            # Utility functions
│   ├── sockets/          # Socket.io handlers
│   ├── types/            # TypeScript types
│   ├── swagger/          # API documentation
│   ├── app.ts            # Express app setup
│   └── server.ts         # Entry point
├── tests/                # Test files
├── logs/                 # Log files
├── .env.example          # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (FREE)
- Cloudinary account (FREE)
- Gmail account with App Password

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd shopify-be
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Then edit `.env` with your credentials:
- MongoDB Atlas connection string
- JWT secrets (generate random strings)
- Cloudinary credentials
- Gmail SMTP credentials

4. **Build TypeScript**
```bash
npm run build
```

5. **Run in development**
```bash
npm run dev
```

6. **Run in production**
```bash
npm start
```

## 🔑 Environment Variables

See `.env.example` for all required variables:

### Required Services Setup

#### 1. MongoDB Atlas (FREE)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster (M0 tier)
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string

#### 2. Cloudinary (FREE)
1. Go to https://cloudinary.com/users/register/free
2. Get Cloud Name, API Key, API Secret from dashboard

#### 3. Gmail SMTP (FREE)
1. Enable 2-Step Verification on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate App Password for "Mail"
4. Use 16-digit password in `.env`

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** `http://localhost:5000/api-docs`
- **API Base:** `http://localhost:5000/api/v1`

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token
- `PUT /api/v1/auth/change-password` - Change password

#### Chat
- `GET /api/v1/chat/conversations` - List conversations
- `POST /api/v1/chat/conversations` - Create conversation
- `GET /api/v1/chat/conversations/:id/messages` - Get messages
- `POST /api/v1/chat/messages` - Send message
- WebSocket: `/socket.io` - Real-time chat

#### Knowledge Base
- `GET /api/v1/knowledge/articles` - List articles
- `GET /api/v1/knowledge/articles/:slug` - Get article
- `POST /api/v1/knowledge/articles` - Create article (admin)
- `GET /api/v1/knowledge/search?q=...&level=...` - Search

#### News
- `GET /api/v1/news` - List news
- `GET /api/v1/news/:slug` - Get news article
- `POST /api/v1/news` - Create news (admin)

#### Carbon Tracking
- `POST /api/v1/carbon/calculate` - Calculate emissions
- `POST /api/v1/carbon/entries` - Create entry
- `GET /api/v1/carbon/entries?level=...` - List entries
- `GET /api/v1/carbon/dashboard` - Dashboard stats
- `GET /api/v1/carbon/roadmap` - Get roadmap

## 🗄 Database Models

### Core Models
- **User** - User accounts with roles
- **Organization** - SME company profiles
- **Conversation** - Chat rooms
- **Message** - Chat messages

### Content Models
- **KnowledgeArticle** - Educational content
- **NewsArticle** - News posts

### Carbon Models
- **CarbonEntry** - Emission records
- **EmissionFactor** - Calculation factors (Ghana-specific)
- **SustainabilityRoadmap** - Progress tracking
- **SustainabilityGoal** - Reduction targets

## 🌱 Sustainability Levels

The system uses a 3-level progression:

### Level 1: Foundation & Measurement
- Basic carbon footprint tracking
- Initial data collection
- Understanding emissions sources

### Level 2: Efficiency & Integration
- Implementing efficiency measures
- Renewable energy integration
- Advanced tracking

### Level 3: Transformation & Net Zero Leadership
- Complete transformation
- Carbon offsetting
- Net-zero achievement

## 🚢 Deployment

### Deploy to Render.com (FREE)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main
```

2. **Create Render Web Service**
- Go to https://render.com
- Connect GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`
- Add environment variables from `.env`

3. **Deploy!**
- Auto-deploys on every push

### Production URL
```
https://solidify-api.onrender.com
```

## 📝 Scripts

```bash
npm run dev       # Development with nodemon
npm run build     # Build TypeScript
npm start         # Production server
npm test          # Run tests
npm run lint      # Lint code
npm run lint:fix  # Fix linting issues
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Helmet for security headers
- Rate limiting
- MongoDB injection prevention
- XSS protection
- CORS configuration
- Input validation

## 👥 User Roles

- **Admin** - Full access, manage all content
- **Manager** - Organization management, create content
- **User** - View content, use chat, track emissions

## 📧 Contact

**Author:** Jehiel Britstot Houmanou
**Email:** jehielbh@gmail.com
**Institution:** Advanced School of Systems and Data Studies (ASSDAS)
**Supervisor:** Mr Eugene Akoto

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Ghana Enterprises Agency (GEA)
- KNUST Net-Zero Carbon Emission Lab
- SME Climate Hub
- All participating Ghanaian SMEs

---

**Built for the fight towards Net Zero Carbon Emissions by 2050** 🌍
