# 🏍️ The Moto Saga - Admin Testing Quick Guide

## Quick Start for Admin Testing

**Platform URL:** https://saga-riders.preview.emergentagent.com

---

## 1. Create Admin Account (2 minutes)

### Option A: Via UI (Recommended)

**Step 1:** Create a regular account
1. Go to https://saga-riders.preview.emergentagent.com
2. Click **"Join Now"** button
3. Fill in the signup form:
   ```
   Name: Admin Test
   Email: admin@test.com
   Password: Admin123!
   Role: Rider (select this for now)
   ```
4. Click **"Join Now"**
5. You'll be automatically logged in

**Step 2:** Upgrade to Admin via MongoDB
```bash
# Connect to MongoDB
mongosh

# Switch to database
use moto_saga_db

# Update your account to admin role
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)

# Verify the change
db.users.findOne({ email: "admin@test.com" })
# Should show: role: "admin"
```

**Step 3:** Refresh the page
- You should now see the **"Create Event"** button and **Admin Shield icon**!

---

## 2. Test Admin Features (10 minutes)

### ✅ Test 1: Create Event (Admin Exclusive)

**Expected Behavior:** Only admins can create events

1. **As Admin:**
   - Look for **"Create Event"** button in the header (next to "New Story")
   - Click it
   - Fill in the form:
     ```
     Title: Test Mumbai Ride
     Event Type: Group Ride
     Date: [Pick any future date]
     Location: Marine Drive, Mumbai
     Max Attendees: 25
     Description: Testing admin event creation
     Image URL: (optional)
     ```
   - Click **"Create Event"**
   - ✅ Event should be created successfully
   - ✅ Event should appear in "Events" tab

2. **As Regular User:**
   - Logout from admin
   - Create/login as a regular rider account
   - ❌ "Create Event" button should NOT be visible
   - ✅ This confirms only admins can create events

---

### ✅ Test 2: Delete Any Story (Admin Privilege)

**Expected Behavior:** Admin can delete ANY user's story

1. **As Regular User:**
   - Login as a rider (not admin)
   - Click **"New Story"**
   - Create a test story:
     ```
     Title: My Weekend Ride
     Location: Lonavala
     Content: Had an amazing ride through the ghats!
     ```
   - Click **"Post Story"**
   - Note the story appears in feed

2. **As Admin:**
   - Logout from rider account
   - Login as admin
   - Find the rider's story in the Stories tab
   - Look for **trash icon** (🗑️) on the story card
   - Click the trash icon
   - Confirm deletion
   - ✅ Story should be deleted successfully
   - ✅ Even though admin didn't create it!

---

### ✅ Test 3: Delete Any Event (Admin Privilege)

**Expected Behavior:** Admin can delete ANY event

1. **As Admin:**
   - Create an event (as in Test 1)
   - Note the event ID

2. **As Regular User:**
   - Logout from admin
   - Login as rider
   - Go to Events tab
   - Click **"RSVP Now"** on the event
   - ✅ RSVP should work

3. **As Admin Again:**
   - Login as admin
   - Go to Events tab
   - Find ANY event (yours or anyone's)
   - Look for **trash icon** (🗑️) on the event card
   - Click the trash icon
   - Confirm deletion
   - ✅ Event should be deleted successfully

---

### ✅ Test 4: View Admin Dashboard

**Expected Behavior:** Admin sees platform statistics

1. **As Admin:**
   - Look for **Shield icon** (🛡️) in the header
   - Click it to open Admin Dashboard
   - You should see:
     ```
     ✅ Total Users: [count]
     ✅ Total Stories: [count]
     ✅ Total Events: [count]
     ✅ Users by Role breakdown (riders, clubs, creators, admins)
     ✅ Payment Management section (UI placeholder)
     ```

2. **As Regular User:**
   - Shield icon should NOT be visible
   - ✅ Confirms only admins have access

---

### ✅ Test 5: Verify Security (API Level)

**Test that regular users CANNOT bypass UI restrictions**

```bash
# Get a rider's token first
# Login as rider and copy the token from browser DevTools -> Application -> LocalStorage

# Try to create event as rider (should fail)
curl -X POST https://saga-riders.preview.emergentagent.com/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RIDER_TOKEN_HERE" \
  -d '{
    "title": "Unauthorized Event",
    "description": "This should fail",
    "date": "2025-02-01",
    "location": "Test",
    "eventType": "ride",
    "maxAttendees": 10
  }'

# Expected Response:
# {
#   "error": "Only administrators can create events"
# }
# Status: 403 Forbidden
```

✅ **If you get 403 error, security is working correctly!**

---

## 3. Feature Differences: Admin vs Regular User

### Admin Features ✅

| Feature | Admin | Rider | Club | Creator |
|---------|-------|-------|------|---------|
| Create Events | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Delete Any Story | ✅ YES | Own only | Own only | Own only |
| Delete Any Event | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| View Admin Dashboard | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Access Platform Stats | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Create Stories | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| RSVP to Events | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| Like Stories | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| Edit Profile | ✅ YES | ✅ YES | ✅ YES | ✅ YES |

---

## 4. Visual Indicators of Admin Access

When logged in as Admin, you should see:

### Header Buttons:
```
[Moon/Sun Icon] [Create Event] [New Story] [Shield Icon] [User Name] [Logout]
     ↑               ↑                           ↑
  Dark Mode    ADMIN ONLY              ADMIN DASHBOARD
```

### Story Cards:
```
[User Avatar] User Name
[Story Title]
[Story Content]
[Images]
[❤️ 5] [💬 2] [🗑️]  ← Trash icon visible on ALL stories
                      (for admin)
```

### Event Cards:
```
[Event Image]
[Event Title]
[Date] [Location] [Attendees]
[RSVP Button] [🗑️]  ← Trash icon visible on ALL events
                      (for admin)
```

---

## 5. Common Issues & Solutions

### Issue: "Create Event" button not visible

**Solution:**
```bash
# Check your role in database
mongosh
use moto_saga_db
db.users.findOne({ email: "your@email.com" })

# If role is not "admin", update it:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

# Then logout and login again
```

---

### Issue: Cannot delete stories/events

**Check:**
1. Are you logged in as admin?
2. Refresh the page after changing role
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in incognito mode

---

### Issue: Admin dashboard shows 0 for all stats

**This is normal if:**
- No users have signed up yet
- No stories created yet
- No events created yet

**Create some test data:**
1. Create 2-3 rider accounts
2. Create 2-3 stories
3. Create 1-2 events as admin
4. Check dashboard again - numbers should update

---

### Issue: Events not appearing after creation

**Debug:**
```bash
# Check if event was created in database
mongosh
use moto_saga_db
db.events.find().pretty()

# Check API response
curl https://saga-riders.preview.emergentagent.com/api/events

# Check browser console (F12) for errors
```

---

## 6. Admin Testing Checklist

Use this checklist to verify all admin features:

### Authentication & Authorization
- [ ] Can create admin account
- [ ] Can login with admin credentials
- [ ] Admin sees exclusive UI elements
- [ ] Regular users don't see admin UI elements

### Event Management
- [ ] Admin can create events
- [ ] Regular users CANNOT create events (UI)
- [ ] Regular users CANNOT create events (API - 403)
- [ ] Admin can delete any event
- [ ] Events display correctly on homepage
- [ ] Events display in Events tab

### Story Management
- [ ] Admin can create stories
- [ ] Admin can delete OWN stories
- [ ] Admin can delete ANY user's stories
- [ ] Deletion is instant (no page refresh needed)

### Admin Dashboard
- [ ] Shield icon visible in header
- [ ] Dashboard opens on click
- [ ] Shows accurate total users
- [ ] Shows accurate total stories
- [ ] Shows accurate total events
- [ ] Shows users by role breakdown
- [ ] Payment management section visible

### Security
- [ ] API blocks non-admins from creating events (403)
- [ ] API blocks non-admins from admin stats (401)
- [ ] JWT tokens expire after 7 days
- [ ] Logout works correctly

### User Experience
- [ ] Dark/Light mode toggle works
- [ ] All buttons clickable
- [ ] Forms submit correctly
- [ ] Images upload correctly
- [ ] RSVP functionality works
- [ ] Like functionality works

---

## 7. Sample Test Data

### Sample Users:
```
Admin:
  Email: admin@motosaga.com
  Password: Admin123!
  Role: admin

Rider 1:
  Email: rider1@test.com
  Password: Test123!
  Role: rider
  Bike: Royal Enfield Classic 350

Rider 2:
  Email: rider2@test.com
  Password: Test123!
  Role: rider
  Bike: KTM Duke 390

Club:
  Email: mumbai.riders@test.com
  Password: Test123!
  Role: club
  Club: Mumbai Riders Club
```

### Sample Events:
```
Event 1:
  Title: Weekend Ride to Lonavala
  Type: Group Ride
  Date: 2025-02-15
  Location: Mumbai to Lonavala
  Max Attendees: 25
  Description: Join us for a scenic ride through the Western Ghats

Event 2:
  Title: Track Day at BIC
  Type: Track Day
  Date: 2025-03-01
  Location: Buddh International Circuit
  Max Attendees: 50
  Description: Experience your bike on a world-class F1 track
```

### Sample Stories:
```
Story 1:
  Title: My First Himalayan Ride
  Location: Leh, Ladakh
  Content: Just completed my dream ride to Khardung La! The highest motorable pass in the world. Weather was challenging but the views were absolutely breathtaking.

Story 2:
  Title: City Ride with Friends
  Location: Bangalore
  Content: Sunday morning ride with the crew. Nandi Hills never disappoints! Perfect weather and great company.
```

---

## 8. Quick Command Reference

### View Database:
```bash
mongosh
use moto_saga_db
db.users.find().pretty()
db.stories.find().pretty()
db.events.find().pretty()
```

### Make User Admin:
```bash
mongosh
use moto_saga_db
db.users.updateOne(
  { email: "user@email.com" },
  { $set: { role: "admin" } }
)
```

### Check Logs:
```bash
# Application logs
tail -f /var/log/supervisor/nextjs.out.log

# Error logs
tail -f /var/log/supervisor/nextjs.err.log
```

### Test API:
```bash
# Get events
curl https://saga-riders.preview.emergentagent.com/api/events

# Get stories
curl https://saga-riders.preview.emergentagent.com/api/stories
```

---

## 🎉 Success Criteria

Your admin testing is successful if:

✅ You can create an admin account
✅ Admin sees "Create Event" button
✅ Admin can create events
✅ Regular users CANNOT create events
✅ Admin can delete any story
✅ Admin can delete any event
✅ Admin dashboard shows statistics
✅ Non-admins cannot access admin features
✅ All UI elements are clickable and responsive

---

## 📞 Need Help?

If something isn't working:

1. **Check your role:**
   ```bash
   mongosh
   use moto_saga_db
   db.users.findOne({ email: "your@email.com" })
   ```

2. **Check application logs:**
   ```bash
   tail -100 /var/log/supervisor/nextjs.out.log
   ```

3. **Clear cache and try again:**
   - Browser: Ctrl+Shift+Delete
   - Or use Incognito mode

4. **Verify MongoDB is running:**
   ```bash
   mongosh --eval "db.serverStatus()"
   ```

---

**Happy Testing! 🏍️**

The Moto Saga Platform - India's Premium Riding Community
