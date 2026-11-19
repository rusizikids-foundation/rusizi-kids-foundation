import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirect,
}) => {
  const { loginAdmin, settings } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (attempts >= 5) {
      setError('Too many failed attempts. Please wait before trying again.');
      return;
    }

    const result = loginAdmin(email, password);
    if (result.success) {
      onClose();
      onSuccessRedirect();
    } else {
      setAttempts((prev) => prev + 1);
      setError(result.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120B08]/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1D120D] rounded-2xl max-w-md w-full shadow-[0_0_40px_rgba(217,166,46,0.2)] border border-[#D9A62E]/45 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#281912] p-6 text-[#F9F5F0] text-center relative border-b border-[#D9A62E]/25">
          <div className="w-16 h-16 rounded-full bg-[#120B08] border border-[#D9A62E] flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(217,166,46,0.25)] p-1.5 overflow-hidden">
            <img
              src={settings.primaryLogo || '/logo.png'}
              alt="Rusizi Kids Foundation Monogram"
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
          <h3 className="font-display text-xl font-bold tracking-tight text-[#F9F5F0]">
            RKF Super Admin Gateway
          </h3>
          <p className="text-xs text-[#D6C7B8] mt-1">
            Restricted foundation administrator sign-in
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#D6C7B8] hover:text-[#F2C14E] text-lg w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body — zero password/email hints */}
        <div className="p-6 space-y-4 bg-[#1D120D]">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500/40 text-xs text-rose-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F2C14E] mb-1.5 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D9A62E] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#D9A62E]/35 bg-[#120B08] text-sm text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F2C14E] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D9A62E] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#D9A62E]/35 bg-[#120B08] text-sm text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_20px_rgba(217,166,46,0.28)] flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authorize &amp; Access CMS</span>
            </button>
          </form>

          <p className="pt-2 text-center text-[11px] text-[#A89585]">
            Protected by Rusizi Kids Foundation access controls.
          </p>
        </div>
      </div>
    </div>
  );
};
