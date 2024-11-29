import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-800 text-white py-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">FinanceQ</h3>
            <p className="text-sm text-green-100">
              Empowering financial knowledge through community-driven Q&A
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="/about" className="hover:text-yellow-300 transition-colors">About</a></li>
              <li><a href="/terms" className="hover:text-yellow-300 transition-colors">Terms</a></li>
              <li><a href="/privacy" className="hover:text-yellow-300 transition-colors">Privacy</a></li>
            </ul>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              {/* Social media icons */}
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              {/* Add more social icons as needed */}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-green-600 text-center text-sm text-green-100">
          <p>© {currentYear} AskFinance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
