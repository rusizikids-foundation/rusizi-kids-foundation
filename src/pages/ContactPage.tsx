import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import {
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  LinkedInIcon,
  InstagramIcon,
  WhatsAppIcon,
} from '../components/SocialIcons';

export const ContactPage: React.FC = () => {
  const { settings, submitContactMessage } = useData();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    submitContactMessage(form);
    setSubmitted(true);
    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const socialButtons = [
    {
      name: 'TikTok',
      url: settings.socialLinks.tikTok,
      icon: TikTokIcon,
      hoverClass: 'hover:bg-[#281912] hover:text-[#F2C14E] hover:border-[#D9A62E]',
    },
    {
      name: 'YouTube',
      url: settings.socialLinks.youTube,
      icon: YouTubeIcon,
      hoverClass: 'hover:bg-red-900/60 hover:text-white hover:border-red-500/60',
    },
    {
      name: 'Facebook',
      url: settings.socialLinks.facebook,
      icon: FacebookIcon,
      hoverClass: 'hover:bg-blue-900/60 hover:text-white hover:border-blue-500/60',
    },
    {
      name: 'LinkedIn',
      url: settings.socialLinks.linkedIn,
      icon: LinkedInIcon,
      hoverClass: 'hover:bg-sky-900/60 hover:text-white hover:border-sky-500/60',
    },
    {
      name: 'Instagram',
      url: settings.socialLinks.instagram,
      icon: InstagramIcon,
      hoverClass: 'hover:bg-pink-900/60 hover:text-white hover:border-pink-500/60',
    },
    {
      name: 'WhatsApp Group',
      url:
        settings.socialLinks.whatsAppGroup ||
        'https://chat.whatsapp.com/FysXKjXF5GG3eW5kSPy044',
      icon: WhatsAppIcon,
      hoverClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
    },
  ];

  const mapsShareUrl =
    settings.googleMapsShareUrl || 'https://maps.app.goo.gl/MugsUVjyLabnKDBD9';
  const mapsEmbedUrl =
    settings.googleMapsEmbedUrl ||
    'https://maps.google.com/maps?q=-2.4877552,28.8997162+(Rusizi%20Kids%20Foundation)&t=&z=16&ie=UTF8&iwloc=&output=embed';
  const whatsAppUrl =
    settings.socialLinks.whatsAppGroup ||
    'https://chat.whatsapp.com/FysXKjXF5GG3eW5kSPy044';

  return (
    <div className="bg-[#120B08] text-[#F9F5F0] pb-20">
      {/* Luxury Dark Chocolate Editorial Header */}
      <section className="bg-[#1D120D] border-b border-[#D9A62E]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#F2C14E] block">
            Official Channels
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F9F5F0]">
            Contact Rusizi Kids Foundation
          </h1>
          <p className="text-sm sm:text-base text-[#D6C7B8] max-w-3xl leading-relaxed">
            Reach out to our executive leadership, artistic mentors, and safeguarding coordinators. We welcome inquiries from parents, donors, cultural collaborators, and volunteers.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Official Contact Details & WhatsApp Option */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#F9F5F0] tracking-tight">
                Official Foundation Headquarters
              </h2>

              <div className="space-y-4">
                <div className="luxury-card flex items-start gap-4 p-4 rounded-xl">
                  <div className="p-2.5 rounded-lg bg-[#281912] border border-[#D9A62E]/35 text-[#F2C14E] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] block">
                      Physical Location
                    </span>
                    <span className="text-sm font-bold text-[#F9F5F0] block mt-0.5">
                      {settings.location}
                    </span>
                    <span className="text-xs text-[#A89585]">
                      Western Province, Republic of Rwanda
                    </span>
                  </div>
                </div>

                <div className="luxury-card flex items-start gap-4 p-4 rounded-xl">
                  <div className="p-2.5 rounded-lg bg-[#281912] border border-[#D9A62E]/35 text-[#F2C14E] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] block">
                      Official Support Email
                    </span>
                    <a
                      href={`mailto:${settings.officialEmail}`}
                      className="text-sm font-bold text-[#F9F5F0] hover:text-[#F2C14E] transition-colors block mt-0.5"
                    >
                      {settings.officialEmail}
                    </a>
                    <span className="text-xs text-[#A89585]">
                      General inquiries, child welfare, &amp; partnerships
                    </span>
                  </div>
                </div>

                <div className="luxury-card flex items-start gap-4 p-4 rounded-xl">
                  <div className="p-2.5 rounded-lg bg-[#281912] border border-[#D9A62E]/35 text-[#F2C14E] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] block">
                      Official Phone Numbers
                    </span>
                    <div className="flex flex-col gap-1 mt-0.5">
                      {settings.officialPhones.map((phone, i) => (
                        <a
                          key={i}
                          href={`tel:${phone.replace(/\s+/g, '')}`}
                          className="text-sm font-bold font-mono tabular-nums text-[#F9F5F0] hover:text-[#F2C14E] transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                    <span className="text-xs text-[#A89585] mt-1 block">
                      Available Monday to Saturday: 8:00 AM – 6:00 PM CAT
                    </span>
                  </div>
                </div>

                <div className="luxury-card flex items-start gap-4 p-4 rounded-xl">
                  <div className="p-2.5 rounded-lg bg-[#281912] border border-[#D9A62E]/35 text-[#F2C14E] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] block">
                      Academy &amp; Office Hours
                    </span>
                    <span className="text-xs font-semibold text-[#F9F5F0] block mt-0.5">
                      {settings.contactOfficeHours || 'Monday – Saturday: 8:00 AM – 5:30 PM (CAT)'}
                    </span>
                    <span className="text-xs text-[#A89585] block">
                      Rehearsals &amp; Workshops: Tuesday – Sunday, 2:00 PM – 6:00 PM
                    </span>
                  </div>
                </div>

                {/* WhatsApp Direct Contact Option */}
                <div className="p-5 rounded-xl bg-[#1D120D] border border-[#D9A62E]/35 shadow-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Community &amp; Parents Desk</span>
                  </div>
                  <p className="text-xs text-[#D6C7B8] leading-relaxed">
                    Connect instantly with foundation updates, rehearsal announcements, and parent coordination via our official WhatsApp Group.
                  </p>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>Join Official WhatsApp Group</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Official Social Media Section */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F2C14E] block">
                Official Social Media Channels
              </span>
              <p className="text-xs text-[#D6C7B8]">
                Follow our daily performances, live showcases, and community announcements:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {socialButtons.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-2.5 rounded-lg border border-[#D9A62E]/25 bg-[#1D120D] text-[#D6C7B8] text-xs font-semibold transition-all duration-200 ${social.hoverClass}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/30 p-6 sm:p-10 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block mb-1">
                  Direct Dispatch
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F9F5F0]">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-[#D6C7B8] mt-1">
                  Have a question about child enrollment, foundation events, or donor contributions? Fill out this form and our management will respond promptly.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E] text-xs text-[#F9F5F0] flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#F2C14E] shrink-0" />
                  <span>
                    Thank you! Your message has been safely delivered to Rusizi Kids Foundation. We will contact you shortly.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Marie Claire"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+250 788 000 000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                      Subject / Topic *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Program Enrollment / General Inquiry"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6C7B8] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9A62E]/30 bg-[#120B08] text-sm text-[#F9F5F0] placeholder:text-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to RKF</span>
                </button>
              </form>

              <div className="flex items-center gap-2 text-[11px] text-[#A89585] pt-2 border-t border-[#D9A62E]/20">
                <ShieldCheck className="w-4 h-4 text-[#F2C14E] shrink-0" />
                <span>
                  Your contact details are kept strictly private and used solely to address your communication.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Rusizi Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1D120D] rounded-2xl border border-[#D9A62E]/30 overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C14E] block">
                Interactive Map Location
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F9F5F0]">
                Find Us in Rusizi District, Rwanda
              </h3>
              <span className="text-xs font-mono text-[#A89585] block mt-0.5 tabular-nums">
                2°29&apos;15.9&quot;S 28°53&apos;59.0&quot;E · Rusizi Kids Foundation Center
              </span>
            </div>

            <a
              href={mapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#D9A62E] text-[#120B08] text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-[#D9A62E]/30 relative bg-[#120B08]">
            <iframe
              title="Rusizi Kids Foundation - Google Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapsEmbedUrl}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
            <p className="text-[#D6C7B8] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F2C14E] shrink-0" />
              <span>
                Visiting our rehearsals or meeting with leadership? Open turn-by-turn navigation directly in Google Maps.
              </span>
            </p>
            <a
              href={mapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#F2C14E] hover:underline shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
