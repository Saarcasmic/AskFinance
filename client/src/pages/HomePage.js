import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, BookOpen, Check, Linkedin, Twitter } from 'lucide-react';
import PhoneMockupFeed from '../components/PhoneMockupFeed';
import './HomePageNew.css';

// ========== HEADER ==========
const Header = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">AskFinance</span>
        </div>

        <div className="header-right">
          <button className="btn-login" onClick={onLogin}>Log In</button>
          <button className="btn-signup" onClick={onSignup}>Sign Up</button>
        </div>
      </div>
    </header>
  );
};

// ========== HERO SECTION ==========
const Hero = ({ onGetStarted }) => {
  return (
    <section className="hero">
      <div className="hero-bg">
        {/* Static Background Layer */}
        <img
          src="/heroo.jpg"
          alt=""
          className="hero-static"
        />
        {/* Animated Cutout Layer */}
        <motion.img
          src="/heroo.jpg"
          alt="People celebrating"
          className="hero-cutout"
          initial={{ scale: 3, opacity: 0, y: 100 }}
          animate={{ scale: 1.5, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Professional Financial Guidance & Expertise
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Connect with verified financial experts for personalized advice and professional insights. Make informed decisions with institutional-grade guidance.
        </motion.p>

        <motion.button
          className="btn-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={onGetStarted}
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

// ========== HOW IT WORKS SECTION ==========
const WelcomeSection = ({ onCreateAccount }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const steps = [
    {
      number: '01',
      title: 'Submit Your Query',
      description: 'Provide detailed context for comprehensive guidance.',
    },
    {
      number: '02',
      title: 'Expert Assignment',
      description: 'Get matched with a qualified financial advisor.',
    },
    {
      number: '03',
      title: 'Receive Professional Insight',
      description: 'Obtain actionable recommendations and analysis.',
    },
  ];

  return (
    <section className="welcome-section" ref={ref}>
      <div className="welcome-container">
        <motion.h2
          className="how-it-works-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="steps-wrapper">
          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="step-item"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="step-number-container">
                  <div className="step-circle" />
                  <div className="step-number">{step.number}</div>
                  {index < steps.length - 1 && <div className="step-connector" />}
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="how-it-works-image"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Financial consultation" 
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="how-it-works-cta centered"
        >
          <button className="btn-cta btn-cta-dark" onClick={onCreateAccount}>Create Account</button>
        </motion.div>
      </div>
    </section>
  );
};

// ========== APP MOCKUP SECTION ==========
const AppMockupSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const features = [
    'Expert-verified responses within 24 hours',
    'Comprehensive market analysis and insights',
    'Personalized investment strategies',
    'Regulatory compliant advice',
  ];

  return (
    <section className="global-transfer-section" ref={ref}>
      <div className="global-bg">
        <div className="world-map" />
      </div>
      
      <div className="mockup-container">
        <motion.div
          className="mockup-text"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Institutional-Grade Financial Advice</h2>
          <p>
            AskFinance bridges the gap between retail investors and professional financial expertise. Our platform connects you with verified financial advisors, providing institutional-quality guidance typically reserved for high-net-worth clients.
          </p>
          <ul className="feature-checklist">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Check size={20} className="check-icon" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="phone-mockup"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="phone-frame">
            <div className="phone-screen">
              <PhoneMockupFeed />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ========== FEATURE GRID SECTION ==========
const FeatureGridSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const cards = [
    {
      title: 'Verified Expertise',
      description: 'All advisors undergo rigorous verification to ensure highest quality guidance.',
      icon: <ShieldCheck size={32} />,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Rapid Response',
      description: 'Get timely answers to your critical financial questions from industry experts.',
      icon: <Zap size={32} />,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Knowledge Repository',
      description: 'Access comprehensive financial insights and market analysis.',
      icon: <BookOpen size={32} />,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="feature-grid-section" ref={ref} style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/white.jpg)` }}>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Why Choose AskFinance
      </motion.h2>

      <div className="feature-grid">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <div className="card-bg">
              <img src={card.image} alt={card.title} loading="lazy" />
              <div className="card-overlay" />
            </div>
            <div className="card-content">
              <div className="card-icon">{card.icon}</div>
              <span className="card-title">{card.title}</span>
              <p className="card-description">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ========== FINAL CTA SECTION ==========
const FinalCTASection = ({ onLogin, onSignup }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="final-cta-section" ref={ref}>
      <motion.div
        className="cta-container"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2>
          Where investors verify info before the noise spreads
        </h2>

        <div className="cta-buttons">
          <button className="btn-secondary" onClick={onLogin}>Log In</button>
          <button className="btn-outline" onClick={onSignup}>
            Sign Up
          </button>
        </div>
      </motion.div>
    </section>
  );
};

// ========== FOOTER ==========
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-text">AskFinance</span>
            <p>
              A professional platform dedicated to providing expert financial guidance through verified advisors and industry professionals. Your trusted source for financial clarity.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#about">About Us</a>
              <a href="#faq">FAQ</a>
              <a href="#experts">Our Experts</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#compliance">Compliance</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 AskFinance. All rights reserved.</p>
          <div className="footer-social">
            <a href="#linkedin" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#twitter" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ========== MAIN HOMEPAGE COMPONENT ==========
const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="homepage-new">
      <Header onLogin={handleLogin} onSignup={handleSignup} />
      <main>
        <Hero onGetStarted={handleSignup} />
        <FeatureGridSection />
        <WelcomeSection onCreateAccount={handleSignup} />
        <AppMockupSection />
        <FinalCTASection onLogin={handleLogin} onSignup={handleSignup} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
