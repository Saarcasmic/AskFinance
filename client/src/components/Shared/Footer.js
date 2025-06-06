import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-900 text-white py-12 border-t border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-white">AskFinance</h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
              A professional platform dedicated to providing expert financial guidance through 
              verified advisors and industry professionals. Your trusted source for financial clarity.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="/about" className="hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors duration-200">FAQ</a></li>
              <li><a href="/experts" className="hover:text-white transition-colors duration-200">Our Experts</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/compliance" className="hover:text-white transition-colors duration-200">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-zinc-400">
              © {currentYear} AskFinance. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://linkedin.com" className="text-zinc-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://twitter.com" className="text-zinc-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
