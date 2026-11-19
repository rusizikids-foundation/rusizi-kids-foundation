import React from 'react';
import { Award, ExternalLink, HeartHandshake, Quote, Star } from 'lucide-react';
import { FALLBACK_LOGO_URL, handleImageError } from '../utils/imageFallback';

export interface SupporterCardProps {
  name: string;
  image?: string;
  roleBadge: string;
  description?: string;
  contribution?: string;
  contributionDate?: string;
  highlights?: string[];
  websiteUrl?: string;
  fallbackType?: 'donor' | 'partner';
  className?: string;
  onClick?: () => void;
}

export const SupporterShowcaseCard: React.FC<SupporterCardProps> = ({
  name,
  image,
  roleBadge,
  description,
  contribution,
  contributionDate,
  websiteUrl,
  fallbackType = 'partner',
  className = '',
  onClick,
}) => {
  const quoteText = (contribution || '').trim() || (description || '').trim();

  return (
    <article
      onClick={onClick}
      className={`luxury-card bg-[#1D120D] rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center justify-between border border-[#D9A62E]/35 hover:border-[#F2C14E]/75 shadow-lg hover:shadow-[0_14px_34px_-12px_rgba(217,166,46,0.28)] transition-all duration-300 group h-full ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top Center: Circular Portrait/Logo + Subtle Gold Quotation Mark */}
      <div className="w-full flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#D9A62E] ring-4 ring-[#D9A62E]/15 bg-[#120B08] shadow-[0_0_24px_rgba(217,166,46,0.22)] shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt={name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                draggable={false}
                onError={(e) => handleImageError(e, FALLBACK_LOGO_URL)}
              />
            ) : fallbackType === 'donor' ? (
              <Award className="w-9 h-9 text-[#F2C14E]" />
            ) : (
              <HeartHandshake className="w-9 h-9 text-[#F2C14E]" />
            )}
          </div>

          {/* Subtle Gold Quotation Mark Beside Circular Portrait */}
          <span
            className="absolute -top-1 -right-4 w-8 h-8 rounded-full bg-[#120B08] border border-[#D9A62E]/55 text-[#F2C14E] flex items-center justify-center shadow-md"
            aria-hidden="true"
          >
            <Quote className="w-3.5 h-3.5 fill-[#F2C14E]/25 text-[#F2C14E]" />
          </span>
        </div>

        {/* Rating / Appreciation Row: Five Small Metallic Gold Stars */}
        <div
          className="flex items-center justify-center gap-1 mt-4"
          aria-label="5 out of 5 appreciation stars"
        >
          {[0, 1, 2, 3, 4].map((starIndex) => (
            <Star
              key={starIndex}
              className="w-3.5 h-3.5 fill-[#F2C14E] text-[#F2C14E]"
            />
          ))}
        </div>

        {/* Middle Italic Quote / Contribution Text */}
        {quoteText && (
          <blockquote className="mt-4 text-xs sm:text-sm italic text-[#D6C7B8] leading-relaxed line-clamp-4">
            &ldquo;{quoteText}&rdquo;
          </blockquote>
        )}
      </div>

      {/* Bottom Footer: Bold Name / Organization + Warm Gold Role Title */}
      <div className="w-full pt-5 mt-5 border-t border-[#D9A62E]/20 space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="font-display text-base sm:text-lg font-bold text-[#F9F5F0] leading-snug tracking-tight">
            {name}
          </h3>
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${name} website`}
              className="text-[#A89585] hover:text-[#F2C14E] transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F2C14E]">
          {roleBadge}
          {contributionDate ? (
            <span className="font-mono text-[#A89585] font-medium ml-1.5 tabular-nums">
              · {contributionDate}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
};
