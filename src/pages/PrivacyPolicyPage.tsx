import React from 'react';
import { useData } from '../context/DataContext';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useData();

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-20">
      {/* Luxury Dark Chocolate Editorial Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
            <ShieldCheck className="w-4 h-4" />
            <span>Child Safeguarding &amp; Legal Charter</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F9F5F0]">
            Privacy Policy &amp; Child Protection Charter
          </h1>
          <p className="text-xs text-[#A89585]">
            Last reviewed: March 2026 · Compliant with Rwandan Law N° 058/2021 &amp; Law N° 71/2018
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <div className="p-5 rounded-xl bg-[#281912] border border-[#D9A62E]/40 text-xs sm:text-sm text-[#D6C7B8] leading-relaxed shadow-lg">
          <span className="font-bold text-[#F2C14E] block mb-1">
            Fundamental Commitment to Minors (Ages 5–17)
          </span>
          Rusizi Kids Foundation (RKF) holds child safety, dignity, and privacy as its paramount institutional duty. Under no circumstances do we commercialize or expose children’s sensitive personal records.
        </div>

        <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/25 p-6 sm:p-10 space-y-8 text-sm text-[#D6C7B8] leading-relaxed shadow-xl">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              1. Information We Collect
            </h2>
            <p>
              When a parent or legal guardian enrolls a child aged 5–17, or when an adult registers for national membership, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#D6C7B8]">
              <li>
                <strong className="text-[#F9F5F0]">Child Identification:</strong> Full name, age, educational school, and class level for academic monitoring.
              </li>
              <li>
                <strong className="text-[#F9F5F0]">Caregiver Safeguarding Data:</strong> Parent/guardian names, official Rwandan National Identification Number (NID), and verified telephone numbers for emergency liaison.
              </li>
              <li>
                <strong className="text-[#F9F5F0]">Adult Membership Data:</strong> Legal name, age (strictly 18+), province, district, NID/Passport number, email, and phone number.
              </li>
              <li>
                <strong className="text-[#F9F5F0]">Contact &amp; Inquiries:</strong> Name, organization name, email address, and correspondence notes submitted through our website.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              2. Mandatory Parental / Guardian Consent for Media
            </h2>
            <p>
              In compliance with Rwandan Law N° 71/2018 relating to the protection of the child:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#D6C7B8]">
              <li>
                No photograph, video recording, or public showcase featuring a child is captured or published without prior documented, written consent from the child’s legal parent or guardian.
              </li>
              <li>
                On public pages (such as Our Children and Gallery), we never publish a child’s national ID, home address, private phone number, or specific school records. We employ protective name formats (e.g. first name and initial).
              </li>
              <li>
                Parents or legal guardians retain the unconditional right to withdraw consent at any time. Upon written notice to{' '}
                <code className="font-mono text-[#F2C14E]">{settings.officialEmail}</code>, any specific media will be promptly removed from public platforms within 48 hours.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              3. Purpose and Legal Basis of Data Processing
            </h2>
            <p>
              We process data exclusively for legitimate foundation operations, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#D6C7B8]">
              <li>Planning talent academy rehearsals, workshops, and safe transport to festivals.</li>
              <li>Monitoring enrolled children’s academic attendance and providing bursaries/school materials.</li>
              <li>Managing communication between foundation directors and parents/guardians.</li>
              <li>Coordinating adult volunteer mentors and reviewing background qualifications.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              4. Data Security and Access Controls
            </h2>
            <p>
              All submitted registration records and contact inquiries are stored with administrative access restrictions. Only authorized foundation administrators authenticated via verified credentials can access full registration documents. We employ strict electronic safeguards to prevent unauthorized disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              5. Financial &amp; Donor Privacy
            </h2>
            <p>
              Rusizi Kids Foundation does not collect, record, or process debit or credit card details directly. Financial contributions sent through Rwandan Mobile Money (MTN MoMo, Airtel Money) or direct bank wires are processed through certified banking institutions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              6. Safeguarding Officer Contact
            </h2>
            <p>
              For questions regarding this policy, data subject rights, or to submit or withdraw consent, contact our dedicated officer:
            </p>
            <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E]/30 text-xs sm:text-sm text-[#F9F5F0] space-y-1">
              <p className="font-bold text-[#F2C14E]">Child Safeguarding &amp; Data Protection Liaison</p>
              <p>{settings.foundationName} ({settings.abbreviation})</p>
              <p>{settings.location}</p>
              <p>
                Email:{' '}
                <a
                  href={`mailto:${settings.officialEmail}`}
                  className="text-[#F2C14E] font-semibold hover:underline"
                >
                  {settings.officialEmail}
                </a>
              </p>
              <p className="font-mono tabular-nums text-[#D6C7B8]">
                Official Phone: {settings.officialPhones[0] || '+250 798 465 782'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
