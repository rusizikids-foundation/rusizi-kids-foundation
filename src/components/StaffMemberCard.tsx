import React from 'react';
import { Award } from 'lucide-react';
import { LeadershipMember } from '../types';

interface StaffMemberCardProps {
  member: LeadershipMember;
}

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member }) => {
  return (
    <article className="luxury-card rounded-2xl px-6 py-8 flex flex-col items-center text-center justify-start group h-full">
      {/* Circular Portrait Photo with Crisp Metallic Gold Border */}
      <div className="relative flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#D9A62E] ring-4 ring-[#D9A62E]/15 bg-[#120B08] shadow-[0_0_24px_rgba(217,166,46,0.22)] shrink-0 group-hover:scale-105 transition-transform duration-300">
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Small Gold Accent Icon Badge Below Photo */}
        <div
          className="-mt-3.5 relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-[#D9A62E] to-[#F2C14E] text-[#120B08] border-2 border-[#1D120D] flex items-center justify-center shadow-md"
          aria-hidden="true"
        >
          <Award className="w-4 h-4" />
        </div>
      </div>

      {/* Full Name & Role / Job Title ONLY */}
      <div className="mt-4 space-y-1.5">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#F9F5F0] tracking-tight">
          {member.name}
        </h3>
        <p className="text-[11px] font-extrabold text-[#F2C14E] uppercase tracking-[0.14em] leading-relaxed">
          {member.role}
        </p>
      </div>
    </article>
  );
};
