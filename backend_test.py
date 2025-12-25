import requests
import sys
import json
from datetime import datetime

class EcommerceAPITester:
    def __init__(self, base_url="https://shop-ecommerce-5.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return None

    def test_root_endpoint(self):
        """Test root API endpoint"""
        response = self.run_test("Root API", "GET", "", 200)
        return response is not None

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}"
        }
        
        response = self.run_test("User Registration", "POST", "auth/register", 200, user_data)
        
        if response and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        if not self.token:
            return False
            
        # Get current user to extract email
        me_response = self.run_test("Get Current User", "GET", "auth/me", 200)
        if not me_response:
            return False
            
        # Try login with same credentials (we'll use a known test user)
        login_data = {
            "email": "admin@test.com",
            "password": "admin123"
        }
        
        response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        return response is not None

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            return False
            
        response = self.run_test("Get Current User", "GET", "auth/me", 200)
        return response is not None

    def test_get_products(self):
        """Test getting all products"""
        response = self.run_test("Get All Products", "GET", "products", 200)
        return response is not None

    def test_get_products_with_filters(self):
        """Test getting products with category filter"""
        response = self.run_test("Get Products by Category", "GET", "products?category=Soin du visage", 200)
        return response is not None

    def test_get_products_with_search(self):
        """Test getting products with search"""
        response = self.run_test("Search Products", "GET", "products?search=soin", 200)
        return response is not None

    def test_create_product(self):
        """Test creating a product (admin endpoint)"""
        if not self.token:
            return False
            
        product_data = {
            "name": "Test Product",
            "description": "A test beauty product",
            "price": 29.99,
            "image_url": "https://example.com/test-product.jpg",
            "category": "Soin du visage",
            "stock": 10
        }
        
        response = self.run_test("Create Product", "POST", "admin/products", 200, product_data)
        
        if response and 'id' in response:
            self.test_product_id = response['id']
            return True
        return False

    def test_get_single_product(self):
        """Test getting a single product"""
        # First get all products to get an ID
        products = self.run_test("Get Products for Single Test", "GET", "products", 200)
        if products and len(products) > 0:
            product_id = products[0]['id']
            response = self.run_test("Get Single Product", "GET", f"products/{product_id}", 200)
            return response is not None
        return False

    def test_cart_operations(self):
        """Test cart operations"""
        if not self.token:
            return False
            
        # Get cart (should be empty initially)
        cart = self.run_test("Get Empty Cart", "GET", "cart", 200)
        if cart is None:
            return False
            
        # Get products to add to cart
        products = self.run_test("Get Products for Cart", "GET", "products", 200)
        if not products or len(products) == 0:
            return False
            
        product_id = products[0]['id']
        
        # Add to cart
        cart_data = {"product_id": product_id, "quantity": 2}
        add_response = self.run_test("Add to Cart", "POST", "cart", 200, cart_data)
        if not add_response:
            return False
            
        # Get cart again (should have items)
        cart_with_items = self.run_test("Get Cart with Items", "GET", "cart", 200)
        if not cart_with_items:
            return False
            
        # Remove from cart
        if cart_with_items and len(cart_with_items) > 0:
            cart_item_id = cart_with_items[0]['cart_item_id']
            remove_response = self.run_test("Remove from Cart", "DELETE", f"cart/{cart_item_id}", 200)
            return remove_response is not None
            
        return True

    def test_checkout_session(self):
        """Test creating checkout session"""
        if not self.token:
            return False
            
        # First add something to cart
        products = self.run_test("Get Products for Checkout", "GET", "products", 200)
        if not products or len(products) == 0:
            return False
            
        product_id = products[0]['id']
        cart_data = {"product_id": product_id, "quantity": 1}
        self.run_test("Add to Cart for Checkout", "POST", "cart", 200, cart_data)
        
        # Create checkout session
        checkout_data = {"origin_url": self.base_url}
        response = self.run_test("Create Checkout Session", "POST", "checkout/session", 200, checkout_data)
        
        if response and 'session_id' in response:
            self.session_id = response['session_id']
            return True
        return False

    def test_checkout_status(self):
        """Test getting checkout status"""
        if not self.token or not hasattr(self, 'session_id'):
            return False
            
        response = self.run_test("Get Checkout Status", "GET", f"checkout/status/{self.session_id}", 200)
        return response is not None

    def test_get_orders(self):
        """Test getting user orders"""
        if not self.token:
            return False
            
        response = self.run_test("Get User Orders", "GET", "orders", 200)
        return response is not None

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting E-commerce API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)
        
        # Basic API tests
        self.test_root_endpoint()
        
        # Authentication tests
        self.test_user_registration()
        self.test_get_current_user()
        
        # Product tests
        self.test_get_products()
        self.test_get_products_with_filters()
        self.test_get_products_with_search()
        self.test_get_single_product()
        
        # Admin tests (if authenticated)
        if self.token:
            self.test_create_product()
        
        # Cart tests
        self.test_cart_operations()
        
        # Checkout tests
        self.test_checkout_session()
        self.test_checkout_status()
        
        # Order tests
        self.test_get_orders()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    tester = EcommerceAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())