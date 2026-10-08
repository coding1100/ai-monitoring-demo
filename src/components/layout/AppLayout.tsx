import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { GuidedTourHUD } from './GuidedTourHUD';
import { useDemoStore } from '../../store/useDemoStore';
import { AlertCircle, LogOut } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const darkMode = useDemoStore((state) => state.darkMode);
  const supportSessionWorkspace = useDemoStore((state) => state.supportSessionWorkspace);
  const endSupportSession = useDemoStore((state) => state.endSupportSession);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleExitSupport = () => {
    endSupportSession();
    navigate('/agency/workspaces');
  };

  return (
    <div className="relative min-h-screen flex flex-col antialiased">
      {/* Fixed static soft mesh in muted blue grey with warm grey and green grey blob */}
      <div
        className="bg-mesh"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 h-screen overflow-hidden">
        {/* 248px Glass Sidebar */}
        <Sidebar />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Banner when Support Session is Active */}
          {supportSessionWorkspace && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 backdrop-blur-md shrink-0 z-20">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-semibold">Support session logged</span>
                <span className="text-amber-800 dark:text-amber-300 font-mono">
                  [Tenant: {supportSessionWorkspace}]
                </span>
              </div>
              <button
                onClick={handleExitSupport}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-amber-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-xs hover:bg-amber-700 transition-colors"
              >
                <LogOut className="h-3 w-3" />
                <span>Exit Support Session</span>
              </button>
            </div>
          )}

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
