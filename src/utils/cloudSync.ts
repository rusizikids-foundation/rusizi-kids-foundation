import {
  Announcement,
  ChildProfile,
  Donor,
  GalleryItem,
  LeadershipMember,
  Partner,
  Program,
  ShowcaseSlide,
  WebsiteSettings,
} from '../types';

export interface SiteDataPayload {
  version: number;
  publishedAt: string;
  settings: WebsiteSettings;
  showcaseSlides: ShowcaseSlide[];
  programs: Program[];
  children: ChildProfile[];
  announcements: Announcement[];
  donors: Donor[];
  partners: Partner[];
  gallery: GalleryItem[];
  leadership: LeadershipMember[];
}

export const GITHUB_SYNC_CONFIG = {
  owner: 'rusizikids-foundation',
  repo: 'rusizi-kids-foundation',
  path: 'public/site-data.json',
};

export const GITHUB_TOKEN_STORAGE_KEY = 'rkf_github_sync_token';

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export function computeSiteDataHash(payload: Pick<
  SiteDataPayload,
  | 'publishedAt'
  | 'settings'
  | 'showcaseSlides'
  | 'programs'
  | 'children'
  | 'announcements'
  | 'donors'
  | 'partners'
  | 'gallery'
  | 'leadership'
>): string {
  const serialized = JSON.stringify({
    publishedAt: payload.publishedAt || '',
    settings: payload.settings,
    showcaseSlides: payload.showcaseSlides,
    programs: payload.programs,
    children: payload.children,
    announcements: payload.announcements,
    donors: payload.donors,
    partners: payload.partners,
    gallery: payload.gallery,
    leadership: payload.leadership,
  });

  // Dual 32-bit FNV-1a / DJB2 hash for fast synchronous change detection
  let h1 = 0x811c9dc5;
  let h2 = 5381;
  for (let i = 0; i < serialized.length; i++) {
    const code = serialized.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 = (Math.imul(h2, 33) ^ code) >>> 0;
  }
  return `${(h1 >>> 0).toString(16)}:${h2.toString(16)}:${serialized.length}`;
}

export async function fetchRemoteSiteData(): Promise<SiteDataPayload | null> {
  try {
    const response = await fetch(`/site-data.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as Partial<SiteDataPayload>;
    if (!data || typeof data !== 'object' || !data.settings) {
      return null;
    }
    return data as SiteDataPayload;
  } catch {
    return null;
  }
}

export async function publishSiteDataToGitHub(
  payload: SiteDataPayload,
  token: string
): Promise<{ success: boolean; message: string; commitUrl?: string }> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    return {
      success: false,
      message: 'Please enter your GitHub Sync Token first in Website Settings.',
    };
  }

  const { owner, repo, path } = GITHUB_SYNC_CONFIG;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    // 1. Check existing file SHA so GitHub updates the file cleanly
    let existingSha: string | undefined;
    const getRes = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (getRes.ok) {
      const existingData = await getRes.json();
      existingSha = existingData.sha;
    } else if (getRes.status === 401) {
      return {
        success: false,
        message: 'GitHub rejected the token (401 Unauthorized). Verify your token is valid.',
      };
    } else if (getRes.status === 403) {
      return {
        success: false,
        message: 'Permission denied (403). Ensure the token has Contents Read & Write access.',
      };
    } else if (getRes.status !== 404) {
      const errBody = await getRes.json().catch(() => ({}));
      return {
        success: false,
        message: errBody.message || `GitHub lookup failed (${getRes.status}).`,
      };
    }

    // 2. Encode updated site-data.json payload as UTF-8 Base64 and commit via Contents API
    const jsonString = JSON.stringify(payload, null, 2);
    const base64Content = utf8ToBase64(jsonString);

    const putBody: Record<string, string> = {
      message: `CMS Update: Publish Rusizi Kids Foundation live content (${new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ')} UTC)`,
      content: base64Content,
    };
    if (existingSha) {
      putBody.sha = existingSha;
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const errBody = await putRes.json().catch(() => ({}));
      if (putRes.status === 404) {
        return {
          success: false,
          message: `Repository ${owner}/${repo} not accessible. Confirm token permissions cover this repository.`,
        };
      }
      return {
        success: false,
        message: errBody.message || `GitHub publish failed (${putRes.status}).`,
      };
    }

    const result = await putRes.json();
    return {
      success: true,
      message:
        'Published live to GitHub! Every phone & computer worldwide will receive the update once Vercel rebuilds (~15s).',
      commitUrl: result?.commit?.html_url,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? `Network error contacting GitHub: ${err.message}`
          : 'Network error contacting GitHub.',
    };
  }
}
