import React from 'react';
import Link from 'next/link';
import { LandingHeader } from './LandingHeader';
import { ChartBarIcon, ExclamationTriangleIcon, PresentationChartLineIcon } from './icons/Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
        <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{children}</p>
    </div>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/70">
      <LandingHeader />
      <main className="flex-grow">
          {/* Hero Section */}
          <section 
            className="relative h-[60vh] flex items-center justify-center text-center text-white bg-gray-900"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1580261458040-d2a23a3ef14a?q=80&w=2940&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="relative z-10 p-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                Train Smarter,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Stay Stronger
                </span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                Track every turn, prevent overuse injuries, and reach your gymnastics goals with data-driven insights.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative py-20 mt-[-4rem]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white">Built for Athletes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <FeatureCard icon={<ChartBarIcon className="w-8 h-8"/>} title="Track Every Turn">
                    Log skills across Vault, Bars, Beam, and Floor with a simple tap. Your data persists across practices.
                </FeatureCard>
                <FeatureCard icon={<ExclamationTriangleIcon className="w-8 h-8"/>} title="Prevent Injuries">
                    Get real-time warnings when you approach overuse thresholds. Train smart, not just hard. (Coming Soon)
                </FeatureCard>
                <FeatureCard icon={<PresentationChartLineIcon className="w-8 h-8"/>} title="See Your Progress">
                    View daily, weekly, and monthly totals. Understand your training patterns and optimize performance.
                </FeatureCard>
              </div>
            </div>
          </section>
      </main>
       {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 text-center p-6">
            <p className="text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} Turnform. All rights reserved.</p>
        </footer>
    </div>
  );
};
