import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageId } from '../types';
import { Menu, X, ChevronRight, Settings, LogOut, Mail } from 'lucide-react';
import { FALLBACK_LOGO_URL, handleImageError } from '../utils/imageFallback';
import { getPathForPage } from '../utils/routing';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    settings,
    isAdminAuthenticated,
    logoutAdmin,
  } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks =
    settings.navItems && settings.navItems.length > 0
      ? settings.navItems.filter((item) => item.visible)
      : [
          { id: 'home' as PageId, label: 'Home' },
          { id: 'about' as PageId, label: 'About Us' },
          { id: 'programs' as PageId, label: 'Our Programs' },
          { id: 'children' as PageId, label: 'Our Children' },
          { id: 'news' as PageId, label: 'News & Events' },
          { id: 'donors' as PageId, label: 'Donors & Partners' },
          { id: 'gallery' as PageId, label: 'Gallery' },
          { id: 'contact' as PageId, label: 'Contact Us' },
        ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: PageId) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    handleNavClick(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#120B08]/95 backdrop-blur-md border-b border-[#D9A62E]/25">
      {/* Super Admin Active Session Bar (Visible only when logged in) */}
      {isAdminAuthenticated && (
        <div className="bg-[#1D120D] text-[#F2C14E] px-4 py-1.5 text-xs border-b border-[#D9A62E]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="font-semibold text-[#F9F5F0] truncate">
              Super Admin Session Active · Full CMS Editing Enabled
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleNavClick('admin')}
                className="px-2.5 py-1 rounded bg-[#281912] hover:bg-[#362218] text-[#F2C14E] text-[11px] font-bold border border-[#D9A62E]/50 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Settings className="w-3 h-3 text-[#F2C14E]" />
                <span>Open Admin CMS</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="text-[#D6C7B8] hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="bg-[#1D120D] text-[#F9F5F0] text-[11px] sm:text-xs py-1.5 px-4 border-b border-[#D9A62E]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-extrabold tracking-[0.18em] text-[#F2C14E] uppercase whitespace-nowrap shrink-0">
              {settings.slogan}
            </span>
            <span className="hidden md:inline text-[#D9A62E]/50" aria-hidden="true">
              ·
            </span>
            <span className="hidden md:inline text-[#D6C7B8] truncate">
              {settings.announcementTicker ||
                'Empowering children aged 5–17 across dance, film, music, fashion & education in Rusizi, Rwanda'}
            </span>
          </div>
          <a
            href={`mailto:${settings.officialEmail}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-[#D6C7B8] hover:text-[#F2C14E] transition-colors whitespace-nowrap shrink-0"
          >
            <Mail className="w-3 h-3 text-[#D9A62E]" />
            <span>{settings.officialEmail}</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Dark Chocolate Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-6">
          {/* Brand Lockup with Circular Gold RKF Logo */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex items-center gap-3 text-left shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A62E] rounded-lg"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#D9A62E] shadow-[0_0_16px_rgba(217,166,46,0.22)] shrink-0 bg-[#1D120D] group-hover:scale-105 transition-transform duration-200 p-0.5">
              <img
                src={settings.primaryLogo || '/logo.png'}
                alt="Rusizi Kids Foundation Circular Gold Monogram Logo"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, FALLBACK_LOGO_URL)}
              />
            </div>
            <div className="min-w-0">
              <span className="block font-display text-base sm:text-lg font-bold tracking-tight text-[#F9F5F0] group-hover:text-[#F2C14E] transition-colors whitespace-nowrap">
                {settings.foundationName}
              </span>
              <span className="block text-[11px] font-medium text-[#D6C7B8] tracking-wide whitespace-nowrap">
                {settings.abbreviation} · Rusizi, Rwanda
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center gap-6 text-[13px] font-semibold"
          >
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <a
                  key={link.id}
                  href={getPathForPage(link.id)}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A62E] rounded ${
                    isActive
                      ? 'text-[#F2C14E] font-bold'
                      : 'text-[#D6C7B8] hover:text-[#F9F5F0]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons & Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="/donate"
              onClick={(e) => handleLinkClick(e, 'donors')}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1D120D] hover:bg-[#281912] border border-[#D9A62E]/55 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Support Us
            </a>
            <a
              href="/join"
              onClick={(e) => handleLinkClick(e, 'join')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#120B08] bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 rounded-lg shadow-[0_0_16px_rgba(217,166,46,0.28)] transition-all whitespace-nowrap shrink-0"
            >
              Join RKF
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-lg text-[#F2C14E] hover:bg-[#281912] border border-[#D9A62E]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A62E]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#D9A62E]/25 bg-[#120B08] shadow-2xl">
          <div className="px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <a
                  key={link.id}
                  href={getPathForPage(link.id)}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#281912] text-[#F2C14E] border border-[#D9A62E]/45'
                      : 'text-[#D6C7B8] hover:bg-[#1D120D] hover:text-[#F9F5F0]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight
                    className={`w-4 h-4 ${isActive ? 'text-[#F2C14E]' : 'text-[#A89585]'}`}
                  />
                </a>
              );
            })}

            <div className="pt-4 mt-3 border-t border-[#D9A62E]/20 flex flex-col gap-2.5">
              <a
                href="/join"
                onClick={(e) => handleLinkClick(e, 'join')}
                className="w-full text-center py-2.5 text-sm font-extrabold uppercase tracking-wider text-[#120B08] bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] rounded-lg transition-all shadow-sm block"
              >
                Join RKF (Child & Adult Registration)
              </a>
              <a
                href="/donate"
                onClick={(e) => handleLinkClick(e, 'donors')}
                className="w-full text-center py-2.5 text-sm font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1D120D] border border-[#D9A62E]/50 rounded-lg hover:bg-[#281912] transition-colors block"
              >
                Support Us · Donors & Partners
              </a>

              {isAdminAuthenticated && (
                <div className="pt-2 flex items-center justify-between text-xs text-[#D6C7B8]">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="text-[#F2C14E] font-bold hover:underline"
                  >
                    Open Super Admin Dashboard
                  </button>
                  <button
                    onClick={logoutAdmin}
                    className="text-rose-400 font-semibold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
