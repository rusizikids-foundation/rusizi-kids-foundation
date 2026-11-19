export type PageId =
  | 'home'
  | 'about'
  | 'programs'
  | 'children'
  | 'news'
  | 'donors'
  | 'gallery'
  | 'join'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin';

export interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  activities: string[];
  achievements: string[];
  schedule?: string;
  featured?: boolean;
}

export interface ChildProfile {
  id: string;
  publicName: string; // First name and initial to respect child privacy
  age: number;
  talentCategory: 'Dance' | 'Film & Acting' | 'Singing & Music' | 'Fashion & Modeling' | 'Traditional Dance' | 'Talent Development';
  description: string;
  activities: string[];
  achievements: string[];
  photo: string;
  consentVerified: boolean;
  joinYear: number;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  image: string;
  publicationDate: string;
  category:
    | 'Foundation Announcements'
    | 'Upcoming Events'
    | 'Activities'
    | 'Parent Announcements'
    | 'Member Announcements'
    | 'Casting Announcements'
    | 'Recruitment'
    | 'Meetings'
    | 'Projects'
    | 'Completed Activities';
  eventDate?: string;
  registrationLink?: string;
  published: boolean;
}

export interface Donor {
  id: string;
  name: string;
  photo?: string;
  logo?: string;
  role?: string;
  description: string;
  contribution?: string;
  contributionDate?: string;
  supportedProjects: string[];
  websiteUrl?: string;
  featuredHomepage: boolean;
  tier?: string;
}

export interface Partner {
  id: string;
  organizationName: string;
  photo?: string;
  logo?: string;
  role?: string;
  description: string;
  contribution?: string;
  contributionDate?: string;
  supportedActivities: string[];
  websiteUrl?: string;
  featuredHomepage: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Dance' | 'Traditional Dance' | 'Film & Acting' | 'Fashion' | 'Events' | 'Training' | 'Community Projects';
  mediaType: 'image' | 'video';
  url: string;
  caption: string;
  consentVerified: boolean;
  date?: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  email?: string;
}

export interface ChildRegistration {
  id: string;
  childName: string;
  age: number;
  school: string;
  classLevel: string;
  fatherName: string;
  motherName: string;
  caregiverIdNumber: string;
  caregiverPhone: string;
  activitiesInterest: string[];
  parentConsent: boolean;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'contacted';
}

export interface AdultMembership {
  id: string;
  applicantName: string;
  age: number;
  province: string;
  district: string;
  idNumber: string;
  email: string;
  phone: string;
  membershipCategory: 'Volunteer Mentor' | 'Community Supporter' | 'Artistic Coach' | 'National Advocate';
  motivation: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'contacted';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  dateSubmitted: string;
  read: boolean;
}

export interface DonorInquiry {
  id: string;
  nameOrOrg: string;
  email: string;
  phone: string;
  supportType: 'Financial Sponsorship' | 'Costume & Equipment' | 'Educational Bursaries' | 'Nutritional & Meal Support' | 'Other';
  message: string;
  dateSubmitted: string;
  status: 'new' | 'in_review' | 'processed';
}

export interface PartnershipInquiry {
  id: string;
  orgName: string;
  contactPerson: string;
  email: string;
  phone: string;
  proposedPartnership: string;
  description: string;
  dateSubmitted: string;
  status: 'new' | 'in_review' | 'processed';
}

export interface SocialLinks {
  tikTok: string;
  youTube: string;
  facebook: string;
  linkedIn: string;
  instagram: string;
  whatsAppGroup: string;
}

export interface StatItem {
  id: string;
  number: string;
  label: string;
  highlight?: boolean;
}

export interface ShowcaseSlide {
  id: string;
  image: string;
  category: string;
  title: string;
  subtitle: string;
  caption: string;
  ageRange: string;
}

export interface CoreValueItem {
  id: string;
  title: string;
  desc: string;
}

export interface NavItemConfig {
  id: PageId;
  label: string;
  visible: boolean;
}

export interface WebsiteSettings {
  // Brand Identity
  foundationName: string;
  abbreviation: string;
  slogan: string;
  mission: string;
  vision: string;
  purpose: string;
  location: string;
  officialEmail: string;
  officialPhones: string[];
  socialLinks: SocialLinks;
  primaryLogo: string;
  emblemLogo: string;
  announcementTicker?: string;

  // Hero Section Customization
  heroBadgeText: string;
  heroHeadlineLine1: string;
  heroHeadlineHighlight: string;
  heroDescription: string;
  heroCta1Text: string;
  heroCta1Page: PageId;
  heroCta2Text: string;
  heroCta2Page: PageId;
  heroImage: string;
  heroCaptionTitle: string;
  heroCaptionText: string;

  // Impact Statistics
  stats: StatItem[];

  // About Section & Page Customization
  aboutStoryHeadline: string;
  aboutStoryParagraphs: string[];
  aboutCoreValues: CoreValueItem[];
  aboutCommunityContext?: string;
  aboutHeroImage: string;
  aboutProtectionPledge?: string;

  // Contact & Office Information
  contactOfficeHours: string;
  googleMapsEmbedUrl?: string;
  googleMapsShareUrl?: string;

  // Footer Details
  footerMissionBlurb: string;
  footerSafeguardingNote: string;
  footerCopyrightText: string;

  // Navigation Items
  navItems?: NavItemConfig[];

  // Post-Registration WhatsApp Confirmation
  registrationWhatsAppUrl?: string;
  registrationWhatsAppTitle?: string;
  registrationWhatsAppSubtitle?: string;
  registrationWhatsAppMessage?: string;
  registrationWhatsAppButtonText?: string;

  // Donation & Payment Methods
  donationMomoUssdCode?: string;
  donationMomoPhone?: string;
  donationAirtelPhone?: string;
  donationAccountName?: string;
  donationBankName?: string;
  donationBankAccountNumber?: string;
  donationBankAccountName?: string;
  donationBankSwiftCode?: string;
}
