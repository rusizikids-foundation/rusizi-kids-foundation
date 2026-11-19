import React, { useState } from 'react';
import { Award, X, Mail } from 'lucide-react';
import { LeadershipMember } from '../types';
import { FALLBACK_PHOTO_URL, handleImageError } from '../utils/imageFallback';

interface StaffMemberCardProps {
  member: LeadershipMember;
}

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member }) => {
  const [showBioModal, setShowBioModal] = useState(false);

  return (
    <>
      <article
        onClick={() => member.bio && setShowBioModal(true)}
        className={`luxury-card rounded-2xl px-6 py-8 flex flex-col items-center text-center justify-start group h-full ${
          member.bio ? 'cursor-pointer' : ''
        }`}
        title={member.bio ? `View profile & bio for ${member.name}` : member.name}
      >
        {/* Circular Portrait Photo with Crisp Metallic Gold Border */}
        <div className="relative flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#D9A62E] ring-4 ring-[#D9A62E]/15 bg-[#120B08] shadow-[0_0_24px_rgba(217,166,46,0.22)] shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img
              src={member.photo || FALLBACK_PHOTO_URL}
              alt={member.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
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

        {/* Full Name & Role / Job Title ONLY on Card Front */}
        <div className="mt-4 space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#F9F5F0] tracking-tight group-hover:text-[#F2C14E] transition-colors">
            {member.name}
          </h3>
          <p className="text-[11px] font-extrabold text-[#F2C14E] uppercase tracking-[0.14em] leading-relaxed">
            {member.role}
          </p>
        </div>
      </article>

      {/* Optional Click-to-View Official Biography Modal */}
      {showBioModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowBioModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${member.name} biography`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1D120D] border-2 border-[#D9A62E]/70 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-5"
          >
            <button
              type="button"
              onClick={() => setShowBioModal(false)}
              aria-label="Close biography modal"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#D6C7B8] hover:text-[#F2C14E] hover:bg-[#281912] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#D9A62E] ring-4 ring-[#D9A62E]/20 mx-auto bg-[#120B08]">
              <img
                src={member.photo || FALLBACK_PHOTO_URL}
                alt={member.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, FALLBACK_PHOTO_URL)}
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-2xl font-bold text-[#F9F5F0]">{member.name}</h3>
              <p className="text-xs font-extrabold text-[#F2C14E] uppercase tracking-[0.14em]">
                {member.role}
              </p>
            </div>

            {member.bio && (
              <p className="text-sm text-[#D6C7B8] leading-relaxed text-left bg-[#120B08] p-4 rounded-xl border border-[#D9A62E]/25">
                {member.bio}
              </p>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#F2C14E] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{member.email}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};
