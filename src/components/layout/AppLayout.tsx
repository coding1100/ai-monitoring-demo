import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { GuidedTourHUD } from './GuidedTourHUD';
import { useDemoStore } from '../../store/useDemoStore';

export const AppLayout: React.FC = () => {
  const darkMode = useDemoStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="relative min-h-screen flex flex-col antialiased">
      {/* Fixed static soft mesh in muted blue grey with warm grey and green grey blob */}
      <div
        className={`bg-mesh ${darkMode ? 'bg-mesh-dark' : 'bg-mesh-light'}`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 h-screen overflow-hidden">
        {/* 248px Glass Sidebar */}
        <Sidebar />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* 56px Top Header */}
          <Header />

          {/* Scrollable View Area with fade animation */}
          <main className="flex-1 overflow-y-auto px-6 py-6 pb-20 custom-scrollbar">
            <div className="max-w-[1440px] mx-auto w-full animate-fade-in">
              <Outlet />
            </div>
          </main>

          {/* Sticky Footer */}
          <Footer />
        </div>
      </div>

      {/* Guided Tour Floating HUD */}
      <GuidedTourHUD />
    </div>
  );
};
