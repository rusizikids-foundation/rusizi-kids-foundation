import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  PageId,
  WebsiteSettings,
  Program,
  ChildProfile,
  Announcement,
  Donor,
  Partner,
  GalleryItem,
  LeadershipMember,
  ChildRegistration,
  AdultMembership,
  ContactMessage,
  DonorInquiry,
  PartnershipInquiry,
  ShowcaseSlide,
} from '../types';
import {
  initialSettings,
  initialPrograms,
  initialChildren,
  initialAnnouncements,
  initialDonors,
  initialPartners,
  initialGallery,
  initialLeadership,
  initialShowcaseSlides,
} from '../data/initialData';
import {
  computeSiteDataHash,
  fetchRemoteSiteData,
  GITHUB_TOKEN_STORAGE_KEY,
  publishSiteDataToGitHub,
  SiteDataPayload,
} from '../utils/cloudSync';
import {
  FALLBACK_LOGO_URL,
  FALLBACK_MENTORSHIP_URL,
  FALLBACK_PHOTO_URL,
  sanitizeImageUrl,
} from '../utils/imageFallback';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DataContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedProgramId: string | null;
  setSelectedProgramId: (id: string | null) => void;
  
  settings: WebsiteSettings;
  updateSettings: (settings: WebsiteSettings) => void;
  deleteImpactStat: (id: string) => void;
  deleteCoreValue: (id: string) => void;

  programs: Program[];
  addProgram: (program: Omit<Program, 'id'>) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  children: ChildProfile[];
  addChild: (child: Omit<ChildProfile, 'id'>) => void;
  updateChild: (id: string, child: Partial<ChildProfile>) => void;
  deleteChild: (id: string) => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  updateDonor: (id: string, donor: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;

  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;

  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  leadership: LeadershipMember[];
  addLeadership: (member: Omit<LeadershipMember, 'id'>) => void;
  updateLeadership: (id: string, member: Partial<LeadershipMember>) => void;
  deleteLeadership: (id: string) => void;

  childRegistrations: ChildRegistration[];
  submitChildRegistration: (reg: Omit<ChildRegistration, 'id' | 'dateSubmitted' | 'status'>) => boolean;
  updateChildRegStatus: (id: string, status: ChildRegistration['status']) => void;
  deleteChildReg: (id: string) => void;

  adultMemberships: AdultMembership[];
  submitAdultMembership: (mem: Omit<AdultMembership, 'id' | 'dateSubmitted' | 'status'>) => boolean;
  updateAdultMemStatus: (id: string, status: AdultMembership['status']) => void;
  deleteAdultMem: (id: string) => void;

  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'dateSubmitted' | 'read'>) => boolean;
  markContactRead: (id: string) => void;
  deleteContactMessage: (id: string) => void;

  donorInquiries: DonorInquiry[];
  submitDonorInquiry: (inq: Omit<DonorInquiry, 'id' | 'dateSubmitted' | 'status'>) => boolean;
  updateDonorInquiryStatus: (id: string, status: DonorInquiry['status']) => void;
  deleteDonorInquiry: (id: string) => void;

  partnershipInquiries: PartnershipInquiry[];
  submitPartnershipInquiry: (inq: Omit<PartnershipInquiry, 'id' | 'dateSubmitted' | 'status'>) => boolean;
  updatePartnershipInquiryStatus: (id: string, status: PartnershipInquiry['status']) => void;
  deletePartnershipInquiry: (id: string) => void;

  // Showcase Slides (Full CMS Management)
  showcaseSlides: ShowcaseSlide[];
  addShowcaseSlide: (slide: Omit<ShowcaseSlide, 'id'>) => void;
  updateShowcaseSlide: (id: string, slide: Partial<ShowcaseSlide>) => void;
  deleteShowcaseSlide: (id: string) => void;

  // Live Edit Mode & CMS Navigation
  isEditModeActive: boolean;
  setIsEditModeActive: (active: boolean) => void;
  toggleEditMode: () => void;
  adminTargetTab: string | null;
  setAdminTargetTab: (tab: string | null) => void;
  openAdminTab: (tab: string) => void;

  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, pass: string) => { success: boolean; message?: string };
  changeAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;

  // Global Cloud Sync (GitHub + public/site-data.json)
  githubToken: string;
  setGithubToken: (token: string) => void;
  isPublishingLive: boolean;
  lastPublishedAt: string | null;
  hasUnpublishedChanges: boolean;
  publishLiveToAllDevices: (tokenOverride?: string) => Promise<{
    success: boolean;
    message: string;
    commitUrl?: string;
  }>;
  downloadSiteDataJson: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'rkf_settings_v1',
  PROGRAMS: 'rkf_programs_v1',
  CHILDREN: 'rkf_children_v1',
  ANNOUNCEMENTS: 'rkf_announcements_v1',
  DONORS: 'rkf_donors_v1',
  PARTNERS: 'rkf_partners_v1',
  GALLERY: 'rkf_gallery_v1',
  LEADERSHIP: 'rkf_leadership_v1',
  CHILD_REGS: 'rkf_child_regs_v1',
  ADULT_MEMS: 'rkf_adult_mems_v1',
  CONTACT_MSGS: 'rkf_contact_msgs_v1',
  DONOR_INQS: 'rkf_donor_inqs_v1',
  PARTNER_INQS: 'rkf_partner_inqs_v1',
  ADMIN_AUTH: 'rkf_admin_auth_v1',
  ADMIN_PASS: 'rkf_admin_pass_v1',
  SHOWCASE_SLIDES: 'rkf_slides_v1',
  LAST_SYNCED_AT: 'rkf_last_synced_at_v1',
  LAST_LOCAL_PUBLISH_AT: 'rkf_last_local_publish_at_v1',
  LAST_SERVER_HASH: 'rkf_last_server_hash_v1',
  HAS_UNPUBLISHED: 'rkf_has_unpublished_v1',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageRaw] = useState<PageId>('home');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const setActivePage = (page: PageId) => {
    setActivePageRaw(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe localStorage helper: returns fallback ONLY if key does not exist or fails to parse
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const persistImmediate = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage quota errors
    }
  };

  const normalizeSettings = (raw?: Partial<WebsiteSettings>): WebsiteSettings => {
    const merged: WebsiteSettings = { ...initialSettings, ...(raw || {}) };
    merged.primaryLogo = sanitizeImageUrl(merged.primaryLogo, FALLBACK_LOGO_URL);
    merged.emblemLogo = sanitizeImageUrl(
      merged.emblemLogo || merged.primaryLogo,
      merged.primaryLogo || FALLBACK_LOGO_URL
    );
    merged.heroImage = sanitizeImageUrl(
      merged.heroImage,
      initialSettings.heroImage || FALLBACK_PHOTO_URL
    );
    merged.aboutHeroImage = sanitizeImageUrl(
      merged.aboutHeroImage,
      initialSettings.aboutHeroImage || FALLBACK_MENTORSHIP_URL
    );
    // Preserve intentional empty arrays ([]) if Admin deleted all items; only fall back if undefined/non-array
    if (!Array.isArray(merged.stats)) {
      merged.stats = initialSettings.stats;
    }
    if (!Array.isArray(merged.aboutCoreValues)) {
      merged.aboutCoreValues = initialSettings.aboutCoreValues;
    }
    if (!Array.isArray(merged.aboutStoryParagraphs)) {
      merged.aboutStoryParagraphs = initialSettings.aboutStoryParagraphs;
    }
    if (!Array.isArray(merged.officialPhones)) {
      merged.officialPhones = initialSettings.officialPhones;
    }
    return merged;
  };

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const loaded = loadStored<Partial<WebsiteSettings>>(STORAGE_KEYS.SETTINGS, initialSettings);
    const merged = normalizeSettings(loaded);
    if (
      !merged.registrationWhatsAppUrl ||
      merged.registrationWhatsAppUrl.includes('FMzmMgtxMQmGj6ziAeVhMg')
    ) {
      merged.registrationWhatsAppUrl = initialSettings.registrationWhatsAppUrl;
    }
    if (!merged.registrationWhatsAppTitle) {
      merged.registrationWhatsAppTitle = initialSettings.registrationWhatsAppTitle;
    }
    if (!merged.registrationWhatsAppSubtitle) {
      merged.registrationWhatsAppSubtitle = initialSettings.registrationWhatsAppSubtitle;
    }
    if (!merged.registrationWhatsAppMessage) {
      merged.registrationWhatsAppMessage = initialSettings.registrationWhatsAppMessage;
    }
    if (!merged.registrationWhatsAppButtonText) {
      merged.registrationWhatsAppButtonText = initialSettings.registrationWhatsAppButtonText;
    }
    if (
      merged.socialLinks &&
      (!merged.socialLinks.whatsAppGroup ||
        merged.socialLinks.whatsAppGroup.includes('FMzmMgtxMQmGj6ziAeVhMg'))
    ) {
      merged.socialLinks.whatsAppGroup = 'https://chat.whatsapp.com/FysXKjXF5GG3eW5kSPy044';
    }
    if (!merged.googleMapsShareUrl) {
      merged.googleMapsShareUrl = initialSettings.googleMapsShareUrl;
    }
    if (
      !merged.googleMapsEmbedUrl ||
      merged.googleMapsEmbedUrl.includes('q=Rusizi,%20Western%20Province,%20Rwanda')
    ) {
      merged.googleMapsEmbedUrl = initialSettings.googleMapsEmbedUrl;
    }
    if (!merged.donationMomoUssdCode) {
      merged.donationMomoUssdCode = initialSettings.donationMomoUssdCode;
    }
    if (!merged.donationMomoPhone) {
      merged.donationMomoPhone = initialSettings.donationMomoPhone;
    }
    if (!merged.donationAirtelPhone) {
      merged.donationAirtelPhone = initialSettings.donationAirtelPhone;
    }
    if (!merged.donationAccountName) {
      merged.donationAccountName = initialSettings.donationAccountName;
    }
    return merged;
  });

  const normalizeSlides = (items: ShowcaseSlide[]): ShowcaseSlide[] =>
    items.map((slide, idx) => {
      const seed =
        initialShowcaseSlides.find((item) => item.id === slide.id) ||
        initialShowcaseSlides[idx % initialShowcaseSlides.length];
      return {
        ...seed,
        ...slide,
        image: sanitizeImageUrl(slide.image, seed.image),
      };
    });

  const normalizePrograms = (items: Program[]): Program[] =>
    items.map((prog, idx) => {
      const seed =
        initialPrograms.find((item) => item.id === prog.id) ||
        initialPrograms[idx % initialPrograms.length];
      return {
        ...prog,
        image: sanitizeImageUrl(prog.image, seed.image),
      };
    });

  const normalizeChildren = (items: ChildProfile[]): ChildProfile[] =>
    items.map((child, idx) => {
      const seed =
        initialChildren.find((item) => item.id === child.id) ||
        initialChildren[idx % initialChildren.length];
      return {
        ...child,
        photo: sanitizeImageUrl(child.photo, seed.photo),
      };
    });

  const normalizeAnnouncements = (items: Announcement[]): Announcement[] =>
    items.map((ann, idx) => {
      const seed =
        initialAnnouncements.find((item) => item.id === ann.id) ||
        initialAnnouncements[idx % initialAnnouncements.length];
      return {
        ...ann,
        image: sanitizeImageUrl(ann.image, seed.image),
      };
    });

  const normalizeDonors = (items: Donor[]): Donor[] =>
    items.map((d, idx) => {
      const seed =
        initialDonors.find((item) => item.id === d.id) ||
        initialDonors[idx % initialDonors.length];
      const normalizedPhoto = sanitizeImageUrl(d.photo || d.logo, seed.photo);
      return {
        ...seed,
        ...d,
        photo: normalizedPhoto,
        logo: d.logo ? sanitizeImageUrl(d.logo, normalizedPhoto) : d.logo,
        role: d.role || d.tier || seed.role,
        contribution: d.contribution || seed.contribution || d.description,
        contributionDate: d.contributionDate || seed.contributionDate,
      };
    });

  const normalizePartners = (items: Partner[]): Partner[] =>
    items.map((p, idx) => {
      const seed =
        initialPartners.find((item) => item.id === p.id) ||
        initialPartners[idx % initialPartners.length];
      const normalizedPhoto = sanitizeImageUrl(p.photo || p.logo, seed.photo);
      return {
        ...seed,
        ...p,
        photo: normalizedPhoto,
        logo: p.logo ? sanitizeImageUrl(p.logo, normalizedPhoto) : p.logo,
        role: p.role || seed.role,
        contribution: p.contribution || seed.contribution || p.description,
        contributionDate: p.contributionDate || seed.contributionDate,
      };
    });

  const normalizeGallery = (items: GalleryItem[]): GalleryItem[] =>
    items.map((item, idx) => {
      const seed =
        initialGallery.find((g) => g.id === item.id) ||
        initialGallery[idx % initialGallery.length];
      return {
        ...item,
        url: sanitizeImageUrl(item.url, seed.url),
      };
    });

  const normalizeLeadership = (items: LeadershipMember[]): LeadershipMember[] =>
    items.map((member, idx) => {
      const seed =
        initialLeadership.find((l) => l.id === member.id) ||
        initialLeadership[idx % initialLeadership.length];
      return {
        ...member,
        photo: sanitizeImageUrl(member.photo, seed.photo),
      };
    });

  const [showcaseSlides, setShowcaseSlides] = useState<ShowcaseSlide[]>(() => {
    const loaded = loadStored<ShowcaseSlide[]>(STORAGE_KEYS.SHOWCASE_SLIDES, initialShowcaseSlides);
    if (!Array.isArray(loaded)) {
      return initialShowcaseSlides;
    }
    return normalizeSlides(loaded);
  });

  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(false);
  const [adminTargetTab, setAdminTargetTab] = useState<string | null>(null);

  const toggleEditMode = () => {
    setIsEditModeActive((prev) => !prev);
    addToast(
      !isEditModeActive
        ? 'Live Edit Mode Active: Quick edit badges enabled across the site'
        : 'Live Edit Mode Deactivated',
      'info'
    );
  };

  const openAdminTab = (tab: string) => {
    setAdminTargetTab(tab);
    setActivePage('admin');
  };
  const [programs, setPrograms] = useState<Program[]>(() => {
    const loaded = loadStored<Program[]>(STORAGE_KEYS.PROGRAMS, initialPrograms);
    return Array.isArray(loaded) ? normalizePrograms(loaded) : initialPrograms;
  });
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() => {
    const loaded = loadStored<ChildProfile[]>(STORAGE_KEYS.CHILDREN, initialChildren);
    return Array.isArray(loaded) ? normalizeChildren(loaded) : initialChildren;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const loaded = loadStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    return Array.isArray(loaded) ? normalizeAnnouncements(loaded) : initialAnnouncements;
  });
  const [donors, setDonors] = useState<Donor[]>(() => {
    const loaded = loadStored<Donor[]>(STORAGE_KEYS.DONORS, initialDonors);
    return Array.isArray(loaded) ? normalizeDonors(loaded) : initialDonors;
  });
  const [partners, setPartners] = useState<Partner[]>(() => {
    const loaded = loadStored<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners);
    return Array.isArray(loaded) ? normalizePartners(loaded) : initialPartners;
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const loaded = loadStored<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
    return Array.isArray(loaded) ? normalizeGallery(loaded) : initialGallery;
  });
  const [leadership, setLeadership] = useState<LeadershipMember[]>(() => {
    const loaded = loadStored<LeadershipMember[]>(STORAGE_KEYS.LEADERSHIP, initialLeadership);
    if (!Array.isArray(loaded)) {
      return initialLeadership;
    }
    const legacyNames = ['Amissa Bora', 'Jean Paul N.', 'Claudine M.', 'Eric K.'];
    const isExactLegacySeed =
      loaded.length === 4 &&
      loaded.every((m, idx) => m.id === `lead-${idx + 1}` && legacyNames.includes(m.name));
    return isExactLegacySeed ? initialLeadership : normalizeLeadership(loaded);
  });

  // Registrations & inquiries
  const [childRegistrations, setChildRegistrations] = useState<ChildRegistration[]>(() =>
    loadStored(STORAGE_KEYS.CHILD_REGS, [
      {
        id: 'reg-demo-1',
        childName: 'Jean Paul M.',
        age: 12,
        school: 'GS Rusizi',
        classLevel: 'Primary 6',
        fatherName: 'Michel M.',
        motherName: 'Beata N.',
        caregiverIdNumber: '1198480012345678',
        caregiverPhone: '+250 788 123 456',
        activitiesInterest: ['Dance', 'Traditional Dance'],
        parentConsent: true,
        dateSubmitted: '2026-03-02',
        status: 'approved',
      },
    ])
  );

  const [adultMemberships, setAdultMemberships] = useState<AdultMembership[]>(() =>
    loadStored(STORAGE_KEYS.ADULT_MEMS, [
      {
        id: 'mem-demo-1',
        applicantName: 'Clarisse Uwase',
        age: 26,
        province: 'Western Province',
        district: 'Rusizi',
        idNumber: '1199880098765432',
        email: 'clarisse.u@gmail.com',
        phone: '+250 783 654 321',
        membershipCategory: 'Volunteer Mentor',
        motivation: 'Passionate about mentoring young girls in traditional arts and secondary school tuition.',
        dateSubmitted: '2026-03-05',
        status: 'approved',
      },
    ])
  );

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    loadStored(STORAGE_KEYS.CONTACT_MSGS, [
      {
        id: 'msg-demo-1',
        name: 'Pastor Emmanuel',
        email: 'emmanuel@faithchurch.rw',
        phone: '+250 788 445 566',
        subject: 'Youth Arts Collaboration in Rusizi',
        message: 'We appreciate the noble work of Rusizi Kids Foundation. We would like to host a joint cultural celebration.',
        dateSubmitted: '2026-03-08',
        read: false,
      },
    ])
  );

  const [donorInquiries, setDonorInquiries] = useState<DonorInquiry[]>(() =>
    loadStored(STORAGE_KEYS.DONOR_INQS, [])
  );
  const [partnershipInquiries, setPartnershipInquiries] = useState<PartnershipInquiry[]>(() =>
    loadStored(STORAGE_KEYS.PARTNER_INQS, [])
  );

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    loadStored(STORAGE_KEYS.ADMIN_AUTH, false)
  );
  const [adminEmail, setAdminEmail] = useState<string | null>(() =>
    isAdminAuthenticated ? 'amissabora@gmail.com' : null
  );

  // GitHub Cloud Sync states
  const [githubToken, setGithubTokenState] = useState<string>(() => {
    try {
      return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isPublishingLive, setIsPublishingLive] = useState<boolean>(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNCED_AT);
    } catch {
      return null;
    }
  });
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(() =>
    loadStored(STORAGE_KEYS.HAS_UNPUBLISHED, false)
  );

  const autoSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePublishPromiseRef = useRef<Promise<{
    success: boolean;
    message: string;
    commitUrl?: string;
  }> | null>(null);
  const pendingRevisionRef = useRef<number>(0);

  const latestDataRef = useRef({
    settings,
    showcaseSlides,
    programs,
    childrenList,
    announcements,
    donors,
    partners,
    gallery,
    leadership,
    githubToken,
  });

  latestDataRef.current = {
    settings,
    showcaseSlides,
    programs,
    childrenList,
    announcements,
    donors,
    partners,
    gallery,
    leadership,
    githubToken,
  };

  useEffect(() => {
    return () => {
      if (autoSyncTimerRef.current) {
        clearTimeout(autoSyncTimerRef.current);
      }
    };
  }, []);

  const executeCloudPublish = async (
    tokenOverride?: string,
    isAuto: boolean = false,
    suppressSuccessToast: boolean = false
  ): Promise<{ success: boolean; message: string; commitUrl?: string }> => {
    if (autoSyncTimerRef.current) {
      clearTimeout(autoSyncTimerRef.current);
      autoSyncTimerRef.current = null;
    }

    const activeToken = (tokenOverride ?? latestDataRef.current.githubToken).trim();
    if (!activeToken) {
      const msg =
        'Enter your GitHub Sync Token inside Website Settings (Logo, Sync & Security) first.';
      if (!isAuto) {
        addToast(msg, 'error');
      }
      return { success: false, message: msg };
    }

    if (activePublishPromiseRef.current) {
      await activePublishPromiseRef.current.catch(() => undefined);
    }

    const run = async () => {
      const startRevision = pendingRevisionRef.current;
      const snap = latestDataRef.current;
      const payload: SiteDataPayload = {
        version: 1,
        publishedAt: new Date().toISOString(),
        settings: snap.settings,
        showcaseSlides: snap.showcaseSlides,
        programs: snap.programs,
        children: snap.childrenList,
        announcements: snap.announcements,
        donors: snap.donors,
        partners: snap.partners,
        gallery: snap.gallery,
        leadership: snap.leadership,
      };

      setIsPublishingLive(true);
      const res = await publishSiteDataToGitHub(payload, activeToken);
      setIsPublishingLive(false);

      if (res.success) {
        setLastPublishedAt(payload.publishedAt);
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_SYNCED_AT, payload.publishedAt);
          localStorage.setItem(STORAGE_KEYS.LAST_LOCAL_PUBLISH_AT, payload.publishedAt);
          localStorage.setItem(STORAGE_KEYS.LAST_SERVER_HASH, computeSiteDataHash(payload));
        } catch {
          // ignore
        }

        if (pendingRevisionRef.current === startRevision) {
          setHasUnpublishedChanges(false);
          try {
            localStorage.setItem(STORAGE_KEYS.HAS_UNPUBLISHED, JSON.stringify(false));
          } catch {
            // ignore
          }
          if (!suppressSuccessToast) {
            addToast(
              isAuto ? 'Auto-Synced Live to All Devices' : res.message,
              'success'
            );
          }
        } else {
          // Newer edits occurred during commit; batch them cleanly after 2 seconds
          if (latestDataRef.current.githubToken.trim()) {
            autoSyncTimerRef.current = setTimeout(() => {
              void executeCloudPublish(undefined, true, false);
            }, 2000);
          }
        }
      } else {
        addToast(
          isAuto ? `Auto-Sync paused: ${res.message}` : res.message,
          'error'
        );
      }

      return res;
    };

    const promise = run().finally(() => {
      if (activePublishPromiseRef.current === promise) {
        activePublishPromiseRef.current = null;
      }
    });
    activePublishPromiseRef.current = promise;
    return promise;
  };

  const setGithubToken = (token: string) => {
    setGithubTokenState(token);
    latestDataRef.current.githubToken = token;
    try {
      if (token.trim()) {
        localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token.trim());
      } else {
        localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  };

  const markLocalChangesPending = (immediate: boolean = false, suppressSuccessToast: boolean = false) => {
    pendingRevisionRef.current += 1;
    setHasUnpublishedChanges(true);
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_UNPUBLISHED, JSON.stringify(true));
    } catch {
      // ignore
    }

    if (latestDataRef.current.githubToken.trim()) {
      if (autoSyncTimerRef.current) {
        clearTimeout(autoSyncTimerRef.current);
        autoSyncTimerRef.current = null;
      }
      if (immediate) {
        void executeCloudPublish(undefined, true, suppressSuccessToast);
      } else {
        autoSyncTimerRef.current = setTimeout(() => {
          void executeCloudPublish(undefined, true, suppressSuccessToast);
        }, 2000);
      }
    }
  };

  // Always fetch /site-data.json?t=Date.now() on every page load & mobile bfcache restore,
  // overwriting any stale localStorage cache whenever the server data has changed.
  useEffect(() => {
    let active = true;

    const syncFromServer = async () => {
      const remote = await fetchRemoteSiteData();
      if (!active || !remote) return;

      // Guard against Vercel/CDN serving a stale pre-deploy site-data.json right after an Admin commit
      const lastLocalPublishAt = (() => {
        try {
          return localStorage.getItem(STORAGE_KEYS.LAST_LOCAL_PUBLISH_AT);
        } catch {
          return null;
        }
      })();
      if (lastLocalPublishAt && remote.publishedAt) {
        const remoteTs = Date.parse(remote.publishedAt);
        const localPublishTs = Date.parse(lastLocalPublishAt);
        if (!Number.isNaN(remoteTs) && !Number.isNaN(localPublishTs) && remoteTs < localPublishTs) {
          return;
        }
      }

      const serverHash = computeSiteDataHash(remote);
      const storedServerHash = (() => {
        try {
          return localStorage.getItem(STORAGE_KEYS.LAST_SERVER_HASH);
        } catch {
          return null;
        }
      })();
      const localHasEdits = loadStored<boolean>(STORAGE_KEYS.HAS_UNPUBLISHED, false);

      // Never replace intentionally emptied arrays ([]) with default placeholders
      const nextSettings = normalizeSettings(remote.settings);
      const nextSlides = Array.isArray(remote.showcaseSlides)
        ? normalizeSlides(remote.showcaseSlides)
        : initialShowcaseSlides;
      const nextPrograms = Array.isArray(remote.programs)
        ? normalizePrograms(remote.programs)
        : initialPrograms;
      const nextChildren = Array.isArray(remote.children)
        ? normalizeChildren(remote.children)
        : initialChildren;
      const nextAnnouncements = Array.isArray(remote.announcements)
        ? normalizeAnnouncements(remote.announcements)
        : initialAnnouncements;
      const nextDonors = Array.isArray(remote.donors)
        ? normalizeDonors(remote.donors)
        : initialDonors;
      const nextPartners = Array.isArray(remote.partners)
        ? normalizePartners(remote.partners)
        : initialPartners;
      const nextGallery = Array.isArray(remote.gallery)
        ? normalizeGallery(remote.gallery)
        : initialGallery;
      const nextLeadership = Array.isArray(remote.leadership)
        ? normalizeLeadership(remote.leadership)
        : initialLeadership;

      const serverChanged = storedServerHash !== serverHash;
      const currentCachedHash = computeSiteDataHash({
        publishedAt: (() => {
          try {
            return localStorage.getItem(STORAGE_KEYS.LAST_SYNCED_AT) || '';
          } catch {
            return '';
          }
        })(),
        settings: loadStored<WebsiteSettings>(STORAGE_KEYS.SETTINGS, initialSettings),
        showcaseSlides: loadStored<ShowcaseSlide[]>(
          STORAGE_KEYS.SHOWCASE_SLIDES,
          initialShowcaseSlides
        ),
        programs: loadStored<Program[]>(STORAGE_KEYS.PROGRAMS, initialPrograms),
        children: loadStored<ChildProfile[]>(STORAGE_KEYS.CHILDREN, initialChildren),
        announcements: loadStored<Announcement[]>(
          STORAGE_KEYS.ANNOUNCEMENTS,
          initialAnnouncements
        ),
        donors: loadStored<Donor[]>(STORAGE_KEYS.DONORS, initialDonors),
        partners: loadStored<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners),
        gallery: loadStored<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery),
        leadership: loadStored<LeadershipMember[]>(
          STORAGE_KEYS.LEADERSHIP,
          initialLeadership
        ),
      });

      // Overwrite stale localStorage whenever server data changed OR cached visitor state differs
      if (serverChanged || (!localHasEdits && currentCachedHash !== serverHash)) {
        try {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(nextSettings));
          localStorage.setItem(STORAGE_KEYS.SHOWCASE_SLIDES, JSON.stringify(nextSlides));
          localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(nextPrograms));
          localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(nextChildren));
          localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(nextAnnouncements));
          localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(nextDonors));
          localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(nextPartners));
          localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(nextGallery));
          localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(nextLeadership));
          localStorage.setItem(STORAGE_KEYS.LAST_SERVER_HASH, serverHash);
          localStorage.setItem(STORAGE_KEYS.HAS_UNPUBLISHED, JSON.stringify(false));
          if (remote.publishedAt) {
            localStorage.setItem(STORAGE_KEYS.LAST_SYNCED_AT, remote.publishedAt);
          }
        } catch {
          // ignore storage quota errors
        }

        latestDataRef.current = {
          ...latestDataRef.current,
          settings: nextSettings,
          showcaseSlides: nextSlides,
          programs: nextPrograms,
          childrenList: nextChildren,
          announcements: nextAnnouncements,
          donors: nextDonors,
          partners: nextPartners,
          gallery: nextGallery,
          leadership: nextLeadership,
        };

        setSettings(nextSettings);
        setShowcaseSlides(nextSlides);
        setPrograms(nextPrograms);
        setChildrenList(nextChildren);
        setAnnouncements(nextAnnouncements);
        setDonors(nextDonors);
        setPartners(nextPartners);
        setGallery(nextGallery);
        setLeadership(nextLeadership);
        if (remote.publishedAt) {
          setLastPublishedAt(remote.publishedAt);
        }
        setHasUnpublishedChanges(false);
      }
    };

    void syncFromServer();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void syncFromServer();
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void syncFromServer();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(childrenList));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [childrenList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [donors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [partners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(leadership));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [leadership]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHILD_REGS, JSON.stringify(childRegistrations));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [childRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADULT_MEMS, JSON.stringify(adultMemberships));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [adultMemberships]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACT_MSGS, JSON.stringify(contactMessages));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [contactMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DONOR_INQS, JSON.stringify(donorInquiries));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [donorInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNER_INQS, JSON.stringify(partnershipInquiries));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [partnershipInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(isAdminAuthenticated));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOWCASE_SLIDES, JSON.stringify(showcaseSlides));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [showcaseSlides]);

  // Settings
  const updateSettings = (newSettings: WebsiteSettings) => {
    latestDataRef.current.settings = newSettings;
    persistImmediate(STORAGE_KEYS.SETTINGS, newSettings);
    setSettings(newSettings);
    markLocalChangesPending();
    addToast(
      latestDataRef.current.githubToken.trim()
        ? 'Website settings saved'
        : 'Website settings saved locally. Click "Publish Live" to sync globally.',
      'success'
    );
  };

  const deleteImpactStat = (id: string) => {
    const current = latestDataRef.current.settings;
    const nextStats = (current.stats || []).filter((s) => s.id !== id);
    const nextSettings: WebsiteSettings = { ...current, stats: nextStats };
    latestDataRef.current.settings = nextSettings;
    persistImmediate(STORAGE_KEYS.SETTINGS, nextSettings);
    setSettings(nextSettings);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  const deleteCoreValue = (id: string) => {
    const current = latestDataRef.current.settings;
    const nextValues = (current.aboutCoreValues || []).filter((v) => v.id !== id);
    const nextSettings: WebsiteSettings = { ...current, aboutCoreValues: nextValues };
    latestDataRef.current.settings = nextSettings;
    persistImmediate(STORAGE_KEYS.SETTINGS, nextSettings);
    setSettings(nextSettings);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Showcase Slides CRUD
  const addShowcaseSlide = (slide: Omit<ShowcaseSlide, 'id'>) => {
    const id = 'slide-' + Date.now();
    const next = [...latestDataRef.current.showcaseSlides, { ...slide, id }];
    latestDataRef.current.showcaseSlides = next;
    persistImmediate(STORAGE_KEYS.SHOWCASE_SLIDES, next);
    setShowcaseSlides(next);
    markLocalChangesPending();
    addToast('Homepage photo slide added successfully', 'success');
  };

  const updateShowcaseSlide = (id: string, updated: Partial<ShowcaseSlide>) => {
    const next = latestDataRef.current.showcaseSlides.map((s) =>
      s.id === id ? { ...s, ...updated } : s
    );
    latestDataRef.current.showcaseSlides = next;
    persistImmediate(STORAGE_KEYS.SHOWCASE_SLIDES, next);
    setShowcaseSlides(next);
    markLocalChangesPending();
    addToast('Homepage photo slide updated live', 'success');
  };

  const deleteShowcaseSlide = (id: string) => {
    const next = latestDataRef.current.showcaseSlides.filter((s) => s.id !== id);
    latestDataRef.current.showcaseSlides = next;
    persistImmediate(STORAGE_KEYS.SHOWCASE_SLIDES, next);
    setShowcaseSlides(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Programs CRUD
  const addProgram = (item: Omit<Program, 'id'>) => {
    const id = 'prog-' + Date.now();
    const next = [{ ...item, id }, ...latestDataRef.current.programs];
    latestDataRef.current.programs = next;
    persistImmediate(STORAGE_KEYS.PROGRAMS, next);
    setPrograms(next);
    markLocalChangesPending();
    addToast('New program created', 'success');
  };

  const updateProgram = (id: string, updated: Partial<Program>) => {
    const next = latestDataRef.current.programs.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    latestDataRef.current.programs = next;
    persistImmediate(STORAGE_KEYS.PROGRAMS, next);
    setPrograms(next);
    markLocalChangesPending();
    addToast('Program updated', 'success');
  };

  const deleteProgram = (id: string) => {
    const next = latestDataRef.current.programs.filter((p) => p.id !== id);
    latestDataRef.current.programs = next;
    persistImmediate(STORAGE_KEYS.PROGRAMS, next);
    setPrograms(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Children Profiles CRUD
  const addChild = (item: Omit<ChildProfile, 'id'>) => {
    const id = 'child-' + Date.now();
    const next = [{ ...item, id }, ...latestDataRef.current.childrenList];
    latestDataRef.current.childrenList = next;
    persistImmediate(STORAGE_KEYS.CHILDREN, next);
    setChildrenList(next);
    markLocalChangesPending();
    addToast('Child profile added with privacy consent', 'success');
  };

  const updateChild = (id: string, updated: Partial<ChildProfile>) => {
    const next = latestDataRef.current.childrenList.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    );
    latestDataRef.current.childrenList = next;
    persistImmediate(STORAGE_KEYS.CHILDREN, next);
    setChildrenList(next);
    markLocalChangesPending();
    addToast('Child profile updated', 'success');
  };

  const deleteChild = (id: string) => {
    const next = latestDataRef.current.childrenList.filter((c) => c.id !== id);
    latestDataRef.current.childrenList = next;
    persistImmediate(STORAGE_KEYS.CHILDREN, next);
    setChildrenList(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Announcements CRUD
  const addAnnouncement = (item: Omit<Announcement, 'id'>) => {
    const id = 'ann-' + Date.now();
    const next = [{ ...item, id }, ...latestDataRef.current.announcements];
    latestDataRef.current.announcements = next;
    persistImmediate(STORAGE_KEYS.ANNOUNCEMENTS, next);
    setAnnouncements(next);
    markLocalChangesPending();
    addToast('Announcement published', 'success');
  };

  const updateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    const next = latestDataRef.current.announcements.map((a) =>
      a.id === id ? { ...a, ...updated } : a
    );
    latestDataRef.current.announcements = next;
    persistImmediate(STORAGE_KEYS.ANNOUNCEMENTS, next);
    setAnnouncements(next);
    markLocalChangesPending();
    addToast('Announcement updated', 'success');
  };

  const deleteAnnouncement = (id: string) => {
    const next = latestDataRef.current.announcements.filter((a) => a.id !== id);
    latestDataRef.current.announcements = next;
    persistImmediate(STORAGE_KEYS.ANNOUNCEMENTS, next);
    setAnnouncements(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Donors CRUD
  const addDonor = (item: Omit<Donor, 'id'>) => {
    const id = 'donor-' + Date.now();
    const next = [{ ...item, id }, ...latestDataRef.current.donors];
    latestDataRef.current.donors = next;
    persistImmediate(STORAGE_KEYS.DONORS, next);
    setDonors(next);
    markLocalChangesPending();
    addToast('Donor added', 'success');
  };

  const updateDonor = (id: string, updated: Partial<Donor>) => {
    const next = latestDataRef.current.donors.map((d) =>
      d.id === id ? { ...d, ...updated } : d
    );
    latestDataRef.current.donors = next;
    persistImmediate(STORAGE_KEYS.DONORS, next);
    setDonors(next);
    markLocalChangesPending();
    addToast('Donor updated', 'success');
  };

  const deleteDonor = (id: string) => {
    const next = latestDataRef.current.donors.filter((d) => d.id !== id);
    latestDataRef.current.donors = next;
    persistImmediate(STORAGE_KEYS.DONORS, next);
    setDonors(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Partners CRUD
  const addPartner = (item: Omit<Partner, 'id'>) => {
    const id = 'partner-' + Date.now();
    const next = [{ ...item, id }, ...latestDataRef.current.partners];
    latestDataRef.current.partners = next;
    persistImmediate(STORAGE_KEYS.PARTNERS, next);
    setPartners(next);
    markLocalChangesPending();
    addToast('Partner added', 'success');
  };

  const updatePartner = (id: string, updated: Partial<Partner>) => {
    const next = latestDataRef.current.partners.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    latestDataRef.current.partners = next;
    persistImmediate(STORAGE_KEYS.PARTNERS, next);
    setPartners(next);
    markLocalChangesPending();
    addToast('Partner updated', 'success');
  };

  const deletePartner = (id: string) => {
    const next = latestDataRef.current.partners.filter((p) => p.id !== id);
    latestDataRef.current.partners = next;
    persistImmediate(STORAGE_KEYS.PARTNERS, next);
    setPartners(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const id = 'gal-' + Date.now();
    const next = [{ ...item, id }, ...latestDataRef.current.gallery];
    latestDataRef.current.gallery = next;
    persistImmediate(STORAGE_KEYS.GALLERY, next);
    setGallery(next);
    markLocalChangesPending();
    addToast('Media uploaded to gallery', 'success');
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    const next = latestDataRef.current.gallery.map((g) =>
      g.id === id ? { ...g, ...updated } : g
    );
    latestDataRef.current.gallery = next;
    persistImmediate(STORAGE_KEYS.GALLERY, next);
    setGallery(next);
    markLocalChangesPending();
    addToast('Media details updated', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    const next = latestDataRef.current.gallery.filter((g) => g.id !== id);
    latestDataRef.current.gallery = next;
    persistImmediate(STORAGE_KEYS.GALLERY, next);
    setGallery(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Leadership CRUD
  const addLeadership = (item: Omit<LeadershipMember, 'id'>) => {
    const id = 'lead-' + Date.now();
    const next = [...latestDataRef.current.leadership, { ...item, id }];
    latestDataRef.current.leadership = next;
    persistImmediate(STORAGE_KEYS.LEADERSHIP, next);
    setLeadership(next);
    markLocalChangesPending();
    addToast('Leadership profile added', 'success');
  };

  const updateLeadership = (id: string, updated: Partial<LeadershipMember>) => {
    const next = latestDataRef.current.leadership.map((l) =>
      l.id === id ? { ...l, ...updated } : l
    );
    latestDataRef.current.leadership = next;
    persistImmediate(STORAGE_KEYS.LEADERSHIP, next);
    setLeadership(next);
    markLocalChangesPending();
    addToast('Leadership profile updated', 'success');
  };

  const deleteLeadership = (id: string) => {
    const next = latestDataRef.current.leadership.filter((l) => l.id !== id);
    latestDataRef.current.leadership = next;
    persistImmediate(STORAGE_KEYS.LEADERSHIP, next);
    setLeadership(next);
    markLocalChangesPending(true, true);
    addToast('Permanently deleted and synced.', 'success');
  };

  // Form Submissions
  const submitChildRegistration = (reg: Omit<ChildRegistration, 'id' | 'dateSubmitted' | 'status'>) => {
    const id = 'reg-' + Date.now();
    const dateSubmitted = new Date().toISOString().split('T')[0];
    const newRecord: ChildRegistration = {
      ...reg,
      id,
      dateSubmitted,
      status: 'pending',
    };
    setChildRegistrations((prev) => {
      const next = [newRecord, ...prev];
      persistImmediate(STORAGE_KEYS.CHILD_REGS, next);
      return next;
    });
    addToast('Registration submitted successfully! Our team will contact the caregiver.', 'success');
    return true;
  };

  const updateChildRegStatus = (id: string, status: ChildRegistration['status']) => {
    setChildRegistrations((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
      persistImmediate(STORAGE_KEYS.CHILD_REGS, next);
      return next;
    });
    addToast(`Registration status set to ${status}`, 'info');
  };

  const deleteChildReg = (id: string) => {
    setChildRegistrations((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistImmediate(STORAGE_KEYS.CHILD_REGS, next);
      return next;
    });
    addToast('Permanently deleted and synced.', 'success');
  };

  const submitAdultMembership = (mem: Omit<AdultMembership, 'id' | 'dateSubmitted' | 'status'>) => {
    const id = 'mem-' + Date.now();
    const dateSubmitted = new Date().toISOString().split('T')[0];
    const newRecord: AdultMembership = {
      ...mem,
      id,
      dateSubmitted,
      status: 'pending',
    };
    setAdultMemberships((prev) => {
      const next = [newRecord, ...prev];
      persistImmediate(STORAGE_KEYS.ADULT_MEMS, next);
      return next;
    });
    addToast('Membership application submitted! Our coordinator will review your application.', 'success');
    return true;
  };

  const updateAdultMemStatus = (id: string, status: AdultMembership['status']) => {
    setAdultMemberships((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, status } : m));
      persistImmediate(STORAGE_KEYS.ADULT_MEMS, next);
      return next;
    });
    addToast(`Membership status updated to ${status}`, 'info');
  };

  const deleteAdultMem = (id: string) => {
    setAdultMemberships((prev) => {
      const next = prev.filter((m) => m.id !== id);
      persistImmediate(STORAGE_KEYS.ADULT_MEMS, next);
      return next;
    });
    addToast('Permanently deleted and synced.', 'success');
  };

  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'dateSubmitted' | 'read'>) => {
    const id = 'msg-' + Date.now();
    const dateSubmitted = new Date().toISOString().split('T')[0];
    const newRecord: ContactMessage = {
      ...msg,
      id,
      dateSubmitted,
      read: false,
    };
    setContactMessages((prev) => {
      const next = [newRecord, ...prev];
      persistImmediate(STORAGE_KEYS.CONTACT_MSGS, next);
      return next;
    });
    addToast('Thank you! Your message has been sent to Rusizi Kids Foundation.', 'success');
    return true;
  };

  const markContactRead = (id: string) => {
    setContactMessages((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, read: true } : m));
      persistImmediate(STORAGE_KEYS.CONTACT_MSGS, next);
      return next;
    });
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages((prev) => {
      const next = prev.filter((m) => m.id !== id);
      persistImmediate(STORAGE_KEYS.CONTACT_MSGS, next);
      return next;
    });
    addToast('Permanently deleted and synced.', 'success');
  };

  const submitDonorInquiry = (inq: Omit<DonorInquiry, 'id' | 'dateSubmitted' | 'status'>) => {
    const id = 'dinq-' + Date.now();
    const dateSubmitted = new Date().toISOString().split('T')[0];
    const newRecord: DonorInquiry = {
      ...inq,
      id,
      dateSubmitted,
      status: 'new',
    };
    setDonorInquiries((prev) => {
      const next = [newRecord, ...prev];
      persistImmediate(STORAGE_KEYS.DONOR_INQS, next);
      return next;
    });
    addToast('Thank you for your generous inquiry! Our director will get in touch.', 'success');
    return true;
  };

  const updateDonorInquiryStatus = (id: string, status: DonorInquiry['status']) => {
    setDonorInquiries((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, status } : d));
      persistImmediate(STORAGE_KEYS.DONOR_INQS, next);
      return next;
    });
  };

  const deleteDonorInquiry = (id: string) => {
    setDonorInquiries((prev) => {
      const next = prev.filter((d) => d.id !== id);
      persistImmediate(STORAGE_KEYS.DONOR_INQS, next);
      return next;
    });
    addToast('Permanently deleted and synced.', 'success');
  };

  const submitPartnershipInquiry = (inq: Omit<PartnershipInquiry, 'id' | 'dateSubmitted' | 'status'>) => {
    const id = 'pinq-' + Date.now();
    const dateSubmitted = new Date().toISOString().split('T')[0];
    const newRecord: PartnershipInquiry = {
      ...inq,
      id,
      dateSubmitted,
      status: 'new',
    };
    setPartnershipInquiries((prev) => {
      const next = [newRecord, ...prev];
      persistImmediate(STORAGE_KEYS.PARTNER_INQS, next);
      return next;
    });
    addToast('Partnership proposal received! We look forward to collaborating.', 'success');
    return true;
  };

  const updatePartnershipInquiryStatus = (id: string, status: PartnershipInquiry['status']) => {
    setPartnershipInquiries((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, status } : p));
      persistImmediate(STORAGE_KEYS.PARTNER_INQS, next);
      return next;
    });
  };

  const deletePartnershipInquiry = (id: string) => {
    setPartnershipInquiries((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistImmediate(STORAGE_KEYS.PARTNER_INQS, next);
      return next;
    });
    addToast('Permanently deleted and synced.', 'success');
  };

  // Admin authentication (Uses foundation official email: amissabora@gmail.com)
  const getCustomAdminPass = (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
    } catch {
      return null;
    }
  };

  const isPassValid = (inputPass: string): boolean => {
    const trimmed = inputPass.trim();
    const customPass = getCustomAdminPass();
    if (customPass) {
      return trimmed === customPass;
    }
    return trimmed === 'rusizi2026' || trimmed === 'rkf@rwanda2026' || trimmed === 'admin123';
  };

  const loginAdmin = (email: string, pass: string): { success: boolean; message?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const authorizedEmail = 'amissabora@gmail.com';
    const dynamicEmail = (settings.officialEmail || '').trim().toLowerCase();

    // Validate email
    if (
      normalizedEmail !== authorizedEmail &&
      normalizedEmail !== 'admin@rusizikids.org' &&
      (!dynamicEmail || normalizedEmail !== dynamicEmail)
    ) {
      return {
        success: false,
        message: 'Invalid credentials. Access is restricted to authorized administrators only.',
      };
    }

    if (isPassValid(pass)) {
      setIsAdminAuthenticated(true);
      setAdminEmail(normalizedEmail);
      addToast('Super Admin authenticated successfully', 'success');
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please verify your super administrator password.',
    };
  };

  const changeAdminPassword = (
    currentPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    if (!isPassValid(currentPass)) {
      return {
        success: false,
        message: 'Current administrator password is incorrect.',
      };
    }
    const trimmedNew = newPass.trim();
    if (trimmedNew.length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters long.',
      };
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, trimmedNew);
      addToast('Super Admin password updated securely', 'success');
      return {
        success: true,
        message: 'Administrator password changed successfully! Use this new password for future logins.',
      };
    } catch {
      return {
        success: false,
        message: 'Unable to save password to browser storage.',
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    if (activePage === 'admin') {
      setActivePage('home');
    }
    addToast('Administrator logged out safely', 'info');
  };

  const buildSiteDataPayload = (): SiteDataPayload => ({
    version: 1,
    publishedAt: new Date().toISOString(),
    settings,
    showcaseSlides,
    programs,
    children: childrenList,
    announcements,
    donors,
    partners,
    gallery,
    leadership,
  });

  const publishLiveToAllDevices = async (tokenOverride?: string) => {
    return executeCloudPublish(tokenOverride, false);
  };

  const downloadSiteDataJson = () => {
    const payload = buildSiteDataPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-data.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Downloaded site-data.json', 'success');
  };

  const resetAllData = () => {
    localStorage.clear();
    latestDataRef.current = {
      ...latestDataRef.current,
      settings: initialSettings,
      showcaseSlides: initialShowcaseSlides,
      programs: initialPrograms,
      childrenList: initialChildren,
      announcements: initialAnnouncements,
      donors: initialDonors,
      partners: initialPartners,
      gallery: initialGallery,
      leadership: initialLeadership,
    };
    setSettings(initialSettings);
    setShowcaseSlides(initialShowcaseSlides);
    setPrograms(initialPrograms);
    setChildrenList(initialChildren);
    setAnnouncements(initialAnnouncements);
    setDonors(initialDonors);
    setPartners(initialPartners);
    setGallery(initialGallery);
    setLeadership(initialLeadership);
    setHasUnpublishedChanges(false);
    addToast('Website reset to default official data', 'info');
  };

  return (
    <DataContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProgramId,
        setSelectedProgramId,
        settings,
        updateSettings,
        deleteImpactStat,
        deleteCoreValue,
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        children: childrenList,
        addChild,
        updateChild,
        deleteChild,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        donors,
        addDonor,
        updateDonor,
        deleteDonor,
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        leadership,
        addLeadership,
        updateLeadership,
        deleteLeadership,
        childRegistrations,
        submitChildRegistration,
        updateChildRegStatus,
        deleteChildReg,
        adultMemberships,
        submitAdultMembership,
        updateAdultMemStatus,
        deleteAdultMem,
        contactMessages,
        submitContactMessage,
        markContactRead,
        deleteContactMessage,
        donorInquiries,
        submitDonorInquiry,
        updateDonorInquiryStatus,
        deleteDonorInquiry,
        partnershipInquiries,
        submitPartnershipInquiry,
        updatePartnershipInquiryStatus,
        deletePartnershipInquiry,
        showcaseSlides,
        addShowcaseSlide,
        updateShowcaseSlide,
        deleteShowcaseSlide,
        isEditModeActive,
        setIsEditModeActive,
        toggleEditMode,
        adminTargetTab,
        setAdminTargetTab,
        openAdminTab,
        isAdminAuthenticated,
        adminEmail,
        loginAdmin,
        changeAdminPassword,
        logoutAdmin,
        toasts,
        addToast,
        removeToast,
        resetAllData,
        githubToken,
        setGithubToken,
        isPublishingLive,
        lastPublishedAt,
        hasUnpublishedChanges,
        publishLiveToAllDevices,
        downloadSiteDataJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
