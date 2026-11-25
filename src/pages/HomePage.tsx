import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChildrenPhotoShowcase } from '../components/ChildrenPhotoShowcase';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Edit3,
  MapPin,
  Mail,
  Send,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/SocialIcons';
import { DonorsPartnersMarquee } from '../components/DonorsPartnersMarquee';
import { StaffMemberCard } from '../components/StaffMemberCard';
import {
  FALLBACK_MENTORSHIP_URL,
  FALLBACK_PHOTO_URL,
  handleImageError,
} from '../utils/imageFallback';

export const HomePage: React.FC = () => {
  const {
    settings,
    setActivePage,
    navigateToPath,
    setSelectedProgramId,
    programs,
    children,
    announcements,
    leadership,
    submitContactMessage,
    isAdminAuthenticated,
    openAdminTab,
  } = useData();

  const [quickContact, setQuickContact] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [contactSent, setContactSent] = useState(false);

  const handleQuickContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContact.name || !quickContact.email || !quickContact.message) return;
    submitContactMessage(quickContact);
    setContactSent(true);
    setQuickContact({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setContactSent(false), 6000);
  };

  // Spotlight the four signature creative disciplines requested on Home
  const priorityCategories = ['Traditional Dance', 'Dance', 'Film & Acting', 'Fashion & Modeling'];
  const featuredPrograms = [
    ...priorityCategories
      .map((cat) => programs.find((p) => p.category === cat))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    ...programs.filter((p) => !priorityCategories.includes(p.category)),
  ].slice(0, 4);

  const featuredChildren = children.slice(0, 4);
  const latestAnnouncements = announcements.filter((a) => a.published).slice(0, 3);

  const defaultStats = [
    { id: 'stat-1', number: '120+', label: 'Children Nurtured', progress: 92 },
    { id: 'stat-2', number: String(programs.length || 8), label: 'Talent Disciplines', progress: 86 },
    { id: 'stat-3', number: '5–17', label: 'Age Group Focus', progress: 88 },
    { id: 'stat-4', number: '100%', label: 'Verified Guardian Consent', progress: 95 },
  ];

  const rawStats = Array.isArray(settings.stats) ? settings.stats : defaultStats;
  const statsList = rawStats.map((st, idx) => ({
    id: st.id || `stat-${idx + 1}`,
    number: st.number,
    label: st.label,
    progress: [92, 86, 88, 95][idx % 4] || 88,
  }));

  const statsGridCols =
    statsList.length === 1
      ? 'grid-cols-1 max-w-xs mx-auto'
      : statsList.length === 2
      ? 'grid-cols-2 max-w-lg mx-auto'
      : statsList.length === 3
      ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
      : 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className="bg-[#120B08] text-[#F9F5F0]">
      {/* 1. Full-Width Luxury Hero Section */}
      <section>
        <ChildrenPhotoShowcase variant="hero" />

        {/* Circular Gold-Ring Statistics & Impact Counters Row */}
        {(statsList.length > 0 || isAdminAuthenticated) && (
          <div className="bg-[#1D120D] border-y border-[#D9A62E]/28 py-10 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {isAdminAuthenticated && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => openAdminTab('impact_stats')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#281912] px-3 py-1.5 rounded-lg border border-[#D9A62E]/40 hover:border-[#F2C14E] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Impact Stats</span>
                  </button>
                </div>
              )}
              {statsList.length > 0 ? (
                <div className={`grid ${statsGridCols} gap-8`}>
                  {statsList.map((st, index) => {
                    const radius = 44;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (st.progress / 100) * circumference;
                    const gradId = `goldRingGrad-${index}`;

                    return (
                      <div key={st.id} className="flex flex-col items-center text-center group">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                            <defs>
                              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D9A62E" />
                                <stop offset="50%" stopColor="#F2C14E" />
                                <stop offset="100%" stopColor="#B8861B" />
                              </linearGradient>
                            </defs>
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              stroke="#281912"
                              strokeWidth="6"
                              fill="#120B08"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              stroke={`url(#${gradId})`}
                              strokeWidth="6"
                              strokeLinecap="round"
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <span className="absolute font-mono tabular-nums text-xl sm:text-2xl font-bold text-[#F2C14E]">
                            {st.number}
                          </span>
                        </div>
                        <span className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#F9F5F0]">
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-xs text-[#A89585]">
                  All impact stat cards have been removed. Click &quot;Edit Impact Stats&quot; above to add new ones.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Four Signature Programs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
              Structured Talent Incubation
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F5F0] tracking-tight">
              Signature Program Highlights
            </h2>
            <p className="text-sm text-[#D6C7B8] max-w-2xl">
              Coaching Rusizi children aged 5–17 in Traditional Dance, Modern Dance, Film &amp; Acting, and Fashion &amp; Modeling alongside academic mentorship.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isAdminAuthenticated && (
              <button
                onClick={() => openAdminTab('programs')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#1D120D] px-3 py-2 rounded-lg border border-[#D9A62E]/40"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Programs</span>
              </button>
            )}
            <a
              href="/programs"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActivePage('programs');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F2C14E] hover:text-[#F9F5F0] transition-colors whitespace-nowrap"
            >
              <span>All Programs ({programs.length})</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPrograms.map((prog) => (
            <article
              key={prog.id}
              onClick={() => {
                setSelectedProgramId(prog.id);
                setActivePage('programs');
              }}
              className="luxury-card rounded-xl overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="h-40 overflow-hidden bg-[#281912]">
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

              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#F9F5F0] tracking-tight leading-snug">
                  {prog.title}
                </h3>

                <div className="pt-3 border-t border-[#D9A62E]/20 flex items-center justify-between text-xs">
                  <span className="text-[#A89585] font-medium">Free Admission</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgramId(prog.id);
                      setActivePage('programs');
                    }}
                    className="text-[#F2C14E] font-bold hover:text-[#F9F5F0] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Welcome & Mission Section */}
      <section className="bg-[#1D120D] border-y border-[#D9A62E]/25 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[320px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-[#D9A62E]/35 shadow-2xl bg-[#120B08]">
                <img
                  src={settings.aboutHeroImage || FALLBACK_MENTORSHIP_URL}
                  alt="Mentorship Session at Rusizi Kids Foundation"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_MENTORSHIP_URL)}
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                  Welcome to RKF · Rusizi, Rwanda
                </span>
                {isAdminAuthenticated && (
                  <button
                    onClick={() => openAdminTab('about_content')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#F2C14E] bg-[#281912] px-2.5 py-1 rounded border border-[#D9A62E]/40"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit About</span>
                  </button>
                )}
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F9F5F0] tracking-tight">
                Rooted in Rusizi, Ready for the World
              </h2>

              <p className="text-sm sm:text-base text-[#D6C7B8] leading-relaxed">
                {settings.purpose ||
                  'To develop, nurture, support, and promote the talents of children aged 5–17.'}{' '}
                Founded in Rwanda’s Western Province, we unite structured artistic training, cultural pride, academic continuity, and strict child safeguarding.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#281912] border border-[#D9A62E]/30">
                  <h4 className="text-xs font-extrabold text-[#F2C14E] uppercase tracking-wider">
                    Our Mission
                  </h4>
                  <p className="text-xs text-[#D6C7B8] mt-2 leading-relaxed">{settings.mission}</p>
                </div>
                <div className="p-5 rounded-xl bg-[#281912] border border-[#D9A62E]/30">
                  <h4 className="text-xs font-extrabold text-[#F2C14E] uppercase tracking-wider">
                    Our Vision
                  </h4>
                  <p className="text-xs text-[#D6C7B8] mt-2 leading-relaxed">{settings.vision}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-5">
                <a
                  href="/about"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    setActivePage('about');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all inline-flex items-center gap-2 shadow-[0_0_18px_rgba(217,166,46,0.25)]"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <div className="flex items-center gap-2 text-xs text-[#D6C7B8] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#F2C14E]" />
                  <span>Zero-tuition child safeguarding charter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Children & Talents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
              Talent in Action
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F5F0] tracking-tight">
              Featured Children &amp; Talents
            </h2>
            <p className="text-sm text-[#D6C7B8] max-w-2xl">
              Celebrating young artists across Rusizi with documented parental consent and strict child protection standards.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isAdminAuthenticated && (
              <button
                onClick={() => openAdminTab('children')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#1D120D] px-3 py-2 rounded-lg border border-[#D9A62E]/40"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Profiles</span>
              </button>
            )}
            <button
              onClick={() => setActivePage('children')}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F2C14E] hover:text-[#F9F5F0] transition-colors whitespace-nowrap"
            >
              <span>View Full Roster</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredChildren.map((child) => (
            <article
              key={child.id}
              className="luxury-card rounded-xl overflow-hidden flex flex-col group"
            >
              <div className="h-56 overflow-hidden bg-[#281912]">
                <img
                  src={child.photo || FALLBACK_PHOTO_URL}
                  alt={child.publicName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                    <span>{child.talentCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums text-[#D6C7B8]">Age {child.age}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#F9F5F0]">{child.publicName}</h3>
                  <p className="text-xs text-[#D6C7B8] mt-1.5 line-clamp-2 leading-relaxed">
                    {child.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D9A62E]/20 text-[11px] text-[#A89585] flex items-center justify-between">
                  <span className="tabular-nums">Enrolled {child.joinYear}</span>
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
      </section>

      {/* 5. Latest News & Events */}
      <section className="bg-[#1D120D] border-y border-[#D9A62E]/25 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                Updates &amp; Upcoming Events
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F5F0] tracking-tight">
                Latest News &amp; Announcements
              </h2>
              <p className="text-sm text-[#D6C7B8] max-w-2xl">
                Official notices, talent festivals, casting calls, and guardian meetings across Rusizi District.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {isAdminAuthenticated && (
                <button
                  onClick={() => openAdminTab('announcements')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#281912] px-3 py-2 rounded-lg border border-[#D9A62E]/40"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Manage News</span>
                </button>
              )}
              <button
                onClick={() => setActivePage('news')}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F2C14E] hover:text-[#F9F5F0] transition-colors whitespace-nowrap"
              >
                <span>All News &amp; Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestAnnouncements.map((item) => (
              <article
                key={item.id}
                className="luxury-card bg-[#281912] rounded-xl overflow-hidden flex flex-col group"
              >
                <div className="h-48 overflow-hidden bg-[#120B08]">
                  <img
                    src={item.image || FALLBACK_PHOTO_URL}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#A89585] font-medium mb-2">
                      <span className="font-bold uppercase tracking-wider text-[#F2C14E]">
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Calendar className="w-3 h-3 text-[#D9A62E]" />
                        {item.publicationDate}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#F9F5F0] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#D6C7B8] mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9A62E]/20">
                    <button
                      onClick={() => setActivePage('news')}
                      className="text-xs font-bold text-[#F2C14E] hover:text-[#F9F5F0] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Read Announcement</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Meet Our Dedicated Team (Staff) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
              Leadership &amp; Mentors
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F5F0] tracking-tight">
              Meet Our Dedicated Team
            </h2>
            <p className="text-sm text-[#D6C7B8] max-w-2xl">
              Committed educators, artistic choreographers, and child safeguarding officers guiding Rusizi’s next generation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isAdminAuthenticated && (
              <button
                onClick={() => openAdminTab('leadership')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#1D120D] px-3 py-2 rounded-lg border border-[#D9A62E]/40"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Team</span>
              </button>
            )}
            <a
              href="/leadership"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                navigateToPath('/leadership');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F2C14E] hover:text-[#F9F5F0] transition-colors whitespace-nowrap"
            >
              <span>Full Leadership Roster</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.slice(0, 4).map((member) => (
            <StaffMemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* 7. Contact Us & Interactive Rusizi Map Section */}
      <section className="bg-[#1D120D] border-y border-[#D9A62E]/25 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
              Visit or Message Us
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0] tracking-tight">
              Connect with Rusizi Kids Foundation
            </h2>
            <p className="text-sm text-[#D6C7B8] max-w-xl">
              Visit our center in Rusizi District or reach our team directly via form or WhatsApp.
            </p>
          </div>
          <a
            href={settings.socialLinks.whatsAppGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp Community</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map & Location Card */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#1D120D] border border-[#D9A62E]/30 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F2C14E] shrink-0 mt-1" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                    Location
                  </span>
                  <span className="text-xs font-bold text-[#F9F5F0] block mt-0.5">
                    {settings.location}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1D120D] border border-[#D9A62E]/30 flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F2C14E] shrink-0 mt-1" />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                    Email &amp; Phone
                  </span>
                  <a
                    href={`mailto:${settings.officialEmail}`}
                    className="text-xs font-bold text-[#F9F5F0] hover:text-[#F2C14E] block truncate mt-0.5"
                  >
                    {settings.officialEmail}
                  </a>
                  <span className="text-[11px] text-[#D6C7B8] block font-mono tabular-nums">
                    {settings.officialPhones?.[0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 rounded-xl overflow-hidden border border-[#D9A62E]/35 shadow-lg bg-[#1D120D] flex flex-col">
              <div className="flex-1 min-h-[260px]">
                <iframe
                  title="Rusizi Kids Foundation Map - Rusizi, Rwanda"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '260px' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={
                    settings.googleMapsEmbedUrl ||
                    'https://maps.google.com/maps?q=-2.4877552,28.8997162+(Rusizi%20Kids%20Foundation)&t=&z=16&ie=UTF8&iwloc=&output=embed'
                  }
                />
              </div>
              <div className="p-4 bg-[#281912] text-[#F9F5F0] border-t border-[#D9A62E]/25 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#D6C7B8]">
                  Rusizi Kids Foundation Center · Rusizi, Rwanda
                </span>
                <a
                  href={settings.googleMapsShareUrl || 'https://maps.app.goo.gl/MugsUVjyLabnKDBD9'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="lg:col-span-6 luxury-card rounded-xl p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#F9F5F0]">
                Send Us a Direct Message
              </h3>
              <p className="text-xs text-[#D6C7B8] mt-1">
                Messages are routed directly to RKF leadership in Rusizi.
              </p>
            </div>

            {contactSent && (
              <div className="p-3.5 rounded-xl bg-[#281912] border border-[#D9A62E]/60 text-xs text-[#F9F5F0] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2C14E] shrink-0" />
                <span>Thank you! Your message has been received by Rusizi Kids Foundation.</span>
              </div>
            )}

            <form onSubmit={handleQuickContactSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickContact.name}
                    onChange={(e) => setQuickContact({ ...quickContact, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-xs text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={quickContact.email}
                    onChange={(e) => setQuickContact({ ...quickContact, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-xs text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={quickContact.phone}
                    onChange={(e) => setQuickContact({ ...quickContact, phone: e.target.value })}
                    placeholder="+250 788 000 000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-xs text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickContact.subject}
                    onChange={(e) => setQuickContact({ ...quickContact, subject: e.target.value })}
                    placeholder="Inquiry topic"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-xs text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quickContact.message}
                  onChange={(e) => setQuickContact({ ...quickContact, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-xs text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>

      {/* 8. Luxury Registration CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-2xl bg-[#1D120D] text-[#F9F5F0] p-8 sm:p-12 shadow-[0_0_40px_rgba(217,166,46,0.12)] border border-[#D9A62E]/40 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#F2C14E]">
              Enroll &amp; Empower · Ages 5–17 &amp; Adult Mentors
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F9F5F0]">
              Ready to Join Rusizi Kids Foundation?
            </h2>
            <p className="text-[#D6C7B8] text-sm sm:text-base leading-relaxed">
              Parents can enroll talented children free of tuition, adults (18+) can join our national volunteer network, and partners can sponsor education and stage programs.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <a
              href="/join"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActivePage('join');
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_24px_rgba(217,166,46,0.3)] transition-all whitespace-nowrap"
            >
              Register Child or Join (18+)
            </a>
            <a
              href="/donate"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setActivePage('donors');
              }}
              className="px-6 py-3.5 bg-[#281912] hover:bg-[#362218] text-[#F2C14E] border border-[#D9A62E]/60 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap"
            >
              Support Our Children
            </a>
          </div>
        </div>
      </section>

      {/* 9. Bottom Scrolling Donors & Partners Marquee (Right Above Footer) */}
      <DonorsPartnersMarquee />
    </div>
  );
};
