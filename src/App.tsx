/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BrandPreloader } from './components/BrandPreloader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ChildrenPage } from './pages/ChildrenPage';
import { NewsPage } from './pages/NewsPage';
import { DonorsPartnersPage } from './pages/DonorsPartnersPage';
import { GalleryPage } from './pages/GalleryPage';
import { JoinPage } from './pages/JoinPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, setActivePage, isAdminAuthenticated, toasts, removeToast } = useData();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Scroll to top whenever activePage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Secret #admin URL hash trigger
  useEffect(() => {
    const checkAdminHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        if (isAdminAuthenticated) {
          setActivePage('admin');
        } else {
          setIsAdminModalOpen(true);
        }
      }
    };

    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);
    return () => window.removeEventListener('hashchange', checkAdminHash);
  }, [isAdminAuthenticated, setActivePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'children':
        return <ChildrenPage />;
      case 'news':
        return <NewsPage />;
      case 'donors':
        return <DonorsPartnersPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'join':
        return <JoinPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#120B08] text-[#F9F5F0] font-sans selection:bg-[#D9A62E] selection:text-[#120B08]">
      {/* Luxury Brand Preloader / Splash Screen */}
      <BrandPreloader />

      {/* Toast Notification Stack */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm transition-all duration-200 animate-slide-in-right ${
              toast.type === 'success'
                ? 'bg-[#1D120D] text-[#F9F5F0] border-[#D9A62E]/70 shadow-[0_0_24px_rgba(217,166,46,0.2)]'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-500/50'
                : 'bg-[#281912] text-[#F9F5F0] border-[#D9A62E]/40'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-[#F2C14E] shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-[#D9A62E] shrink-0 mt-0.5" />
            )}
            <p className="flex-1 text-xs leading-relaxed font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A89585] hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">{renderPage()}</main>

      {/* Official Footer */}
      <Footer onOpenAdminLogin={() => setIsAdminModalOpen(true)} />

      {/* Super Admin Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccessRedirect={() => {
          setActivePage('admin');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}
