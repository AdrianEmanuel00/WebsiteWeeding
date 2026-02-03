import requests
import sys
import json
from datetime import datetime

class WeddingAPITester:
    def __init__(self, base_url="https://nunta-romantic.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"username": "admin", "password": "sara&adrian2026"}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_rsvp_creation(self):
        """Test RSVP creation"""
        rsvp_data = {
            "guest_name": "Test User",
            "attending": True,
            "num_guests": 2,
            "guests": [
                {"name": "Test User", "menu_type": "Standard"},
                {"name": "Test Guest", "menu_type": "Vegetarian"}
            ],
            "allergies": "No allergies",
            "message": "Looking forward to the wedding!"
        }
        success, response = self.run_test(
            "Create RSVP",
            "POST",
            "rsvp",
            200,
            data=rsvp_data
        )
        if success and 'id' in response:
            return response['id']
        return None

    def test_get_rsvps(self):
        """Test getting RSVPs (admin only)"""
        if not self.token:
            print("❌ No admin token for RSVP list test")
            return False
        return self.run_test("Get RSVPs", "GET", "rsvp", 200)[0]

    def test_get_stats(self):
        """Test getting stats (admin only)"""
        if not self.token:
            print("❌ No admin token for stats test")
            return False
        success, response = self.run_test("Get Stats", "GET", "stats", 200)
        if success:
            print(f"   Stats: {json.dumps(response, indent=2)}")
        return success

    def test_photos_endpoint(self):
        """Test photos endpoint"""
        return self.run_test("Get Photos", "GET", "photos", 200)[0]

    def test_photos_all_endpoint(self):
        """Test photos/all endpoint (admin only)"""
        if not self.token:
            print("❌ No admin token for photos/all test")
            return False
        return self.run_test("Get All Photos", "GET", "photos/all", 200)[0]

    def test_qr_code_generation(self):
        """Test QR code generation"""
        success, _ = self.run_test("Generate QR Code", "GET", "qrcode", 200)
        return success

    def test_delete_rsvp(self, rsvp_id):
        """Test RSVP deletion (admin only)"""
        if not self.token or not rsvp_id:
            print("❌ No admin token or RSVP ID for deletion test")
            return False
        return self.run_test(f"Delete RSVP {rsvp_id}", "DELETE", f"rsvp/{rsvp_id}", 200)[0]

def main():
    print("🎉 Starting Wedding Website API Tests")
    print("=" * 50)
    
    # Setup
    tester = WeddingAPITester()
    
    # Test basic endpoints
    print("\n📋 Testing Basic Endpoints...")
    tester.test_root_endpoint()
    tester.test_photos_endpoint()
    tester.test_qr_code_generation()
    
    # Test RSVP functionality
    print("\n💌 Testing RSVP Functionality...")
    rsvp_id = tester.test_rsvp_creation()
    
    # Test admin functionality
    print("\n🔐 Testing Admin Functionality...")
    if tester.test_admin_login():
        tester.test_get_rsvps()
        tester.test_get_stats()
        tester.test_photos_all_endpoint()
        
        # Test RSVP deletion if we created one
        if rsvp_id:
            tester.test_delete_rsvp(rsvp_id)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            print(f"   - {failed}")
    else:
        print("\n✅ All tests passed!")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())