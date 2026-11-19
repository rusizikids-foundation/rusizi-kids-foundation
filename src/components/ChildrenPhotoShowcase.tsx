import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Heart,
  Edit3,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface ChildrenPhotoShowcaseProps {
  variant?: 'hero' | 'embedded';
}

export const ChildrenPhotoShowcase: React.FC<ChildrenPhotoShowcaseProps> = ({
  variant = 'hero',
}) => {
  const {
    settings,
    setActivePage,
    showcaseSlides,
    isAdminAuthenticated,
    openAdminTab,
  } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides =
    showcaseSlides && showcaseSlides.length > 0
      ? showcaseSlides
      : [
          {
            id: 'fallback-hero',
            image: settings.heroImage || '/assets/aistudio/New_Recording_69_2dab5d6c.jpeg',
            category: 'Youth Talent Academy',
            title: settings.heroCaptionTitle || 'Empowering Young Voices in Rusizi',
            subtitle: 'Dance · Film · Music · Fashion · Education',
            caption:
              settings.heroDescription ||
              'Rusizi Kids Foundation develops, nurtures, and promotes the creative talents of children aged 5–17 in Rusizi, Rwanda.',
            ageRange: 'Ages 5–17',
          },
        ];

  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  useEffect(() => {
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const goToNext = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];
  const isHero = variant === 'hero';

  return (
    <div
      className={`w-full relative overflow-hidden bg-[#120B08] text-[#F9F5F0] ${
        isHero
          ? 'h-[450px] sm:h-[550px] md:h-[620px] min-h-[450px]'
          : 'h-[420px] sm:h-[480px] min-h-[420px] rounded-2xl border border-[#D9A62E]/30 shadow-2xl'
      }`}
    >
      {/* Full-Width Single-Photo Ken Burns Background Stage */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        const kbClass = isActive
          ? index % 2 === 0
            ? 'animate-kenburns'
            : 'animate-kenburns-alt'
          : 'scale-100';

        return (
          <div
            key={slide.id}
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              transition: 'opacity 1000ms ease-in-out',
            }}
            className={`absolute inset-0 w-full h-full ${
              isActive ? '' : 'pointer-events-none'
            }`}
          >
            <img
              src={slide.image || '/assets/aistudio/New_Recording_69_2dab5d6c.jpeg'}
              alt={slide.title}
              className={`block w-full h-full object-cover object-center ${kbClass}`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallbackApplied) {
                  img.dataset.fallbackApplied = '1';
                  img.src = '/assets/aistudio/New_Recording_69_2dab5d6c.jpeg';
                }
              }}
            />
            {/* Balanced Dark Chocolate Contrast Gradient Overlays */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#120B08]/80 via-[#120B08]/35 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#120B08]/85 via-transparent to-[#120B08]/20"
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* Admin Quick Edit Trigger */}
      {isAdminAuthenticated && (
        <button
          type="button"
          onClick={() => openAdminTab('hero_slideshow')}
          className="absolute top-4 right-4 z-40 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all hover:brightness-110"
          title="Edit hero & slideshow photos in CMS"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Hero Slides ({slides.length})</span>
        </button>
      )}

      {/* Minimal Sleek Left / Right Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous photo"
            className="hidden sm:flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#120B08]/65 hover:bg-[#1D120D]/95 text-[#F9F5F0] hover:text-[#F2C14E] border border-[#D9A62E]/40 hover:border-[#F2C14E] items-center justify-center backdrop-blur-sm transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next photo"
            className="hidden sm:flex absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#120B08]/65 hover:bg-[#1D120D]/95 text-[#F9F5F0] hover:text-[#F2C14E] border border-[#D9A62E]/40 hover:border-[#F2C14E] items-center justify-center backdrop-blur-sm transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Foreground Content Layer */}
      <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-between max-w-7xl mx-auto left-0 right-0 px-4 sm:px-14 lg:px-16 py-6 sm:py-10 md:py-12">
        {/* Top Metadata Line */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F2C14E]">
            <span>
              {settings.heroBadgeText || 'Rusizi, Rwanda · Youth Talent Incubation'}
            </span>
            <span className="text-[#D9A62E]/50" aria-hidden="true">
              ·
            </span>
            <span className="text-[#D6C7B8]">{currentSlide.category}</span>
          </div>

          {!isAdminAuthenticated && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#D6C7B8]">
              <ShieldCheck className="w-4 h-4 text-[#F2C14E]" />
              <span>Verified Guardian Consent</span>
            </div>
          )}
        </div>

        {/* Center Hero Headline & Dual Gold CTAs */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 my-auto">
          <p className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#F2C14E]">
            FROM RUSIZI TO THE WORLD — NURTURING YOUTH TALENTS GLOBALLY
          </p>

          <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-bold text-[#F9F5F0] leading-[1.08] tracking-tight">
            {settings.heroHeadlineLine1 || 'FROM RUSIZI'}{' '}
            <span className="text-[#F2C14E] italic">
              {settings.heroHeadlineHighlight || 'TO THE WORLD.'}
            </span>
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-[#D6C7B8] max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-none">
            {settings.heroDescription ||
              'Rusizi Kids Foundation develops, nurtures, and promotes the extraordinary creative talents of children aged 5–17 in dance, film, music, fashion, and education.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={() => setActivePage(settings.heroCta1Page || 'join')}
              className="px-5 sm:px-7 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-lg shadow-[0_0_28px_rgba(217,166,46,0.35)] transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span>JOIN RKF</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActivePage(settings.heroCta2Page || 'donors')}
              className="px-5 sm:px-7 py-2.5 sm:py-3.5 bg-[#1D120D]/80 hover:bg-[#281912] text-[#F2C14E] border border-[#D9A62E] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              <span>SUPPORT US</span>
            </button>
          </div>
        </div>

        {/* Bottom Caption & Centered Gold Slide Indicator Dots */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-end justify-between gap-4">
            <p className="text-xs sm:text-sm font-medium text-[#D6C7B8] truncate max-w-2xl">
              <span className="font-bold text-[#F2C14E] mr-2">{currentSlide.ageRange}</span>
              <span className="font-bold text-[#F9F5F0]">{currentSlide.title}</span>
              <span className="hidden sm:inline"> — {currentSlide.subtitle}</span>
            </p>

            {slides.length > 1 && (
              <div className="flex sm:hidden items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Previous photo"
                  className="w-8 h-8 rounded-full bg-[#120B08]/75 text-[#F9F5F0] border border-[#D9A62E]/40 flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next photo"
                  className="w-8 h-8 rounded-full bg-[#120B08]/75 text-[#F9F5F0] border border-[#D9A62E]/40 flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 pt-0.5"
              aria-label="Slide indicator dots"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`View slide ${index + 1}: ${slide.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-[#F2C14E] shadow-[0_0_8px_rgba(242,193,78,0.65)]'
                      : 'w-2 bg-[#F9F5F0]/40 hover:bg-[#F2C14E]/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
