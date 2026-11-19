import React, { useRef, useState } from 'react';
import { ArrowRight, Edit3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SupporterShowcaseCard } from './SupporterShowcaseCard';

interface MarqueeSupporter {
  id: string;
  name: string;
  image?: string;
  roleBadge: string;
  description?: string;
  contribution?: string;
  contributionDate?: string;
  websiteUrl?: string;
  type: 'donor' | 'partner';
}

export const DonorsPartnersMarquee: React.FC = () => {
  const {
    donors,
    partners,
    setActivePage,
    isAdminAuthenticated,
    openAdminTab,
  } = useData();

  const [isPaused, setIsPaused] = useState(false);
  const touchResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const combined: MarqueeSupporter[] = [
    ...donors.map((d) => ({
      id: `donor-${d.id}`,
      name: d.name,
      image: d.photo || d.logo,
      roleBadge: d.role || d.tier || 'Individual Donor',
      description: d.description,
      contribution: d.contribution,
      contributionDate: d.contributionDate,
      websiteUrl: d.websiteUrl,
      type: 'donor' as const,
    })),
    ...partners.map((p) => ({
      id: `partner-${p.id}`,
      name: p.organizationName,
      image: p.photo || p.logo,
      roleBadge: p.role || 'Community Partner',
      description: p.description,
      contribution: p.contribution,
      contributionDate: p.contributionDate,
      websiteUrl: p.websiteUrl,
      type: 'partner' as const,
    })),
  ];

  if (combined.length === 0) return null;

  // Ensure enough cards in one half-track so wide viewports never show gaps before looping at -50%
  const baseTrack =
    combined.length >= 4
      ? combined
      : [...combined, ...combined, ...combined].slice(0, Math.max(4, combined.length * 2));

  const durationSeconds = Math.max(30, baseTrack.length * 6);

  const handleTouchStart = () => {
    if (touchResumeTimerRef.current) {
      clearTimeout(touchResumeTimerRef.current);
      touchResumeTimerRef.current = null;
    }
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (touchResumeTimerRef.current) {
      clearTimeout(touchResumeTimerRef.current);
    }
    touchResumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3200);
  };

  return (
    <section
      aria-label="Our Valued Donors and Partners"
      className="bg-[#160D09] border-t border-[#D9A62E]/28 py-14 sm:py-18 overflow-hidden"
    >
      {/* Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
              Gratitude &amp; Community Impact
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F5F0] tracking-tight">
              Our Valued Donors &amp; Partners
            </h2>
            <p className="text-xs sm:text-sm text-[#D6C7B8] max-w-2xl">
              Hover or touch any card to pause and read how our generous sponsors, partners, and donors empower Rusizi Kids Foundation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => openAdminTab('donors_partners')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#281912] px-3 py-2 rounded-lg border border-[#D9A62E]/45 hover:border-[#F2C14E] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Donors &amp; Partners</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActivePage('donors')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(217,166,46,0.22)] transition-all whitespace-nowrap"
            >
              <span>All Donors &amp; Support Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Smooth Scrolling Marquee Viewport */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Luxury Edge Fade Scrims */}
        <div
          className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-24 z-10 bg-gradient-to-r from-[#160D09] to-transparent"
          aria-hidden="true"
        />
        <div
          className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-24 z-10 bg-gradient-to-l from-[#160D09] to-transparent"
          aria-hidden="true"
        />

        <div
          className="animate-marquee items-stretch py-2"
          style={
            {
              '--marquee-duration': `${durationSeconds}s`,
              animationPlayState: isPaused ? 'paused' : 'running',
            } as React.CSSProperties
          }
        >
          {[0, 1].map((dupIndex) => (
            <div
              key={dupIndex}
              aria-hidden={dupIndex === 1}
              className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0"
            >
              {baseTrack.map((item, idx) => (
                <SupporterShowcaseCard
                  key={`${dupIndex}-${item.id}-${idx}`}
                  name={item.name}
                  image={item.image}
                  roleBadge={item.roleBadge}
                  description={item.description}
                  contribution={item.contribution}
                  contributionDate={item.contributionDate}
                  websiteUrl={item.websiteUrl}
                  fallbackType={item.type}
                  onClick={() => setActivePage('donors')}
                  className="w-[290px] sm:w-[330px] shrink-0"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
