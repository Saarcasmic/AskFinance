import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Investment Analyst",
      content: "AskFinance has been instrumental in helping me make informed investment decisions. The expert insights are invaluable.",
      company: "Goldman Sachs",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "Michael Rodriguez",
      role: "Portfolio Manager",
      content: "The quality of financial advice on this platform is exceptional. It's like having a team of expert advisors at your fingertips.",
      company: "BlackRock",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "Emily Thompson",
      role: "Financial Advisor",
      content: "As a financial advisor, I appreciate the platform's commitment to providing accurate, well-researched information.",
      company: "Morgan Stanley",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "David Park",
      role: "Retail Investor",
      content: "The platform has helped me understand complex financial concepts and make better investment choices.",
      company: "Independent Trader",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    }
  ];

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
      observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    let intervalId;
    if (!isHovered) {
      intervalId = setInterval(nextTestimonial, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isHovered, nextTestimonial]);

  return (
    <div className="bg-zinc-900 text-white">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center border-b border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-8 animate-on-scroll">
              Professional Financial
              <br />
              <span className="text-white/90">Guidance & Expertise</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-12 animate-on-scroll delay-200 max-w-2xl">
              Connect with verified financial experts for personalized advice and professional insights. 
              Make informed decisions with institutional-grade guidance.
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white text-zinc-900 rounded-md text-sm font-medium
                       hover:bg-zinc-100 transition-colors duration-200 animate-on-scroll delay-400"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center animate-on-scroll">
            Why Choose AskFinance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Verified Expertise",
                description: "All advisors undergo rigorous verification to ensure highest quality guidance."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Rapid Response",
                description: "Get timely answers to your critical financial questions from industry experts."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Knowledge Repository",
                description: "Access comprehensive financial insights and market analysis."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="feature-card bg-zinc-900 border border-white/5 rounded-lg p-6 animate-on-scroll"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center animate-on-scroll">
            How It Works
          </h2>

          <div className="max-w-5xl mx-auto">
            {[
              {
                number: "01",
                title: "Submit Your Query",
                description: "Provide detailed context for comprehensive guidance."
              },
              {
                number: "02",
                title: "Expert Assignment",
                description: "Get matched with a qualified financial advisor."
              },
              {
                number: "03",
                title: "Receive Professional Insight",
                description: "Obtain actionable recommendations and analysis."
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="process-step flex items-start mb-16 last:mb-0 animate-on-scroll"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mr-8 flex-shrink-0">
                  <span className="inline-block w-12 h-12 rounded-full bg-white/5 text-white
                                 flex items-center justify-center text-lg font-medium">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center animate-on-scroll">
            <button 
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white text-zinc-900 rounded-md text-sm font-medium
                       hover:bg-zinc-100 transition-colors duration-200"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center animate-on-scroll">
              Transforming Financial Guidance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll delay-200">
                <h3 className="text-xl font-medium mb-6 text-white">Institutional-Grade Financial Advice</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  AskFinance bridges the gap between retail investors and professional financial expertise. 
                  Our platform connects you with verified financial advisors, providing institutional-quality 
                  guidance typically reserved for high-net-worth clients.
                </p>
                <ul className="space-y-4">
                  {[
                    "Expert-verified responses within 24 hours",
                    "Comprehensive market analysis and insights",
                    "Personalized investment strategies",
                    "Regulatory compliant advice"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-zinc-400">
                      <svg className="w-5 h-5 mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative animate-on-scroll delay-400">
                <div className="aspect-square rounded-lg bg-zinc-800/50 border border-white/5 p-8 backdrop-blur-sm">
                  <div className="relative h-full">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="relative h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-semibold mb-2">10K+</div>
                        <div className="text-zinc-400">Questions Answered</div>
                        <div className="mt-8 text-4xl font-semibold mb-2">500+</div>
                        <div className="text-zinc-400">Verified Experts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center animate-on-scroll">
            Trusted by Financial Professionals
          </h2>

          <div className="max-w-4xl mx-auto relative">
            <div 
              className="testimonial-carousel relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="testimonial-slide bg-zinc-800/50 rounded-lg border border-white/5 p-8 backdrop-blur-sm">
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <img 
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                    />
                  </div>
                  <div className="flex-grow">
                    <Quote className="w-8 h-8 text-white/20 mb-4" />
                    <p className="text-lg text-zinc-300 leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div>
                    <div className="font-medium text-white">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 
                      ${index === currentTestimonial 
                        ? 'bg-white w-6' 
                        : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
