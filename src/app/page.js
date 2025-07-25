"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const ReProcessLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom icon components using SVG
  const ChevronDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  );

  const AwardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const FootprintsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16V10A4 4 0 0112 10V16A4 4 0 014 16Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 16V10A4 4 0 0120 10V16A4 4 0 0112 16Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 z-50 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
              <li><a onClick={() => smoothScroll('hero')}>Home</a></li>
              <li><a onClick={() => smoothScroll('features')}>3R Features</a></li>
              <li><a onClick={() => smoothScroll('marketplace')}>Marketplace</a></li>
              <li><a onClick={() => smoothScroll('impact')}>Impact</a></li>
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-success">Re:Process</span>
          </div>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a onClick={() => smoothScroll('hero')} className="hover:text-success">Home</a></li>
            <li><a onClick={() => smoothScroll('features')} className="hover:text-success">3R Features</a></li>
            <li><a onClick={() => smoothScroll('marketplace')} className="hover:text-success">Marketplace</a></li>
            <li><a onClick={() => smoothScroll('impact')} className="hover:text-success">Impact</a></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          <a href="/auth" className="btn btn-success text-white rounded-full">Login</a>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="hero min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Recycling and environment"
            fill
            style={{ objectFit: 'cover' }}
            className="brightness-50"
          />
        </div>
        <div className="hero-overlay bg-opacity-30"></div>
        <div className="hero-content text-center text-white z-10 max-w-4xl">
          <div>
            <h1 className="mb-6 text-4xl lg:text-6xl font-bold leading-tight">
              Transform Your Waste Into 
              <span className="text-success"> Value</span>
            </h1>
            <p className="mb-8 text-lg lg:text-xl opacity-90 max-w-2xl mx-auto">
              Join Indonesia's first AI-powered waste marketplace. Turn trash into cash while building a sustainable future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => smoothScroll('features')} 
                className="btn btn-success btn-lg text-white"
              >
                Get Started
              </button>
              <button 
                onClick={() => smoothScroll('marketplace')} 
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-base-content"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3R Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">The Power of 3R with Re:Process</h2>
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              At re:process, we empower you to embrace the 3Rs: Reduce, Reuse, Recycle with cutting-edge AI technology. Our intelligent assistant helps you make the best decisions for your waste, maximizing its value and minimizing environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Reduce */}
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                    <path d="M8 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-success">Reduce</h3>
                <p className="text-base-content/70">
                  Not sure what to do with an item? Our AI can analyze your waste type and suggest alternatives to disposal.
                </p>
              </div>
            </div>

            {/* Reuse */}
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-success">Reuse</h3>
                <p className="text-base-content/70">
                  Our AI identifies potential for reuse by suggesting upcycling ideas or connecting you with individuals or businesses looking for second-hand materials.
                </p>
              </div>
            </div>

            {/* Recycle */}
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-success">Recycle</h3>
                <p className="text-base-content/70">
                  Confused about what's recyclable? Simply snap a photo or give us a description of your waste. AI will instantly tell you how and where to recycle it effectively.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="btn btn-ghost text-success hover:bg-success hover:text-white">
              Learn more <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Your Waste, Your Money</h2>
            <p className="text-lg text-base-content/70 max-w-2xl">
              Re:Process is your direct marketplace for all types of recyclable waste, turning discarded materials into value.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* For Individual Sellers */}
              <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="badge badge-success text-white px-4 py-3 whitespace-nowrap">
                  For Individual Sellers
                </div>
                <p className="text-base-content/70">
                  Connect with buyers & arrange pickups. Turn waste into income.
                </p>
              </div>

              {/* For Business Waste */}
              <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="badge badge-success text-white px-4 py-3 whitespace-nowrap">
                  For Business Waste
                </div>
                <p className="text-base-content/70">
                  List industrial waste (e.g. scrap, off-cuts). Ensure compliant, profitable disposal.
                </p>
              </div>

              {/* For Business Buyers */}
              <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="badge badge-success text-white px-4 py-3 whitespace-nowrap">
                  For Business Buyers
                </div>
                <p className="text-base-content/70">
                  Set material specs & browse listings. Secure consistent, sustainable supply.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card bg-warning/10 border border-warning/20 shadow-lg">
                  <div className="card-body p-4 text-center">
                    <div className="w-12 h-12 bg-warning rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                      🍌
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Banana Peel</h4>
                    <p className="text-xs text-base-content/60 mb-3">Best of the best banana peel of the highest quality</p>
                    <p className="text-success font-bold">Rp 10.000 / kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="btn btn-ghost text-success hover:bg-success hover:text-white">
              See more wastes <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 lg:py-24 bg-slate-100 text-neutral-content">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-black text-3xl lg:text-4xl font-bold mb-6">
                Play Your Part,<br />See Your Impact
              </h2>
              <p className="text-black text-lg leading-relaxed">
                At Re:Process, every action you take contributes to a greener Indonesia. We believe that contribution should be recognized! Our gamified platform journeys, rewarding you for every step you take towards a more sustainable Indonesia.
              </p>
            </div>
            <div className="relative rounded-lg">
              <Image
                src="/img2.jpg"
                alt="Environmental impact"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Earn Impact Points */}
            <div className="card bg-base-100 text-base-content shadow-xl">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-warning/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <StarIcon />
                </div>
                <h3 className="font-semibold mb-3 text-warning">Earn Impact Points!</h3>
                <p className="text-sm text-base-content/70">
                  Every time you list, sell or make a sale or purchase materials you're helping. You'll earn Impact Points. Think of it like a credit card loyalty program - the more you contribute to the 3Rs, the higher your points and the more you dedicate to a cleaner environment.
                </p>
              </div>
            </div>

            {/* Unlock Exclusive Badges */}
            <div className="card bg-base-100 text-base-content shadow-xl">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-info/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AwardIcon />
                </div>
                <h3 className="font-semibold mb-3 text-info">Unlock Exclusive Badges!</h3>
                <p className="text-sm text-base-content/70">
                  Go for goals! From the "Plastic Hero" Collector' for recycling hundreds of bottles to the "Cardboard King" for processing cardboard waste, our system rewards your specific efforts with fun, themed badges. Collect them all and show off your environmental commitment.
                </p>
              </div>
            </div>

            {/* See Your Footprints */}
            <div className="card bg-base-100 text-base-content shadow-xl">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FootprintsIcon />
                </div>
                <h3 className="font-semibold mb-3 text-success">See Your Footprints!</h3>
                <p className="text-sm text-base-content/70">
                  Track and see your individual impact. This also gives you a real-time view of the collective impact of the forests community. See how much plastic you've helped divert, quantify the resources saved, and measure the positive change we're creating for Indonesia and beyond.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="btn btn-success text-white btn-lg">
              Earn now! <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-success text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Don't just discard, Re:Process! Let's build a more sustainable place for everyone, one smart action at a time.
          </h2>
          <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-success mt-8">
            Let's do it now! <ArrowRightIcon />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-neutral text-neutral-content">
        <aside>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold">Re:Process</span>
          </div>
          <p className="font-bold">
            Re:Process
            <br/>Building a sustainable future together
          </p> 
          <p>© 2024 Re:Process. All rights reserved.</p>
        </aside> 
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a href="#" className="hover:text-success transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-success transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-success transition-colors">Contact</a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default ReProcessLanding;