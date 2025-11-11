'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoIcon } from './icons/Icons';

export const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white">
            <LogoIcon className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold">Turnform</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white font-semibold hover:text-indigo-300 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
