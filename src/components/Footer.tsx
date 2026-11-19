import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import {
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  LinkedInIcon,
  InstagramIcon,
  WhatsAppIcon,
} from './SocialIcons';
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight, Lock } from 'lucide-react';
import { FALLBACK_LOGO_URL, handleImageError } from '../utils/imageFallback';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { settings, setActivePage, isAdminAuthenticated } = useData();
  const clickTimestampsRef = useRef<number[]>([]);

  // Discreet triple-click within 2 seconds opens Super Admin Gateway
  const handleLockClick = () => {
    const now = Date.now();
    const recent = [...clickTimestampsRef.current.filter((ts) => now - ts < 2000), now];
    clickTimestampsRef.current = recent;
    if (recent.length >= 3) {
      clickTimestampsRef.current = [];
      if (isAdminAuthenticated) {
        setActivePage('admin');
      } else {
        onOpenAdminLogin();
      }
    }
  };

  const socialButtons = [
    { name: 'TikTok', url: settings.socialLinks.tikTok, icon: TikTokIcon },
    { name: 'YouTube', url: settings.socialLinks.youTube, icon: YouTubeIcon },
    { name: 'Facebook', url: settings.socialLinks.facebook, icon: FacebookIcon },
    { name: 'LinkedIn', url: settings.socialLinks.linkedIn, icon: LinkedInIcon },
    { name: 'Instagram', url: settings.socialLinks.instagram, icon: InstagramIcon },
    { name: 'WhatsApp', url: settings.socialLinks.whatsAppGroup, icon: WhatsAppIcon },
  ];

  return (
    <footer className="bg-[#120B08] text-[#D6C7B8] border-t border-[#D9A62E]/30">
      {/* Luxury Motto & Identity Strip */}
      <div className="bg-[#1D120D] py-3.5 border-b border-[#D9A62E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <span className="font-extrabold tracking-[0.2em] text-[#F2C14E] uppercase">
              {settings.slogan}
            </span>
            <span className="hidden md:inline text-[#D9A62E]/50" aria-hidden="true">
              ·
            </span>
            <span className="hidden md:inline text-[#F9F5F0]/90">
              Nurturing Youth Talents Globally from Rusizi, Rwanda
            </span>
          </div>
          <span className="text-[11px] text-[#D6C7B8]">
            Registered Youth Talent Foundation · Ages 5–17
          </span>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand & Safeguarding */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full border border-[#D9A62E] bg-[#1D120D] p-1 shrink-0 shadow-[0_0_16px_rgba(217,166,46,0.2)] overflow-hidden">
                <img
                  src={settings.primaryLogo || '/logo.png'}
                  alt="Rusizi Kids Foundation Monogram Logo"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_LOGO_URL)}
                />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-[#F9F5F0] tracking-tight">
                  {settings.foundationName}
                </h4>
                <p className="text-xs text-[#F2C14E] font-bold tracking-wider uppercase">
                  {settings.slogan}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#D6C7B8] leading-relaxed">
              {settings.footerMissionBlurb ||
                'Rusizi Kids Foundation (RKF) is a dedicated talent incubation nonprofit in Rusizi, Rwanda. We develop, nurture, support, and promote children and youth through dance, film, music, fashion, and education.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1D120D] border border-[#D9A62E]/30 text-xs text-[#F9F5F0]">
              <ShieldCheck className="w-4 h-4 text-[#F2C14E] shrink-0" />
              <span>
                {settings.footerSafeguardingNote ||
                  'Strict Child Protection & Privacy Safeguards Enforced'}
              </span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-[#F2C14E] uppercase tracking-[0.16em]">
              Explore RKF
            </h5>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home' as const, label: 'Home' },
                { id: 'about' as const, label: 'About Us & Staff' },
                { id: 'programs' as const, label: 'Our Programs' },
                { id: 'children' as const, label: 'Our Children' },
                { id: 'news' as const, label: 'News & Events' },
                { id: 'gallery' as const, label: 'Media Gallery' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActivePage(item.id)}
                    className="text-[#D6C7B8] hover:text-[#F2C14E] transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Get Involved & Governance */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-[#F2C14E] uppercase tracking-[0.16em]">
              Get Involved
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('join')}
                  className="text-[#D6C7B8] hover:text-[#F2C14E] transition-colors inline-flex items-center gap-1"
                >
                  <span>Child Registration</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A62E]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('join')}
                  className="text-[#D6C7B8] hover:text-[#F2C14E] transition-colors inline-flex items-center gap-1"
                >
                  <span>Adult Membership</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A62E]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('donors')}
                  className="text-[#D6C7B8] hover:text-[#F2C14E] transition-colors"
                >
                  Donors &amp; Partners
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="text-[#D6C7B8] hover:text-[#F2C14E] transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li className="pt-2 border-t border-[#D9A62E]/20">
                <button
                  onClick={() => setActivePage('privacy')}
                  className="text-[#A89585] hover:text-[#F2C14E] transition-colors text-xs"
                >
                  Child Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('terms')}
                  className="text-[#A89585] hover:text-[#F2C14E] transition-colors text-xs"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contact & Social Channels */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="text-xs font-bold text-[#F2C14E] uppercase tracking-[0.16em]">
              Official Contact
            </h5>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F2C14E] shrink-0 mt-1" />
                <div>
                  <span className="block font-semibold text-[#F9F5F0]">{settings.location}</span>
                  <span className="text-xs text-[#A89585]">Western Province, Republic of Rwanda</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F2C14E] shrink-0 mt-1" />
                <div>
                  <a
                    href={`mailto:${settings.officialEmail}`}
                    className="font-medium text-[#F9F5F0] hover:text-[#F2C14E] transition-colors"
                  >
                    {settings.officialEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#F2C14E] shrink-0 mt-1" />
                <div className="flex flex-col gap-0.5 font-mono tabular-nums">
                  {settings.officialPhones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="font-medium text-[#F9F5F0] hover:text-[#F2C14E] transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D9A62E]/20">
              <span className="block text-[11px] font-bold text-[#D6C7B8] uppercase tracking-wider mb-2.5">
                Official Channels
              </span>
              <div className="flex flex-wrap gap-2">
                {socialButtons.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D120D] hover:bg-[#281912] text-[#F9F5F0] border border-[#D9A62E]/30 hover:border-[#F2C14E] text-xs font-medium transition-colors"
                      title={social.name}
                      aria-label={social.name}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                      <span>{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row + Discreet Gold-Tinted Triple-Click Admin Lock */}
        <div className="mt-12 pt-7 border-t border-[#D9A62E]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89585] gap-4">
          <div className="flex items-center gap-2">
            <p>
              © {new Date().getFullYear()}{' '}
              {settings.footerCopyrightText ||
                `${settings.foundationName} (RKF). All rights reserved.`}
            </p>
            <button
              type="button"
              onClick={handleLockClick}
              aria-label="Foundation Gateway"
              className="text-[#D9A62E]/40 hover:text-[#F2C14E]/80 transition-colors p-1 focus:outline-none cursor-default select-none"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActivePage('privacy')}
              className="hover:text-[#F2C14E] transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActivePage('terms')}
              className="hover:text-[#F2C14E] transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-[#F2C14E] font-medium">Rusizi, Rwanda</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
