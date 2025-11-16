#!/usr/bin/env python3
"""
Moto Saga Admin Readiness Test Suite
Focus: Critical admin flows as requested in the review
"""

import requests
import json
import uuid
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://saga-riders.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class AdminReadinessTest:
    def __init__(self):
        self.admin_token = None
        self.rider_token = None
        self.admin_user_id = None
        self.rider_user_id = None
        self.test_story_id = None
        self.test_event_id = None
        self.results = []
        
        # Generate unique identifiers for this test run
        self.test_id = uuid.uuid4().hex[:8]
        
    def log_result(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_admin_signup(self):
        """Test 1: Create admin user account"""
        print("🔐 Testing Admin Authentication...")
        try:
            admin_data = {
                "email": f"admin_{self.test_id}@motosaga.com",
                "password": "AdminPass123!",
                "name": "Test Admin",
                "role": "admin",
                "bio": "Platform Administrator"
            }
            
            response = requests.post(f"{BASE_URL}/auth/signup", 
                                   json=admin_data, headers=HEADERS)
            
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("token")
                self.admin_user_id = data.get("user", {}).get("id")
                
                if self.admin_token and data.get("user", {}).get("role") == "admin":
                    self.log_result("Admin Signup", True, 
                                  f"Admin user created successfully with ID: {self.admin_user_id}")
                    return True
                else:
                    self.log_result("Admin Signup", False, 
                                  "Admin user created but missing token or role")
                    return False
            else:
                self.log_result("Admin Signup", False, 
                              f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Admin Signup", False, f"Exception: {str(e)}")
            return False
    
    def test_rider_signup(self):
        """Test 2: Create regular rider user for comparison tests"""
        try:
            rider_data = {
                "email": f"rider_{self.test_id}@motosaga.com",
                "password": "RiderPass123!",
                "name": "Test Rider",
                "role": "rider",
                "bikeInfo": {
                    "make": "Royal Enfield",
                    "model": "Classic 350",
                    "year": "2023"
                },
                "bio": "Motorcycle enthusiast"
            }
            
            response = requests.post(f"{BASE_URL}/auth/signup", 
                                   json=rider_data, headers=HEADERS)
            
            if response.status_code == 200:
                data = response.json()
                self.rider_token = data.get("token")
                self.rider_user_id = data.get("user", {}).get("id")
                
                if self.rider_token and data.get("user", {}).get("role") == "rider":
                    self.log_result("Rider Signup", True, 
                                  f"Rider user created successfully with ID: {self.rider_user_id}")
                    return True
                else:
                    self.log_result("Rider Signup", False, 
                                  "Rider user created but missing token or role")
                    return False
            else:
                self.log_result("Rider Signup", False, 
                              f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Rider Signup", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_event_creation(self):
        """Test 3: CRITICAL - Test POST /api/events as admin (should work)"""
        print("🎯 Testing CRITICAL Admin Event Creation...")
        if not self.admin_token:
            self.log_result("Admin Event Creation", False, "No admin token available")
            return False
            
        try:
            event_data = {
                "title": "Mumbai Coastal Ride",
                "description": "Join us for a scenic coastal ride from Mumbai to Alibaug",
                "date": (datetime.now() + timedelta(days=7)).isoformat(),
                "location": "Marine Drive, Mumbai",
                "eventType": "ride",
                "maxAttendees": 25,
                "imageUrl": "https://example.com/coastal-ride.jpg"
            }
            
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.admin_token}"}
            response = requests.post(f"{BASE_URL}/events", 
                                   json=event_data, headers=auth_headers)
            
            if response.status_code == 200:
                data = response.json()
                self.test_event_id = data.get("id")
                
                # Verify all required fields are present
                required_fields = ["id", "title", "description", "date", "location", "eventType"]
                missing_fields = [field for field in required_fields if not data.get(field)]
                
                if not missing_fields and data.get("creatorId") == self.admin_user_id:
                    self.log_result("Admin Event Creation", True, 
                                  f"Event created successfully with ID: {self.test_event_id}",
                                  f"All required fields present: {required_fields}")
                    return True
                else:
                    self.log_result("Admin Event Creation", False, 
                                  f"Event created but issues found",
                                  f"Missing fields: {missing_fields}, Creator ID match: {data.get('creatorId') == self.admin_user_id}")
                    return False
            else:
                self.log_result("Admin Event Creation", False, 
                              f"Failed with status {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Event Creation", False, f"Exception: {str(e)}")
            return False
    
    def test_rider_event_creation_forbidden(self):
        """Test 4: CRITICAL - Test POST /api/events as regular user (should fail with 403)"""
        print("🚫 Testing Rider Event Creation (Should Fail)...")
        if not self.rider_token:
            self.log_result("Rider Event Creation (Should Fail)", False, "No rider token available")
            return False
            
        try:
            event_data = {
                "title": "Unauthorized Event",
                "description": "This should not be created",
                "date": (datetime.now() + timedelta(days=5)).isoformat(),
                "location": "Test Location",
                "eventType": "ride",
                "maxAttendees": 10
            }
            
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.rider_token}"}
            response = requests.post(f"{BASE_URL}/events", 
                                   json=event_data, headers=auth_headers)
            
            if response.status_code == 403:
                error_msg = response.json().get("error", "")
                if "administrator" in error_msg.lower() or "admin" in error_msg.lower():
                    self.log_result("Rider Event Creation (Should Fail)", True, 
                                  "Correctly blocked rider from creating events with 403",
                                  f"Error message: {error_msg}")
                    return True
                else:
                    self.log_result("Rider Event Creation (Should Fail)", False, 
                                  f"Got 403 but wrong error message: {error_msg}")
                    return False
            else:
                self.log_result("Rider Event Creation (Should Fail)", False, 
                              f"Expected 403 but got {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Rider Event Creation (Should Fail)", False, f"Exception: {str(e)}")
            return False
    
    def test_story_creation(self):
        """Test 5: Create test stories for admin deletion testing"""
        print("📝 Creating Test Stories...")
        if not self.rider_token:
            self.log_result("Story Creation", False, "No rider token available")
            return False
            
        try:
            story_data = {
                "title": "My Royal Enfield Adventure",
                "content": "Just completed an amazing ride through the Western Ghats!",
                "location": "Western Ghats, Maharashtra",
                "mediaUrls": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVR"]
            }
            
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.rider_token}"}
            response = requests.post(f"{BASE_URL}/stories", 
                                   json=story_data, headers=auth_headers)
            
            if response.status_code == 200:
                data = response.json()
                self.test_story_id = data.get("id")
                
                if self.test_story_id and data.get("userId") == self.rider_user_id:
                    self.log_result("Story Creation", True, 
                                  f"Story created successfully with ID: {self.test_story_id}")
                    return True
                else:
                    self.log_result("Story Creation", False, 
                                  "Story created but missing ID or wrong user")
                    return False
            else:
                self.log_result("Story Creation", False, 
                              f"Failed with status {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Story Creation", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_delete_story(self):
        """Test 6: CRITICAL - Test DELETE /api/stories/:id as admin (should work on any story)"""
        print("🗑️ Testing Admin Delete Story Privileges...")
        if not self.admin_token or not self.test_story_id:
            self.log_result("Admin Delete Story", False, "Missing admin token or test story")
            return False
            
        try:
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.admin_token}"}
            response = requests.delete(f"{BASE_URL}/stories/{self.test_story_id}", 
                                     headers=auth_headers)
            
            if response.status_code == 200:
                data = response.json()
                if "deleted" in data.get("message", "").lower():
                    self.log_result("Admin Delete Story", True, 
                                  "Admin successfully deleted story from another user",
                                  f"Response: {data}")
                    return True
                else:
                    self.log_result("Admin Delete Story", False, 
                                  f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Admin Delete Story", False, 
                              f"Failed with status {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Delete Story", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_delete_event(self):
        """Test 7: CRITICAL - Test DELETE /api/events/:id as admin (should work on any event)"""
        print("🗑️ Testing Admin Delete Event Privileges...")
        if not self.admin_token or not self.test_event_id:
            self.log_result("Admin Delete Event", False, "Missing admin token or test event")
            return False
            
        try:
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.admin_token}"}
            response = requests.delete(f"{BASE_URL}/events/{self.test_event_id}", 
                                     headers=auth_headers)
            
            if response.status_code == 200:
                data = response.json()
                if "deleted" in data.get("message", "").lower():
                    self.log_result("Admin Delete Event", True, 
                                  "Admin successfully deleted event",
                                  f"Response: {data}")
                    return True
                else:
                    self.log_result("Admin Delete Event", False, 
                                  f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Admin Delete Event", False, 
                              f"Failed with status {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Delete Event", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_stats(self):
        """Test 8: CRITICAL - Test GET /api/admin/stats (should return platform statistics)"""
        print("📊 Testing Admin Dashboard Stats...")
        if not self.admin_token:
            self.log_result("Admin Stats", False, "No admin token available")
            return False
            
        try:
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{BASE_URL}/admin/stats", headers=auth_headers)
            
            if response.status_code == 200:
                data = response.json()
                required_stats = ["totalUsers", "totalStories", "totalEvents", "usersByRole"]
                missing_stats = [stat for stat in required_stats if stat not in data]
                
                if not missing_stats:
                    self.log_result("Admin Stats", True, 
                                  f"Admin stats retrieved successfully",
                                  f"Stats: Users={data['totalUsers']}, Stories={data['totalStories']}, Events={data['totalEvents']}")
                    return True
                else:
                    self.log_result("Admin Stats", False, 
                                  f"Missing stats fields: {missing_stats}",
                                  f"Received: {data}")
                    return False
            else:
                self.log_result("Admin Stats", False, 
                              f"Failed with status {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Stats", False, f"Exception: {str(e)}")
            return False
    
    def test_rider_stats_forbidden(self):
        """Test 9: Test GET /api/admin/stats as rider (should fail)"""
        print("🚫 Testing Rider Access to Admin Stats (Should Fail)...")
        if not self.rider_token:
            self.log_result("Rider Stats (Should Fail)", False, "No rider token available")
            return False
            
        try:
            auth_headers = {**HEADERS, "Authorization": f"Bearer {self.rider_token}"}
            response = requests.get(f"{BASE_URL}/admin/stats", headers=auth_headers)
            
            if response.status_code == 401:
                self.log_result("Rider Stats (Should Fail)", True, 
                              "Correctly blocked rider from accessing admin stats")
                return True
            else:
                self.log_result("Rider Stats (Should Fail)", False, 
                              f"Expected 401 but got {response.status_code}",
                              response.text)
                return False
                
        except Exception as e:
            self.log_result("Rider Stats (Should Fail)", False, f"Exception: {str(e)}")
            return False
    
    def test_rsvp_functionality(self):
        """Test 10: Test RSVP functionality"""
        print("🎫 Testing RSVP Functionality...")
        if not self.admin_token or not self.rider_token:
            self.log_result("RSVP Functionality", False, "Missing required tokens")
            return False
            
        try:
            # First create an event as admin
            event_data = {
                "title": "RSVP Test Event",
                "description": "Testing RSVP functionality",
                "date": (datetime.now() + timedelta(days=3)).isoformat(),
                "location": "Test Location",
                "eventType": "meetup",
                "maxAttendees": 5
            }
            
            admin_headers = {**HEADERS, "Authorization": f"Bearer {self.admin_token}"}
            event_response = requests.post(f"{BASE_URL}/events", 
                                         json=event_data, headers=admin_headers)
            
            if event_response.status_code != 200:
                self.log_result("RSVP Functionality", False, "Failed to create test event")
                return False
            
            event_id = event_response.json().get("id")
            
            # Test RSVP as rider
            rider_headers = {**HEADERS, "Authorization": f"Bearer {self.rider_token}"}
            rsvp_response = requests.post(f"{BASE_URL}/events/{event_id}/rsvp", 
                                        headers=rider_headers)
            
            if rsvp_response.status_code == 200:
                data = rsvp_response.json()
                if self.rider_user_id in data.get("rsvps", []):
                    self.log_result("RSVP Functionality", True, 
                                  "RSVP functionality working correctly",
                                  f"User {self.rider_user_id} successfully RSVPed to event {event_id}")
                    return True
                else:
                    self.log_result("RSVP Functionality", False, 
                                  "RSVP response successful but user not in RSVP list",
                                  f"RSVPs: {data.get('rsvps', [])}")
                    return False
            else:
                self.log_result("RSVP Functionality", False, 
                              f"RSVP failed with status {rsvp_response.status_code}",
                              rsvp_response.text)
                return False
                
        except Exception as e:
            self.log_result("RSVP Functionality", False, f"Exception: {str(e)}")
            return False
    
    def test_like_functionality(self):
        """Test 11: Test like functionality on stories"""
        print("❤️ Testing Like Functionality...")
        if not self.rider_token:
            self.log_result("Like Functionality", False, "No rider token available")
            return False
            
        try:
            # Create a story first
            story_data = {
                "title": "Like Test Story",
                "content": "Testing like functionality",
                "location": "Test Location"
            }
            
            rider_headers = {**HEADERS, "Authorization": f"Bearer {self.rider_token}"}
            story_response = requests.post(f"{BASE_URL}/stories", 
                                         json=story_data, headers=rider_headers)
            
            if story_response.status_code != 200:
                self.log_result("Like Functionality", False, "Failed to create test story")
                return False
            
            story_id = story_response.json().get("id")
            
            # Test like functionality
            like_response = requests.post(f"{BASE_URL}/stories/{story_id}/like", 
                                        headers=rider_headers)
            
            if like_response.status_code == 200:
                data = like_response.json()
                if self.rider_user_id in data.get("likes", []):
                    self.log_result("Like Functionality", True, 
                                  "Like functionality working correctly",
                                  f"User {self.rider_user_id} successfully liked story {story_id}")
                    return True
                else:
                    self.log_result("Like Functionality", False, 
                                  "Like response successful but user not in likes list",
                                  f"Likes: {data.get('likes', [])}")
                    return False
            else:
                self.log_result("Like Functionality", False, 
                              f"Like failed with status {like_response.status_code}",
                              like_response.text)
                return False
                
        except Exception as e:
            self.log_result("Like Functionality", False, f"Exception: {str(e)}")
            return False
    
    def run_admin_readiness_tests(self):
        """Run all admin readiness tests in sequence"""
        print("🏍️  MOTO SAGA ADMIN READINESS TEST SUITE")
        print("=" * 80)
        print(f"🎯 Focus: Critical admin flows for platform readiness")
        print(f"🔗 Base URL: {BASE_URL}")
        print(f"🕒 Test ID: {self.test_id}")
        print("=" * 80)
        
        # Test sequence for admin readiness
        tests = [
            ("Admin Authentication", self.test_admin_signup),
            ("Rider Authentication", self.test_rider_signup),
            ("CRITICAL: Admin Event Creation", self.test_admin_event_creation),
            ("CRITICAL: Rider Event Creation Block", self.test_rider_event_creation_forbidden),
            ("Story Creation Setup", self.test_story_creation),
            ("CRITICAL: Admin Delete Story", self.test_admin_delete_story),
            ("CRITICAL: Admin Delete Event", self.test_admin_delete_event),
            ("CRITICAL: Admin Stats Access", self.test_admin_stats),
            ("Rider Stats Block", self.test_rider_stats_forbidden),
            ("RSVP Functionality", self.test_rsvp_functionality),
            ("Like Functionality", self.test_like_functionality)
        ]
        
        passed = 0
        failed = 0
        critical_failures = []
        
        for test_name, test_func in tests:
            print(f"🧪 Running: {test_name}")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
                    if "CRITICAL" in test_name:
                        critical_failures.append(test_name)
            except Exception as e:
                print(f"❌ CRITICAL ERROR in {test_name}: {str(e)}")
                failed += 1
                critical_failures.append(test_name)
            
            # Small delay between tests
            time.sleep(0.5)
        
        print("\n" + "=" * 80)
        print(f"🏍️  ADMIN READINESS TEST RESULTS")
        print("=" * 80)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Critical issues summary
        if critical_failures:
            print(f"\n🚨 CRITICAL ADMIN ISSUES FOUND ({len(critical_failures)}):")
            for failure in critical_failures:
                print(f"   • {failure}")
            print("\n⚠️  These issues must be resolved before admin platform readiness!")
        else:
            print(f"\n🎉 ALL CRITICAL ADMIN FLOWS WORKING!")
            print("✅ Platform is ready for admin use")
        
        return passed, failed, self.results, critical_failures

if __name__ == "__main__":
    tester = AdminReadinessTest()
    passed, failed, results, critical_failures = tester.run_admin_readiness_tests()
    
    # Save detailed results
    with open("/app/admin_test_results.json", "w") as f:
        json.dump({
            "summary": {
                "passed": passed,
                "failed": failed,
                "success_rate": (passed/(passed+failed)*100) if (passed+failed) > 0 else 0,
                "critical_failures": critical_failures
            },
            "detailed_results": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/admin_test_results.json")