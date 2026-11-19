import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ShieldCheck, CheckCircle2, Lock, Search, X } from 'lucide-react';
import { FALLBACK_PHOTO_URL, handleImageError } from '../utils/imageFallback';

export const ChildrenPage: React.FC = () => {
  const { children, setActivePage } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Dance',
    'Traditional Dance',
    'Film & Acting',
    'Fashion & Modeling',
    'Singing & Music',
    'Talent Development',
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredChildren = children.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.talentCategory === selectedCategory;
    if (!matchesCat) return false;
    if (!normalizedQuery) return true;
    return (
      c.publicName.toLowerCase().includes(normalizedQuery) ||
      c.talentCategory.toLowerCase().includes(normalizedQuery) ||
      c.description.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-16">
      {/* Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
            Rising Stars of Rwanda
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9F5F0] tracking-tight">
            Our Children’s Talent Showcase
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-3xl leading-relaxed">
            Witness the creative poise and artistic achievements of children enrolled in Rusizi Kids Foundation. Every published profile strictly honors our child safeguarding charter.
          </p>
        </div>
      </section>

      {/* Safeguarding & Privacy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="p-6 rounded-xl bg-[#1D120D] border border-[#D9A62E]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#281912] border border-[#D9A62E]/40 text-[#F2C14E] shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#F9F5F0]">
                Child Privacy &amp; Parental Consent Standard
              </h3>
              <p className="text-xs text-[#D6C7B8] leading-relaxed max-w-2xl">
                Only approved photographs with documented written guardian consent are published. Sensitive personal details, home addresses, private phone numbers, and school records remain strictly confidential.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('privacy')}
            className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] hover:bg-[#281912] border border-[#D9A62E]/45 bg-[#120B08] px-4 py-2 rounded-lg transition-colors shrink-0 inline-flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Safeguarding Policy</span>
          </button>
        </div>
      </section>

      {/* Search & Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#D9A62E] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search children by name or talent..."
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
            Showing {filteredChildren.length} of {children.length} profiles
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

      {/* Children Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredChildren.length === 0 ? (
          <div className="text-center py-16 bg-[#1D120D] rounded-xl border border-[#D9A62E]/25">
            <p className="text-sm text-[#D6C7B8]">
              No child talent profiles matched your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child) => (
              <article
                key={child.id}
                className="luxury-card rounded-xl overflow-hidden flex flex-col group"
              >
                <div className="h-64 overflow-hidden relative bg-[#281912]">
                  <img
                    src={child.photo || FALLBACK_PHOTO_URL}
                    alt={child.publicName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120B08]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-[#F9F5F0]">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                        {child.talentCategory}
                      </span>
                      <h3 className="font-display text-xl font-bold tracking-tight">
                        {child.publicName}
                      </h3>
                      <span className="text-xs text-[#D6C7B8] tabular-nums">
                        Age {child.age} · Enrolled {child.joinYear}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#D6C7B8] leading-relaxed">{child.description}</p>

                  <div className="space-y-3 pt-3 border-t border-[#D9A62E]/20">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block mb-1">
                        Activities at RKF
                      </span>
                      <p className="text-xs text-[#D6C7B8]">{child.activities.join(' · ')}</p>
                    </div>

                    {child.achievements.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block mb-1">
                          Achievements
                        </span>
                        <ul className="space-y-1">
                          {child.achievements.map((ach, i) => (
                            <li key={i} className="text-xs text-[#D6C7B8]">
                              · {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#D9A62E]/20 text-[11px] text-[#A89585] flex items-center justify-between">
                    <span>Rusizi, Rwanda</span>
                    {child.consentVerified && (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#F2C14E]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Consent Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Enroll Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="p-8 rounded-2xl bg-[#1D120D] text-[#F9F5F0] border border-[#D9A62E]/35 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-[#F9F5F0]">
              Does your child have a creative passion?
            </h3>
            <p className="text-xs sm:text-sm text-[#D6C7B8] mt-1 max-w-xl">
              We welcome children aged 5–17 in Rusizi District with free structured training in safe environments.
            </p>
          </div>
          <button
            onClick={() => setActivePage('join')}
            className="px-6 py-3 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap"
          >
            Submit Child Registration
          </button>
        </div>
      </section>
    </div>
  );
};
