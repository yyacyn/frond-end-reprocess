"use client";

import React, { useState } from 'react';
import { ChevronDown, Star, Award, Footprints, ArrowRight, Menu, X } from 'lucide-react';

const ReProcessLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-emerald-600 text-white relative">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold">Re:Process</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-emerald-200 transition-colors">Home</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">3R</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Buy/Sell</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Track</a>
            <button className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors">
              Login
            </button>
            <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-emerald-600 border-t border-emerald-500 z-50">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#" className="block hover:text-emerald-200">Home</a>
              <a href="#" className="block hover:text-emerald-200">3R</a>
              <a href="#" className="block hover:text-emerald-200">Buy/Sell</a>
              <a href="#" className="block hover:text-emerald-200">Track</a>
              <button className="w-full bg-emerald-500 px-4 py-2 rounded-lg">Login</button>
              <button className="w-full border border-white px-4 py-2 rounded-lg">Register</button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Your Waste, Reimagined.
            </h1>
            <p className="text-xl mb-6 text-emerald-100">
              Turn Trash Into Treasure. Connect, Sell, & Transform Waste with Re:Process.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-gray-100"></div>
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex space-x-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-6 h-20 bg-amber-200 rounded-sm transform rotate-2" style={{marginLeft: i * 2}}></div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs font-bold">♻</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </header>

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
              Learn more <ArrowRight size={16} className="ml-1" />
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
              See more wastes <ArrowRight size={16} className="ml-1" />
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
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Earn Impact Points!</h3>
                <p className="text-sm text-gray-600">
                  Every time you list, sell or make a sale or purchase materials you're helping. You'll earn Impact Points. Think of it like a credit card loyalty program - the more you contribute to the 3Rs, the higher your points and the more you dedicate to a cleaner environment.
                </p>
              </div>

              {/* Unlock Exclusive Badges */}
              <div className="bg-white text-gray-900 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2">Unlock Exclusive Badges!</h3>
                <p className="text-sm text-gray-600">
                  Go for goals! From the "Plastic Hero" Collector' for recycling hundreds of bottles to the "Cardboard King" for processing cardboard waste, our system rewards your specific efforts with fun, themed badges. Collect them all and show off your environmental commitment.
                </p>
              </div>

              {/* See Your Footprints */}
              <div className="bg-white text-gray-900 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Footprints className="w-6 h-6 text-green-600" />
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
              Earn now! <ArrowRight size={16} className="ml-2" />
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
            Let's do it now! <ArrowRight size={16} className="ml-2" />
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