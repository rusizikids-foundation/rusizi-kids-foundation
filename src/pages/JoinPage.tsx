import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Users,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/SocialIcons';

export const JoinPage: React.FC = () => {
  const { settings, submitChildRegistration, submitAdultMembership, setActivePage } = useData();
  const [activeTab, setActiveTab] = useState<'child' | 'adult'>('child');

  // Child Registration State
  const [childForm, setChildForm] = useState({
    childName: '',
    age: 10,
    school: '',
    classLevel: '',
    fatherName: '',
    motherName: '',
    caregiverIdNumber: '',
    caregiverPhone: '',
    activitiesInterest: [] as string[],
    parentConsent: false,
  });
  const [childSubmitted, setChildSubmitted] = useState(false);
  const [showChildSuccessModal, setShowChildSuccessModal] = useState(false);
  const [childError, setChildError] = useState<string | null>(null);

  // Adult Membership State
  const [adultForm, setAdultForm] = useState({
    applicantName: '',
    age: 25,
    province: 'Western Province',
    district: 'Rusizi',
    idNumber: '',
    email: '',
    phone: '',
    membershipCategory: 'Volunteer Mentor' as const,
    motivation: '',
  });
  const [adultSubmitted, setAdultSubmitted] = useState(false);
  const [adultError, setAdultError] = useState<string | null>(null);

  const availableActivities = [
    'Modern & Urban Dance',
    'Traditional Rwandan Dance (Itorero)',
    'Film & Screen Acting',
    'Fashion & Modeling',
    'Singing & Vocal Music',
    'Talent Incubation & Coaching',
    'Homework & Reading Club',
    'Community Umuganda Cleanups',
  ];

  const whatsAppInviteUrl =
    settings.registrationWhatsAppUrl ||
    'https://chat.whatsapp.com/FysXKjXF5GG3eW5kSPy044';

  const toggleActivity = (activity: string) => {
    setChildForm((prev) => {
      const exists = prev.activitiesInterest.includes(activity);
      if (exists) {
        return {
          ...prev,
          activitiesInterest: prev.activitiesInterest.filter((a) => a !== activity),
        };
      } else {
        return {
          ...prev,
          activitiesInterest: [...prev.activitiesInterest, activity],
        };
      }
    });
  };

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChildError(null);

    if (childForm.age < 5 || childForm.age > 17) {
      setChildError('Child age must be between 5 and 17 years old.');
      return;
    }

    if (!childForm.parentConsent) {
      setChildError('Parent or guardian consent is mandatory to enroll a child.');
      return;
    }

    if (childForm.activitiesInterest.length === 0) {
      setChildError('Please select at least one talent or activity of interest.');
      return;
    }

    submitChildRegistration(childForm);
    setChildSubmitted(true);
    setShowChildSuccessModal(true);
    setChildForm({
      childName: '',
      age: 10,
      school: '',
      classLevel: '',
      fatherName: '',
      motherName: '',
      caregiverIdNumber: '',
      caregiverPhone: '',
      activitiesInterest: [],
      parentConsent: false,
    });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleAdultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdultError(null);

    if (adultForm.age < 18) {
      setAdultError('Adult National Membership is strictly for individuals aged 18 and above.');
      return;
    }

    submitAdultMembership(adultForm);
    setAdultSubmitted(true);
    setAdultForm({
      applicantName: '',
      age: 25,
      province: 'Western Province',
      district: 'Rusizi',
      idNumber: '',
      email: '',
      phone: '',
      membershipCategory: 'Volunteer Mentor',
      motivation: '',
    });
    setTimeout(() => setAdultSubmitted(false), 8000);
  };

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-20">
      {/* Luxury Dark Chocolate Editorial Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#F2C14E] block">
            Official Enrollment &amp; Membership Registry
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F9F5F0]">
            Join Rusizi Kids Foundation
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-3xl leading-relaxed">
            We operate two distinct registration paths: one for children aged 5–17 residing in or near Rusizi, and one for adult citizens (18+) across Rwanda seeking to support as mentors and advocates.
          </p>
        </div>
      </section>

      {/* Mode Selector Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('child')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              activeTab === 'child'
                ? 'bg-[#281912] border-[#D9A62E] ring-2 ring-[#D9A62E]/30 text-[#F9F5F0] shadow-lg'
                : 'bg-[#1D120D] border-[#D9A62E]/25 hover:border-[#D9A62E]/60 text-[#D6C7B8]'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                activeTab === 'child'
                  ? 'bg-gradient-to-br from-[#D9A62E] to-[#F2C14E] text-[#120B08]'
                  : 'bg-[#120B08] border border-[#D9A62E]/30 text-[#F2C14E]'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                System A · Ages 5–17
              </span>
              <span className="text-sm font-bold text-[#F9F5F0] block">
                Child Talent Registration
              </span>
              <span className="text-xs text-[#A89585]">
                With verified parent/guardian consent
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('adult')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              activeTab === 'adult'
                ? 'bg-[#281912] border-[#D9A62E] ring-2 ring-[#D9A62E]/30 text-[#F9F5F0] shadow-lg'
                : 'bg-[#1D120D] border-[#D9A62E]/25 hover:border-[#D9A62E]/60 text-[#D6C7B8]'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                activeTab === 'adult'
                  ? 'bg-gradient-to-br from-[#D9A62E] to-[#F2C14E] text-[#120B08]'
                  : 'bg-[#120B08] border border-[#D9A62E]/30 text-[#F2C14E]'
              }`}
            >
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                System B · Ages 18+
              </span>
              <span className="text-sm font-bold text-[#F9F5F0] block">
                National Adult Membership
              </span>
              <span className="text-xs text-[#A89585]">
                Mentors, coaches &amp; community advocates
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Main Forms Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'child' ? (
          /* System A: Child Registration Form */
          <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/30 p-6 sm:p-10 shadow-2xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                <Users className="w-4 h-4" />
                <span>System A · Registration</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                Child Talent Registration (Ages 5–17)
              </h2>
              <p className="text-xs sm:text-sm text-[#D6C7B8] mt-1">
                Please provide accurate details. Participation in RKF talent academies is completely free of charge. Parental or guardian consent is legally required.
              </p>
            </div>

            {childSubmitted ? (
              <div className="rounded-2xl bg-[#281912] border border-[#D9A62E]/70 p-6 sm:p-8 shadow-lg space-y-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#120B08] border-2 border-[#D9A62E] text-[#F2C14E] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#F2C14E]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official RKF Enrollment Confirmation</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0] tracking-tight pt-1">
                    {settings.registrationWhatsAppTitle || 'Registration Submitted Successfully!'}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#F2C14E]">
                    {settings.registrationWhatsAppSubtitle ||
                      'Thank you for registering your child with Rusizi Kids Foundation.'}
                  </p>
                  <p className="text-xs sm:text-sm text-[#D6C7B8] leading-relaxed pt-1">
                    Our Safeguarding Liaison has logged your child’s application and will also confirm rehearsal schedules via phone.
                  </p>
                </div>

                {/* Official Parents WhatsApp Group Invitation Card */}
                <div className="max-w-lg mx-auto bg-[#1D120D] rounded-2xl border border-[#D9A62E]/35 p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    <span>Next Step · Stay Connected</span>
                  </div>
                  <p className="text-sm text-[#D6C7B8] leading-relaxed">
                    {settings.registrationWhatsAppMessage ||
                      'Stay connected with updates, schedules, and announcements by joining the official Parents WhatsApp Group.'}
                  </p>

                  <a
                    href={whatsAppInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>
                      {settings.registrationWhatsAppButtonText || 'Join Parents WhatsApp Group'}
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-90 shrink-0" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setChildSubmitted(false)}
                    className="px-4 py-2.5 text-xs font-bold text-[#F2C14E] hover:bg-[#1D120D] border border-[#D9A62E]/40 rounded-lg transition-colors"
                  >
                    + Register Another Child
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePage('home')}
                    className="px-5 py-2.5 text-xs font-bold text-[#120B08] bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] rounded-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Return to Home</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {childError && (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{childError}</span>
                  </div>
                )}

                <form onSubmit={handleChildSubmit} className="space-y-6">
                  {/* Child Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                      1. Child Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Child Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={childForm.childName}
                          onChange={(e) => setChildForm({ ...childForm, childName: e.target.value })}
                          placeholder="e.g. Mugisha Kevin"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Age (5–17) *
                        </label>
                        <input
                          type="number"
                          required
                          min={5}
                          max={17}
                          value={childForm.age}
                          onChange={(e) =>
                            setChildForm({ ...childForm, age: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          School Attending *
                        </label>
                        <input
                          type="text"
                          required
                          value={childForm.school}
                          onChange={(e) => setChildForm({ ...childForm, school: e.target.value })}
                          placeholder="e.g. GS Rusizi / EP Kamembe"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Class / Level *
                        </label>
                        <input
                          type="text"
                          required
                          value={childForm.classLevel}
                          onChange={(e) =>
                            setChildForm({ ...childForm, classLevel: e.target.value })
                          }
                          placeholder="e.g. Primary 5 / Senior 2"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parents & Caregiver Details */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                      2. Parents &amp; Caregiver Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Father’s Name
                        </label>
                        <input
                          type="text"
                          value={childForm.fatherName}
                          onChange={(e) =>
                            setChildForm({ ...childForm, fatherName: e.target.value })
                          }
                          placeholder="Father's full name"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Mother’s Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={childForm.motherName}
                          onChange={(e) =>
                            setChildForm({ ...childForm, motherName: e.target.value })
                          }
                          placeholder="Mother's full name"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Caregiver National ID Number (NID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={childForm.caregiverIdNumber}
                          onChange={(e) =>
                            setChildForm({ ...childForm, caregiverIdNumber: e.target.value })
                          }
                          placeholder="16-digit Rwandan NID"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                          Caregiver Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={childForm.caregiverPhone}
                          onChange={(e) =>
                            setChildForm({ ...childForm, caregiverPhone: e.target.value })
                          }
                          placeholder="+250 788 000 000"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Activities of Interest */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                      3. Activities &amp; Talents in the Foundation
                    </h3>
                    <p className="text-xs text-[#D6C7B8]">
                      Select all talent programs the child wishes to participate in:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {availableActivities.map((act) => {
                        const isSelected = childForm.activitiesInterest.includes(act);
                        return (
                          <button
                            type="button"
                            key={act}
                            onClick={() => toggleActivity(act)}
                            className={`px-3.5 py-2.5 rounded-lg text-xs font-medium text-left border transition-colors flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#281912] border-[#D9A62E] text-[#F9F5F0] font-bold'
                                : 'bg-[#120B08] border-[#D9A62E]/25 text-[#D6C7B8] hover:border-[#D9A62E]/60'
                            }`}
                          >
                            <span>{act}</span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-[#F2C14E] shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded border border-[#D9A62E]/40" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Parental Consent Agreement */}
                  <div className="space-y-3 pt-4 border-t border-[#D9A62E]/25">
                    <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E]/30 text-xs text-[#D6C7B8] space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#F2C14E]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Parent or Legal Guardian Consent Declaration</span>
                      </div>
                      <p className="leading-relaxed">
                        By submitting this form, I confirm that I am the legal parent or guardian of the registered child. I give permission for the child to attend foundation rehearsals and workshops, and agree to the child safeguarding policies of Rusizi Kids Foundation.
                      </p>
                      <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={childForm.parentConsent}
                          onChange={(e) =>
                            setChildForm({ ...childForm, parentConsent: e.target.checked })
                          }
                          className="mt-0.5 rounded accent-[#D9A62E] w-4 h-4"
                        />
                        <span className="font-semibold text-[#F9F5F0] text-xs">
                          I have read, agree, and grant legal guardian consent for enrollment *
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                    >
                      Submit Child Registration
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A89585] mt-2">
                      <Lock className="w-3 h-3 text-[#D9A62E]" />
                      <span>
                        Submissions are stored securely and reviewed only by authorized administrators
                      </span>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        ) : (
          /* System B: Adult National Membership Form */
          <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/30 p-6 sm:p-10 shadow-2xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                <UserCheck className="w-4 h-4" />
                <span>System B · Registration</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                RKF National Membership Registration (Ages 18+)
              </h2>
              <p className="text-xs sm:text-sm text-[#D6C7B8] mt-1">
                For adults residing anywhere in Rwanda who wish to join our national network as volunteer mentors, artistic coaches, community supporters, or foundation advocates.
              </p>
            </div>

            {adultSubmitted && (
              <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E] text-xs text-[#F9F5F0] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#F2C14E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Membership Application Received!</span>
                  <span className="text-[#D6C7B8]">
                    Your application has been logged for administrative review. An RKF coordinator will review your profile and reach out via email/phone.
                  </span>
                </div>
              </div>
            )}

            {adultError && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{adultError}</span>
              </div>
            )}

            <form onSubmit={handleAdultSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                  1. Applicant Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adultForm.applicantName}
                      onChange={(e) =>
                        setAdultForm({ ...adultForm, applicantName: e.target.value })
                      }
                      placeholder="e.g. Jean Damascene Hakizimana"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Age (18+) *
                    </label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={99}
                      value={adultForm.age}
                      onChange={(e) =>
                        setAdultForm({ ...adultForm, age: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Province of Residence *
                    </label>
                    <select
                      value={adultForm.province}
                      onChange={(e) => setAdultForm({ ...adultForm, province: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    >
                      <option value="Western Province">Western Province</option>
                      <option value="Kigali City">Kigali City</option>
                      <option value="Northern Province">Northern Province</option>
                      <option value="Southern Province">Southern Province</option>
                      <option value="Eastern Province">Eastern Province</option>
                      <option value="Diaspora">Rwandan Diaspora</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      value={adultForm.district}
                      onChange={(e) => setAdultForm({ ...adultForm, district: e.target.value })}
                      placeholder="e.g. Rusizi, Gasabo, Rubavu..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                    National ID Number (NID) / Passport *
                  </label>
                  <input
                    type="text"
                    required
                    value={adultForm.idNumber}
                    onChange={(e) => setAdultForm({ ...adultForm, idNumber: e.target.value })}
                    placeholder="16-digit Rwandan NID"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                  2. Contact &amp; Membership Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={adultForm.email}
                      onChange={(e) => setAdultForm({ ...adultForm, email: e.target.value })}
                      placeholder="your.email@example.rw"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={adultForm.phone}
                      onChange={(e) => setAdultForm({ ...adultForm, phone: e.target.value })}
                      placeholder="+250 788 000 000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                    Membership Category *
                  </label>
                  <select
                    value={adultForm.membershipCategory}
                    onChange={(e) =>
                      setAdultForm({
                        ...adultForm,
                        membershipCategory: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  >
                    <option value="Volunteer Mentor">
                      Volunteer Mentor (Homework &amp; Life Skills)
                    </option>
                    <option value="Artistic Coach">
                      Artistic Coach (Dance, Music, Acting, Fashion)
                    </option>
                    <option value="Community Supporter">
                      Community Supporter (Events &amp; Logistics)
                    </option>
                    <option value="National Advocate">
                      National Advocate (Promoting RKF across Rwanda)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                    Motivation &amp; Skills Statement *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={adultForm.motivation}
                    onChange={(e) => setAdultForm({ ...adultForm, motivation: e.target.value })}
                    placeholder="Describe your background and why you wish to support the children of Rusizi..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Submit Membership Application
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A89585] mt-2">
                  <Lock className="w-3 h-3 text-[#D9A62E]" />
                  <span>
                    Applications undergo administrative background review per our safeguarding policy
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Immediate Post-Submission Child Registration Confirmation Modal */}
      {showChildSuccessModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="child-reg-success-title"
        >
          <div className="bg-[#1D120D] border-2 border-[#D9A62E] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative">
            <div className="bg-[#120B08] px-6 py-4 flex items-center justify-between border-b border-[#D9A62E]/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F2C14E]">
                <Sparkles className="w-4 h-4" />
                <span>Official Enrollment Confirmation</span>
              </div>
              <button
                type="button"
                onClick={() => setShowChildSuccessModal(false)}
                aria-label="Close confirmation modal"
                className="p-1.5 rounded-lg text-[#D6C7B8] hover:text-[#F2C14E] hover:bg-[#281912] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#281912] border-2 border-[#D9A62E] text-[#F2C14E] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3
                  id="child-reg-success-title"
                  className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]"
                >
                  {settings.registrationWhatsAppTitle || 'Registration Submitted Successfully!'}
                </h3>
                <p className="text-sm font-semibold text-[#F2C14E]">
                  {settings.registrationWhatsAppSubtitle ||
                    'Thank you for registering your child with Rusizi Kids Foundation.'}
                </p>
                <p className="text-xs sm:text-sm text-[#D6C7B8] leading-relaxed">
                  {settings.registrationWhatsAppMessage ||
                    'Stay connected with updates, schedules, and announcements by joining the official Parents WhatsApp Group.'}
                </p>
              </div>

              <a
                href={whatsAppInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>
                  {settings.registrationWhatsAppButtonText || 'Join Parents WhatsApp Group'}
                </span>
                <ExternalLink className="w-4 h-4 opacity-90 shrink-0" />
              </a>

              <button
                type="button"
                onClick={() => setShowChildSuccessModal(false)}
                className="text-xs font-semibold text-[#A89585] hover:text-[#F2C14E] transition-colors pt-1"
              >
                Close &amp; Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
