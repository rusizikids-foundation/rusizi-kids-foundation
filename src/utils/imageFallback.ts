import React from 'react';

export const FALLBACK_LOGO_URL = '/logo.png';
export const FALLBACK_PHOTO_URL = '/assets/aistudio/New_Recording_69_2dab5d6c.jpeg';
export const FALLBACK_MENTORSHIP_URL = '/assets/aistudio/New_Recording_47_6a9ce814.jpeg';

/**
 * Replaces empty, broken, or slow external stock image URLs (e.g. Unsplash/Pexels)
 * from stale browser caches with verified local RKF assets.
 */
export function sanitizeImageUrl(
  url: string | undefined | null,
  fallback: string = FALLBACK_PHOTO_URL
): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }
  if (/unsplash\.com|pexels\.com|source\.unsplash/i.test(trimmed)) {
    return fallback;
  }
  if (trimmed.includes('RKF_circle_icon') || trimmed.includes('RUSIZI_FOUNDATION_afe2877a')) {
    return FALLBACK_LOGO_URL;
  }
  return trimmed;
}

/**
 * Safe one-shot <img> onError handler that swaps broken images to a verified
 * local RKF asset (and then /logo.png if needed) without infinite error loops.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string = FALLBACK_PHOTO_URL
): void {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === '1') {
    if (img.dataset.logoFallbackApplied !== '1' && fallback !== FALLBACK_LOGO_URL) {
      img.dataset.logoFallbackApplied = '1';
      img.src = FALLBACK_LOGO_URL;
    }
    return;
  }
  img.dataset.fallbackApplied = '1';
  img.src = fallback;
}
