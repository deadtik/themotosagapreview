# The Moto Saga - Complete Deployment Guide

## 🏍️ Platform Overview

**The Moto Saga** is a full-stack motorcycle community platform built with:
- **Frontend & Backend:** Next.js 14 (App Router)
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Base64 encoding (MVP)
- **Styling:** Tailwind CSS + Shadcn UI

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Creating Admin Account](#creating-admin-account)
7. [Testing Admin Features](#testing-admin-features)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software:
- **Node.js** >= 18.0.0
- **Yarn** >= 1.22.0 (or npm >= 9.0.0)
- **MongoDB** >= 5.0.0

### Install Node.js & Yarn:
```bash
# Check if installed
node --version
yarn --version

# Install Node.js (if needed)
# Download from: https://nodejs.org/

# Install Yarn (if needed)
npm install -g yarn
```

### Install MongoDB:

**Option 1: Local MongoDB (Recommended for Development)**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# Download from: https://www.mongodb.com/try/download/community
```

**Option 2: MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string

---

## 2. Local Development Setup

### Step 1: Clone/Access the Repository
```bash
# Navigate to the app directory
cd /app
```

### Step 2: Install Dependencies
```bash
# Install all packages
yarn install

# Or using npm
npm install
```

### Step 3: Verify Installation
```bash
# Check package.json
cat package.json

# Verify node_modules
ls -la node_modules | head -20
```

---

## 3. Environment Variables

### Required Variables

Create/update `.env` file in `/app` directory:

```bash
# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=moto_saga_db

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CORS Settings
CORS_ORIGINS=*
```

### For Production:

```bash
# Database Configuration (MongoDB Atlas)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=moto_saga_production

# JWT Secret (MUST be strong and unique)
JWT_SECRET=<generate-strong-random-string-here>

# Application URL (Your domain)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# CORS Settings (Restrict to your domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Generate Strong JWT Secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

---

## 4. Database Setup

### Automatic Setup (Recommended)
The database collections are created automatically when you:
1. Start the application
2. Create your first user

MongoDB will create:
- Database: `moto_saga_db` (or your custom name)
- Collections: `users`, `stories`, `events`

### Manual MongoDB Verification:
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use your database
use moto_saga_db

# Show collections
show collections

# View users
db.users.find().pretty()

# View stories
db.stories.find().pretty()

# View events
db.events.find().pretty()
```

### Database Schema

**Users Collection:**
```javascript
{
  id: "uuid-string",
  email: "user@email.com",
  password: "hashed-password",
  name: "User Name",
  role: "rider|club|creator|admin",
  bio: "User bio",
  profileImage: "image-url",
  bikeInfo: "Bike details (for riders)",
  clubInfo: "Club details (for clubs)",
  createdAt: "ISO-8601-timestamp"
}
```

**Stories Collection:**
```javascript
{
  id: "uuid-string",
  userId: "creator-uuid",
  title: "Story Title",
  content: "Story content",
  location: "Location name",
  mediaUrls: ["image-url-1", "image-url-2"],
  likes: ["user-id-1", "user-id-2"],
  comments: [{
    id: "uuid",
    userId: "user-id",
    text: "comment",
    createdAt: "timestamp"
  }],
  createdAt: "ISO-8601-timestamp"
}
```

**Events Collection:**
```javascript
{
  id: "uuid-string",
  creatorId: "admin-uuid",
  title: "Event Title",
  description: "Event description",
  date: "ISO-8601-timestamp",
  location: "Event location",
  eventType: "ride|trackday|meetup|festival",
  maxAttendees: 0,
  imageUrl: "event-image-url",
  rsvps: ["user-id-1", "user-id-2"],
  createdAt: "ISO-8601-timestamp"
}
```

---

## 5. Running the Application

### Development Mode:
```bash
# Start the development server
cd /app
yarn dev

# Or using npm
npm run dev

# Application will be available at:
# http://localhost:3000
```

### Production Mode:
```bash
# Build the application
yarn build

# Start production server
yarn start

# Or using npm
npm run build
npm start
```

### Using PM2 (Recommended for Production):
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start yarn --name "moto-saga" -- start

# Or if using npm
pm2 start npm --name "moto-saga" -- start

# View logs
pm2 logs moto-saga

# Monitor
pm2 monit

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Check Application Status:
```bash
# Check if app is running
curl http://localhost:3000

# Check API health
curl http://localhost:3000/api/stories

# Check logs (if using PM2)
pm2 logs moto-saga --lines 100
```

---

## 6. Creating Admin Account

### Method 1: Via UI + Manual Database Update (Recommended)

**Step 1: Create Regular Account**
1. Go to http://localhost:3000
2. Click "Join Now"
3. Fill in the form:
   - Name: Admin User
   - Email: admin@motosaga.com
   - Password: YourSecurePassword123
   - Role: Select "Rider" (we'll change this)
4. Click "Join Now"

**Step 2: Update Role to Admin**
```bash
# Connect to MongoDB
mongosh

# Use your database
use moto_saga_db

# Update user role to admin
db.users.updateOne(
  { email: "admin@motosaga.com" },
  { $set: { role: "admin" } }
)

# Verify the update
db.users.findOne({ email: "admin@motosaga.com" })
```

**Step 3: Log in as Admin**
1. Logout if logged in
2. Click "Sign In"
3. Enter admin credentials
4. You should now see admin features!

### Method 2: Direct API Call

```bash
# Create admin user via API
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@motosaga.com",
    "password": "SecurePassword123!",
    "name": "Platform Admin",
    "role": "admin",
    "bio": "Platform Administrator"
  }'

# Save the token from the response
# Then login:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@motosaga.com",
    "password": "SecurePassword123!"
  }'
```

**Note:** The signup endpoint accepts any role during signup. In production, you may want to restrict this to only allow "rider", "club", "creator" and manually promote to "admin".

---

## 7. Testing Admin Features

### Admin Panel Access

Once logged in as admin, you should see:
1. **"Create Event" button** - In the header (not visible to regular users)
2. **Admin icon (shield)** - Click to open admin dashboard
3. **Delete buttons** - On all stories and events (trash icons)

### Test Checklist:

#### ✅ Test 1: Create Event (Admin Only)
1. Login as admin
2. Click "Create Event" button in header
3. Fill in event details:
   - Title: "Test Ride to Goa"
   - Event Type: "Group Ride"
   - Date: Select future date
   - Location: "Mumbai"
   - Description: "Weekend ride to Goa"
   - Max Attendees: 20
4. Click "Create Event"
5. Verify event appears on homepage and events tab

**Expected:** Event created successfully ✅

#### ✅ Test 2: Regular User Cannot Create Events
1. Logout admin
2. Create/login as regular rider
3. Verify "Create Event" button is NOT visible
4. Try API call:
```bash
# Login as rider first, save token
RIDER_TOKEN="your-rider-token-here"

# Try to create event (should fail)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RIDER_TOKEN" \
  -d '{
    "title": "Unauthorized Event",
    "description": "This should fail",
    "date": "2025-02-01",
    "location": "Test",
    "eventType": "ride",
    "maxAttendees": 10
  }'
```

**Expected:** 403 Error with message "Only administrators can create events" ✅

#### ✅ Test 3: Admin Can Delete Any Story
1. Login as regular rider
2. Create a story with image
3. Logout, login as admin
4. Find the rider's story
5. Click trash icon on the story
6. Confirm deletion

**Expected:** Story deleted successfully even though admin is not the owner ✅

#### ✅ Test 4: Admin Can Delete Any Event
1. Login as admin
2. Create an event
3. Logout, login as rider
4. RSVP to the event
5. Logout, login as admin again
6. Click trash icon on any event
7. Confirm deletion

**Expected:** Event deleted successfully ✅

#### ✅ Test 5: Admin Dashboard Statistics
1. Login as admin
2. Click admin icon (shield) in header
3. View statistics:
   - Total Users count
   - Total Stories count
   - Total Events count
   - Users by role breakdown

**Expected:** Dashboard shows accurate platform statistics ✅

#### ✅ Test 6: Regular User Cannot Access Admin Stats
```bash
# Login as rider first, save token
RIDER_TOKEN="your-rider-token-here"

# Try to access admin stats (should fail)
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer $RIDER_TOKEN"
```

**Expected:** 401 Unauthorized error ✅

### Full Admin Test Script:

```bash
#!/bin/bash
# Save as test_admin.sh

BASE_URL="http://localhost:3000/api"

echo "🔐 Testing Admin Features..."

# 1. Create Admin
echo "1. Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@motosaga.com",
    "password": "Admin123!",
    "name": "Test Admin",
    "role": "admin"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.token')
echo "✅ Admin token: ${ADMIN_TOKEN:0:20}..."

# 2. Create Rider
echo "2. Creating rider user..."
RIDER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testrider@motosaga.com",
    "password": "Rider123!",
    "name": "Test Rider",
    "role": "rider",
    "bikeInfo": "Royal Enfield Classic 350"
  }')

RIDER_TOKEN=$(echo $RIDER_RESPONSE | jq -r '.token')
echo "✅ Rider token: ${RIDER_TOKEN:0:20}..."

# 3. Admin creates event (should work)
echo "3. Admin creating event..."
curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Admin Test Event",
    "description": "Testing admin privileges",
    "date": "2025-02-15T10:00:00Z",
    "location": "Mumbai",
    "eventType": "ride",
    "maxAttendees": 20
  }' | jq

# 4. Rider tries to create event (should fail)
echo "4. Rider trying to create event (should fail)..."
curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RIDER_TOKEN" \
  -d '{
    "title": "Rider Test Event",
    "description": "This should fail",
    "date": "2025-02-20T10:00:00Z",
    "location": "Delhi",
    "eventType": "ride"
  }' | jq

# 5. Admin gets stats (should work)
echo "5. Admin accessing dashboard stats..."
curl -s -X GET $BASE_URL/admin/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 6. Rider gets stats (should fail)
echo "6. Rider trying to access stats (should fail)..."
curl -s -X GET $BASE_URL/admin/stats \
  -H "Authorization: Bearer $RIDER_TOKEN" | jq

echo "✅ Admin tests complete!"
```

Run the script:
```bash
chmod +x test_admin.sh
./test_admin.sh
```

---

## 8. Production Deployment

### Option 1: Vercel (Recommended for Next.js)

**Prerequisites:**
- GitHub/GitLab account
- Vercel account (https://vercel.com)
- MongoDB Atlas account

**Steps:**

1. **Push Code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/moto-saga.git
git push -u origin main
```

2. **Connect to Vercel:**
- Go to https://vercel.com
- Click "Import Project"
- Select your repository
- Configure:
  - Framework: Next.js
  - Root Directory: /app
  - Build Command: `yarn build`
  - Output Directory: `.next`

3. **Add Environment Variables:**
In Vercel dashboard:
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=moto_saga_production
JWT_SECRET=your-super-secret-jwt-key-64-chars-long
NEXT_PUBLIC_BASE_URL=https://yourdomain.vercel.app
CORS_ORIGINS=https://yourdomain.vercel.app
```

4. **Deploy:**
- Click "Deploy"
- Wait for deployment to complete
- Visit your live URL!

### Option 2: Docker Deployment

**Create Dockerfile:**
```dockerfile
# /app/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy app files
COPY . .

# Build Next.js
RUN yarn build

# Expose port
EXPOSE 3000

# Start app
CMD ["yarn", "start"]
```

**Create docker-compose.yml:**
```yaml
# /app/docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - DB_NAME=moto_saga_db
      - JWT_SECRET=your-secret-key
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

**Deploy with Docker:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: VPS/Cloud Server (DigitalOcean, AWS, etc.)

**On Your Server:**

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install Yarn
npm install -g yarn

# 3. Install MongoDB
# Follow instructions from: https://www.mongodb.com/docs/manual/installation/

# 4. Install PM2
npm install -g pm2

# 5. Clone your code
git clone https://github.com/yourusername/moto-saga.git
cd moto-saga/app

# 6. Install dependencies
yarn install

# 7. Create .env file
nano .env
# Add your environment variables

# 8. Build
yarn build

# 9. Start with PM2
pm2 start yarn --name "moto-saga" -- start
pm2 save
pm2 startup

# 10. Setup Nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/moto-saga
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/moto-saga /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 9. Troubleshooting

### Issue: Application won't start

**Check:**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Check MongoDB connection
mongosh --eval "db.serverStatus()"

# Check environment variables
cat /app/.env

# Check logs
tail -f /var/log/supervisor/nextjs.out.log
tail -f /var/log/supervisor/nextjs.err.log
```

### Issue: Cannot create admin user

**Solution:**
```bash
# Connect to MongoDB
mongosh

# Use your database
use moto_saga_db

# Manually update role
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ email: "youremail@example.com" })
```

### Issue: Events not showing

**Check:**
```bash
# Verify events in database
mongosh
use moto_saga_db
db.events.find().pretty()

# Check API response
curl http://localhost:3000/api/events

# Check frontend console
# Open browser DevTools (F12) and check for errors
```

### Issue: File uploads not working

**Note:** Current implementation uses base64 encoding, which has limitations:
- Maximum file size: ~10MB recommended
- Large files may cause performance issues

**For production:** Consider implementing:
- AWS S3 for file storage
- Cloudinary for image optimization
- Or another CDN solution

### Issue: JWT token expired

**Solution:**
```bash
# Token expires after 7 days by default
# User needs to login again
# Or increase expiry in /app/app/api/[[...path]]/route.js:
# Change: expiresIn: '7d' to expiresIn: '30d'
```

### Issue: Dark mode not persisting

**Check:**
- LocalStorage must be enabled in browser
- Clear browser cache and try again
- Check browser console for errors

### Getting Help:

1. Check application logs
2. Check browser console (F12)
3. Verify environment variables
4. Test API endpoints directly with curl
5. Check MongoDB connection and data

---

## 📞 Support

For issues or questions:
- Check logs first
- Verify all environment variables
- Test API endpoints independently
- Check MongoDB data structure

---

## 🎉 Success Checklist

- [ ] MongoDB running and accessible
- [ ] Application starts without errors
- [ ] Can create regular user account
- [ ] Can create admin account
- [ ] Admin can see "Create Event" button
- [ ] Admin can create events
- [ ] Regular users cannot create events
- [ ] Admin can delete any content
- [ ] Admin dashboard shows statistics
- [ ] Stories and events display correctly
- [ ] RSVP functionality works
- [ ] Dark/Light mode toggle works
- [ ] All clicks are responsive

---

**Congratulations! The Moto Saga platform is deployed and ready! 🏍️**
