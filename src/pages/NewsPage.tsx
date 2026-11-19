import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Announcement } from '../types';
import { Calendar, ArrowRight, Share2, Search, X } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { announcements, setActivePage } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Foundation Announcements',
    'Upcoming Events',
    'Activities',
    'Parent Announcements',
    'Member Announcements',
    'Casting Announcements',
    'Recruitment',
    'Meetings',
    'Projects',
    'Completed Activities',
  ];

  const publishedList = announcements.filter((a) => a.published);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredList = publishedList.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    if (!matchesCat) return false;
    if (!normalizedQuery) return true;
    return (
      a.title.toLowerCase().includes(normalizedQuery) ||
      a.category.toLowerCase().includes(normalizedQuery) ||
      a.description.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleShare = (item: Announcement) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-16">
      {/* Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
            Official Notices &amp; Events
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9F5F0] tracking-tight">
            News &amp; Foundation Announcements
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-3xl leading-relaxed">
            Stay informed with official updates from Rusizi Kids Foundation, including talent recruitment calls, upcoming performances, and guardian meetings.
          </p>
        </div>
      </section>

      {/* Search & Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#D9A62E] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements or events..."
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
            {filteredList.length} published notices
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

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120B08]/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-[#1D120D] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D9A62E]/45"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-64 sm:h-72 relative bg-[#120B08]">
              <img
                src={selectedAnnouncement.image}
                alt={selectedAnnouncement.title}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D120D] via-[#120B08]/35 to-transparent" />
              <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest text-[#F2C14E]">
                {selectedAnnouncement.category}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 right-4 bg-[#120B08]/85 text-[#F9F5F0] border border-[#D9A62E]/40 w-9 h-9 rounded-full flex items-center justify-center hover:text-[#F2C14E] transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#D6C7B8] mb-2">
                  <span className="inline-flex items-center gap-1 font-semibold font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
                    Published: {selectedAnnouncement.publicationDate}
                  </span>
                  {selectedAnnouncement.eventDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-[#F2C14E] font-mono tabular-nums">
                        Event Date: {selectedAnnouncement.eventDate}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#F9F5F0] leading-snug">
                  {selectedAnnouncement.title}
                </h3>
              </div>

              <div className="text-sm text-[#D6C7B8] leading-relaxed whitespace-pre-line">
                {selectedAnnouncement.description}
              </div>

              <div className="pt-4 border-t border-[#D9A62E]/25 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleShare(selectedAnnouncement)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F9F5F0] hover:text-[#F2C14E] px-3 py-2 rounded-lg border border-[#D9A62E]/35 bg-[#281912]"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>{copiedId === selectedAnnouncement.id ? 'Link Copied!' : 'Share Notice'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#D6C7B8] hover:text-[#F9F5F0]"
                  >
                    Close
                  </button>
                  {selectedAnnouncement.registrationLink && (
                    <button
                      onClick={() => {
                        setSelectedAnnouncement(null);
                        setActivePage('join');
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-[#1D120D] rounded-xl border border-[#D9A62E]/25">
            <p className="text-sm text-[#D6C7B8]">
              No announcements matched your filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => (
              <article
                key={item.id}
                className="luxury-card rounded-xl overflow-hidden flex flex-col group"
              >
                <div className="h-48 overflow-hidden bg-[#281912]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#A89585] mb-2">
                      <span className="font-bold uppercase tracking-wider text-[#F2C14E]">
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{item.publicationDate}</span>
                      {item.eventDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-[#F9F5F0] font-mono tabular-nums">
                            Event: {item.eventDate}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#F9F5F0] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#D6C7B8] mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9A62E]/20 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedAnnouncement(item)}
                      className="text-xs font-bold text-[#F2C14E] hover:text-[#F9F5F0] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Read Notice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {item.registrationLink && (
                      <button
                        onClick={() => setActivePage('join')}
                        className="px-3 py-1 bg-[#281912] text-[#F2C14E] border border-[#D9A62E]/40 text-[11px] font-bold rounded hover:bg-[#D9A62E] hover:text-[#120B08] transition-colors"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
