'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, VideoCameraIcon, UserCircleIcon, BookmarkIcon, BookOpenIcon, LogoutIcon } from './icons/Icons';

type AppView = 'tracker' | 'aiCoach' | 'profile' | 'savedVideos' | 'skillLibrary';

interface SidebarProps {
  athleteName: string | undefined;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  href: string;
}> = ({ icon, label, isActive, href }) => (
  <Link
    href={href}
    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </Link>
);

export const Sidebar: React.FC<SidebarProps> = ({ athleteName, onLogout }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Turn Tracker', icon: <HomeIcon className="w-6 h-6" /> },
    { href: '/dashboard/ai-coach', label: 'AI Video Coach', icon: <VideoCameraIcon className="w-6 h-6" /> },
    { href: '/dashboard/saved-videos', label: 'Saved Videos', icon: <BookmarkIcon className="w-6 h-6" /> },
    { href: '/dashboard/skill-library', label: 'Skill Library', icon: <BookOpenIcon className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col h-full border-r border-gray-800">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-lg"></div>
        <span className="text-xl font-bold">COACH HaiLEY</span>
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
      
      <div className="mt-auto flex-shrink-0">
         <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700/50 hover:text-white"
        >
            <LogoutIcon className="w-6 h-6" />
            <span className="font-semibold">Log Out</span>
        </button>

        {athleteName && (
            <Link
                href="/dashboard/profile"
                className="w-full block mt-2 pt-2 border-t border-gray-700 text-left hover:bg-gray-800 rounded-lg p-3 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-gray-400"/>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{athleteName}</p>
                        <p className="text-xs text-gray-500">Manage Profile</p>
                    </div>
                </div>
            </Link>
        )}
      </div>
    </aside>
  );
};
