import { PageId } from '../types';

export const SITE_BASE_URL = 'https://rusizi-kids-foundation.vercel.app';

export interface RouteSeoMeta {
  path: string;
  page: PageId;
  sectionId?: string;
  title: string;
  description: string;
  image: string;
}

const DEFAULT_IMAGE = `${SITE_BASE_URL}/assets/aistudio/New_Recording_69_2dab5d6c.jpeg`;

export const ROUTE_CONFIGS: RouteSeoMeta[] = [
  {
    path: '/',
    page: 'home',
    title: 'Rusizi Kids Foundation (RKF) | Nurturing Youth Talents Globally',
    description:
      'Empower and support talented children aged 5–17 in Rusizi, Rwanda across dance, film, music, fashion, and education with Rusizi Kids Foundation (RKF).',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_69_2dab5d6c.jpeg`,
  },
  {
    path: '/about',
    page: 'about',
    title: 'About Rusizi Kids Foundation | Our Mission & Story',
    description:
      'Discover the mission, story, core values, child protection safeguards, and community impact of Rusizi Kids Foundation (RKF) in Rusizi District, Rwanda.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_47_6a9ce814.jpeg`,
  },
  {
    path: '/leadership',
    page: 'about',
    sectionId: 'leadership',
    title: 'Leadership & Dedicated Team | Rusizi Kids Foundation',
    description:
      'Meet the dedicated leadership team, coaches, and child welfare officers guiding Rusizi Kids Foundation (RKF) in Rusizi, Rwanda.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_47_6a9ce814.jpeg`,
  },
  {
    path: '/programs',
    page: 'programs',
    title: 'Youth Talent Programs | Dance, Film, Acting & Fashion',
    description:
      'Explore structured youth talent programs at Rusizi Kids Foundation: Traditional Rwandan Itorero Dance, Modern Dance, Film & Acting, Fashion & Modeling, Singing, and Education.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_35_583fbbcd.jpeg`,
  },
  {
    path: '/children',
    page: 'children',
    title: 'Our Talented Children | Rusizi Kids Foundation (RKF)',
    description:
      'Meet the inspiring young dancers, actors, musicians, and creators aged 5–17 thriving under verified guardian consent at Rusizi Kids Foundation.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_31_1a5b87d9.jpeg`,
  },
  {
    path: '/news',
    page: 'news',
    title: 'News, Castings & Community Events | Rusizi Kids Foundation',
    description:
      'Latest announcements, upcoming cultural showcases, youth workshops, and community milestones from Rusizi Kids Foundation in Rwanda.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_2_2317054a.jpeg`,
  },
  {
    path: '/donate',
    page: 'donors',
    title: 'Support & Donate | Rusizi Kids Foundation',
    description:
      'Support children in Rusizi, Rwanda through MTN MoMo, Airtel Money, educational sponsorships, and strategic partnerships with Rusizi Kids Foundation.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_14_17ffd186.jpeg`,
  },
  {
    path: '/gallery',
    page: 'gallery',
    title: 'Media Gallery | Performances & Training at RKF',
    description:
      'Photos and videos of Traditional Rwandan Dance, Urban Dance, Fashion Runway, Film workshops, and community Umuganda at Rusizi Kids Foundation.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_74_dc1cfdc1.jpeg`,
  },
  {
    path: '/join',
    page: 'join',
    title: 'Join Rusizi Kids Foundation | Child Registration & Mentors',
    description:
      'Enroll a talented child aged 5–17 free of tuition or apply as an adult volunteer mentor (18+) with Rusizi Kids Foundation in Rwanda.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_61_be2a8f89.jpeg`,
  },
  {
    path: '/contact',
    page: 'contact',
    title: 'Contact Rusizi Kids Foundation | Rusizi, Rwanda',
    description:
      'Get in touch with Rusizi Kids Foundation in Rusizi District, Western Province, Rwanda via email, phone, WhatsApp, or interactive Google Maps.',
    image: `${SITE_BASE_URL}/assets/aistudio/New_Recording_69_2dab5d6c.jpeg`,
  },
  {
    path: '/privacy',
    page: 'privacy',
    title: 'Child Privacy & Safeguarding Policy | Rusizi Kids Foundation',
    description:
      'Read how Rusizi Kids Foundation protects children’s privacy, guardian consent, and personal data under Rwandan Child Protection Law N° 71/2018.',
    image: `${SITE_BASE_URL}/logo.png`,
  },
  {
    path: '/terms',
    page: 'terms',
    title: 'Terms & Conditions | Rusizi Kids Foundation',
    description:
      'Official terms, safeguarding standards, and participation guidelines for Rusizi Kids Foundation (RKF).',
    image: `${SITE_BASE_URL}/logo.png`,
  },
  {
    path: '/admin',
    page: 'admin',
    title: 'Super Admin CMS | Rusizi Kids Foundation',
    description: 'Rusizi Kids Foundation Super Admin Content Management System.',
    image: `${SITE_BASE_URL}/logo.png`,
  },
];

const PATH_ALIASES: Record<string, string> = {
  '/donors': '/donate',
  '/donors-partners': '/donate',
  '/support': '/donate',
  '/team': '/leadership',
  '/staff': '/leadership',
  '/home': '/',
};

export function normalizePathname(rawPathname: string): string {
  const cleaned = rawPathname.replace(/\/+$/, '').toLowerCase() || '/';
  return PATH_ALIASES[cleaned] || cleaned;
}

export function resolveRoute(rawPathname: string): RouteSeoMeta {
  const normalized = normalizePathname(rawPathname);
  const found = ROUTE_CONFIGS.find((route) => route.path === normalized);
  return found || ROUTE_CONFIGS[0];
}

export function getPathForPage(page: PageId): string {
  const match = ROUTE_CONFIGS.find((route) => route.page === page && !route.sectionId);
  return match ? match.path : '/';
}

function upsertMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string
): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(url: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

const ROUTE_IMAGE_GALLERY = [
  `${SITE_BASE_URL}/assets/aistudio/New_Recording_69_2dab5d6c.jpeg`,
  `${SITE_BASE_URL}/assets/aistudio/New_Recording_35_583fbbcd.jpeg`,
  `${SITE_BASE_URL}/assets/aistudio/New_Recording_14_17ffd186.jpeg`,
  `${SITE_BASE_URL}/assets/aistudio/New_Recording_47_6a9ce814.jpeg`,
  `${SITE_BASE_URL}/assets/aistudio/New_Recording_78_59ee1a8e.jpeg`,
  `${SITE_BASE_URL}/logo.png`,
];

function upsertRouteWebPageJsonLd(route: RouteSeoMeta, canonicalUrl: string, primaryImage: string): void {
  if (typeof document === 'undefined') return;
  const scriptId = 'rkf-route-webpage-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const images = [primaryImage, ...ROUTE_IMAGE_GALLERY.filter((img) => img !== primaryImage)];

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.title,
    description: route.description,
    url: canonicalUrl,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: primaryImage,
    },
    image: images,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Rusizi Kids Foundation',
      url: `${SITE_BASE_URL}/`,
    },
  });
}

export function applyRouteSeoMetadata(rawPathname: string): RouteSeoMeta {
  const route = resolveRoute(rawPathname);
  if (typeof document === 'undefined') return route;

  const canonicalUrl = `${SITE_BASE_URL}${route.path === '/' ? '/' : route.path}`;
  const ogImage = route.image || DEFAULT_IMAGE;

  document.title = route.title;
  upsertMetaTag('name', 'description', route.description);
  upsertMetaTag('property', 'og:title', route.title);
  upsertMetaTag('property', 'og:description', route.description);
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertMetaTag('property', 'og:image', ogImage);
  upsertMetaTag('name', 'twitter:title', route.title);
  upsertMetaTag('name', 'twitter:description', route.description);
  upsertMetaTag('name', 'twitter:image', ogImage);
  upsertCanonicalLink(canonicalUrl);
  upsertRouteWebPageJsonLd(route, canonicalUrl, ogImage);

  return route;
}
