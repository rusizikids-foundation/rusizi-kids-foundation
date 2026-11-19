import React from 'react';
import { useData } from '../context/DataContext';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { settings } = useData();

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-20">
      {/* Luxury Dark Chocolate Editorial Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
            <FileText className="w-4 h-4" />
            <span>Foundation Governance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F9F5F0]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#D6C7B8]">
            Governing child enrollment, adult membership, and donor stewardship at Rusizi Kids Foundation.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/25 p-6 sm:p-10 space-y-8 text-sm text-[#D6C7B8] leading-relaxed shadow-xl">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              1. Acceptance of Terms
            </h2>
            <p>
              By enrolling a child, applying for national adult membership, donating, or utilizing the official website of Rusizi Kids Foundation (RKF), you agree to abide by these terms, our Child Protection Charter, and relevant laws of the Republic of Rwanda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              2. Free &amp; Equal Access
            </h2>
            <p>
              Participation in Rusizi Kids Foundation talent academies (dance, film, music, fashion, and education) is 100% free of tuition. No foundation staff member or coach is authorized to demand payment from parents or caregivers for training or enrollment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              3. Child Code of Conduct &amp; Safeguarding
            </h2>
            <p>To maintain an inspiring, safe, and disciplined environment:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#D6C7B8]">
              <li>
                Children must demonstrate respect toward fellow performers, mentors, and equipment.
              </li>
              <li>
                Enrolled children are expected to maintain consistent school attendance and academic diligence.
              </li>
              <li>
                Bullying, discrimination, violence, or substance abuse carries immediate suspension from activities.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              4. Adult National Membership Standards
            </h2>
            <p>
              Adult members (aged 18 and above) acting as volunteer mentors or coaches must undergo foundation background screening and sign the Child Safeguarding Code of Conduct prior to direct contact with minors. Adult members represent RKF with civic dignity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              5. Donor &amp; Partner Stewardship
            </h2>
            <p>
              All financial gifts, costumes, and educational equipment donated to Rusizi Kids Foundation are allocated strictly for child talent development, academic bursaries, nutrition, and community development. We provide verified receipts and project updates upon request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9F5F0]">
              6. Official Inquiries
            </h2>
            <p>For legal or governance inquiries, please reach out directly:</p>
            <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E]/30 text-xs sm:text-sm text-[#F9F5F0] font-medium space-y-1">
              <p className="font-bold text-[#F2C14E]">Executive Director · {settings.foundationName}</p>
              <p className="text-[#D6C7B8]">
                Email: {settings.officialEmail} · Phone:{' '}
                <span className="font-mono tabular-nums text-[#F9F5F0]">
                  {settings.officialPhones[0] || '+250 798 465 782'}
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
