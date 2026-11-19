import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Program } from '../types';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { FALLBACK_PHOTO_URL, handleImageError } from '../utils/imageFallback';

export const ProgramsPage: React.FC = () => {
  const { programs, setActivePage, selectedProgramId } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailProgram, setActiveDetailProgram] = useState<Program | null>(() => {
    if (selectedProgramId) {
      const match = programs.find((p) => p.id === selectedProgramId);
      return match || null;
    }
    return null;
  });

  const categories = [
    'All',
    'Dance',
    'Traditional Dance',
    'Film & Acting',
    'Fashion & Modeling',
    'Singing & Music',
    'Talent Development',
    'Educational Activities',
    'Community Projects',
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPrograms = programs.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    if (!matchesCat) return false;
    if (!normalizedQuery) return true;
    return (
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-16">
      {/* Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
            Holistic Youth Development · Ages 5–17
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9F5F0] tracking-tight">
            Our Talent &amp; Educational Programs
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-3xl leading-relaxed">
            Every child in Rusizi has a unique spark. Our structured curriculum combines artistic coaching with character building, academic tutoring, and community solidarity.
          </p>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#D9A62E] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs by title or discipline..."
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
            Showing {filteredPrograms.length} of {programs.length} programs
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveDetailProgram(null);
              }}
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

      {/* Program Detail Modal */}
      {activeDetailProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120B08]/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveDetailProgram(null)}
        >
          <div
            className="bg-[#1D120D] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D9A62E]/45"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-64 relative bg-[#120B08]">
              <img
                src={activeDetailProgram.image || FALLBACK_PHOTO_URL}
                alt={activeDetailProgram.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D120D] via-[#120B08]/35 to-transparent" />
              <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest text-[#F2C14E]">
                {activeDetailProgram.category}
              </span>
              <button
                onClick={() => setActiveDetailProgram(null)}
                className="absolute top-4 right-4 bg-[#120B08]/85 text-[#F9F5F0] border border-[#D9A62E]/40 w-9 h-9 rounded-full flex items-center justify-center hover:text-[#F2C14E] transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#F9F5F0]">
                  {activeDetailProgram.title}
                </h3>
                {activeDetailProgram.schedule && (
                  <div className="flex items-center gap-1.5 text-xs text-[#F2C14E] font-semibold mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>{activeDetailProgram.schedule}</span>
                  </div>
                )}
                <p className="text-sm text-[#D6C7B8] mt-3 leading-relaxed">
                  {activeDetailProgram.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] mb-3">
                  Core Activities &amp; Training
                </h4>
                <ul className="space-y-2">
                  {activeDetailProgram.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#D6C7B8]">
                      <CheckCircle2 className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeDetailProgram.achievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] mb-3">
                    Key Achievements &amp; Milestones
                  </h4>
                  <ul className="space-y-2">
                    {activeDetailProgram.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#D6C7B8]">
                        <Sparkles className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-[#D9A62E]/25 flex items-center justify-between">
                <button
                  onClick={() => setActiveDetailProgram(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#D6C7B8] hover:text-[#F9F5F0]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveDetailProgram(null);
                    setActivePage('join');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-sm"
                >
                  Enroll Child in Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-16 bg-[#1D120D] rounded-xl border border-[#D9A62E]/25">
            <p className="text-sm text-[#D6C7B8]">
              No programs matched your search or filter selection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <article
                key={prog.id}
                className="luxury-card rounded-xl overflow-hidden flex flex-col group"
              >
                <div className="h-52 overflow-hidden bg-[#281912]">
                  <img
                    src={prog.image || FALLBACK_PHOTO_URL}
                    alt={prog.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                      <span>{prog.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#D6C7B8]">Ages 5–17</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#F9F5F0] tracking-tight">
                      {prog.title}
                    </h3>
                    {prog.schedule && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#D6C7B8] font-semibold mt-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>{prog.schedule}</span>
                      </div>
                    )}
                    <p className="text-xs text-[#D6C7B8] mt-2.5 line-clamp-3 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#D9A62E]/20">
                    <ul className="space-y-1 text-xs text-[#A89585]">
                      {prog.activities.slice(0, 2).map((act, i) => (
                        <li key={i} className="truncate">
                          · {act}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setActiveDetailProgram(prog)}
                        className="text-xs font-bold text-[#F2C14E] hover:text-[#F9F5F0] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Program Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActivePage('join')}
                        className="px-3.5 py-1.5 bg-[#281912] hover:bg-[#D9A62E] text-[#F2C14E] hover:text-[#120B08] border border-[#D9A62E]/40 text-xs font-bold rounded-md transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Program Enrollment Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="p-8 rounded-2xl bg-[#1D120D] text-[#F9F5F0] border border-[#D9A62E]/35 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-display text-2xl font-bold text-[#F9F5F0]">
              Are you a parent or guardian in Rusizi?
            </h3>
            <p className="text-xs sm:text-sm text-[#D6C7B8] leading-relaxed">
              Admission into Rusizi Kids Foundation programs is 100% free and merit-based. We prioritize discipline, school attendance, and guardian involvement.
            </p>
          </div>
          <button
            onClick={() => setActivePage('join')}
            className="px-6 py-3 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-sm shrink-0"
          >
            Register Child (Ages 5–17)
          </button>
        </div>
      </section>
    </div>
  );
};
