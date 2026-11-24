import React from 'react';
import { useData } from '../context/DataContext';
import { ShieldCheck, Award, Edit3, CheckCircle2, ArrowRight } from 'lucide-react';
import { StaffMemberCard } from '../components/StaffMemberCard';
import { FALLBACK_MENTORSHIP_URL, handleImageError } from '../utils/imageFallback';

export const AboutPage: React.FC = () => {
  const { settings, leadership, setActivePage, isAdminAuthenticated, openAdminTab } = useData();

  const coreValues = Array.isArray(settings.aboutCoreValues)
    ? settings.aboutCoreValues
    : [
        {
          id: '1',
          title: 'Talent Empowerment',
          desc: 'Believing in the boundless artistic and intellectual potential of every child from Rusizi, regardless of socioeconomic background.',
        },
        {
          id: '2',
          title: 'Child Safeguarding & Dignity',
          desc: 'Ensuring zero tolerance for abuse, verified parental consent for all public appearances, and safe emotional and physical spaces.',
        },
        {
          id: '3',
          title: 'Rwandan Cultural Heritage',
          desc: 'Preserving Itorero traditional dances, storytelling, drumming, and patriotic values as an anchor of identity.',
        },
        {
          id: '4',
          title: 'Academic & Talent Synergy',
          desc: 'Requiring all enrolled children to attend school, with after-school tutoring and book supplies provided by our partners.',
        },
        {
          id: '5',
          title: 'Civic Responsibility (Umuganda)',
          desc: 'Instilling community solidarity, hygiene, environmental tree planting, and positive peer leadership across Rusizi.',
        },
      ];

  const storyParagraphs = Array.isArray(settings.aboutStoryParagraphs)
    ? settings.aboutStoryParagraphs
    : [
        'Rusizi District in the Western Province of Rwanda is home to vibrant, spirited young minds full of natural musicality, physical agility, and expressive emotion. Yet, far from the capital city of Kigali, many talented children lacked structured rehearsal spaces, costumes, artistic mentors, and protective guidance.',
        'Rusizi Kids Foundation was established to change that reality. By creating a warm, safe community sanctuary, we invited children aged 5 to 17 to discover their artistic voice. Whether mastering modern Afrobeat synchronization, preserving ancient Rwandan Itorero dance with traditional broom regalia, or acting in short films, each child is provided a structured path to thrive.',
        'We do not view artistic training in isolation. Every participant must be enrolled in school, with our coordinators monitoring attendance and academic effort. Through regular community cleaning actions (Umuganda) and anti-drug peer campaigns, our children grow into responsible citizens who lead by example.',
      ];

  const keyAchievements = [
    {
      metric: '120+',
      title: 'Children Mentored',
      detail: 'Active participants aged 5–17 trained tuition-free in Rusizi District.',
    },
    {
      metric: '8',
      title: 'Creative & Civic Tracks',
      detail: 'Dance, film, fashion, vocals, homework club, and monthly Umuganda service.',
    },
    {
      metric: '100%',
      title: 'School Enrollment Link',
      detail: 'Every registered academy artist maintains verified school attendance.',
    },
    {
      metric: '100%',
      title: 'Written Guardian Consent',
      detail: 'Strict adherence to Rwandan Law N° 71/2018 on child protection.',
    },
  ];

  return (
    <div className="bg-[#120B08] text-[#F9F5F0]">
      {/* Page Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
              <span>Organizational Profile</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#D6C7B8]">{settings.location}</span>
            </div>
            {isAdminAuthenticated && (
              <button
                onClick={() => openAdminTab('about_content')}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] font-extrabold text-xs shadow-sm inline-flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit About Us in CMS</span>
              </button>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F9F5F0] max-w-3xl">
            About {settings.foundationName} ({settings.abbreviation})
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-2xl leading-relaxed">
            {settings.purpose}
          </p>
        </div>
      </section>

      {/* Mission, Vision, Slogan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="luxury-card p-8 rounded-xl bg-[#281912] flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block mb-2">
                Our Motto
              </span>
              <h2 className="font-display text-2xl font-bold text-[#F9F5F0] tracking-tight">
                {settings.slogan}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#D6C7B8] leading-relaxed">
              Carrying the rhythm, artistic excellence, and cultural pride of Rwanda’s Western Province onto national and global stages.
            </p>
          </div>

          <div className="luxury-card p-8 rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block mb-2">
                Our Mission
              </span>
              <h3 className="font-display text-xl font-bold text-[#F9F5F0] tracking-tight">
                Nurture &amp; Empower
              </h3>
            </div>
            <p className="text-sm text-[#D6C7B8] leading-relaxed">{settings.mission}</p>
          </div>

          <div className="luxury-card p-8 rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block mb-2">
                Our Vision
              </span>
              <h3 className="font-display text-xl font-bold text-[#F9F5F0] tracking-tight">
                Global Recognition
              </h3>
            </div>
            <p className="text-sm text-[#D6C7B8] leading-relaxed">{settings.vision}</p>
          </div>
        </div>
      </section>

      {/* History & Genesis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
              Our History &amp; Genesis
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0] tracking-tight">
              {settings.aboutStoryHeadline || 'From the Hills of Rusizi to the Creative Horizon'}
            </h2>
            <div className="space-y-4 text-[#D6C7B8] text-sm sm:text-base leading-relaxed max-w-prose">
              {storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="rounded-2xl overflow-hidden border border-[#D9A62E]/35 shadow-xl bg-[#1D120D] flex-1 min-h-[300px]">
              <img
                src={settings.aboutHeroImage || FALLBACK_MENTORSHIP_URL}
                alt="Mentoring Gathering at Rusizi Kids Foundation"
                loading="lazy"
                decoding="async"
                className="w-full h-full max-h-[420px] object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, FALLBACK_MENTORSHIP_URL)}
              />
            </div>
            <div className="p-4 bg-[#1D120D] border border-[#D9A62E]/30 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#F2C14E] shrink-0 mt-0.5" />
              <div className="text-xs text-[#D6C7B8] leading-relaxed">
                <span className="font-bold text-[#F9F5F0]">Child Protection Pledge: </span>
                {settings.aboutProtectionPledge ||
                  'Rusizi Kids Foundation strictly adheres to Rwandan child protection laws (Law N° 71/2018 relating to the protection of the child). We obtain written guardian consent before any photo publication or public artistic performance.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Impact Strip */}
      <section className="bg-[#1D120D] py-14 border-y border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block mb-1">
                Verified Impact
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                Achievements &amp; Community Reach
              </h2>
            </div>
            <button
              onClick={() => setActivePage('programs')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2C14E] hover:underline"
            >
              <span>Explore Our Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyAchievements.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#281912] border border-[#D9A62E]/30 space-y-2"
              >
                <span className="font-mono tabular-nums text-3xl font-extrabold text-[#F2C14E] block">
                  {item.metric}
                </span>
                <h3 className="text-sm font-bold text-[#F9F5F0] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9A62E] shrink-0" />
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs text-[#D6C7B8] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[#120B08] py-16 border-b border-[#D9A62E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
              Guiding Principles
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0] tracking-tight">
              Our Core Values
            </h2>
            <p className="text-sm text-[#D6C7B8]">
              The ethical bedrock supporting every rehearsal, workshop, and public showcase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {coreValues.map((val) => (
              <div
                key={val.id}
                className="luxury-card p-6 rounded-xl flex flex-col justify-between space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#281912] border border-[#D9A62E]/40 text-[#F2C14E] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#F9F5F0] mb-1.5">
                    {val.title}
                  </h4>
                  <p className="text-xs text-[#D6C7B8] leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff & Team Section ("Meet Our Dedicated Team") */}
      <section
        id="leadership"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9A62E]/25 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block mb-1">
              Staff &amp; Governance
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0] tracking-tight">
              Meet Our Dedicated Team
            </h2>
            <p className="text-sm text-[#D6C7B8] mt-1 max-w-xl">
              Led by committed staff, mentors, and child development coordinators in Rusizi, Rwanda.
            </p>
          </div>
          {isAdminAuthenticated && (
            <button
              onClick={() => openAdminTab('leadership')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1D120D] px-3.5 py-2 rounded-lg border border-[#D9A62E]/40 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manage Staff &amp; Team ({leadership.length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((member) => (
            <StaffMemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
};
