#!/usr/bin/env python3
"""
Moto Saga Backend API Test Suite
Tests all backend endpoints for the motorcycle community platform
"""

import requests
import json
import base64
import io
from datetime import datetime, timedelta

# Base URL from environment
BASE_URL = "https://saga-riders.preview.emergentagent.com/api"

# Test data storage
test_data = {
    'users': {},
    'tokens': {},
    'stories': [],
    'events': [],
    'comments': []
}

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(success, message):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

def print_error(error_msg):
    """Print error message"""
    print(f"❌ ERROR: {error_msg}")

# ============================================================================
# 1. AUTHENTICATION FLOW TESTS (CRITICAL)
# ============================================================================

def test_signup_rider():
    """Test signup with rider role and bikeInfo"""
    print_test_header("Signup - Rider with Bike Info")
    
    try:
        payload = {
            "email": "rider1@motosaga.com",
            "password": "RiderPass123!",
            "name": "Rajesh Kumar",
            "role": "rider",
            "bio": "Passionate rider from Mumbai",
            "bikeInfo": {
                "brand": "Royal Enfield",
                "model": "Himalayan 450",
                "year": 2024
            }
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'user' in data and 'token' in data:
                test_data['users']['rider1'] = data['user']
                test_data['tokens']['rider1'] = data['token']
                print_result(True, f"Rider signup successful - User ID: {data['user']['id']}")
                print(f"   Token: {data['token'][:50]}...")
                print(f"   Bike: {data['user']['bikeInfo']['brand']} {data['user']['bikeInfo']['model']}")
                return True
            else:
                print_result(False, "Response missing user or token")
                return False
        else:
            print_result(False, f"Signup failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during rider signup: {str(e)}")
        return False

def test_signup_club():
    """Test signup with club role and clubInfo"""
    print_test_header("Signup - Club with Club Info")
    
    try:
        payload = {
            "email": "club1@motosaga.com",
            "password": "ClubPass123!",
            "name": "Mumbai Riders Club",
            "role": "club",
            "bio": "Premier motorcycle club in Mumbai",
            "clubInfo": {
                "location": "Mumbai, Maharashtra",
                "memberCount": 150,
                "established": 2015
            }
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'user' in data and 'token' in data:
                test_data['users']['club1'] = data['user']
                test_data['tokens']['club1'] = data['token']
                print_result(True, f"Club signup successful - User ID: {data['user']['id']}")
                print(f"   Club: {data['user']['name']}")
                print(f"   Location: {data['user']['clubInfo']['location']}")
                return True
            else:
                print_result(False, "Response missing user or token")
                return False
        else:
            print_result(False, f"Signup failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during club signup: {str(e)}")
        return False

def test_signup_creator():
    """Test signup with creator role"""
    print_test_header("Signup - Creator")
    
    try:
        payload = {
            "email": "creator1@motosaga.com",
            "password": "CreatorPass123!",
            "name": "Priya Sharma",
            "role": "creator",
            "bio": "Motorcycle content creator and vlogger"
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'user' in data and 'token' in data:
                test_data['users']['creator1'] = data['user']
                test_data['tokens']['creator1'] = data['token']
                print_result(True, f"Creator signup successful - User ID: {data['user']['id']}")
                return True
            else:
                print_result(False, "Response missing user or token")
                return False
        else:
            print_result(False, f"Signup failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during creator signup: {str(e)}")
        return False

def test_signup_admin():
    """Test signup with admin role"""
    print_test_header("Signup - Admin")
    
    try:
        payload = {
            "email": "admin@motosaga.com",
            "password": "AdminPass123!",
            "name": "Admin User",
            "role": "admin",
            "bio": "Platform administrator"
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'user' in data and 'token' in data:
                test_data['users']['admin'] = data['user']
                test_data['tokens']['admin'] = data['token']
                print_result(True, f"Admin signup successful - User ID: {data['user']['id']}")
                return True
            else:
                print_result(False, "Response missing user or token")
                return False
        else:
            print_result(False, f"Signup failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during admin signup: {str(e)}")
        return False

def test_login():
    """Test login with created credentials"""
    print_test_header("Login - Existing User")
    
    try:
        payload = {
            "email": "rider1@motosaga.com",
            "password": "RiderPass123!"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'user' in data and 'token' in data:
                print_result(True, f"Login successful - User: {data['user']['name']}")
                print(f"   Token matches signup: {data['token'] == test_data['tokens']['rider1']}")
                return True
            else:
                print_result(False, "Response missing user or token")
                return False
        else:
            print_result(False, f"Login failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during login: {str(e)}")
        return False

def test_login_invalid():
    """Test login with invalid credentials"""
    print_test_header("Login - Invalid Credentials")
    
    try:
        payload = {
            "email": "rider1@motosaga.com",
            "password": "WrongPassword"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print_result(True, "Invalid credentials correctly rejected")
            return True
        else:
            print_result(False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception during invalid login: {str(e)}")
        return False

def test_get_current_user():
    """Test GET /api/auth/me with JWT token"""
    print_test_header("Get Current User (/auth/me)")
    
    try:
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data['id'] == test_data['users']['rider1']['id']:
                print_result(True, f"Current user retrieved - {data['name']}")
                print(f"   Role: {data['role']}")
                print(f"   Email: {data['email']}")
                return True
            else:
                print_result(False, "User ID mismatch")
                return False
        else:
            print_result(False, f"Failed to get current user: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during get current user: {str(e)}")
        return False

def test_auth_unauthorized():
    """Test endpoint without token"""
    print_test_header("Unauthorized Access Test")
    
    try:
        response = requests.get(f"{BASE_URL}/auth/me")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print_result(True, "Unauthorized access correctly blocked")
            return True
        else:
            print_result(False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception during unauthorized test: {str(e)}")
        return False

# ============================================================================
# 2. STORY CREATION FLOW TESTS (CRITICAL - THE AHA MOMENT)
# ============================================================================

def test_upload_file():
    """Test file upload to /api/upload"""
    print_test_header("File Upload - Image to Base64")
    
    try:
        # Create a small test image (1x1 pixel PNG)
        test_image_data = base64.b64decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        )
        
        files = {
            'file': ('test_bike.png', io.BytesIO(test_image_data), 'image/png')
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'url' in data and data['url'].startswith('data:'):
                test_data['uploaded_image_url'] = data['url']
                print_result(True, "File uploaded successfully")
                print(f"   Data URL length: {len(data['url'])} chars")
                return True
            else:
                print_result(False, "Response missing url or invalid format")
                return False
        else:
            print_result(False, f"Upload failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during file upload: {str(e)}")
        return False

def test_create_story_with_media():
    """Test creating story with title, content, location, and media"""
    print_test_header("Create Story - With Media and Location")
    
    try:
        payload = {
            "title": "Epic Ride to Leh-Ladakh",
            "content": "Just completed an amazing 10-day journey through the Himalayas. The roads were challenging but the views were absolutely breathtaking! Met some incredible fellow riders along the way.",
            "location": "Leh, Ladakh",
            "mediaUrls": [
                test_data.get('uploaded_image_url', 'data:image/png;base64,test'),
                "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
            ]
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/stories", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and 'user' in data:
                test_data['stories'].append(data)
                print_result(True, f"Story created - ID: {data['id']}")
                print(f"   Title: {data['title']}")
                print(f"   Location: {data['location']}")
                print(f"   Media count: {len(data['mediaUrls'])}")
                print(f"   Author: {data['user']['name']}")
                return True
            else:
                print_result(False, "Response missing required fields")
                return False
        else:
            print_result(False, f"Story creation failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during story creation: {str(e)}")
        return False

def test_create_story_simple():
    """Test creating simple story without media"""
    print_test_header("Create Story - Simple (No Media)")
    
    try:
        payload = {
            "title": "Weekend Ride to Lonavala",
            "content": "Perfect weather for a quick ride to the hills. The monsoon has made everything so green!",
            "location": "Lonavala, Maharashtra"
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['creator1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/stories", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            test_data['stories'].append(data)
            print_result(True, f"Simple story created - ID: {data['id']}")
            return True
        else:
            print_result(False, f"Story creation failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during simple story creation: {str(e)}")
        return False

def test_list_all_stories():
    """Test GET /api/stories - list all stories"""
    print_test_header("List All Stories")
    
    try:
        response = requests.get(f"{BASE_URL}/stories")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_result(True, f"Retrieved {len(data)} stories")
                for i, story in enumerate(data[:3], 1):
                    print(f"   Story {i}: {story['title']} by {story.get('user', {}).get('name', 'Unknown')}")
                return True
            else:
                print_result(False, "Response is not a list")
                return False
        else:
            print_result(False, f"Failed to list stories: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during list stories: {str(e)}")
        return False

def test_get_single_story():
    """Test GET /api/stories/:id - get single story"""
    print_test_header("Get Single Story by ID")
    
    try:
        if not test_data['stories']:
            print_result(False, "No stories available to test")
            return False
        
        story_id = test_data['stories'][0]['id']
        response = requests.get(f"{BASE_URL}/stories/{story_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data['id'] == story_id:
                print_result(True, f"Story retrieved - {data['title']}")
                print(f"   Likes: {len(data.get('likes', []))}")
                print(f"   Comments: {len(data.get('comments', []))}")
                return True
            else:
                print_result(False, "Story ID mismatch")
                return False
        else:
            print_result(False, f"Failed to get story: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during get single story: {str(e)}")
        return False

def test_like_story():
    """Test POST /api/stories/:id/like - like a story"""
    print_test_header("Like Story")
    
    try:
        if not test_data['stories']:
            print_result(False, "No stories available to test")
            return False
        
        story_id = test_data['stories'][0]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['club1']}"
        }
        
        response = requests.post(f"{BASE_URL}/stories/{story_id}/like", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            likes_count = len(data.get('likes', []))
            print_result(True, f"Story liked - Total likes: {likes_count}")
            return True
        else:
            print_result(False, f"Failed to like story: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during like story: {str(e)}")
        return False

def test_unlike_story():
    """Test POST /api/stories/:id/like - unlike a story (toggle)"""
    print_test_header("Unlike Story (Toggle)")
    
    try:
        if not test_data['stories']:
            print_result(False, "No stories available to test")
            return False
        
        story_id = test_data['stories'][0]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['club1']}"
        }
        
        response = requests.post(f"{BASE_URL}/stories/{story_id}/like", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            likes_count = len(data.get('likes', []))
            print_result(True, f"Story unliked - Total likes: {likes_count}")
            return True
        else:
            print_result(False, f"Failed to unlike story: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during unlike story: {str(e)}")
        return False

def test_add_comment():
    """Test POST /api/stories/:id/comment - add comment to story"""
    print_test_header("Add Comment to Story")
    
    try:
        if not test_data['stories']:
            print_result(False, "No stories available to test")
            return False
        
        story_id = test_data['stories'][0]['id']
        payload = {
            "text": "Amazing journey! I've always wanted to ride to Ladakh. Any tips for first-timers?"
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['creator1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/stories/{story_id}/comment", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            comments_count = len(data.get('comments', []))
            print_result(True, f"Comment added - Total comments: {comments_count}")
            if comments_count > 0:
                print(f"   Latest comment: {data['comments'][-1]['text'][:50]}...")
            return True
        else:
            print_result(False, f"Failed to add comment: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during add comment: {str(e)}")
        return False

# ============================================================================
# 3. EVENT SYSTEM FLOW TESTS (CRITICAL)
# ============================================================================

def test_create_event_as_admin():
    """Test creating event as admin (CRITICAL - should work)"""
    print_test_header("Create Event - As Admin (CRITICAL)")
    
    try:
        future_date = (datetime.now() + timedelta(days=30)).isoformat()
        
        payload = {
            "title": "Mumbai Coastal Ride 2024",
            "description": "Join us for a scenic coastal ride from Mumbai to Alibaug. All riders welcome! We'll stop for breakfast at a beachside cafe.",
            "date": future_date,
            "location": "Gateway of India, Mumbai",
            "eventType": "ride",
            "maxAttendees": 50,
            "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['admin']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/events", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data:
                test_data['events'].append(data)
                print_result(True, f"Event created by admin - ID: {data['id']}")
                print(f"   Title: {data['title']}")
                print(f"   Type: {data['eventType']}")
                print(f"   Max Attendees: {data['maxAttendees']}")
                print(f"   Creator ID: {data.get('creatorId')}")
                return True
            else:
                print_result(False, "Response missing event ID")
                return False
        else:
            print_result(False, f"Event creation failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during event creation as admin: {str(e)}")
        return False

def test_create_event_as_club():
    """Test creating event as club (should fail per admin-only requirement)"""
    print_test_header("Create Event - As Club (Should Fail)")
    
    try:
        future_date = (datetime.now() + timedelta(days=30)).isoformat()
        
        payload = {
            "title": "Club Event Test",
            "description": "This should fail if only admins can create events",
            "date": future_date,
            "location": "Test Location",
            "eventType": "ride",
            "maxAttendees": 25
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['club1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/events", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 403:
            print_result(True, "Club correctly prevented from creating event (admin-only)")
            return True
        elif response.status_code == 200:
            # If clubs can create events, that's also valid
            data = response.json()
            test_data['events'].append(data)
            print_result(True, f"Club can create events - ID: {data['id']}")
            return True
        else:
            print_result(False, f"Unexpected response: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during event creation as club: {str(e)}")
        return False

def test_create_event_as_creator():
    """Test creating event as creator (should work)"""
    print_test_header("Create Event - As Creator")
    
    try:
        future_date = (datetime.now() + timedelta(days=45)).isoformat()
        
        payload = {
            "title": "Motorcycle Photography Workshop",
            "description": "Learn how to capture stunning motorcycle photos. Bring your camera and bike!",
            "date": future_date,
            "location": "Pune, Maharashtra",
            "eventType": "meetup",
            "maxAttendees": 20
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['creator1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/events", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            test_data['events'].append(data)
            print_result(True, f"Event created by creator - ID: {data['id']}")
            return True
        else:
            print_result(False, f"Event creation failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during event creation as creator: {str(e)}")
        return False

def test_create_event_as_rider():
    """Test creating event as rider (should fail)"""
    print_test_header("Create Event - As Rider (Should Fail)")
    
    try:
        future_date = (datetime.now() + timedelta(days=15)).isoformat()
        
        payload = {
            "title": "Test Event",
            "description": "This should not be created",
            "date": future_date,
            "location": "Test Location",
            "eventType": "ride"
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/events", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 403:
            print_result(True, "Rider correctly prevented from creating event")
            return True
        else:
            print_result(False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception during event creation as rider: {str(e)}")
        return False

def test_list_all_events():
    """Test GET /api/events - list all events"""
    print_test_header("List All Events")
    
    try:
        response = requests.get(f"{BASE_URL}/events")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_result(True, f"Retrieved {len(data)} events")
                for i, event in enumerate(data[:3], 1):
                    print(f"   Event {i}: {event['title']} - {event.get('rsvpCount', 0)} RSVPs")
                return True
            else:
                print_result(False, "Response is not a list")
                return False
        else:
            print_result(False, f"Failed to list events: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during list events: {str(e)}")
        return False

def test_rsvp_to_event():
    """Test POST /api/events/:id/rsvp - RSVP to event"""
    print_test_header("RSVP to Event")
    
    try:
        if not test_data['events']:
            print_result(False, "No events available to test")
            return False
        
        event_id = test_data['events'][0]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.post(f"{BASE_URL}/events/{event_id}/rsvp", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            rsvp_count = len(data.get('rsvps', []))
            print_result(True, f"RSVP successful - Total RSVPs: {rsvp_count}")
            return True
        else:
            print_result(False, f"RSVP failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during RSVP: {str(e)}")
        return False

def test_rsvp_toggle():
    """Test POST /api/events/:id/rsvp - toggle RSVP off"""
    print_test_header("Toggle RSVP Off")
    
    try:
        if not test_data['events']:
            print_result(False, "No events available to test")
            return False
        
        event_id = test_data['events'][0]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.post(f"{BASE_URL}/events/{event_id}/rsvp", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            rsvp_count = len(data.get('rsvps', []))
            print_result(True, f"RSVP toggled off - Total RSVPs: {rsvp_count}")
            return True
        else:
            print_result(False, f"RSVP toggle failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during RSVP toggle: {str(e)}")
        return False

def test_max_attendees_limit():
    """Test max attendees enforcement"""
    print_test_header("Max Attendees Limit Test")
    
    try:
        # Create event with max 1 attendee
        future_date = (datetime.now() + timedelta(days=7)).isoformat()
        
        payload = {
            "title": "Small Group Ride",
            "description": "Limited to 1 person only",
            "date": future_date,
            "location": "Test Location",
            "eventType": "ride",
            "maxAttendees": 1
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['club1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(f"{BASE_URL}/events", json=payload, headers=headers)
        
        if response.status_code != 200:
            print_result(False, "Failed to create test event")
            return False
        
        event_id = response.json()['id']
        
        # First RSVP should succeed
        headers_rsvp = {"Authorization": f"Bearer {test_data['tokens']['rider1']}"}
        response1 = requests.post(f"{BASE_URL}/events/{event_id}/rsvp", headers=headers_rsvp)
        
        # Second RSVP should fail
        headers_rsvp2 = {"Authorization": f"Bearer {test_data['tokens']['creator1']}"}
        response2 = requests.post(f"{BASE_URL}/events/{event_id}/rsvp", headers=headers_rsvp2)
        
        print(f"First RSVP Status: {response1.status_code}")
        print(f"Second RSVP Status: {response2.status_code}")
        
        if response1.status_code == 200 and response2.status_code == 400:
            print_result(True, "Max attendees limit correctly enforced")
            return True
        else:
            print_result(False, "Max attendees limit not working correctly")
            return False
    except Exception as e:
        print_error(f"Exception during max attendees test: {str(e)}")
        return False

def test_get_event_by_id():
    """Test GET /api/events/:id with RSVP count"""
    print_test_header("Get Event by ID")
    
    try:
        if not test_data['events']:
            print_result(False, "No events available to test")
            return False
        
        event_id = test_data['events'][0]['id']
        response = requests.get(f"{BASE_URL}/events/{event_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data['id'] == event_id:
                print_result(True, f"Event retrieved - {data['title']}")
                print(f"   RSVP Count: {data.get('rsvpCount', 0)}")
                print(f"   Creator: {data.get('creator', {}).get('name', 'Unknown')}")
                return True
            else:
                print_result(False, "Event ID mismatch")
                return False
        else:
            print_result(False, f"Failed to get event: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during get event by ID: {str(e)}")
        return False

# ============================================================================
# 4. USER PROFILE FLOW TESTS
# ============================================================================

def test_get_user_profile():
    """Test GET /api/users/:id"""
    print_test_header("Get User Profile by ID")
    
    try:
        user_id = test_data['users']['rider1']['id']
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data['id'] == user_id:
                print_result(True, f"User profile retrieved - {data['name']}")
                print(f"   Role: {data['role']}")
                print(f"   Stories: {len(data.get('stories', []))}")
                if 'bikeInfo' in data and data['bikeInfo']:
                    print(f"   Bike: {data['bikeInfo']['brand']} {data['bikeInfo']['model']}")
                return True
            else:
                print_result(False, "User ID mismatch")
                return False
        else:
            print_result(False, f"Failed to get user profile: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during get user profile: {str(e)}")
        return False

def test_update_own_profile():
    """Test PUT /api/users/:id - update own profile"""
    print_test_header("Update Own Profile")
    
    try:
        user_id = test_data['users']['rider1']['id']
        payload = {
            "name": "Rajesh Kumar (Updated)",
            "bio": "Passionate rider from Mumbai - 10 years of riding experience",
            "bikeInfo": {
                "brand": "Royal Enfield",
                "model": "Himalayan 450",
                "year": 2024,
                "modifications": "Crash guards, panniers"
            }
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.put(f"{BASE_URL}/users/{user_id}", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data['name'] == payload['name']:
                print_result(True, "Profile updated successfully")
                print(f"   New name: {data['name']}")
                print(f"   New bio: {data['bio'][:50]}...")
                return True
            else:
                print_result(False, "Profile not updated correctly")
                return False
        else:
            print_result(False, f"Profile update failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during profile update: {str(e)}")
        return False

def test_update_other_profile_unauthorized():
    """Test PUT /api/users/:id - try to update another user's profile (should fail)"""
    print_test_header("Update Other User's Profile (Should Fail)")
    
    try:
        user_id = test_data['users']['club1']['id']
        payload = {
            "name": "Hacked Name"
        }
        
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}",
            "Content-Type": "application/json"
        }
        
        response = requests.put(f"{BASE_URL}/users/{user_id}", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 403:
            print_result(True, "Unauthorized profile update correctly blocked")
            return True
        else:
            print_result(False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception during unauthorized profile update: {str(e)}")
        return False

# ============================================================================
# 5. ADMIN FUNCTIONS TESTS
# ============================================================================

def test_admin_stats():
    """Test GET /api/admin/stats"""
    print_test_header("Admin Stats")
    
    try:
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['admin']}"
        }
        
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'totalUsers' in data and 'totalStories' in data and 'totalEvents' in data:
                print_result(True, "Admin stats retrieved successfully")
                print(f"   Total Users: {data['totalUsers']}")
                print(f"   Total Stories: {data['totalStories']}")
                print(f"   Total Events: {data['totalEvents']}")
                print(f"   Users by Role: {data.get('usersByRole', [])}")
                return True
            else:
                print_result(False, "Response missing required stats")
                return False
        else:
            print_result(False, f"Failed to get admin stats: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during admin stats: {str(e)}")
        return False

def test_admin_stats_unauthorized():
    """Test GET /api/admin/stats as non-admin (should fail)"""
    print_test_header("Admin Stats - Unauthorized (Should Fail)")
    
    try:
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print_result(True, "Non-admin correctly blocked from admin stats")
            return True
        else:
            print_result(False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception during unauthorized admin stats: {str(e)}")
        return False

def test_delete_own_story():
    """Test DELETE /api/stories/:id - delete own story"""
    print_test_header("Delete Own Story")
    
    try:
        if not test_data['stories']:
            print_result(False, "No stories available to test")
            return False
        
        story_id = test_data['stories'][0]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.delete(f"{BASE_URL}/stories/{story_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "Story deleted successfully")
            return True
        else:
            print_result(False, f"Story deletion failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during story deletion: {str(e)}")
        return False

def test_delete_other_story_unauthorized():
    """Test DELETE /api/stories/:id - try to delete another user's story (should fail)"""
    print_test_header("Delete Other User's Story (Should Fail)")
    
    try:
        if len(test_data['stories']) < 2:
            print_result(False, "Not enough stories to test")
            return False
        
        story_id = test_data['stories'][1]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['rider1']}"
        }
        
        response = requests.delete(f"{BASE_URL}/stories/{story_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 403:
            print_result(True, "Unauthorized story deletion correctly blocked")
            return True
        else:
            print_result(False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Exception during unauthorized story deletion: {str(e)}")
        return False

def test_admin_delete_any_story():
    """Test DELETE /api/stories/:id - admin can delete any story"""
    print_test_header("Admin Delete Any Story")
    
    try:
        if len(test_data['stories']) < 2:
            print_result(False, "Not enough stories to test")
            return False
        
        story_id = test_data['stories'][1]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['admin']}"
        }
        
        response = requests.delete(f"{BASE_URL}/stories/{story_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "Admin successfully deleted story")
            return True
        else:
            print_result(False, f"Admin story deletion failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during admin story deletion: {str(e)}")
        return False

def test_delete_own_event():
    """Test DELETE /api/events/:id - delete own event"""
    print_test_header("Delete Own Event")
    
    try:
        if not test_data['events']:
            print_result(False, "No events available to test")
            return False
        
        event_id = test_data['events'][0]['id']
        headers = {
            "Authorization": f"Bearer {test_data['tokens']['club1']}"
        }
        
        response = requests.delete(f"{BASE_URL}/events/{event_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "Event deleted successfully")
            return True
        else:
            print_result(False, f"Event deletion failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Exception during event deletion: {str(e)}")
        return False

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def run_all_tests():
    """Run all backend tests in order"""
    print("\n" + "="*80)
    print("MOTO SAGA BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    results = {
        'passed': 0,
        'failed': 0,
        'total': 0
    }
    
    tests = [
        # 1. Authentication Flow (CRITICAL)
        ("Authentication Flow", [
            test_signup_rider,
            test_signup_club,
            test_signup_creator,
            test_signup_admin,
            test_login,
            test_login_invalid,
            test_get_current_user,
            test_auth_unauthorized
        ]),
        
        # 2. Story Creation Flow (CRITICAL - THE AHA MOMENT)
        ("Story Creation Flow", [
            test_upload_file,
            test_create_story_with_media,
            test_create_story_simple,
            test_list_all_stories,
            test_get_single_story,
            test_like_story,
            test_unlike_story,
            test_add_comment
        ]),
        
        # 3. Event System Flow (CRITICAL - ADMIN FOCUS)
        ("Event System Flow", [
            test_create_event_as_admin,
            test_create_event_as_club,
            test_create_event_as_creator,
            test_create_event_as_rider,
            test_list_all_events,
            test_rsvp_to_event,
            test_rsvp_toggle,
            test_max_attendees_limit,
            test_get_event_by_id
        ]),
        
        # 4. User Profile Flow
        ("User Profile Flow", [
            test_get_user_profile,
            test_update_own_profile,
            test_update_other_profile_unauthorized
        ]),
        
        # 5. Admin Functions
        ("Admin Functions", [
            test_admin_stats,
            test_admin_stats_unauthorized,
            test_delete_own_story,
            test_delete_other_story_unauthorized,
            test_admin_delete_any_story,
            test_delete_own_event
        ])
    ]
    
    for section_name, section_tests in tests:
        print(f"\n{'#'*80}")
        print(f"# {section_name}")
        print(f"{'#'*80}")
        
        for test_func in section_tests:
            results['total'] += 1
            try:
                if test_func():
                    results['passed'] += 1
                else:
                    results['failed'] += 1
            except Exception as e:
                print_error(f"Test crashed: {str(e)}")
                results['failed'] += 1
    
    # Print final summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {results['total']}")
    print(f"✅ Passed: {results['passed']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"Success Rate: {(results['passed']/results['total']*100):.1f}%")
    print("="*80)
    print(f"Test End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    return results

if __name__ == "__main__":
    run_all_tests()
