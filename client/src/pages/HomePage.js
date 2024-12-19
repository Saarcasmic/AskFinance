import React from "react";
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <section id="hero" className="h-screen bg-black relative overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src="https://web-images.credcdn.in/v2/_next/assets/videos/landing/desktop/hero-desktop.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl md:text-8xl font-romie text-white leading-tight max-w-4xl">
            Where Finance Questions Meet Expert Answers
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-8 max-w-2xl font-gilroy">
            Get personalized financial advice from verified experts. Your path to financial clarity starts here.
          </p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="mt-12 bg-white text-black px-8 py-4 rounded-full text-lg font-gilroy hover:bg-gray-100 transition-colors inline-block w-fit"
          >
            Ask Your Question
          </button>
        </div>
      </section>

      <section id="features" className="bg-black text-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-romie mb-16 text-center">
            Expert Financial Guidance at Your Fingertips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                video: "https://web-images.credcdn.in/v2/_next/assets/videos/landing/desktop/ccbp-fold-d.mp4",
                title: "Verified Experts",
                description: "Get answers from certified financial advisors, analysts, and industry professionals."
              },
              {
                video: "https://web-images.credcdn.in/v2/_next/assets/videos/landing/desktop/rewards-desktop-final.mp4",
                title: "Real-time Solutions",
                description: "Get quick, personalized responses to your urgent financial questions."
              },
              {
                video: "https://web-images.credcdn.in/v2/_next/assets/videos/landing/desktop/phone-ticker-desktop-final.mp4",
                title: "Knowledge Hub",
                description: "Access a vast library of financial insights and expert recommendations."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
                <video autoPlay loop muted playsInline className="w-full h-64 object-cover mb-8 rounded-lg">
                  <source src={feature.video} type="video/mp4" />
                </video>
                <h3 className="text-2xl font-gilroy mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          
        </div>
      </section>

      <section id="howItWorks" className="bg-black text-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-romie mb-24 text-center">
            Your Journey to Financial Clarity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                number: "01",
                icon: "plus-icon.png",
                title: "Ask Your Question",
                description: "Submit your financial query with relevant details and context for the best possible guidance."
              },
              {
                number: "02",
                icon: "datasafe.png",
                title: "Expert Match",
                description: "Our system connects you with the most qualified expert for your specific financial query."
              },
              {
                number: "03",
                icon: "footer-logo.png",
                title: "Get Solutions",
                description: "Receive personalized advice and actionable insights from industry professionals."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -top-8 -left-8 text-8xl font-romie text-zinc-800">
                  {step.number}
                </div>
                <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 relative z-10">
                  {index === 2 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <img 
                      src={`https://web-images.credcdn.in/v2/_next/assets/images/landing/${step.icon}`}
                      alt={`Step ${index + 1}`}
                      className="w-12 h-12 mb-6"
                    />
                  )}
                  <h3 className="text-2xl font-gilroy mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <button 
              onClick={() => window.location.href = "/signup"}
              className="bg-white text-black px-12 py-6 rounded-full text-xl font-gilroy hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-4"
            >
              Start Your Journey
              <img 
                src="https://web-images.credcdn.in/v2/_next/assets/images/landing/down-arrow.png" 
                alt="Arrow" 
                className="w-6 h-6 rotate-90 invert" 
              />
            </button>
          </div>
        </div>
      </section>

      {/* Additional sections follow the same pattern */}
    </>
  );
};

export default HomePage;
