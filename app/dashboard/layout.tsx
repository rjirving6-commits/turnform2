'use client';

import React, { useState, useEffect } from 'react';
import { useAthleteManager } from '@/hooks/useAthleteManager';
import { Profile } from '@/components/Profile';
import { Sidebar } from '@/components/Sidebar';
import { LandingPage } from '@/components/LandingPage';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    athletes,
    activeAthlete,
    addAthlete,
    updateAthlete,
    setActiveAthlete,
    logout,
  } = useAthleteManager();
  
  // This state ensures we don't flash the setup screen before localStorage is read.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogout = () => {
    logout();
    // Redirect to landing page after logout
    window.location.href = '/';
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <Profile 
          athletes={athletes}
          activeAthlete={activeAthlete}
          addAthlete={addAthlete}
          updateAthlete={updateAthlete}
          setActiveAthlete={setActiveAthlete}
          isInitialSetup 
        />
      </div>
    );
  }

  if (!activeAthlete) {
     return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <p>Loading athlete...</p>
        </div>
     )
  }

  return (
    <div className="flex h-screen bg-gray-800 text-white font-sans">
      <Sidebar 
        athleteName={activeAthlete?.name}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 overflow-y-auto bg-gray-800">
        <div className="max-w-4xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
