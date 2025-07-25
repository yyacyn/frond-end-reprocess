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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className='flex justify-center'>
        <div className="navbar bg-base-100 shadow-lg w-3/4 fixed top-5 z-50 rounded-full px-3">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><a>Item 1</a></li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </li>
              <li><a>Item 3</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a>Item 1</a></li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <a href='auth' className="btn rounded-full btn-success">Login</a>
        </div>
      </div>
      </div>

      {/* Hero Section */}


      <section className="hero text-white">
       {/* Hero Section */}
        <div 
          className=' w-full relative top-0 h-[700px]'
          style={{
            backgroundImage: 'url("hero.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          
        </div>
      </section>


      {/* 3R Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Power of 3R with Re:Process</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At re:process, we empower you to embrace the 3Rs: Reduce, Reuse, Recycle with cutting-edge AI technology. Our intelligent assistant helps you make the best decisions for your waste, maximizing its value and minimizing environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Reduce */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                  <path d="M8 12l2 2 4-4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Reduce</h3>
              <p className="text-gray-600">
                Not sure what to do with an item? Our AI can analyze your waste type and suggest alternatives to disposal.
              </p>
            </div>

            {/* Reuse */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Reuse</h3>
              <p className="text-gray-600">
                Our AI identifies potential for reuse by suggesting upcycling ideas or connecting you with individuals or businesses looking for second-hand materials.
              </p>
            </div>

            {/* Recycle */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Recycle</h3>
              <p className="text-gray-600">
                Confused about what's recyclable? Simply snap a photo or give us a description of your waste. AI will instantly tell you how and where to recycle it effectively.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center">
              Learn more <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Your Waste, Your Money</h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Re:Process is your direct marketplace for all types of recyclable waste, turning discarded materials into value.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* For Individual Sellers */}
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  For Individual Sellers
                </div>
                <div>
                  <p className="text-gray-600">
                    Connect with buyers & arrange pickups. Turn waste into income.
                  </p>
                </div>
              </div>

              {/* For Business Waste */}
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  For Business Waste
                </div>
                <div>
                  <p className="text-gray-600">
                    List industrial waste (e.g. scrap, off-cuts). Ensure compliant, profitable disposal.
                  </p>
                </div>
              </div>

              {/* For Business Buyers */}
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  For Business Buyers
                </div>
                <div>
                  <p className="text-gray-600">
                    Set material specs & browse listings. Secure consistent, sustainable supply.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs font-bold">🍌</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Banana Peel</h4>
                  <p className="text-xs text-gray-600 mb-2">Best of the best banana peel of the highest quality</p>
                  <p className="text-emerald-600 font-semibold text-xs">Rp 10.000 / kg</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center">
              See more wastes <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Play Your Part,<br />See Your Impact
              </h2>
              <p className="text-gray-300 mb-8">
                At Re:Process, every action you take contributes to a greener Indonesia. We believe that contribution should be recognized! Our gamified platform journeys, rewarding you for every step you take towards a more sustainable Indonesia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Earn Impact Points */}
              <div className="bg-white text-gray-900 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <StarIcon />
                </div>
                <h3 className="font-semibold mb-2">Earn Impact Points!</h3>
                <p className="text-sm text-gray-600">
                  Every time you list, sell or make a sale or purchase materials you're helping. You'll earn Impact Points. Think of it like a credit card loyalty program - the more you contribute to the 3Rs, the higher your points and the more you dedicate to a cleaner environment.
                </p>
              </div>

              {/* Unlock Exclusive Badges */}
              <div className="bg-white text-gray-900 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AwardIcon />
                </div>
                <h3 className="font-semibold mb-2">Unlock Exclusive Badges!</h3>
                <p className="text-sm text-gray-600">
                  Go for goals! From the "Plastic Hero" Collector' for recycling hundreds of bottles to the "Cardboard King" for processing cardboard waste, our system rewards your specific efforts with fun, themed badges. Collect them all and show off your environmental commitment.
                </p>
              </div>

              {/* See Your Footprints */}
              <div className="bg-white text-gray-900 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FootprintsIcon />
                </div>
                <h3 className="font-semibold mb-2">See Your Footprints!</h3>
                <p className="text-sm text-gray-600">
                  Track and see your individual impact. This also gives you a real-time view of the collective impact of the forests community. See how much plastic you've helped divert, quantify the resources saved, and measure the positive change we're creating for Indonesia and beyond.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors inline-flex items-center">
              Earn now! <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Don't just discard, Re:Process! Let's build a more sustainable place for everyone, one smart action at a time.
          </h2>
          <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors inline-flex items-center mt-8">
            Let's do it now! <ArrowRightIcon />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-bold">Re:Process</span>
          </div>
          <p className="text-gray-400">
            © 2024 Re:Process. Building a sustainable future together.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReProcessLanding;