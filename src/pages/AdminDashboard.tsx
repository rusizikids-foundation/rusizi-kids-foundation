import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import {
  Program,
  ChildProfile,
  Announcement,
  Donor,
  Partner,
  GalleryItem,
  LeadershipMember,
  WebsiteSettings,
  ShowcaseSlide,
} from '../types';
import { ImageUploadInput } from '../components/ImageUploadInput';
import {
  Shield,
  Users,
  UserCheck,
  Mail,
  Settings,
  Award,
  Bell,
  HeartHandshake,
  Image as ImageIcon,
  Check,
  Trash2,
  Edit2,
  Plus,
  Eye,
  LogOut,
  Download,
  RotateCcw,
  Sparkles,
  BookOpen,
  Layout,
  CheckCircle2,
  KeyRound,
  MessageCircle,
  Lock,
  TrendingUp,
  Smartphone,
  Landmark,
  CloudUpload,
  Loader2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { GITHUB_SYNC_CONFIG } from '../utils/cloudSync';

type AdminTab =
  | 'overview'
  | 'branding_security'
  | 'hero_slideshow'
  | 'impact_stats'
  | 'about_content'
  | 'programs'
  | 'children'
  | 'announcements'
  | 'gallery'
  | 'leadership'
  | 'donors_partners'
  | 'contact_footer_nav'
  | 'child_regs'
  | 'adult_mems'
  | 'messages';

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-xs text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]';
const LABEL_CLASS = 'block text-xs font-semibold text-[#D6C7B8] mb-1';
const CARD_CLASS = 'bg-[#1D120D] rounded-2xl border border-[#D9A62E]/30 p-6 shadow-xl';
const INNER_CARD_CLASS = 'p-4 rounded-xl border border-[#D9A62E]/25 bg-[#281912]';
const GOLD_BTN_CLASS =
  'px-4 py-2 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-all';

export const AdminDashboard: React.FC = () => {
  const {
    setActivePage,
    settings,
    updateSettings,
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    children,
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
    updateChildRegStatus,
    deleteChildReg,
    adultMemberships,
    updateAdultMemStatus,
    deleteAdultMem,
    contactMessages,
    markContactRead,
    deleteContactMessage,
    donorInquiries,
    updateDonorInquiryStatus,
    partnershipInquiries,
    updatePartnershipInquiryStatus,
    showcaseSlides,
    addShowcaseSlide,
    updateShowcaseSlide,
    deleteShowcaseSlide,
    adminTargetTab,
    setAdminTargetTab,
    changeAdminPassword,
    logoutAdmin,
    addToast,
    resetAllData,
    githubToken,
    setGithubToken,
    isPublishingLive,
    lastPublishedAt,
    hasUnpublishedChanges,
    publishLiveToAllDevices,
    downloadSiteDataJson,
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [tokenInput, setTokenInput] = useState<string>(githubToken || '');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
    commitUrl?: string;
  } | null>(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passFeedback, setPassFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Handle jump-to-tab from live edit links
  useEffect(() => {
    if (adminTargetTab) {
      setActiveTab(adminTargetTab as AdminTab);
      setAdminTargetTab(null);
    }
  }, [adminTargetTab, setAdminTargetTab]);

  // Form states for Settings & General Content
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);

  // Sync settingsForm when settings change
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Modals & Edit states
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeadershipMember | null>(null);
  const [isAddingLeader, setIsAddingLeader] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [isAddingDonor, setIsAddingDonor] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);

  // Showcase Slides Edit states
  const [editingSlide, setEditingSlide] = useState<ShowcaseSlide | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  // Core Values Editor
  const [newValueTitle, setNewValueTitle] = useState('');
  const [newValueDesc, setNewValueDesc] = useState('');

  // Filter terms
  const [childRegFilter, setChildRegFilter] = useState<string>('all');
  const [adultMemFilter, setAdultMemFilter] = useState<string>('all');

  const pendingChildRegs = childRegistrations.filter((r) => r.status === 'pending').length;
  const pendingAdultMems = adultMemberships.filter((m) => m.status === 'pending').length;
  const unreadMessages = contactMessages.filter((m) => !m.read).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handlePublishLive = async () => {
    setPublishResult(null);
    if (tokenInput.trim() !== githubToken.trim()) {
      setGithubToken(tokenInput.trim());
    }
    const res = await publishLiveToAllDevices(tokenInput.trim());
    setPublishResult(res);
  };

  const handleExportJson = () => {
    const backup = {
      settings,
      showcaseSlides,
      programs,
      children,
      announcements,
      donors,
      partners,
      gallery,
      leadership,
      childRegistrations,
      adultMemberships,
      contactMessages,
      donorInquiries,
      partnershipInquiries,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rkf_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    addToast('Complete database exported successfully', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);
    if (newPass.trim() !== confirmPass.trim()) {
      setPassFeedback({ success: false, message: 'New passwords do not match.' });
      return;
    }
    const res = changeAdminPassword(currentPass, newPass);
    setPassFeedback(res);
    if (res.success) {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  const navTabs: {
    id: AdminTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge: number | null;
  }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layout, badge: null },
    { id: 'branding_security', label: 'Website Settings & Cloud Sync', icon: CloudUpload, badge: null },
    {
      id: 'hero_slideshow',
      label: 'Hero & Showcase Photos',
      icon: Sparkles,
      badge: showcaseSlides.length,
    },
    {
      id: 'impact_stats',
      label: 'Impact Stats',
      icon: TrendingUp,
      badge: 4,
    },
    { id: 'about_content', label: 'About Us, Mission & Story', icon: BookOpen, badge: null },
    { id: 'programs', label: 'Talent Programs', icon: Award, badge: programs.length },
    { id: 'children', label: 'Children Showcase', icon: Users, badge: children.length },
    { id: 'announcements', label: 'Announcements & News', icon: Bell, badge: announcements.length },
    {
      id: 'donors_partners',
      label: 'Donors & Partners',
      icon: HeartHandshake,
      badge: donors.length + partners.length,
    },
    { id: 'gallery', label: 'Media Gallery', icon: ImageIcon, badge: gallery.length },
    { id: 'leadership', label: 'Staff & Team', icon: Shield, badge: leadership.length },
    { id: 'contact_footer_nav', label: 'Contact, Footer & Nav', icon: Settings, badge: null },
    {
      id: 'child_regs',
      label: 'Child Registrations (5-17)',
      icon: Users,
      badge: pendingChildRegs > 0 ? pendingChildRegs : null,
    },
    {
      id: 'adult_mems',
      label: 'Adult Memberships (18+)',
      icon: UserCheck,
      badge: pendingAdultMems > 0 ? pendingAdultMems : null,
    },
    {
      id: 'messages',
      label: 'Messages & Inquiries',
      icon: Mail,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#120B08] text-[#F9F5F0] pb-20">
      {/* Top Luxury Dark Chocolate Admin Header */}
      <div className="bg-[#1D120D] text-[#F9F5F0] border-b border-[#D9A62E]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#120B08] border border-[#D9A62E]/60 p-1 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              <img
                src={settings.primaryLogo || '/logo.png'}
                alt="RKF Monogram Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.dataset.fallbackApplied) {
                    img.dataset.fallbackApplied = '1';
                    img.src = '/logo.png';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-bold text-[#F9F5F0] tracking-tight">
                  RKF Super Admin CMS
                </h1>
                <span className="text-[10px] text-[#F2C14E] font-mono uppercase tracking-widest font-bold">
                  · Active Session
                </span>
              </div>
              <span className="text-xs text-[#A89585]">
                Executive Director Portal · Rusizi District, Rwanda
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (tokenInput.trim()) {
                  handlePublishLive();
                } else {
                  setActiveTab('branding_security');
                  addToast('Enter your optional GitHub Sync Token in Website Settings to publish live.', 'info');
                }
              }}
              disabled={isPublishingLive}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-1.5 disabled:opacity-60"
            >
              {isPublishingLive ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5" />
              )}
              <span>
                {isPublishingLive
                  ? 'Publishing...'
                  : hasUnpublishedChanges
                  ? 'Publish Live (Unsaved)'
                  : 'Publish Live to All Devices'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="px-3.5 py-1.5 bg-[#281912] hover:bg-[#3A241A] text-[#F9F5F0] text-xs font-semibold rounded-lg transition-colors border border-[#D9A62E]/35 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>View Public Website</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3.5 py-1.5 bg-[#281912] hover:bg-[#3A241A] text-[#F2C14E] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-[#D9A62E]/35"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3.5 py-1.5 bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/60 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/30 p-3 shadow-xl space-y-1">
              {navTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] shadow-md font-bold'
                        : 'text-[#D6C7B8] hover:bg-[#281912] hover:text-[#F2C14E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#120B08]' : 'text-[#D9A62E]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded font-bold ml-1 shrink-0 ${
                          isActive
                            ? 'bg-[#120B08]/15 text-[#120B08]'
                            : 'bg-[#281912] text-[#F2C14E] border border-[#D9A62E]/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Reset Button */}
            <div className="p-3 bg-[#1D120D] rounded-2xl border border-[#D9A62E]/25 shadow-xl text-center space-y-2">
              {confirmingReset ? (
                <div className="space-y-2 p-1">
                  <p className="text-[11px] text-[#F2C14E] font-semibold">
                    Reset all CMS content to defaults?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#D6C7B8] border border-[#D9A62E]/30 rounded-lg hover:bg-[#281912]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetAllData();
                        setConfirmingReset(false);
                      }}
                      className="flex-1 py-1.5 text-xs font-bold bg-red-800 hover:bg-red-700 text-white rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className="w-full py-2 text-xs font-medium text-[#A89585] hover:text-[#F2C14E] border border-[#D9A62E]/25 hover:border-[#D9A62E]/60 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Data</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Dashboard Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className={CARD_CLASS}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F9F5F0] tracking-tight">
                        Welcome, Executive Director Amissa Bora
                      </h2>
                      <p className="text-xs text-[#D6C7B8] mt-1">
                        Complete super-administrator control of the Rusizi Kids Foundation website. Edit every headline, section, photo, program, child talent, and incoming registration in real-time.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex px-3 py-1 bg-[#281912] text-[#F2C14E] text-xs font-bold rounded-lg border border-[#D9A62E]/40 shrink-0">
                      Full CMS Control
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className={INNER_CARD_CLASS}>
                      <span className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wide block">
                        Child Registrations
                      </span>
                      <span className="text-2xl font-mono font-bold tabular-nums text-[#F9F5F0] block mt-1">
                        {childRegistrations.length}
                      </span>
                      <span className="text-[11px] text-[#A89585]">
                        {pendingChildRegs} awaiting review
                      </span>
                    </div>

                    <div className={INNER_CARD_CLASS}>
                      <span className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wide block">
                        Showcase Slides
                      </span>
                      <span className="text-2xl font-mono font-bold tabular-nums text-[#F9F5F0] block mt-1">
                        {showcaseSlides.length}
                      </span>
                      <span className="text-[11px] text-[#A89585]">Active animated photos</span>
                    </div>

                    <div className={INNER_CARD_CLASS}>
                      <span className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wide block">
                        Talent Programs
                      </span>
                      <span className="text-2xl font-mono font-bold tabular-nums text-[#F9F5F0] block mt-1">
                        {programs.length}
                      </span>
                      <span className="text-[11px] text-[#A89585]">Disciplines in Rusizi</span>
                    </div>

                    <div className={INNER_CARD_CLASS}>
                      <span className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wide block">
                        Inquiries / Messages
                      </span>
                      <span className="text-2xl font-mono font-bold tabular-nums text-[#F9F5F0] block mt-1">
                        {contactMessages.length}
                      </span>
                      <span className="text-[11px] text-[#A89585]">
                        {unreadMessages} unread messages
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hero_slideshow')}
                    className="luxury-card p-5 rounded-2xl text-left flex items-start justify-between group"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                        Visual Showcase
                      </span>
                      <h4 className="text-sm font-bold text-[#F9F5F0] mt-1">
                        Edit Hero &amp; Photos
                      </h4>
                      <p className="text-xs text-[#A89585] mt-0.5">
                        Update animated slides, hero titles, &amp; stats
                      </p>
                    </div>
                    <Sparkles className="w-5 h-5 text-[#F2C14E] group-hover:scale-110 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('child_regs')}
                    className="luxury-card p-5 rounded-2xl text-left flex items-start justify-between group"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                        Action Required
                      </span>
                      <h4 className="text-sm font-bold text-[#F9F5F0] mt-1">
                        Review Child Registrations
                      </h4>
                      <p className="text-xs text-[#A89585] mt-0.5">
                        {pendingChildRegs} new child applications from Rusizi
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-[#F2C14E] group-hover:scale-110 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('branding_security')}
                    className="luxury-card p-5 rounded-2xl text-left flex items-start justify-between group"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                        Branding &amp; Access
                      </span>
                      <h4 className="text-sm font-bold text-[#F9F5F0] mt-1">
                        Logo, WhatsApp &amp; Password
                      </h4>
                      <p className="text-xs text-[#A89585] mt-0.5">
                        Upload site logo, edit parent WhatsApp invite, or change password
                      </p>
                    </div>
                    <KeyRound className="w-5 h-5 text-[#F2C14E] group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* 1B. WEBSITE SETTINGS, GLOBAL CLOUD SYNC, LOGO & SECURITY TAB */}
            {activeTab === 'branding_security' && (
              <div className="space-y-6">
                {/* Direct GitHub Cloud Sync & Global Publishing */}
                <div className={`${CARD_CLASS} space-y-5 border-2 border-[#D9A62E]/50`}>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9A62E]/25 pb-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <CloudUpload className="w-4 h-4 text-[#F2C14E]" />
                        <h3 className="text-base font-bold text-[#F9F5F0]">
                          Global Cloud Sync — Publish Live to All Devices
                        </h3>
                      </div>
                      <p className="text-xs text-[#D6C7B8] leading-relaxed">
                        Every phone and computer worldwide automatically fetches{' '}
                        <code className="font-mono text-[#F2C14E] bg-[#120B08] px-1.5 py-0.5 rounded">
                          /{GITHUB_SYNC_CONFIG.path}
                        </code>{' '}
                        on load. Commit your latest Hero slides, Impact Stats, Staff roster, Programs, Gallery, Donors, and Settings straight to{' '}
                        <span className="font-mono text-[#F9F5F0]">
                          {GITHUB_SYNC_CONFIG.owner}/{GITHUB_SYNC_CONFIG.repo}
                        </span>{' '}
                        so Vercel updates all visitors within ~15 seconds.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePublishLive}
                      disabled={isPublishingLive}
                      className={`${GOLD_BTN_CLASS} py-2.5 px-5 shrink-0 disabled:opacity-60`}
                    >
                      {isPublishingLive ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CloudUpload className="w-4 h-4" />
                      )}
                      <span>
                        {isPublishingLive ? 'Publishing Live...' : 'Publish Live to All Devices'}
                      </span>
                    </button>
                  </div>

                  {publishResult && (
                    <div
                      className={`p-4 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 border ${
                        publishResult.success
                          ? 'bg-[#281912] border-[#D9A62E] text-[#F9F5F0]'
                          : 'bg-rose-950/60 border-rose-500/45 text-rose-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {publishResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <span>{publishResult.message}</span>
                      </div>
                      {publishResult.commitUrl && (
                        <a
                          href={publishResult.commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#F2C14E] font-bold hover:underline"
                        >
                          <span>View GitHub Commit</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-8 space-y-1.5">
                      <label className={LABEL_CLASS}>
                        GitHub Sync Token (Optional · Stored Securely in This Browser Only)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type={showToken ? 'text' : 'password'}
                          value={tokenInput}
                          onChange={(e) => {
                            setTokenInput(e.target.value);
                            setGithubToken(e.target.value);
                          }}
                          placeholder="github_pat_... or ghp_... (Contents: Read and write)"
                          className={`${INPUT_CLASS} font-mono`}
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken((prev) => !prev)}
                          className="px-3 py-2 rounded-lg bg-[#281912] hover:bg-[#362218] text-[#D6C7B8] border border-[#D9A62E]/35 text-xs font-semibold shrink-0"
                        >
                          {showToken ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#A89585]">
                        Need a token? GitHub → Settings → Developer settings → Fine-grained tokens → Select{' '}
                        <span className="text-[#D6C7B8] font-mono">rusizi-kids-foundation</span> → Repository permissions: Contents (Read and write).
                      </p>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={downloadSiteDataJson}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#281912] hover:bg-[#362218] text-[#F2C14E] border border-[#D9A62E]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download site-data.json</span>
                      </button>
                      <span className="text-[11px] text-[#A89585] text-center font-mono tabular-nums">
                        {lastPublishedAt
                          ? `Last synced: ${new Date(lastPublishedAt).toLocaleString()}`
                          : 'Synced with initial build data'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Website Logo & Identity */}
                <div className={`${CARD_CLASS} space-y-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Official Website Logo &amp; Foundation Branding
                      </h3>
                      <p className="text-xs text-[#A89585]">
                        Upload or update the circular RKF logo shown across the header, footer, and portals.
                      </p>
                    </div>
                    <button type="button" onClick={handleSaveSettings} className={GOLD_BTN_CLASS}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Logo &amp; WhatsApp Settings</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <ImageUploadInput
                      label="Primary Website Logo (Header, Footer & Portals)"
                      value={settingsForm.primaryLogo || ''}
                      onChange={(url) =>
                        setSettingsForm({ ...settingsForm, primaryLogo: url, emblemLogo: url })
                      }
                      placeholder="Upload or paste logo URL"
                      shape="circle"
                    />
                    <div className="space-y-3">
                      <div>
                        <label className={LABEL_CLASS}>Foundation Name</label>
                        <input
                          type="text"
                          value={settingsForm.foundationName || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, foundationName: e.target.value })
                          }
                          className={`${INPUT_CLASS} font-bold`}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Abbreviation</label>
                        <input
                          type="text"
                          value={settingsForm.abbreviation || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, abbreviation: e.target.value })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post-Registration Parents WhatsApp Invite Settings */}
                <div className={`${CARD_CLASS} space-y-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <h3 className="text-base font-bold text-[#F9F5F0]">
                          Post-Registration Parents WhatsApp Confirmation
                        </h3>
                      </div>
                      <p className="text-xs text-[#A89585]">
                        Customize the thank-you screen and WhatsApp group invite button displayed immediately after a parent submits Child Registration.
                      </p>
                    </div>
                    <button type="button" onClick={handleSaveSettings} className={GOLD_BTN_CLASS}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Confirmation</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={LABEL_CLASS}>
                        Official Parents WhatsApp Group Invite Link
                      </label>
                      <input
                        type="url"
                        value={settingsForm.registrationWhatsAppUrl || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            registrationWhatsAppUrl: e.target.value,
                          })
                        }
                        placeholder="https://chat.whatsapp.com/..."
                        className={`${INPUT_CLASS} font-mono text-[#F2C14E]`}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Confirmation Headline</label>
                      <input
                        type="text"
                        value={settingsForm.registrationWhatsAppTitle || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            registrationWhatsAppTitle: e.target.value,
                          })
                        }
                        className={`${INPUT_CLASS} font-bold`}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>WhatsApp Button Label</label>
                      <input
                        type="text"
                        value={settingsForm.registrationWhatsAppButtonText || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            registrationWhatsAppButtonText: e.target.value,
                          })
                        }
                        className={`${INPUT_CLASS} font-bold`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={LABEL_CLASS}>Warm Thank-You Subtitle</label>
                      <input
                        type="text"
                        value={settingsForm.registrationWhatsAppSubtitle || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            registrationWhatsAppSubtitle: e.target.value,
                          })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={LABEL_CLASS}>
                        Call-To-Action Message (Inviting Parents to Join WhatsApp Group)
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.registrationWhatsAppMessage || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            registrationWhatsAppMessage: e.target.value,
                          })
                        }
                        className={`${INPUT_CLASS} leading-relaxed`}
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Password Security Section */}
                <div className={`${CARD_CLASS} space-y-5`}>
                  <div className="border-b border-[#D9A62E]/25 pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#F2C14E]" />
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Super Admin Password Security
                      </h3>
                    </div>
                    <p className="text-xs text-[#A89585]">
                      Update your administrator login password. Changes take effect immediately for future logins.
                    </p>
                  </div>

                  {passFeedback && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                        passFeedback.success
                          ? 'bg-[#281912] border-[#D9A62E] text-[#F2C14E]'
                          : 'bg-red-950/60 border-red-500/40 text-red-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{passFeedback.message}</span>
                    </div>
                  )}

                  <form
                    onSubmit={handlePasswordChange}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                  >
                    <div>
                      <label className={LABEL_CLASS}>Current Password *</label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Enter current password"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>New Password (min 6 chars) *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Enter new password"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button type="submit" className={GOLD_BTN_CLASS}>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Update Admin Password</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 2. HERO & SHOWCASE PHOTOS TAB */}
            {activeTab === 'hero_slideshow' && (
              <div className="space-y-6">
                {/* Hero Section Content Form */}
                <div className={`${CARD_CLASS} space-y-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Hero Section Titles, Deck &amp; Buttons
                      </h3>
                      <p className="text-xs text-[#A89585]">
                        Edit the prominent headline, highlighted text, buttons, and hero photo on the homepage.
                      </p>
                    </div>
                    <button type="button" onClick={handleSaveSettings} className={GOLD_BTN_CLASS}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Hero Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLASS}>Badge Text (Top of Hero)</label>
                      <input
                        type="text"
                        value={settingsForm.heroBadgeText || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroBadgeText: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Headline Line 1</label>
                      <input
                        type="text"
                        value={settingsForm.heroHeadlineLine1 || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroHeadlineLine1: e.target.value })
                        }
                        className={`${INPUT_CLASS} font-bold`}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Highlighted Slogan Line (Gold)</label>
                      <input
                        type="text"
                        value={settingsForm.heroHeadlineHighlight || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            heroHeadlineHighlight: e.target.value,
                          })
                        }
                        className={`${INPUT_CLASS} font-bold text-[#F2C14E]`}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Hero Caption Overlay Title</label>
                      <input
                        type="text"
                        value={settingsForm.heroCaptionTitle || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroCaptionTitle: e.target.value })
                        }
                        className={`${INPUT_CLASS} font-semibold`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={LABEL_CLASS}>Hero Description / Deck Text</label>
                      <textarea
                        rows={3}
                        value={settingsForm.heroDescription || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroDescription: e.target.value })
                        }
                        className={`${INPUT_CLASS} leading-relaxed`}
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>CTA Button 1 Label</label>
                      <input
                        type="text"
                        value={settingsForm.heroCta1Text || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroCta1Text: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>CTA Button 2 Label</label>
                      <input
                        type="text"
                        value={settingsForm.heroCta2Text || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroCta2Text: e.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <ImageUploadInput
                        label="Hero Right Showcase Photo (with Upload & Compression)"
                        value={settingsForm.heroImage || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, heroImage: url })}
                        placeholder="Enter image URL or click Upload File"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={LABEL_CLASS}>Hero Photo Caption Text</label>
                      <textarea
                        rows={2}
                        value={settingsForm.heroCaptionText || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroCaptionText: e.target.value })
                        }
                        className={`${INPUT_CLASS} leading-relaxed`}
                      />
                    </div>
                  </div>
                </div>

                {/* Shortcut to Dedicated Impact Stats Tab */}
                <div className={`${CARD_CLASS} flex flex-wrap items-center justify-between gap-4`}>
                  <div>
                    <h3 className="text-sm font-bold text-[#F9F5F0]">
                      Circular Gold Impact Statistics (4 Cards)
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Edit the 4 circular gold stat cards displayed below the homepage hero in the dedicated Impact Stats tab.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('impact_stats')}
                    className={GOLD_BTN_CLASS}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Open Impact Stats Editor</span>
                  </button>
                </div>

                {/* Animated Showcase Slides Manager */}
                <div className={`${CARD_CLASS} space-y-4`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Ken Burns Animated Slideshow Photos ({showcaseSlides.length})
                      </h3>
                      <p className="text-xs text-[#A89585]">
                        Upload inspiring photos of the children, edit captions, and change categories for the interactive homepage showcase.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingSlide(true)}
                      className={GOLD_BTN_CLASS}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Slide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {showcaseSlides.map((slide) => (
                      <div key={slide.id} className={`${INNER_CARD_CLASS} flex gap-4 items-start`}>
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#D9A62E]/30 bg-[#120B08]">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2C14E]">
                              {slide.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingSlide(slide)}
                                className="p-1 text-[#D6C7B8] hover:text-[#F2C14E]"
                                title="Edit slide"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteShowcaseSlide(slide.id)}
                                className="p-1 text-[#A89585] hover:text-red-400"
                                title="Delete slide"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-[#F9F5F0] truncate">
                            {slide.title}
                          </h4>
                          <p className="text-[11px] text-[#D9A62E] font-semibold truncate">
                            {slide.subtitle}
                          </p>
                          <p className="text-[11px] text-[#D6C7B8] line-clamp-2 leading-relaxed">
                            {slide.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2B. IMPACT STATS TAB (4 CIRCULAR GOLD CARDS) */}
            {activeTab === 'impact_stats' && (
              <form onSubmit={handleSaveSettings} className={`${CARD_CLASS} space-y-6`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#F2C14E]" />
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Home Page Impact Stats (4 Circular Gold Cards)
                      </h3>
                    </div>
                    <p className="text-xs text-[#A89585] mt-0.5">
                      Edit the number/value and label text for each of the 4 circular gold stat cards shown on the Home Page.
                    </p>
                  </div>
                  <button type="submit" className={GOLD_BTN_CLASS}>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Impact Stats</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      id: 'stat-1',
                      fallbackNumber: '120+',
                      fallbackLabel: 'Children Nurtured',
                      title: 'Stat Card 1 · Primary Reach',
                      progress: 92,
                    },
                    {
                      id: 'stat-2',
                      fallbackNumber: '8',
                      fallbackLabel: 'Talent Disciplines',
                      title: 'Stat Card 2 · Programs',
                      progress: 86,
                    },
                    {
                      id: 'stat-3',
                      fallbackNumber: '5–17',
                      fallbackLabel: 'Age Group Focus',
                      title: 'Stat Card 3 · Youth Age Span',
                      progress: 88,
                    },
                    {
                      id: 'stat-4',
                      fallbackNumber: '100%',
                      fallbackLabel: 'Verified Guardian Consent',
                      title: 'Stat Card 4 · Safeguarding',
                      progress: 95,
                    },
                  ].map((slot, idx) => {
                    const currentStats = settingsForm.stats || [];
                    const stat = currentStats[idx] || {
                      id: slot.id,
                      number: slot.fallbackNumber,
                      label: slot.fallbackLabel,
                      highlight: idx % 2 === 1,
                    };

                    const updateSlot = (field: 'number' | 'label', value: string) => {
                      const defaults = [
                        { id: 'stat-1', number: '120+', label: 'Children Nurtured', highlight: false },
                        { id: 'stat-2', number: '8', label: 'Talent Disciplines', highlight: true },
                        { id: 'stat-3', number: '5–17', label: 'Age Group Focus', highlight: false },
                        {
                          id: 'stat-4',
                          number: '100%',
                          label: 'Verified Guardian Consent',
                          highlight: true,
                        },
                      ];
                      const nextStats = [0, 1, 2, 3].map(
                        (i) => currentStats[i] || defaults[i]
                      );
                      nextStats[idx] = { ...nextStats[idx], [field]: value };
                      setSettingsForm({ ...settingsForm, stats: nextStats });
                    };

                    const radius = 34;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset =
                      circumference - (slot.progress / 100) * circumference;

                    return (
                      <div key={slot.id} className={`${INNER_CARD_CLASS} space-y-4`}>
                        <div className="flex items-center justify-between gap-4 border-b border-[#D9A62E]/20 pb-3">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                              {slot.title}
                            </span>
                            <span className="text-xs text-[#A89585]">
                              Live preview on Home Page
                            </span>
                          </div>
                          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                              <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                stroke="#1D120D"
                                strokeWidth="5"
                                fill="#120B08"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                stroke="#F2C14E"
                                strokeWidth="5"
                                strokeLinecap="round"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                              />
                            </svg>
                            <span className="absolute font-mono tabular-nums text-xs font-bold text-[#F2C14E]">
                              {stat.number}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className={LABEL_CLASS}>Number / Value *</label>
                            <input
                              type="text"
                              required
                              value={stat.number}
                              onChange={(e) => updateSlot('number', e.target.value)}
                              placeholder={slot.fallbackNumber}
                              className={`${INPUT_CLASS} font-mono font-bold text-sm text-[#F2C14E]`}
                            />
                          </div>
                          <div>
                            <label className={LABEL_CLASS}>Stat Label Text *</label>
                            <input
                              type="text"
                              required
                              value={stat.label}
                              onChange={(e) => updateSlot('label', e.target.value)}
                              placeholder={slot.fallbackLabel}
                              className={`${INPUT_CLASS} uppercase font-semibold`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D9A62E]/25">
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        stats: [
                          { id: 'stat-1', number: '120+', label: 'Children Nurtured', highlight: false },
                          { id: 'stat-2', number: '8', label: 'Talent Disciplines', highlight: true },
                          { id: 'stat-3', number: '5–17', label: 'Age Group Focus', highlight: false },
                          {
                            id: 'stat-4',
                            number: '100%',
                            label: 'Verified Guardian Consent',
                            highlight: true,
                          },
                        ],
                      })
                    }
                    className="px-3.5 py-2 text-xs font-semibold text-[#D6C7B8] hover:text-[#F2C14E] border border-[#D9A62E]/30 rounded-lg transition-colors"
                  >
                    Restore 4 Default Stats
                  </button>
                  <button type="submit" className={GOLD_BTN_CLASS}>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Impact Stats</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. ABOUT US, MISSION & STORY TAB */}
            {activeTab === 'about_content' && (
              <div className={`${CARD_CLASS} space-y-6`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      About Us, Mission, Vision &amp; Genesis Narrative
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Edit all organizational statements, founding story, core principles, and about photo.
                    </p>
                  </div>
                  <button type="button" onClick={handleSaveSettings} className={GOLD_BTN_CLASS}>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save About Changes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Official Slogan</label>
                    <input
                      type="text"
                      value={settingsForm.slogan || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                      className={`${INPUT_CLASS} font-bold text-[#F2C14E]`}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Organization Purpose (Brief Summary)</label>
                    <input
                      type="text"
                      value={settingsForm.purpose || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, purpose: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLASS}>Mission Statement</label>
                    <textarea
                      rows={2}
                      value={settingsForm.mission || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, mission: e.target.value })
                      }
                      className={`${INPUT_CLASS} leading-relaxed`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLASS}>Vision Statement</label>
                    <textarea
                      rows={2}
                      value={settingsForm.vision || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vision: e.target.value })}
                      className={`${INPUT_CLASS} leading-relaxed`}
                    />
                  </div>

                  <div className="md:col-span-2 border-t border-[#D9A62E]/25 pt-4">
                    <label className={LABEL_CLASS}>Genesis Story Headline</label>
                    <input
                      type="text"
                      value={settingsForm.aboutStoryHeadline || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, aboutStoryHeadline: e.target.value })
                      }
                      className={`${INPUT_CLASS} font-bold`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL_CLASS}>
                      Full Genesis Story Paragraphs (Separate paragraphs with double newlines)
                    </label>
                    <textarea
                      rows={6}
                      value={settingsForm.aboutStoryParagraphs?.join('\n\n') || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          aboutStoryParagraphs: e.target.value.split('\n\n').filter(Boolean),
                        })
                      }
                      className={`${INPUT_CLASS} leading-relaxed`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUploadInput
                      label="About Us Featured Photo (with File Upload & Compression)"
                      value={settingsForm.aboutHeroImage || ''}
                      onChange={(url) => setSettingsForm({ ...settingsForm, aboutHeroImage: url })}
                      placeholder="Enter photo URL or upload from device"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={LABEL_CLASS}>
                      Child Safeguarding &amp; Legal Protection Pledge Text
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.aboutProtectionPledge || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, aboutProtectionPledge: e.target.value })
                      }
                      className={`${INPUT_CLASS} leading-relaxed`}
                    />
                  </div>
                </div>

                {/* Core Values List */}
                <div className="border-t border-[#D9A62E]/25 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
                    Core Values ({settingsForm.aboutCoreValues?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {settingsForm.aboutCoreValues?.map((val, idx) => (
                      <div key={val.id || idx} className={`${INNER_CARD_CLASS} space-y-2 relative`}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = settingsForm.aboutCoreValues.filter(
                              (_, i) => i !== idx
                            );
                            setSettingsForm({ ...settingsForm, aboutCoreValues: updated });
                          }}
                          className="absolute top-2.5 right-2.5 text-[#A89585] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="text"
                          value={val.title}
                          onChange={(e) => {
                            const updated = [...settingsForm.aboutCoreValues];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setSettingsForm({ ...settingsForm, aboutCoreValues: updated });
                          }}
                          className="w-full px-2.5 py-1 text-xs font-bold border border-[#D9A62E]/30 rounded bg-[#120B08] text-[#F9F5F0]"
                        />
                        <textarea
                          rows={2}
                          value={val.desc}
                          onChange={(e) => {
                            const updated = [...settingsForm.aboutCoreValues];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setSettingsForm({ ...settingsForm, aboutCoreValues: updated });
                          }}
                          className="w-full px-2.5 py-1 text-xs border border-[#D9A62E]/30 rounded bg-[#120B08] text-[#D6C7B8] leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add Value */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="New Value Title"
                      value={newValueTitle}
                      onChange={(e) => setNewValueTitle(e.target.value)}
                      className="w-full sm:w-1/3 px-3 py-1.5 border border-[#D9A62E]/30 rounded-lg bg-[#120B08] text-xs text-[#F9F5F0]"
                    />
                    <input
                      type="text"
                      placeholder="Value Description..."
                      value={newValueDesc}
                      onChange={(e) => setNewValueDesc(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-[#D9A62E]/30 rounded-lg bg-[#120B08] text-xs text-[#F9F5F0]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newValueTitle || !newValueDesc) return;
                        const newVal = {
                          id: `val-${Date.now()}`,
                          title: newValueTitle,
                          desc: newValueDesc,
                        };
                        setSettingsForm({
                          ...settingsForm,
                          aboutCoreValues: [...(settingsForm.aboutCoreValues || []), newVal],
                        });
                        setNewValueTitle('');
                        setNewValueDesc('');
                      }}
                      className={GOLD_BTN_CLASS}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Value</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. TALENT PROGRAMS TAB */}
            {activeTab === 'programs' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Talent Programs Directory ({programs.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Add, update, or remove disciplines, curriculums, and schedule cards.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingProgram(true)}
                    className={GOLD_BTN_CLASS}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Program</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((prog) => (
                    <div key={prog.id} className={`${INNER_CARD_CLASS} flex gap-4 items-start`}>
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#D9A62E]/30 bg-[#120B08]">
                        <img
                          src={prog.image}
                          alt={prog.title}
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2C14E]">
                            {prog.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingProgram(prog)}
                              className="p-1 text-[#D6C7B8] hover:text-[#F2C14E]"
                              title="Edit program"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProgram(prog.id)}
                              className="p-1 text-[#A89585] hover:text-red-400"
                              title="Delete program"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-[#F9F5F0] truncate">{prog.title}</h4>
                        <p className="text-[11px] text-[#D6C7B8] line-clamp-2 leading-relaxed">
                          {prog.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CHILDREN SHOWCASE TAB */}
            {activeTab === 'children' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Children Talent Profiles ({children.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Publish approved child profiles with verified guardian consent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingChild(true)}
                    className={GOLD_BTN_CLASS}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Child Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child) => (
                    <div key={child.id} className={`${INNER_CARD_CLASS} flex gap-4 items-start`}>
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#D9A62E]/35 bg-[#120B08]">
                        <img
                          src={child.photo}
                          alt={child.publicName}
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2C14E]">
                            {child.talentCategory}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingChild(child)}
                              className="p-1 text-[#D6C7B8] hover:text-[#F2C14E]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteChild(child.id)}
                              className="p-1 text-[#A89585] hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-[#F9F5F0]">
                          {child.publicName} (Age {child.age})
                        </h4>
                        <p className="text-[11px] text-[#D6C7B8] line-clamp-2 leading-relaxed">
                          {child.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ANNOUNCEMENTS & NEWS TAB */}
            {activeTab === 'announcements' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Announcements &amp; Events ({announcements.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Create, publish, and manage foundation notices and casting updates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingAnnouncement(true)}
                    className={GOLD_BTN_CLASS}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Announcement</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`${INNER_CARD_CLASS} flex items-start justify-between gap-4`}
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#120B08] border border-[#D9A62E]/30">
                          <img
                            src={ann.image}
                            alt={ann.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2C14E]">
                              {ann.category}
                            </span>
                            <span className="text-xs font-mono tabular-nums text-[#A89585]">
                              · {ann.publicationDate}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#F9F5F0] mt-1">{ann.title}</h4>
                          <p className="text-xs text-[#D6C7B8] line-clamp-2 mt-0.5">
                            {ann.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingAnnouncement(ann)}
                          className="p-1.5 text-[#D6C7B8] hover:text-[#F2C14E] border border-[#D9A62E]/30 rounded bg-[#120B08]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="p-1.5 text-[#A89585] hover:text-red-400 border border-[#D9A62E]/30 rounded bg-[#120B08]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. DONORS & PARTNERS TAB */}
            {activeTab === 'donors_partners' && (
              <div className="space-y-6">
                {/* Donation & Payment Methods Settings */}
                <form onSubmit={handleSaveSettings} className={`${CARD_CLASS} space-y-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#F2C14E]" />
                        <h3 className="text-base font-bold text-[#F9F5F0]">
                          Donation &amp; Payment Methods
                        </h3>
                      </div>
                      <p className="text-xs text-[#A89585] mt-0.5">
                        Configure the live Mobile Money USSD donation code, helpline numbers, and official Bank Transfer details shown on the Support Us / Donors page.
                      </p>
                    </div>
                    <button type="submit" className={GOLD_BTN_CLASS}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Payment Settings</span>
                    </button>
                  </div>

                  {/* Mobile Money & Airtel Settings */}
                  <div className={`${INNER_CARD_CLASS} space-y-4`}>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile Money (USSD Code &amp; Wallets)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={LABEL_CLASS}>
                          Mobile Money USSD Code (One-Tap Dial &amp; Copy) *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.donationMomoUssdCode || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationMomoUssdCode: e.target.value,
                            })
                          }
                          placeholder="*182*1*1*0798465782#"
                          className={`${INPUT_CLASS} font-mono font-bold text-[#F2C14E]`}
                        />
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>Registered Account Holder Name</label>
                        <input
                          type="text"
                          value={settingsForm.donationAccountName || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationAccountName: e.target.value,
                            })
                          }
                          placeholder="Rusizi Kids Foundation"
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>MTN Mobile Money Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.donationMomoPhone || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationMomoPhone: e.target.value,
                            })
                          }
                          placeholder="+250 798 465 782"
                          className={`${INPUT_CLASS} font-mono`}
                        />
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>Airtel Money Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.donationAirtelPhone || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationAirtelPhone: e.target.value,
                            })
                          }
                          placeholder="+250 794 228 258"
                          className={`${INPUT_CLASS} font-mono`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer Settings */}
                  <div className={`${INNER_CARD_CLASS} space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Official Bank Transfer Details (Optional)</span>
                      </div>
                      <span className="text-[11px] text-[#A89585]">
                        Leave Bank Name &amp; Account blank to display &quot;Coming Soon&quot; publicly
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={LABEL_CLASS}>Bank Name</label>
                        <input
                          type="text"
                          value={settingsForm.donationBankName || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationBankName: e.target.value,
                            })
                          }
                          placeholder="e.g. Bank of Kigali (BK)"
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>Bank Account Number</label>
                        <input
                          type="text"
                          value={settingsForm.donationBankAccountNumber || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationBankAccountNumber: e.target.value,
                            })
                          }
                          placeholder="Enter account number once available"
                          className={`${INPUT_CLASS} font-mono`}
                        />
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>Bank Account Name</label>
                        <input
                          type="text"
                          value={settingsForm.donationBankAccountName || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationBankAccountName: e.target.value,
                            })
                          }
                          placeholder="Rusizi Kids Foundation"
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div>
                        <label className={LABEL_CLASS}>SWIFT / BIC Code (Optional)</label>
                        <input
                          type="text"
                          value={settingsForm.donationBankSwiftCode || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              donationBankSwiftCode: e.target.value,
                            })
                          }
                          placeholder="e.g. BKIGRWRW"
                          className={`${INPUT_CLASS} font-mono uppercase`}
                        />
                      </div>
                    </div>
                  </div>
                </form>

                {/* Donors & Sponsors Roster */}
                <div className={`${CARD_CLASS} space-y-4`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Foundation Donors &amp; Sponsors ({donors.length})
                      </h3>
                      <p className="text-xs text-[#A89585]">
                        Upload sponsor/donor photos, specify their role, year, and what they helped RKF with. Changes sync live to Home &amp; Donors pages.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingDonor(true)}
                      className={GOLD_BTN_CLASS}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Donor / Sponsor
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {donors.map((d) => {
                      const imgSrc = d.photo || d.logo;
                      const contribText = d.contribution || d.description;
                      return (
                        <div
                          key={d.id}
                          className={`${INNER_CARD_CLASS} flex items-start justify-between gap-3.5`}
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#120B08] border-2 border-[#D9A62E]/65 shrink-0 flex items-center justify-center">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={d.name}
                                  className="w-full h-full object-cover object-top"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <HeartHandshake className="w-6 h-6 text-[#F2C14E]" />
                              )}
                            </div>
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold text-[#F2C14E] uppercase tracking-wider">
                                  {d.role || d.tier || 'Individual Donor'}
                                </span>
                                {d.contributionDate && (
                                  <span className="text-[10px] font-mono text-[#A89585] tabular-nums">
                                    · {d.contributionDate}
                                  </span>
                                )}
                                {d.featuredHomepage && (
                                  <span className="text-[10px] text-emerald-300 font-semibold">
                                    · Home
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-[#F9F5F0] truncate">
                                {d.name}
                              </h4>
                              <p className="text-[11px] text-[#D6C7B8] line-clamp-2 leading-relaxed">
                                {contribText}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingDonor(d)}
                              className="p-1.5 text-[#D6C7B8] hover:text-[#F2C14E] border border-[#D9A62E]/30 rounded bg-[#120B08]"
                              title="Edit Donor / Sponsor"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteDonor(d.id)}
                              className="p-1.5 text-[#A89585] hover:text-red-400 border border-[#D9A62E]/30 rounded bg-[#120B08]"
                              title="Delete Donor / Sponsor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Partners Roster */}
                <div className={`${CARD_CLASS} space-y-4`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#F9F5F0]">
                        Community &amp; Strategic Partners ({partners.length})
                      </h3>
                      <p className="text-xs text-[#A89585]">
                        Showcase partner organizations, photos/logos, contribution details, and partnership dates.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingPartner(true)}
                      className={GOLD_BTN_CLASS}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Partner
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partners.map((p) => {
                      const imgSrc = p.photo || p.logo;
                      const contribText = p.contribution || p.description;
                      return (
                        <div
                          key={p.id}
                          className={`${INNER_CARD_CLASS} flex items-start justify-between gap-3.5`}
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#120B08] border-2 border-[#D9A62E]/65 shrink-0 flex items-center justify-center">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={p.organizationName}
                                  className="w-full h-full object-cover object-top"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <HeartHandshake className="w-6 h-6 text-[#F2C14E]" />
                              )}
                            </div>
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold text-[#F2C14E] uppercase tracking-wider">
                                  {p.role || 'Community Partner'}
                                </span>
                                {p.contributionDate && (
                                  <span className="text-[10px] font-mono text-[#A89585] tabular-nums">
                                    · {p.contributionDate}
                                  </span>
                                )}
                                {p.featuredHomepage && (
                                  <span className="text-[10px] text-emerald-300 font-semibold">
                                    · Home
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-[#F9F5F0] truncate">
                                {p.organizationName}
                              </h4>
                              <p className="text-[11px] text-[#D6C7B8] line-clamp-2 leading-relaxed">
                                {contribText}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingPartner(p)}
                              className="p-1.5 text-[#D6C7B8] hover:text-[#F2C14E] border border-[#D9A62E]/30 rounded bg-[#120B08]"
                              title="Edit Partner"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePartner(p.id)}
                              className="p-1.5 text-[#A89585] hover:text-red-400 border border-[#D9A62E]/30 rounded bg-[#120B08]"
                              title="Delete Partner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 8. MEDIA GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Media Gallery ({gallery.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Upload performance photos and rehearsal recordings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingGallery(true)}
                    className={GOLD_BTN_CLASS}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Media Item
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#D9A62E]/25 rounded-xl overflow-hidden bg-[#281912] group relative"
                    >
                      <div className="h-32 bg-[#120B08]">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2C14E] block">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold truncate text-[#F9F5F0]">{item.title}</h4>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#120B08]/85 p-1.5 rounded-md border border-[#D9A62E]/30">
                        <button
                          type="button"
                          onClick={() => setEditingGallery(item)}
                          className="text-[#F9F5F0] hover:text-[#F2C14E]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteGalleryItem(item.id)}
                          className="text-[#F9F5F0] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. STAFF & TEAM TAB */}
            {activeTab === 'leadership' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Staff &amp; Team — &quot;Meet Our Dedicated Team&quot; ({leadership.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Add, edit, upload circular portrait photos, or remove RKF staff members displayed on the Home &amp; About pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingLeader(true)}
                    className={GOLD_BTN_CLASS}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Staff Member
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leadership.map((lead) => (
                    <div key={lead.id} className={`${INNER_CARD_CLASS} flex items-center gap-4`}>
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-[#120B08] border-2 border-[#D9A62E] shrink-0 shadow-md">
                        <img
                          src={lead.photo}
                          alt={lead.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#F9F5F0]">{lead.name}</h4>
                        <span className="text-[11px] font-bold text-[#F2C14E] block">
                          {lead.role}
                        </span>
                        <p className="text-xs text-[#D6C7B8] line-clamp-2 mt-1">{lead.bio}</p>
                        <div className="mt-2 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingLeader(lead)}
                            className="text-[11px] font-bold text-[#F2C14E] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteLeadership(lead.id)}
                            className="text-[11px] text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. CONTACT, FOOTER & NAVIGATION TAB */}
            {activeTab === 'contact_footer_nav' && (
              <div className={`${CARD_CLASS} space-y-6`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Contact Information, Social Links, Nav &amp; Footer
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Configure official support email, phone numbers, office hours, map, and footer texts.
                    </p>
                  </div>
                  <button type="button" onClick={handleSaveSettings} className={GOLD_BTN_CLASS}>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Contact Changes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.officialEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, officialEmail: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Physical Location</label>
                    <input
                      type="text"
                      value={settingsForm.location}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, location: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Phone Number 1</label>
                    <input
                      type="text"
                      value={settingsForm.officialPhones?.[0] || ''}
                      onChange={(e) => {
                        const updated = [...(settingsForm.officialPhones || [])];
                        updated[0] = e.target.value;
                        setSettingsForm({ ...settingsForm, officialPhones: updated });
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Phone Number 2</label>
                    <input
                      type="text"
                      value={settingsForm.officialPhones?.[1] || ''}
                      onChange={(e) => {
                        const updated = [...(settingsForm.officialPhones || [])];
                        updated[1] = e.target.value;
                        setSettingsForm({ ...settingsForm, officialPhones: updated });
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLASS}>Office Hours / Operational Schedule</label>
                    <input
                      type="text"
                      value={settingsForm.contactOfficeHours || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactOfficeHours: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Social Media Links */}
                  <div className="md:col-span-2 border-t border-[#D9A62E]/25 pt-4">
                    <h4 className="text-xs font-bold uppercase text-[#F2C14E] mb-3">
                      Social Media Channels
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          TikTok URL
                        </label>
                        <input
                          type="text"
                          value={settingsForm.socialLinks.tikTok}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialLinks: { ...settingsForm.socialLinks, tikTok: e.target.value },
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          YouTube URL
                        </label>
                        <input
                          type="text"
                          value={settingsForm.socialLinks.youTube}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialLinks: { ...settingsForm.socialLinks, youTube: e.target.value },
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="text"
                          value={settingsForm.socialLinks.facebook}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialLinks: {
                                ...settingsForm.socialLinks,
                                facebook: e.target.value,
                              },
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          WhatsApp Community Group URL
                        </label>
                        <input
                          type="text"
                          value={settingsForm.socialLinks.whatsAppGroup}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialLinks: {
                                ...settingsForm.socialLinks,
                                whatsAppGroup: e.target.value,
                              },
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer & Map Customization */}
                  <div className="md:col-span-2 border-t border-[#D9A62E]/25 pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-[#F2C14E]">
                      Map, Navigation &amp; Footer Customization
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          Google Maps Share / Directions Link (Opens in New Tab)
                        </label>
                        <input
                          type="url"
                          value={settingsForm.googleMapsShareUrl || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, googleMapsShareUrl: e.target.value })
                          }
                          placeholder="https://maps.app.goo.gl/..."
                          className={`${INPUT_CLASS} font-mono text-[#F2C14E]`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          Google Maps Embed URL (Interactive Iframe)
                        </label>
                        <input
                          type="url"
                          value={settingsForm.googleMapsEmbedUrl || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })
                          }
                          className={`${INPUT_CLASS} font-mono`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                        Footer Mission Summary Blurb
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.footerMissionBlurb || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, footerMissionBlurb: e.target.value })
                        }
                        className={`${INPUT_CLASS} leading-relaxed`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          Footer Child Safeguarding Notice
                        </label>
                        <input
                          type="text"
                          value={settingsForm.footerSafeguardingNote || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footerSafeguardingNote: e.target.value,
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#D6C7B8] mb-1">
                          Footer Copyright Text
                        </label>
                        <input
                          type="text"
                          value={settingsForm.footerCopyrightText || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              footerCopyrightText: e.target.value,
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>

                    {/* Navigation Menu Items */}
                    {settingsForm.navItems && settingsForm.navItems.length > 0 && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold uppercase text-[#F2C14E] mb-2">
                          Navigation Menu Labels &amp; Visibility
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                          {settingsForm.navItems.map((nav, idx) => (
                            <div
                              key={nav.id}
                              className="p-2.5 border border-[#D9A62E]/25 rounded-lg bg-[#281912] space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-[10px] text-[#A89585]">
                                <span className="uppercase font-mono">{nav.id}</span>
                                <label className="flex items-center gap-1 cursor-pointer text-[#D6C7B8]">
                                  <input
                                    type="checkbox"
                                    checked={nav.visible}
                                    onChange={(e) => {
                                      const updated = [...(settingsForm.navItems || [])];
                                      updated[idx] = {
                                        ...updated[idx],
                                        visible: e.target.checked,
                                      };
                                      setSettingsForm({ ...settingsForm, navItems: updated });
                                    }}
                                    className="accent-[#D9A62E]"
                                  />
                                  <span>Show</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                value={nav.label}
                                onChange={(e) => {
                                  const updated = [...(settingsForm.navItems || [])];
                                  updated[idx] = { ...updated[idx], label: e.target.value };
                                  setSettingsForm({ ...settingsForm, navItems: updated });
                                }}
                                className="w-full px-2 py-1 border border-[#D9A62E]/30 rounded bg-[#120B08] text-[#F9F5F0] text-xs font-medium"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 11. CHILD REGISTRATIONS TAB */}
            {activeTab === 'child_regs' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Child Registrations Submissions ({childRegistrations.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Private data for children aged 5–17 submitted by their parent or guardian.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={childRegFilter}
                      onChange={(e) => setChildRegFilter(e.target.value)}
                      className="px-3 py-1.5 border border-[#D9A62E]/30 rounded-lg text-xs bg-[#120B08] text-[#F9F5F0]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {childRegistrations
                    .filter((r) => (childRegFilter === 'all' ? true : r.status === childRegFilter))
                    .map((reg) => (
                      <div key={reg.id} className={`${INNER_CARD_CLASS} space-y-2`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#F9F5F0]">{reg.childName}</h4>
                            <span className="text-[11px] text-[#A89585]">(Age {reg.age})</span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                reg.status === 'approved'
                                  ? 'text-[#F2C14E]'
                                  : reg.status === 'contacted'
                                  ? 'text-[#D6C7B8]'
                                  : 'text-amber-300'
                              }`}
                            >
                              · {reg.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={reg.status}
                              onChange={(e) =>
                                updateChildRegStatus(
                                  reg.id,
                                  e.target.value as 'pending' | 'approved' | 'contacted'
                                )
                              }
                              className="text-[11px] border border-[#D9A62E]/30 rounded px-2 py-1 bg-[#120B08] text-[#F9F5F0] font-medium"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="contacted">Contacted</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => deleteChildReg(reg.id)}
                              className="p-1 text-[#A89585] hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#D6C7B8] pt-1">
                          <div>
                            <span className="font-semibold text-[#F2C14E] block">
                              School / Class:
                            </span>
                            <span>
                              {reg.school} · {reg.classLevel}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#F2C14E] block">
                              Guardian Phone:
                            </span>
                            <a
                              href={`tel:${reg.caregiverPhone}`}
                              className="text-[#F9F5F0] font-mono tabular-nums font-bold hover:text-[#F2C14E]"
                            >
                              {reg.caregiverPhone}
                            </a>
                          </div>
                          <div>
                            <span className="font-semibold text-[#F2C14E] block">Parents:</span>
                            <span>
                              Father: {reg.fatherName || 'N/A'} · Mother: {reg.motherName || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#F2C14E] block">Talents:</span>
                            <span>{reg.activitiesInterest?.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 12. ADULT MEMBERSHIPS TAB */}
            {activeTab === 'adult_mems' && (
              <div className={`${CARD_CLASS} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A62E]/25 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      National Adult Memberships ({adultMemberships.length})
                    </h3>
                    <p className="text-xs text-[#A89585]">
                      Applications from adult volunteers and mentors across Rwanda.
                    </p>
                  </div>
                  <select
                    value={adultMemFilter}
                    onChange={(e) => setAdultMemFilter(e.target.value)}
                    className="px-3 py-1.5 border border-[#D9A62E]/30 rounded-lg text-xs bg-[#120B08] text-[#F9F5F0]"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {adultMemberships
                    .filter((m) => (adultMemFilter === 'all' ? true : m.status === adultMemFilter))
                    .map((mem) => (
                      <div key={mem.id} className={`${INNER_CARD_CLASS} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-[#F9F5F0]">
                              {mem.applicantName}
                            </h4>
                            <span className="text-[11px] text-[#F2C14E] font-semibold">
                              {mem.membershipCategory}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={mem.status}
                              onChange={(e) =>
                                updateAdultMemStatus(
                                  mem.id,
                                  e.target.value as 'pending' | 'approved' | 'contacted'
                                )
                              }
                              className="text-[11px] border border-[#D9A62E]/30 rounded px-2 py-1 bg-[#120B08] text-[#F9F5F0]"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="contacted">Contacted</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => deleteAdultMem(mem.id)}
                              className="p-1 text-[#A89585] hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#D6C7B8] bg-[#120B08] p-2.5 rounded border border-[#D9A62E]/20">
                          &quot;{mem.motivation}&quot;
                        </p>
                        <div className="flex flex-wrap gap-4 text-[11px] text-[#A89585]">
                          <span>Email: {mem.email}</span>
                          <span>Phone: {mem.phone}</span>
                          <span>
                            Location: {mem.district}, {mem.province}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 13. MESSAGES & INQUIRIES TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className={`${CARD_CLASS} space-y-4`}>
                  <div className="flex items-center justify-between border-b border-[#D9A62E]/25 pb-3">
                    <h3 className="text-base font-bold text-[#F9F5F0]">
                      Contact Messages ({contactMessages.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className={`${INNER_CARD_CLASS} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#F9F5F0]">{msg.name}</h4>
                            <span className="text-[11px] text-[#A89585]">&lt;{msg.email}&gt;</span>
                            {!msg.read && (
                              <span className="text-[10px] bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] text-[#120B08] px-2 py-0.5 rounded font-bold">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!msg.read && (
                              <button
                                type="button"
                                onClick={() => markContactRead(msg.id)}
                                className="text-[11px] text-[#F2C14E] font-bold hover:underline"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteContactMessage(msg.id)}
                              className="p-1 text-[#A89585] hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h5 className="text-xs font-semibold text-[#F2C14E]">{msg.subject}</h5>
                        <p className="text-xs text-[#D6C7B8] bg-[#120B08] p-3 rounded border border-[#D9A62E]/20 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donor & Partnership Inquiries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${CARD_CLASS} space-y-3`}>
                    <h3 className="text-sm font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                      Donor Inquiries ({donorInquiries.length})
                    </h3>
                    {donorInquiries.length === 0 ? (
                      <p className="text-xs text-[#A89585]">No donor inquiries submitted yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {donorInquiries.map((inq) => (
                          <div key={inq.id} className={`${INNER_CARD_CLASS} space-y-1.5`}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#F9F5F0]">
                                {inq.nameOrOrg}
                              </span>
                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  updateDonorInquiryStatus(
                                    inq.id,
                                    e.target.value as 'new' | 'in_review' | 'processed'
                                  )
                                }
                                className="text-[10px] border border-[#D9A62E]/30 rounded px-1.5 py-0.5 bg-[#120B08] text-[#F2C14E]"
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="processed">Processed</option>
                              </select>
                            </div>
                            <span className="text-[11px] text-[#F2C14E] block">
                              {inq.supportType} · {inq.email}
                            </span>
                            <p className="text-xs text-[#D6C7B8]">{inq.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`${CARD_CLASS} space-y-3`}>
                    <h3 className="text-sm font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
                      Partnership Proposals ({partnershipInquiries.length})
                    </h3>
                    {partnershipInquiries.length === 0 ? (
                      <p className="text-xs text-[#A89585]">No partnership proposals yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {partnershipInquiries.map((inq) => (
                          <div key={inq.id} className={`${INNER_CARD_CLASS} space-y-1.5`}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#F9F5F0]">
                                {inq.orgName}
                              </span>
                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  updatePartnershipInquiryStatus(
                                    inq.id,
                                    e.target.value as 'new' | 'in_review' | 'processed'
                                  )
                                }
                                className="text-[10px] border border-[#D9A62E]/30 rounded px-1.5 py-0.5 bg-[#120B08] text-[#F2C14E]"
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="processed">Processed</option>
                              </select>
                            </div>
                            <span className="text-[11px] text-[#F2C14E] block">
                              {inq.contactPerson} · {inq.proposedPartnership}
                            </span>
                            <p className="text-xs text-[#D6C7B8]">{inq.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: ADD / EDIT SHOWCASE SLIDE */}
      {(isAddingSlide || editingSlide) && (
        <SlideModal
          slide={editingSlide}
          onClose={() => {
            setIsAddingSlide(false);
            setEditingSlide(null);
          }}
          onSave={(data) => {
            if (editingSlide) {
              updateShowcaseSlide(editingSlide.id, data);
            } else {
              addShowcaseSlide(data);
            }
            setIsAddingSlide(false);
            setEditingSlide(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT PROGRAM */}
      {(isAddingProgram || editingProgram) && (
        <ProgramModal
          program={editingProgram}
          onClose={() => {
            setIsAddingProgram(false);
            setEditingProgram(null);
          }}
          onSave={(data) => {
            if (editingProgram) {
              updateProgram(editingProgram.id, data);
            } else {
              addProgram(data);
            }
            setIsAddingProgram(false);
            setEditingProgram(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT CHILD PROFILE */}
      {(isAddingChild || editingChild) && (
        <ChildModal
          child={editingChild}
          onClose={() => {
            setIsAddingChild(false);
            setEditingChild(null);
          }}
          onSave={(data) => {
            if (editingChild) {
              updateChild(editingChild.id, data);
            } else {
              addChild(data);
            }
            setIsAddingChild(false);
            setEditingChild(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT ANNOUNCEMENT */}
      {(isAddingAnnouncement || editingAnnouncement) && (
        <AnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => {
            setIsAddingAnnouncement(false);
            setEditingAnnouncement(null);
          }}
          onSave={(data) => {
            if (editingAnnouncement) {
              updateAnnouncement(editingAnnouncement.id, data);
            } else {
              addAnnouncement(data);
            }
            setIsAddingAnnouncement(false);
            setEditingAnnouncement(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT GALLERY ITEM */}
      {(isAddingGallery || editingGallery) && (
        <GalleryModal
          item={editingGallery}
          onClose={() => {
            setIsAddingGallery(false);
            setEditingGallery(null);
          }}
          onSave={(data) => {
            if (editingGallery) {
              updateGalleryItem(editingGallery.id, data);
            } else {
              addGalleryItem(data);
            }
            setIsAddingGallery(false);
            setEditingGallery(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT LEADER */}
      {(isAddingLeader || editingLeader) && (
        <LeaderModal
          leader={editingLeader}
          onClose={() => {
            setIsAddingLeader(false);
            setEditingLeader(null);
          }}
          onSave={(data) => {
            if (editingLeader) {
              updateLeadership(editingLeader.id, data);
            } else {
              addLeadership(data);
            }
            setIsAddingLeader(false);
            setEditingLeader(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT DONOR */}
      {(isAddingDonor || editingDonor) && (
        <DonorModal
          donor={editingDonor}
          onClose={() => {
            setIsAddingDonor(false);
            setEditingDonor(null);
          }}
          onSave={(data) => {
            if (editingDonor) {
              updateDonor(editingDonor.id, data);
            } else {
              addDonor(data);
            }
            setIsAddingDonor(false);
            setEditingDonor(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT PARTNER */}
      {(isAddingPartner || editingPartner) && (
        <PartnerModal
          partner={editingPartner}
          onClose={() => {
            setIsAddingPartner(false);
            setEditingPartner(null);
          }}
          onSave={(data) => {
            if (editingPartner) {
              updatePartner(editingPartner.id, data);
            } else {
              addPartner(data);
            }
            setIsAddingPartner(false);
            setEditingPartner(null);
          }}
        />
      )}
    </div>
  );
};

// ================= MODAL COMPONENTS ================= //

const MODAL_WRAPPER =
  'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm';
const MODAL_CARD =
  'bg-[#1D120D] text-[#F9F5F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D9A62E]/40 max-h-[90vh] overflow-y-auto space-y-4';

const SlideModal: React.FC<{
  slide: ShowcaseSlide | null;
  onClose: () => void;
  onSave: (data: Omit<ShowcaseSlide, 'id'>) => void;
}> = ({ slide, onClose, onSave }) => {
  const [category, setCategory] = useState(slide?.category || 'Traditional Rwandan Itorero');
  const [title, setTitle] = useState(slide?.title || '');
  const [subtitle, setSubtitle] = useState(slide?.subtitle || '');
  const [caption, setCaption] = useState(slide?.caption || '');
  const [ageRange, setAgeRange] = useState(slide?.ageRange || 'Ages 7–15');
  const [image, setImage] = useState(
    slide?.image || '/assets/aistudio/New_Recording_35_583fbbcd.jpeg'
  );

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {slide ? 'Edit Animated Showcase Slide' : 'Add New Showcase Slide'}
        </h3>
        <ImageUploadInput label="Slide Photograph" value={image} onChange={setImage} />
        <div>
          <label className={LABEL_CLASS}>Category Label</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Slide Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Slide Subtitle / Highlight</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Welcoming Caption</label>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Age Range</label>
          <input
            type="text"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ image, category, title, subtitle, caption, ageRange })}
            className={GOLD_BTN_CLASS}
          >
            Save Slide
          </button>
        </div>
      </div>
    </div>
  );
};

const ProgramModal: React.FC<{
  program: Program | null;
  onClose: () => void;
  onSave: (data: Omit<Program, 'id'>) => void;
}> = ({ program, onClose, onSave }) => {
  const [title, setTitle] = useState(program?.title || '');
  const [category, setCategory] = useState(program?.category || 'Dance');
  const [description, setDescription] = useState(program?.description || '');
  const [image, setImage] = useState(
    program?.image || '/assets/aistudio/New_Recording_14_17ffd186.jpeg'
  );
  const [activitiesStr, setActivitiesStr] = useState(program?.activities?.join('\n') || '');
  const [achievementsStr, setAchievementsStr] = useState(program?.achievements?.join('\n') || '');

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {program ? 'Edit Talent Program' : 'Create New Program'}
        </h3>
        <div>
          <label className={LABEL_CLASS}>Program Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <ImageUploadInput label="Program Cover Image" value={image} onChange={setImage} />
        <div>
          <label className={LABEL_CLASS}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Weekly Activities (one per line)</label>
          <textarea
            rows={3}
            value={activitiesStr}
            onChange={(e) => setActivitiesStr(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Key Achievements (one per line)</label>
          <textarea
            rows={2}
            value={achievementsStr}
            onChange={(e) => setAchievementsStr(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                title,
                category,
                description,
                image,
                activities: activitiesStr.split('\n').filter(Boolean),
                achievements: achievementsStr.split('\n').filter(Boolean),
                featured: true,
              })
            }
            className={GOLD_BTN_CLASS}
          >
            Save Program
          </button>
        </div>
      </div>
    </div>
  );
};

const ChildModal: React.FC<{
  child: ChildProfile | null;
  onClose: () => void;
  onSave: (data: Omit<ChildProfile, 'id'>) => void;
}> = ({ child, onClose, onSave }) => {
  const [publicName, setPublicName] = useState(child?.publicName || '');
  const [age, setAge] = useState(child?.age || 10);
  const [talentCategory, setTalentCategory] = useState<ChildProfile['talentCategory']>(
    child?.talentCategory || 'Dance'
  );
  const [description, setDescription] = useState(child?.description || '');
  const [photo, setPhoto] = useState(
    child?.photo || '/assets/aistudio/New_Recording_2_2317054a.jpeg'
  );
  const [consentVerified, setConsentVerified] = useState(child?.consentVerified ?? true);

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {child ? 'Edit Child Talent Profile' : 'Add Child Profile'}
        </h3>
        <div>
          <label className={LABEL_CLASS}>Public Name (First Name + Initial)</label>
          <input
            type="text"
            value={publicName}
            onChange={(e) => setPublicName(e.target.value)}
            placeholder="e.g. Jean-Luc M."
            className={INPUT_CLASS}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Age (5–17)</label>
            <input
              type="number"
              min={5}
              max={17}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Category</label>
            <select
              value={talentCategory}
              onChange={(e) => setTalentCategory(e.target.value as ChildProfile['talentCategory'])}
              className={INPUT_CLASS}
            >
              <option value="Dance">Dance</option>
              <option value="Traditional Dance">Traditional Dance</option>
              <option value="Film & Acting">Film &amp; Acting</option>
              <option value="Singing & Music">Singing &amp; Music</option>
              <option value="Fashion & Modeling">Fashion &amp; Modeling</option>
              <option value="Talent Development">Talent Development</option>
            </select>
          </div>
        </div>
        <ImageUploadInput label="Child Photo" value={photo} onChange={setPhoto} shape="square" />
        <div>
          <label className={LABEL_CLASS}>Description &amp; Achievements</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="consentCheck"
            checked={consentVerified}
            onChange={(e) => setConsentVerified(e.target.checked)}
            className="w-4 h-4 accent-[#D9A62E]"
          />
          <label htmlFor="consentCheck" className="text-xs font-medium text-[#D6C7B8]">
            Written Parental / Guardian Publication Consent on File
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                publicName,
                age,
                talentCategory,
                description,
                photo,
                consentVerified,
                activities: ['Regular rehearsal attendance'],
                achievements: ['Showcase participant'],
                joinYear: 2025,
              })
            }
            className={GOLD_BTN_CLASS}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const AnnouncementModal: React.FC<{
  announcement: Announcement | null;
  onClose: () => void;
  onSave: (data: Omit<Announcement, 'id'>) => void;
}> = ({ announcement, onClose, onSave }) => {
  const [title, setTitle] = useState(announcement?.title || '');
  const [category, setCategory] = useState<Announcement['category']>(
    announcement?.category || 'Foundation Announcements'
  );
  const [description, setDescription] = useState(announcement?.description || '');
  const [image, setImage] = useState(
    announcement?.image || '/assets/aistudio/New_Recording_76_a54427fb.jpeg'
  );
  const [publicationDate, setPublicationDate] = useState(
    announcement?.publicationDate || new Date().toISOString().slice(0, 10)
  );

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {announcement ? 'Edit Announcement' : 'Post Announcement'}
        </h3>
        <div>
          <label className={LABEL_CLASS}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value as Announcement['category'])}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Date</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <ImageUploadInput label="Announcement Poster / Image" value={image} onChange={setImage} />
        <div>
          <label className={LABEL_CLASS}>Details &amp; Instructions</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                title,
                category,
                description,
                image,
                publicationDate,
                published: true,
              })
            }
            className={GOLD_BTN_CLASS}
          >
            Publish Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

const GalleryModal: React.FC<{
  item: GalleryItem | null;
  onClose: () => void;
  onSave: (data: Omit<GalleryItem, 'id'>) => void;
}> = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [category, setCategory] = useState<GalleryItem['category']>(item?.category || 'Dance');
  const [caption, setCaption] = useState(item?.caption || '');
  const [url, setUrl] = useState(
    item?.url || '/assets/aistudio/New_Recording_31_1a5b87d9.jpeg'
  );

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {item ? 'Edit Media Item' : 'Upload Gallery Media'}
        </h3>
        <div>
          <label className={LABEL_CLASS}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
            className={INPUT_CLASS}
          >
            <option value="Dance">Dance</option>
            <option value="Traditional Dance">Traditional Dance</option>
            <option value="Film & Acting">Film &amp; Acting</option>
            <option value="Fashion">Fashion</option>
            <option value="Events">Events</option>
            <option value="Training">Training</option>
            <option value="Community Projects">Community Projects</option>
          </select>
        </div>
        <ImageUploadInput label="Media Image" value={url} onChange={setUrl} />
        <div>
          <label className={LABEL_CLASS}>Caption</label>
          <textarea
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                title,
                category,
                caption,
                url,
                mediaType: 'image',
                consentVerified: true,
              })
            }
            className={GOLD_BTN_CLASS}
          >
            Save Media
          </button>
        </div>
      </div>
    </div>
  );
};

const LeaderModal: React.FC<{
  leader: LeadershipMember | null;
  onClose: () => void;
  onSave: (data: Omit<LeadershipMember, 'id'>) => void;
}> = ({ leader, onClose, onSave }) => {
  const [name, setName] = useState(leader?.name || '');
  const [role, setRole] = useState(leader?.role || '');
  const [bio, setBio] = useState(leader?.bio || '');
  const [email, setEmail] = useState(leader?.email || '');
  const [photo, setPhoto] = useState(
    leader?.photo || '/assets/aistudio/New_Recording_78_59ee1a8e.jpeg'
  );

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {leader ? 'Edit Staff / Team Member' : 'Add Staff / Team Member'}
        </h3>
        <div>
          <label className={LABEL_CLASS}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Role / Job Title</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <ImageUploadInput
          label="Circular Portrait Photo"
          value={photo}
          onChange={setPhoto}
          shape="circle"
        />
        <div>
          <label className={LABEL_CLASS}>Brief Responsibility Description</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`${INPUT_CLASS} leading-relaxed`}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ name, role, bio, email, photo })}
            className={GOLD_BTN_CLASS}
          >
            Save Staff Member
          </button>
        </div>
      </div>
    </div>
  );
};

const DonorModal: React.FC<{
  donor: Donor | null;
  onClose: () => void;
  onSave: (data: Omit<Donor, 'id'>) => void;
}> = ({ donor, onClose, onSave }) => {
  const [name, setName] = useState(donor?.name || '');
  const [photo, setPhoto] = useState(donor?.photo || donor?.logo || '');
  const [role, setRole] = useState(donor?.role || donor?.tier || 'Official Sponsor');
  const [contribution, setContribution] = useState(
    donor?.contribution || donor?.description || ''
  );
  const [description, setDescription] = useState(donor?.description || '');
  const [contributionDate, setContributionDate] = useState(
    donor?.contributionDate || new Date().getFullYear().toString()
  );
  const [projectsStr, setProjectsStr] = useState(
    donor?.supportedProjects?.join(', ') || 'Youth Talent Support'
  );
  const [websiteUrl, setWebsiteUrl] = useState(donor?.websiteUrl || '');
  const [featuredHomepage, setFeaturedHomepage] = useState(donor?.featuredHomepage ?? true);

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {donor ? 'Edit Donor / Sponsor' : 'Add Donor / Sponsor'}
        </h3>

        <ImageUploadInput
          label="Upload Donor / Sponsor Portrait or Logo"
          value={photo}
          onChange={setPhoto}
          shape="circle"
        />

        <div>
          <label className={LABEL_CLASS}>Full Name / Organization Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jean-Marie V. / Kigali Hope Foundation"
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Role / Tier</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="Official Sponsor">Official Sponsor</option>
              <option value="Education Donor">Education Donor</option>
              <option value="Individual Donor">Individual Donor</option>
              <option value="Community Partner">Community Partner</option>
              <option value="Patron">Patron</option>
              <option value="Champion">Champion</option>
              <option value="Supporter">Supporter</option>
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Year / Date of Contribution</label>
            <input
              type="text"
              value={contributionDate}
              onChange={(e) => setContributionDate(e.target.value)}
              placeholder="e.g. 2026 or March 2026"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>
            What They Helped RKF With (Detailed Contribution) *
          </label>
          <textarea
            rows={3}
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            placeholder="e.g. Donated traditional dance costumes, sound speakers, and sponsored annual school fees for 10 children."
            className={`${INPUT_CLASS} leading-relaxed`}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Brief Bio / Organization Overview (Optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short background about the donor or organization..."
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Supported Focus Areas (comma separated)</label>
            <input
              type="text"
              value={projectsStr}
              onChange={(e) => setProjectsStr(e.target.value)}
              placeholder="e.g. Costumes, School Fees"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Website / Social Link (Optional)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-[#D6C7B8] cursor-pointer">
          <input
            type="checkbox"
            checked={featuredHomepage}
            onChange={(e) => setFeaturedHomepage(e.target.checked)}
            className="w-4 h-4 accent-[#D9A62E]"
          />
          <span>Feature on Home Page &quot;Our Partners &amp; Donors&quot; preview</span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!name.trim()) return;
              onSave({
                name: name.trim(),
                photo: photo || undefined,
                logo: photo || undefined,
                role,
                tier: role,
                contribution: contribution.trim(),
                description: description.trim() || contribution.trim(),
                contributionDate: contributionDate.trim() || undefined,
                supportedProjects: projectsStr
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                websiteUrl: websiteUrl.trim() || undefined,
                featuredHomepage,
              });
            }}
            className={GOLD_BTN_CLASS}
          >
            Save Donor
          </button>
        </div>
      </div>
    </div>
  );
};

const PartnerModal: React.FC<{
  partner: Partner | null;
  onClose: () => void;
  onSave: (data: Omit<Partner, 'id'>) => void;
}> = ({ partner, onClose, onSave }) => {
  const [organizationName, setOrganizationName] = useState(partner?.organizationName || '');
  const [photo, setPhoto] = useState(partner?.photo || partner?.logo || '');
  const [role, setRole] = useState(partner?.role || 'Community Partner');
  const [contribution, setContribution] = useState(
    partner?.contribution || partner?.description || ''
  );
  const [description, setDescription] = useState(partner?.description || '');
  const [contributionDate, setContributionDate] = useState(
    partner?.contributionDate || new Date().getFullYear().toString()
  );
  const [websiteUrl, setWebsiteUrl] = useState(partner?.websiteUrl || '');
  const [activitiesStr, setActivitiesStr] = useState(
    partner?.supportedActivities?.join(', ') || 'Community Outreach'
  );
  const [featuredHomepage, setFeaturedHomepage] = useState(partner?.featuredHomepage ?? true);

  return (
    <div className={MODAL_WRAPPER}>
      <div className={MODAL_CARD}>
        <h3 className="text-base font-bold text-[#F2C14E] border-b border-[#D9A62E]/25 pb-2">
          {partner ? 'Edit Partner' : 'Add Strategic / Community Partner'}
        </h3>

        <ImageUploadInput
          label="Upload Partner Portrait or Organization Logo"
          value={photo}
          onChange={setPhoto}
          shape="circle"
        />

        <div>
          <label className={LABEL_CLASS}>Partner Name / Organization Name *</label>
          <input
            type="text"
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="e.g. Rusizi Youth Cultural Center"
            className={`${INPUT_CLASS} font-bold`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Role / Tier</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="Community Partner">Community Partner</option>
              <option value="Official Sponsor">Official Sponsor</option>
              <option value="Education Donor">Education Donor</option>
              <option value="Institutional Partner">Institutional Partner</option>
              <option value="Individual Donor">Individual Donor</option>
              <option value="Media & Creative Partner">Media &amp; Creative Partner</option>
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Year / Date of Contribution</label>
            <input
              type="text"
              value={contributionDate}
              onChange={(e) => setContributionDate(e.target.value)}
              placeholder="e.g. 2025–2026"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>
            What They Helped RKF With (Detailed Contribution) *
          </label>
          <textarea
            rows={3}
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            placeholder="e.g. Provided safe rehearsal grounds, artist mentorship workshops, and stage event support..."
            className={`${INPUT_CLASS} leading-relaxed`}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Partnership Overview (Optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the partner organization..."
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Supported Activities (comma separated)</label>
            <input
              type="text"
              value={activitiesStr}
              onChange={(e) => setActivitiesStr(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Partner Website URL (Optional)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-[#D6C7B8] cursor-pointer">
          <input
            type="checkbox"
            checked={featuredHomepage}
            onChange={(e) => setFeaturedHomepage(e.target.checked)}
            className="w-4 h-4 accent-[#D9A62E]"
          />
          <span>Feature on Home Page &quot;Our Partners &amp; Donors&quot; preview</span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#D9A62E]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#D6C7B8] hover:text-[#F9F5F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!organizationName.trim()) return;
              onSave({
                organizationName: organizationName.trim(),
                photo: photo || undefined,
                logo: photo || undefined,
                role,
                contribution: contribution.trim(),
                description: description.trim() || contribution.trim(),
                contributionDate: contributionDate.trim() || undefined,
                websiteUrl: websiteUrl.trim() || undefined,
                supportedActivities: activitiesStr
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                featuredHomepage,
              });
            }}
            className={GOLD_BTN_CLASS}
          >
            Save Partner
          </button>
        </div>
      </div>
    </div>
  );
};
