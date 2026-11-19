import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Heart,
  Handshake,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  ArrowDown,
  Smartphone,
  Copy,
  Check,
  Landmark,
  Edit3,
} from 'lucide-react';
import { SupporterShowcaseCard } from '../components/SupporterShowcaseCard';

export const DonorsPartnersPage: React.FC = () => {
  const {
    donors,
    partners,
    settings,
    submitDonorInquiry,
    submitPartnershipInquiry,
    addToast,
    isAdminAuthenticated,
    openAdminTab,
  } = useData();

  const [copiedCode, setCopiedCode] = useState(false);

  const [donorForm, setDonorForm] = useState({
    nameOrOrg: '',
    email: '',
    phone: '',
    supportType: 'Financial Sponsorship' as const,
    message: '',
  });
  const [donorSubmitted, setDonorSubmitted] = useState(false);

  const [partnerForm, setPartnerForm] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    proposedPartnership: '',
    description: '',
  });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const momoUssdCode = (settings.donationMomoUssdCode || '*182*1*1*0798465782#').trim();
  const momoTelHref = `tel:${momoUssdCode.replace(/#/g, '%23')}`;
  const momoPhone = settings.donationMomoPhone || '+250 798 465 782';
  const airtelPhone = settings.donationAirtelPhone || '+250 794 228 258';
  const accountHolder = settings.donationAccountName || settings.foundationName;

  const hasBankDetails = Boolean(
    settings.donationBankName?.trim() && settings.donationBankAccountNumber?.trim()
  );

  const handleCopyMomoCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(momoUssdCode);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = momoUssdCode;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopiedCode(true);
      addToast(`Mobile Money code ${momoUssdCode} copied to clipboard`, 'success');
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      addToast('Unable to access clipboard. Please dial or copy manually.', 'error');
    }
  };

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorForm.nameOrOrg || !donorForm.email) return;
    submitDonorInquiry(donorForm);
    setDonorSubmitted(true);
    setDonorForm({
      nameOrOrg: '',
      email: '',
      phone: '',
      supportType: 'Financial Sponsorship',
      message: '',
    });
    setTimeout(() => setDonorSubmitted(false), 6000);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.orgName || !partnerForm.email) return;
    submitPartnershipInquiry(partnerForm);
    setPartnerSubmitted(true);
    setPartnerForm({
      orgName: '',
      contactPerson: '',
      email: '',
      phone: '',
      proposedPartnership: '',
      description: '',
    });
    setTimeout(() => setPartnerSubmitted(false), 6000);
  };

  const impactAreas = [
    {
      title: 'Costumes & Instruments',
      desc: 'Supplying traditional kitenge dance fabric, brooms, Afrobeat performance outfits, drums (Ingoma), and sound accessories for rehearsals.',
    },
    {
      title: 'Education & School Bursaries',
      desc: 'Covering secondary and primary school tuition fees, notebooks, and uniforms so that talented youth remain in classrooms.',
    },
    {
      title: 'Rehearsal Nutrition & Snacks',
      desc: 'Providing clean drinking water and healthy nutrition after intense physical dance workouts and workshops.',
    },
    {
      title: 'Regional Travel & Showcases',
      desc: 'Covering safe ground transport and logistics for children to perform at provincial and national cultural festivals outside Rusizi.',
    },
  ];

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-20">
      {/* Luxury Dark Chocolate Editorial Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#F2C14E] block">
              Support Us · Stewardship &amp; Solidarity
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F9F5F0]">
              Support Rusizi Kids Foundation
            </h1>
            <p className="text-sm sm:text-base text-[#D6C7B8] leading-relaxed">
              Every contribution directly nurtures the dance, film, music, fashion, and academic dreams of children aged 5–17 in Rusizi District with zero tuition barriers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#support-channels"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] font-bold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <span>Donate via Mobile Money</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
            <a
              href="#become-partner"
              className="px-5 py-2.5 rounded-xl border border-[#D9A62E]/45 hover:border-[#F2C14E] text-[#F2C14E] hover:bg-[#281912] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Partner Inquiry
            </a>
          </div>
        </div>
      </section>

      {/* Prominent Donation & Mobile Money Payment Section */}
      <section id="support-channels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="p-6 sm:p-10 rounded-2xl bg-[#1D120D] border border-[#D9A62E]/40 shadow-[0_0_40px_rgba(217,166,46,0.12)] space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9A62E]/25 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                <DollarSign className="w-4 h-4" />
                <span>Official Donation &amp; Payment Methods</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                Direct Ways to Support Our Children
              </h2>
            </div>

            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => openAdminTab('donors_partners')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] bg-[#281912] px-3.5 py-2 rounded-lg border border-[#D9A62E]/45 hover:border-[#F2C14E] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Payment Methods in CMS</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Mobile Money USSD Card */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#281912] border-2 border-[#D9A62E]/60 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
                    <Smartphone className="w-4 h-4" />
                    <span>MTN Mobile Money (Instant USSD Code)</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A89585]">Rwanda MoMoPay / Direct</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F9F5F0]">
                  Give Immediately via Mobile Money
                </h3>
                <p className="text-xs sm:text-sm text-[#D6C7B8] leading-relaxed">
                  Tap <strong className="text-[#F9F5F0]">Pay via Mobile Money</strong> on your phone to dial in one tap, or copy the official USSD code below to complete your gift.
                </p>

                {/* Highlighted Monospaced USSD Code Display */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#120B08] border border-[#D9A62E]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A89585] block">
                      Official Mobile Money Donation Code
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-extrabold text-[#F2C14E] tracking-wider mt-0.5 tabular-nums select-all">
                      {momoUssdCode}
                    </div>
                  </div>
                  <div className="text-xs text-[#D6C7B8] sm:text-right">
                    <span className="block font-semibold text-[#F9F5F0]">{accountHolder}</span>
                    <span className="font-mono text-[11px] text-[#A89585] tabular-nums">
                      Helpline: {momoPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: One-tap tel: Dial & Copy Code */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href={momoTelHref}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(217,166,46,0.3)] transition-all"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span>Pay via Mobile Money</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyMomoCode}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#120B08] hover:bg-[#1D120D] text-[#F2C14E] border border-[#D9A62E]/55 hover:border-[#F2C14E] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shrink-0"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Airtel Money + Bank Transfer Section */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Airtel Money Card */}
              <div className="p-5 rounded-2xl bg-[#281912] border border-[#D9A62E]/25 space-y-2">
                <span className="text-xs font-bold text-[#F2C14E] block uppercase tracking-wider">
                  Airtel Money Rwanda
                </span>
                <p className="text-xs text-[#D6C7B8] leading-relaxed">
                  Direct mobile transfer also available via Airtel Money Rwanda:
                </p>
                <div className="font-mono text-base font-bold text-[#F9F5F0] pt-1 tabular-nums">
                  {airtelPhone}
                </div>
                <span className="text-[11px] text-[#A89585] block">
                  Registered Account: {accountHolder}
                </span>
              </div>

              {/* Bank Transfer Section (Coming Soon placeholder OR Admin-configured Bank Account) */}
              <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-[#281912] border border-[#D9A62E]/30 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F2C14E] uppercase tracking-wider">
                    <Landmark className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>

                  {hasBankDetails ? (
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-[#120B08] border border-[#D9A62E]/25 space-y-1.5">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A89585] block">
                            Bank Institution
                          </span>
                          <span className="font-bold text-[#F9F5F0] text-sm">
                            {settings.donationBankName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A89585] block">
                            Account Number
                          </span>
                          <span className="font-mono font-bold text-[#F2C14E] text-sm tabular-nums select-all">
                            {settings.donationBankAccountNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A89585] block">
                            Account Holder
                          </span>
                          <span className="text-[#D6C7B8] font-medium">
                            {settings.donationBankAccountName || accountHolder}
                          </span>
                        </div>
                        {settings.donationBankSwiftCode && (
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#A89585] block">
                              SWIFT / BIC
                            </span>
                            <span className="font-mono text-[#D6C7B8]">
                              {settings.donationBankSwiftCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="p-3.5 rounded-xl bg-[#120B08] border border-dashed border-[#D9A62E]/35">
                        <p className="text-xs sm:text-sm font-bold text-[#F2C14E]">
                          Official Bank Account Details — Coming Soon
                        </p>
                        <p className="text-[11px] text-[#D6C7B8] mt-1 leading-relaxed">
                          Our institutional bank wire coordinates are currently being finalized. For corporate grants or international transfers in the meantime, please contact{' '}
                          <a
                            href={`mailto:${settings.officialEmail}`}
                            className="text-[#F2C14E] font-semibold hover:underline"
                          >
                            {settings.officialEmail}
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[11px] text-[#A89585] block">
                  Official acknowledgment receipts issued for all contributions
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#D6C7B8] flex items-center gap-2 pt-4 border-t border-[#D9A62E]/20">
            <ShieldCheck className="w-4 h-4 text-[#F2C14E] shrink-0" />
            <span>
              Security Note: Rusizi Kids Foundation never stores raw payment card numbers. All electronic remittances are verified through authorized Rwandan financial networks.
            </span>
          </div>
        </div>
      </section>

      {/* Donation Impact Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E] block">
            Accountability &amp; Purpose
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0] tracking-tight">
            How Your Support Reaches the Children
          </h2>
          <p className="text-[#D6C7B8] text-sm">
            Every contribution directly empowers children aged 5–17 in Rusizi District with zero tuition barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactAreas.map((impact, i) => (
            <div
              key={i}
              className="luxury-card p-6 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="w-11 h-11 rounded-full bg-[#281912] border border-[#D9A62E]/40 text-[#F2C14E] flex items-center justify-center font-mono font-bold text-sm tabular-nums">
                0{i + 1}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F9F5F0]">
                  {impact.title}
                </h3>
                <p className="text-xs text-[#D6C7B8] mt-2 leading-relaxed">
                  {impact.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donors & Partners Roster */}
      <section className="bg-[#160D09] py-16 border-y border-[#D9A62E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Donors Roster */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E] block mb-1">
                  Our Benefactors
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                  Our Donors
                </h2>
              </div>
              <a
                href="#become-donor"
                className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] hover:underline transition-colors inline-flex items-center gap-1"
              >
                <span>Inquire as Donor</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <SupporterShowcaseCard
                  key={donor.id}
                  name={donor.name}
                  image={donor.photo || donor.logo}
                  roleBadge={donor.role || donor.tier || 'Individual Donor'}
                  description={donor.description}
                  contribution={donor.contribution}
                  contributionDate={donor.contributionDate}
                  highlights={donor.supportedProjects}
                  websiteUrl={donor.websiteUrl}
                  fallbackType="donor"
                />
              ))}
            </div>
          </div>

          {/* Partners Roster */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E] block mb-1">
                  Institutional &amp; Community Allies
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                  Our Partners
                </h2>
              </div>
              <a
                href="#become-partner"
                className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] hover:underline transition-colors inline-flex items-center gap-1"
              >
                <span>Inquire as Partner</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <SupporterShowcaseCard
                  key={partner.id}
                  name={partner.organizationName}
                  image={partner.photo || partner.logo}
                  roleBadge={partner.role || 'Community Partner'}
                  description={partner.description}
                  contribution={partner.contribution}
                  contributionDate={partner.contributionDate}
                  highlights={partner.supportedActivities}
                  websiteUrl={partner.websiteUrl}
                  fallbackType="partner"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Become a Donor & Become a Partner Forms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Become a Donor Form */}
          <div
            id="become-donor"
            className="p-8 rounded-2xl bg-[#1D120D] border border-[#D9A62E]/30 shadow-xl space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                <Heart className="w-4 h-4" />
                <span>Support a Child</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#F9F5F0]">Become a Donor</h2>
              <p className="text-xs text-[#D6C7B8] mt-1">
                Support our children’s artistic journey with financial sponsorship, costumes, or educational grants.
              </p>
            </div>

            {donorSubmitted && (
              <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E] text-xs text-[#F9F5F0] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2C14E] shrink-0" />
                <span>
                  Thank you! Your donor inquiry has been received. Our director will reply shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                  Full Name or Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={donorForm.nameOrOrg}
                  onChange={(e) => setDonorForm({ ...donorForm, nameOrOrg: e.target.value })}
                  placeholder="e.g. Rwandan Friends Foundation / John Smith"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorForm.email}
                    onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={donorForm.phone}
                    onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                    placeholder="+250 788 000 000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                  Type of Support
                </label>
                <select
                  value={donorForm.supportType}
                  onChange={(e) =>
                    setDonorForm({
                      ...donorForm,
                      supportType: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                >
                  <option value="Financial Sponsorship">Financial Sponsorship</option>
                  <option value="Costume & Equipment">Costume &amp; Equipment Donation</option>
                  <option value="Educational Bursaries">Educational School Bursaries</option>
                  <option value="Nutritional & Meal Support">Nutritional &amp; Meal Support</option>
                  <option value="Other">Other Specific Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                  Message / Proposed Contribution *
                </label>
                <textarea
                  required
                  rows={4}
                  value={donorForm.message}
                  onChange={(e) => setDonorForm({ ...donorForm, message: e.target.value })}
                  placeholder="Share details of your intended contribution..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Submit Donor Inquiry
              </button>
            </form>
          </div>

          {/* Become a Partner Form */}
          <div
            id="become-partner"
            className="p-8 rounded-2xl bg-[#1D120D] border border-[#D9A62E]/30 shadow-xl space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2C14E] mb-1">
                <Handshake className="w-4 h-4" />
                <span>Institutional Alliance</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#F9F5F0]">Become a Partner</h2>
              <p className="text-xs text-[#D6C7B8] mt-1">
                Collaborate with Rusizi Kids Foundation on arts workshops, stage showcases, or youth education.
              </p>
            </div>

            {partnerSubmitted && (
              <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E] text-xs text-[#F9F5F0] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2C14E] shrink-0" />
                <span>
                  Partnership inquiry submitted! We will evaluate your proposal and connect.
                </span>
              </div>
            )}

            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.orgName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, orgName: e.target.value })}
                    placeholder="e.g. Kigali Arts Center"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.contactPerson}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, contactPerson: e.target.value })
                    }
                    placeholder="e.g. Jean Damascene"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                    placeholder="contact@organization.rw"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                    placeholder="+250 788 123 456"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                  Proposed Partnership Area *
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.proposedPartnership}
                  onChange={(e) =>
                    setPartnerForm({ ...partnerForm, proposedPartnership: e.target.value })
                  }
                  placeholder="e.g. Masterclasses, Festival Hosting, Facility Sharing"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D6C7B8] uppercase tracking-wide mb-1">
                  Description of Collaboration *
                </label>
                <textarea
                  required
                  rows={4}
                  value={partnerForm.description}
                  onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                  placeholder="Describe your institution and how we can jointly uplift Rusizi children..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-transparent hover:bg-[#281912] text-[#F2C14E] border border-[#D9A62E]/60 hover:border-[#F2C14E] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Submit Partnership Proposal
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
