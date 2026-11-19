import React, { createContext, useContext, useState, useEffect } from 'react';
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
  fetchRemoteSiteData,
  GITHUB_TOKEN_STORAGE_KEY,
  publishSiteDataToGitHub,
  SiteDataPayload,
} from '../utils/cloudSync';

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

  partnershipInquiries: PartnershipInquiry[];
  submitPartnershipInquiry: (inq: Omit<PartnershipInquiry, 'id' | 'dateSubmitted' | 'status'>) => boolean;
  updatePartnershipInquiryStatus: (id: string, status: PartnershipInquiry['status']) => void;

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
  HAS_UNPUBLISHED: 'rkf_has_unpublished_v1',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageRaw] = useState<PageId>('home');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const setActivePage = (page: PageId) => {
    setActivePageRaw(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe localStorage helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const normalizeSettings = (raw?: Partial<WebsiteSettings>): WebsiteSettings => {
    const merged: WebsiteSettings = { ...initialSettings, ...(raw || {}) };
    if (
      !merged.primaryLogo ||
      merged.primaryLogo.includes('RKF_circle_icon') ||
      merged.primaryLogo.includes('RUSIZI_FOUNDATION_afe2877a')
    ) {
      merged.primaryLogo = '/logo.png';
      merged.emblemLogo = '/logo.png';
    }
    if (!merged.emblemLogo) {
      merged.emblemLogo = merged.primaryLogo || '/logo.png';
    }
    return merged;
  };

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const loaded = loadStored<Partial<WebsiteSettings>>(STORAGE_KEYS.SETTINGS, initialSettings);
    const merged = normalizeSettings(loaded);
    // Ensure nested objects/arrays exist
    if (!merged.stats || merged.stats.length === 0) {
      merged.stats = initialSettings.stats;
    }
    if (!merged.aboutCoreValues || merged.aboutCoreValues.length === 0) {
      merged.aboutCoreValues = initialSettings.aboutCoreValues;
    }
    if (!merged.aboutStoryParagraphs || merged.aboutStoryParagraphs.length === 0) {
      merged.aboutStoryParagraphs = initialSettings.aboutStoryParagraphs;
    }
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

  const [showcaseSlides, setShowcaseSlides] = useState<ShowcaseSlide[]>(() => {
    const loaded = loadStored<ShowcaseSlide[]>(STORAGE_KEYS.SHOWCASE_SLIDES, initialShowcaseSlides);
    if (!Array.isArray(loaded) || loaded.length === 0) {
      return initialShowcaseSlides;
    }
    return loaded.map((slide, idx) => {
      const seed =
        initialShowcaseSlides.find((item) => item.id === slide.id) ||
        initialShowcaseSlides[idx % initialShowcaseSlides.length];
      const hasValidImage =
        typeof slide.image === 'string' && slide.image.trim().length > 0;
      return {
        ...seed,
        ...slide,
        image: hasValidImage ? slide.image : seed.image,
      };
    });
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
  const [programs, setPrograms] = useState<Program[]>(() =>
    loadStored(STORAGE_KEYS.PROGRAMS, initialPrograms)
  );
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() =>
    loadStored(STORAGE_KEYS.CHILDREN, initialChildren)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadStored(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements)
  );
  const [donors, setDonors] = useState<Donor[]>(() => {
    const loaded = loadStored<Donor[]>(STORAGE_KEYS.DONORS, initialDonors);
    return loaded.map((d) => {
      const seed = initialDonors.find((item) => item.id === d.id);
      if (!seed) return d;
      return {
        ...seed,
        ...d,
        photo: d.photo || d.logo || seed.photo,
        role: d.role || d.tier || seed.role,
        contribution: d.contribution || seed.contribution || d.description,
        contributionDate: d.contributionDate || seed.contributionDate,
      };
    });
  });
  const [partners, setPartners] = useState<Partner[]>(() => {
    const loaded = loadStored<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners);
    return loaded.map((p) => {
      const seed = initialPartners.find((item) => item.id === p.id);
      if (!seed) return p;
      return {
        ...seed,
        ...p,
        photo: p.photo || p.logo || seed.photo,
        role: p.role || seed.role,
        contribution: p.contribution || seed.contribution || p.description,
        contributionDate: p.contributionDate || seed.contributionDate,
      };
    });
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    loadStored(STORAGE_KEYS.GALLERY, initialGallery)
  );
  const [leadership, setLeadership] = useState<LeadershipMember[]>(() => {
    const loaded = loadStored<LeadershipMember[]>(STORAGE_KEYS.LEADERSHIP, initialLeadership);
    if (!Array.isArray(loaded) || loaded.length === 0) {
      return initialLeadership;
    }
    const legacyNames = ['Amissa Bora', 'Jean Paul N.', 'Claudine M.', 'Eric K.'];
    const isExactLegacySeed =
      loaded.length === 4 &&
      loaded.every((m, idx) => m.id === `lead-${idx + 1}` && legacyNames.includes(m.name));
    return isExactLegacySeed ? initialLeadership : loaded;
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

  const setGithubToken = (token: string) => {
    setGithubTokenState(token);
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

  const markLocalChangesPending = () => {
    setHasUnpublishedChanges(true);
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_UNPUBLISHED, JSON.stringify(true));
    } catch {
      // ignore
    }
  };

  // Automatically fetch central public/site-data.json on every visitor device load
  useEffect(() => {
    let active = true;
    fetchRemoteSiteData().then((remote) => {
      if (!active || !remote) return;

      const localHasEdits = loadStored<boolean>(STORAGE_KEYS.HAS_UNPUBLISHED, false);
      const localSyncedAt = (() => {
        try {
          return localStorage.getItem(STORAGE_KEYS.LAST_SYNCED_AT);
        } catch {
          return null;
        }
      })();

      const remoteTime = remote.publishedAt ? Date.parse(remote.publishedAt) : 0;
      const localTime = localSyncedAt ? Date.parse(localSyncedAt) : 0;
      const remoteIsNewer = remoteTime > 0 && (!localTime || remoteTime > localTime);

      // Visitors without local admin edits always adopt remote site-data.json;
      // Admins with pending edits only overwrite if a newer cloud publish exists.
      if (!localHasEdits || remoteIsNewer) {
        setSettings(normalizeSettings(remote.settings));
        if (Array.isArray(remote.showcaseSlides) && remote.showcaseSlides.length > 0) {
          setShowcaseSlides(remote.showcaseSlides);
        }
        if (Array.isArray(remote.programs) && remote.programs.length > 0) {
          setPrograms(remote.programs);
        }
        if (Array.isArray(remote.children) && remote.children.length > 0) {
          setChildrenList(remote.children);
        }
        if (Array.isArray(remote.announcements) && remote.announcements.length > 0) {
          setAnnouncements(remote.announcements);
        }
        if (Array.isArray(remote.donors) && remote.donors.length > 0) {
          setDonors(remote.donors);
        }
        if (Array.isArray(remote.partners) && remote.partners.length > 0) {
          setPartners(remote.partners);
        }
        if (Array.isArray(remote.gallery) && remote.gallery.length > 0) {
          setGallery(remote.gallery);
        }
        if (Array.isArray(remote.leadership) && remote.leadership.length > 0) {
          setLeadership(remote.leadership);
        }

        if (remote.publishedAt) {
          setLastPublishedAt(remote.publishedAt);
          try {
            localStorage.setItem(STORAGE_KEYS.LAST_SYNCED_AT, remote.publishedAt);
          } catch {
            // ignore
          }
        }
        if (remoteIsNewer) {
          setHasUnpublishedChanges(false);
          try {
            localStorage.setItem(STORAGE_KEYS.HAS_UNPUBLISHED, JSON.stringify(false));
          } catch {
            // ignore
          }
        }
      }
    });

    return () => {
      active = false;
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
    setSettings(newSettings);
    markLocalChangesPending();
    addToast('Website settings saved locally. Click "Publish Live" to sync globally.', 'success');
  };

  // Showcase Slides CRUD
  const addShowcaseSlide = (slide: Omit<ShowcaseSlide, 'id'>) => {
    const id = 'slide-' + Date.now();
    setShowcaseSlides((prev) => [...prev, { ...slide, id }]);
    markLocalChangesPending();
    addToast('Homepage photo slide added successfully', 'success');
  };

  const updateShowcaseSlide = (id: string, updated: Partial<ShowcaseSlide>) => {
    setShowcaseSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    markLocalChangesPending();
    addToast('Homepage photo slide updated live', 'success');
  };

  const deleteShowcaseSlide = (id: string) => {
    setShowcaseSlides((prev) => prev.filter((s) => s.id !== id));
    markLocalChangesPending();
    addToast('Showcase slide removed', 'info');
  };

  // Programs CRUD
  const addProgram = (item: Omit<Program, 'id'>) => {
    const id = 'prog-' + Date.now();
    setPrograms((prev) => [{ ...item, id }, ...prev]);
    markLocalChangesPending();
    addToast('New program created', 'success');
  };

  const updateProgram = (id: string, updated: Partial<Program>) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    markLocalChangesPending();
    addToast('Program updated', 'success');
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    markLocalChangesPending();
    addToast('Program deleted', 'info');
  };

  // Children Profiles CRUD
  const addChild = (item: Omit<ChildProfile, 'id'>) => {
    const id = 'child-' + Date.now();
    setChildrenList((prev) => [{ ...item, id }, ...prev]);
    markLocalChangesPending();
    addToast('Child profile added with privacy consent', 'success');
  };

  const updateChild = (id: string, updated: Partial<ChildProfile>) => {
    setChildrenList((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    markLocalChangesPending();
    addToast('Child profile updated', 'success');
  };

  const deleteChild = (id: string) => {
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
    markLocalChangesPending();
    addToast('Child profile removed', 'info');
  };

  // Announcements CRUD
  const addAnnouncement = (item: Omit<Announcement, 'id'>) => {
    const id = 'ann-' + Date.now();
    setAnnouncements((prev) => [{ ...item, id }, ...prev]);
    markLocalChangesPending();
    addToast('Announcement published', 'success');
  };

  const updateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    markLocalChangesPending();
    addToast('Announcement updated', 'success');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    markLocalChangesPending();
    addToast('Announcement removed', 'info');
  };

  // Donors CRUD
  const addDonor = (item: Omit<Donor, 'id'>) => {
    const id = 'donor-' + Date.now();
    setDonors((prev) => [{ ...item, id }, ...prev]);
    markLocalChangesPending();
    addToast('Donor added', 'success');
  };

  const updateDonor = (id: string, updated: Partial<Donor>) => {
    setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
    markLocalChangesPending();
    addToast('Donor updated', 'success');
  };

  const deleteDonor = (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));
    markLocalChangesPending();
    addToast('Donor removed', 'info');
  };

  // Partners CRUD
  const addPartner = (item: Omit<Partner, 'id'>) => {
    const id = 'partner-' + Date.now();
    setPartners((prev) => [{ ...item, id }, ...prev]);
    markLocalChangesPending();
    addToast('Partner added', 'success');
  };

  const updatePartner = (id: string, updated: Partial<Partner>) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    markLocalChangesPending();
    addToast('Partner updated', 'success');
  };

  const deletePartner = (id: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    markLocalChangesPending();
    addToast('Partner removed', 'info');
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const id = 'gal-' + Date.now();
    setGallery((prev) => [{ ...item, id }, ...prev]);
    markLocalChangesPending();
    addToast('Media uploaded to gallery', 'success');
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    markLocalChangesPending();
    addToast('Media details updated', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    markLocalChangesPending();
    addToast('Media removed', 'info');
  };

  // Leadership CRUD
  const addLeadership = (item: Omit<LeadershipMember, 'id'>) => {
    const id = 'lead-' + Date.now();
    setLeadership((prev) => [...prev, { ...item, id }]);
    markLocalChangesPending();
    addToast('Leadership profile added', 'success');
  };

  const updateLeadership = (id: string, updated: Partial<LeadershipMember>) => {
    setLeadership((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
    markLocalChangesPending();
    addToast('Leadership profile updated', 'success');
  };

  const deleteLeadership = (id: string) => {
    setLeadership((prev) => prev.filter((l) => l.id !== id));
    markLocalChangesPending();
    addToast('Profile removed', 'info');
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
    setChildRegistrations((prev) => [newRecord, ...prev]);
    addToast('Registration submitted successfully! Our team will contact the caregiver.', 'success');
    return true;
  };

  const updateChildRegStatus = (id: string, status: ChildRegistration['status']) => {
    setChildRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    addToast(`Registration status set to ${status}`, 'info');
  };

  const deleteChildReg = (id: string) => {
    setChildRegistrations((prev) => prev.filter((r) => r.id !== id));
    addToast('Registration record deleted', 'info');
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
    setAdultMemberships((prev) => [newRecord, ...prev]);
    addToast('Membership application submitted! Our coordinator will review your application.', 'success');
    return true;
  };

  const updateAdultMemStatus = (id: string, status: AdultMembership['status']) => {
    setAdultMemberships((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    addToast(`Membership status updated to ${status}`, 'info');
  };

  const deleteAdultMem = (id: string) => {
    setAdultMemberships((prev) => prev.filter((m) => m.id !== id));
    addToast('Membership record removed', 'info');
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
    setContactMessages((prev) => [newRecord, ...prev]);
    addToast('Thank you! Your message has been sent to Rusizi Kids Foundation.', 'success');
    return true;
  };

  const markContactRead = (id: string) => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    addToast('Message removed', 'info');
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
    setDonorInquiries((prev) => [newRecord, ...prev]);
    addToast('Thank you for your generous inquiry! Our director will get in touch.', 'success');
    return true;
  };

  const updateDonorInquiryStatus = (id: string, status: DonorInquiry['status']) => {
    setDonorInquiries((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
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
    setPartnershipInquiries((prev) => [newRecord, ...prev]);
    addToast('Partnership proposal received! We look forward to collaborating.', 'success');
    return true;
  };

  const updatePartnershipInquiryStatus = (id: string, status: PartnershipInquiry['status']) => {
    setPartnershipInquiries((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
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
    const activeToken = (tokenOverride ?? githubToken).trim();
    if (!activeToken) {
      const msg =
        'Enter your GitHub Sync Token inside Website Settings (Logo, Sync & Security) first.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }

    setIsPublishingLive(true);
    const payload = buildSiteDataPayload();
    const res = await publishSiteDataToGitHub(payload, activeToken);
    setIsPublishingLive(false);

    if (res.success) {
      setLastPublishedAt(payload.publishedAt);
      setHasUnpublishedChanges(false);
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNCED_AT, payload.publishedAt);
        localStorage.setItem(STORAGE_KEYS.HAS_UNPUBLISHED, JSON.stringify(false));
      } catch {
        // ignore
      }
      addToast(res.message, 'success');
    } else {
      addToast(res.message, 'error');
    }

    return res;
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
        partnershipInquiries,
        submitPartnershipInquiry,
        updatePartnershipInquiryStatus,
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
