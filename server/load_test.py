import asyncio
import aiohttp
import random
import string
import time
from concurrent.futures import ThreadPoolExecutor
import json
from typing import List, Dict
import pandas as pd
from datetime import datetime

class AuthLoadTester:
    def __init__(self, base_url: str, num_users: int = 100):
        self.base_url = base_url
        self.num_users = num_users
        self.results: List[Dict] = []
        self.users: List[Dict] = []
        
    def generate_random_user(self) -> Dict:
        """Generate random user credentials"""
        random_string = ''.join(random.choices(string.ascii_lowercase, k=8))
        return {
            "email": f"test_{random_string}@example.com",
            "username": f"user_{random_string}",
            "password": ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        }

    async def signup_user(self, session: aiohttp.ClientSession, user: Dict) -> Dict:
        """Simulate user signup"""
        start_time = time.time()
        try:
            async with session.post(f"{self.base_url}/signup", json=user) as response:
                response_time = time.time() - start_time
                status = response.status
                result = await response.json()
                return {
                    "operation": "signup",
                    "email": user["email"],
                    "status": status,
                    "response_time": response_time,
                    "success": status == 200,
                    "error": str(result) if status != 200 else None
                }
        except Exception as e:
            return {
                "operation": "signup",
                "email": user["email"],
                "status": 500,
                "response_time": time.time() - start_time,
                "success": False,
                "error": str(e)
            }

    async def login_user(self, session: aiohttp.ClientSession, user: Dict) -> Dict:
        """Simulate user login"""
        start_time = time.time()
        try:
            async with session.post(f"{self.base_url}/login", json=user) as response:
                response_time = time.time() - start_time
                status = response.status
                result = await response.json()
                return {
                    "operation": "login",
                    "email": user["email"],
                    "status": status,
                    "response_time": response_time,
                    "success": status == 200,
                    "error": str(result) if status != 200 else None
                }
        except Exception as e:
            return {
                "operation": "login",
                "email": user["email"],
                "status": 500,
                "response_time": time.time() - start_time,
                "success": False,
                "error": str(e)
            }

    async def run_load_test(self):
        """Run the load test"""
        # Generate random users
        self.users = [self.generate_random_user() for _ in range(self.num_users)]
        
        async with aiohttp.ClientSession() as session:
            # First round: Sign up all users
            signup_tasks = [self.signup_user(session, user) for user in self.users]
            signup_results = await asyncio.gather(*signup_tasks)
            self.results.extend(signup_results)
            
            # Small delay to ensure all signups are processed
            await asyncio.sleep(1)
            
            # Second round: Login all users
            login_tasks = [self.login_user(session, user) for user in self.users]
            login_results = await asyncio.gather(*login_tasks)
            self.results.extend(login_results)

    def generate_report(self) -> str:
        """Generate a detailed report of the load test"""
        df = pd.DataFrame(self.results)
        
        # Calculate statistics
        stats = {
            "total_requests": len(df),
            "successful_requests": len(df[df["success"] == True]),
            "failed_requests": len(df[df["success"] == False]),
            "average_response_time": df["response_time"].mean(),
            "max_response_time": df["response_time"].max(),
            "min_response_time": df["response_time"].min(),
            "signup_success_rate": len(df[(df["operation"] == "signup") & (df["success"] == True)]) / len(df[df["operation"] == "signup"]) * 100,
            "login_success_rate": len(df[(df["operation"] == "login") & (df["success"] == True)]) / len(df[df["operation"] == "login"]) * 100
        }
        
        # Generate report
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        report = f"Load Test Report - {timestamp}\n\n"
        report += f"Total Users Tested: {self.num_users}\n"
        report += f"Total Requests: {stats['total_requests']}\n"
        report += f"Successful Requests: {stats['successful_requests']}\n"
        report += f"Failed Requests: {stats['failed_requests']}\n"
        report += f"Average Response Time: {stats['average_response_time']:.3f}s\n"
        report += f"Max Response Time: {stats['max_response_time']:.3f}s\n"
        report += f"Min Response Time: {stats['min_response_time']:.3f}s\n"
        report += f"Signup Success Rate: {stats['signup_success_rate']:.1f}%\n"
        report += f"Login Success Rate: {stats['login_success_rate']:.1f}%\n\n"
        
        # Save detailed results to CSV
        df.to_csv(f"load_test_results_{timestamp}.csv", index=False)
        report += f"Detailed results saved to: load_test_results_{timestamp}.csv\n"
        
        return report

# Example usage
async def main():
    # Replace with your API base URL
    base_url = "https://askfinance.onrender.com/auth"
    tester = AuthLoadTester(base_url, num_users=100)
    
    print("Starting load test...")
    start_time = time.time()
    
    await tester.run_load_test()
    
    total_time = time.time() - start_time
    print(f"\nLoad test completed in {total_time:.2f} seconds")
    
    # Generate and print report
    report = tester.generate_report()
    print("\nTest Report:")
    print(report)

if __name__ == "__main__":
    asyncio.run(main())