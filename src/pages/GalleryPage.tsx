import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../types';
import {
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Dance',
    'Traditional Dance',
    'Film & Acting',
    'Fashion',
    'Events',
    'Training',
    'Community Projects',
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = gallery.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCat) return false;
    if (!normalizedQuery) return true;
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.caption.toLowerCase().includes(normalizedQuery)
    );
  });

  const currentIndex = lightboxItem
    ? filteredItems.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  const goPrev = () => {
    if (filteredItems.length <= 1 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxItem(filteredItems[prevIdx]);
  };

  const goNext = () => {
    if (filteredItems.length <= 1 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    setLightboxItem(filteredItems[nextIdx]);
  };

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-16">
      {/* Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
            Visual Memories &amp; Performances
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9F5F0] tracking-tight">
            RKF Media Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-3xl leading-relaxed">
            Capturing the joy, discipline, and artistry of our youth during rehearsals, cultural festivals, runway shows, and community service across Rusizi.
          </p>
        </div>
      </section>

      {/* Search & Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#D9A62E] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos by title or caption..."
              className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-[#D9A62E]/35 bg-[#1D120D] text-xs sm:text-sm text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#A89585] hover:text-[#F9F5F0]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-[#D6C7B8] font-mono tabular-nums">
            {filteredItems.length} verified photos
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] font-bold shadow-sm'
                  : 'bg-[#1D120D] border border-[#D9A62E]/25 text-[#D6C7B8] hover:border-[#D9A62E]/60 hover:text-[#F9F5F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Full-Screen Image Viewer / Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120B08]/95 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="max-w-5xl w-full bg-[#1D120D] rounded-2xl overflow-hidden shadow-2xl border border-[#D9A62E]/45"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#120B08] flex items-center justify-center min-h-[320px] max-h-[75vh]">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#281912]/90 hover:bg-[#362218] text-[#F2C14E] border border-[#D9A62E]/50 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#281912]/90 hover:bg-[#362218] text-[#F2C14E] border border-[#D9A62E]/50 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 bg-[#281912] hover:bg-[#362218] text-[#F9F5F0] w-9 h-9 rounded-full flex items-center justify-center border border-[#D9A62E]/50 transition-colors"
                aria-label="Close full-screen viewer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-[#1D120D] text-[#F9F5F0] space-y-2 border-t border-[#D9A62E]/25">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#D6C7B8]">
                <span className="uppercase font-bold tracking-wider text-[#F2C14E]">
                  {lightboxItem.category}
                  {currentIndex >= 0 && (
                    <span className="ml-2 font-mono text-[#D6C7B8]">
                      · {currentIndex + 1} / {filteredItems.length}
                    </span>
                  )}
                </span>
                {lightboxItem.date && (
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>{lightboxItem.date}</span>
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-[#F9F5F0]">
                {lightboxItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D6C7B8] leading-relaxed">
                {lightboxItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#1D120D] rounded-xl border border-[#D9A62E]/25">
            <p className="text-sm text-[#D6C7B8]">
              No gallery photos matched your search or selected category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="luxury-card rounded-xl overflow-hidden cursor-pointer group flex flex-col"
              >
                <div className="h-64 overflow-hidden relative bg-[#281912]">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#120B08]/85 text-[#F2C14E] p-2 rounded-lg border border-[#D9A62E]/45">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                      <span>{item.category}</span>
                      {item.date && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums font-normal text-[#A89585]">
                            {item.date}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-[#F9F5F0] group-hover:text-[#F2C14E] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#D6C7B8] mt-1 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                  {item.consentVerified && (
                    <div className="pt-2.5 border-t border-[#D9A62E]/20 text-[11px] text-[#F2C14E] font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Parental Consent Verified</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Safeguarding Footer Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="p-4 rounded-xl bg-[#1D120D] border border-[#D9A62E]/30 text-center text-xs text-[#D6C7B8] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F2C14E] shrink-0" />
          <span>
            Notice: All media featuring minors is published strictly under documented written guardian publication consent.
          </span>
        </div>
      </section>
    </div>
  );
};
