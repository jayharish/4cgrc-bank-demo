import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Globe, Moon, Sun, Palette,
  CheckCircle2, Save, Camera, Mail, Phone, Building2,
  Key, Eye, EyeOff, Monitor, Smartphone, Sliders, Zap, Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Toggle({ value, onChange, label, description, disabled }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-4 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="toggle-track shrink-0 mt-0.5"
        style={{ background: value ? 'var(--accent)' : 'var(--surface-3)' }}
        aria-checked={value}
        role="switch"
      >
        <div className={`toggle-thumb ${value ? 'on' : ''}`} />
      </button>
    </div>
  );
}

function Section({ title, description, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden mb-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        {Icon && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(71,139,235,0.15)' }}>
            <Icon size={16} style={{ color: 'var(--accent)' }} />
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{title}</h3>
          {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{description}</p>}
        </div>
      </div>
      <div className="px-6">{children}</div>
    </motion.div>
  );
}

const ACCENT_COLORS = [
  { name: 'Blue', value: '#478BEB', dark: '#2563EB' },
  { name: 'Purple', value: '#8B5CF6', dark: '#7C3AED' },
  { name: 'Emerald', value: '#10B981', dark: '#059669' },
  { name: 'Rose', value: '#F43F5E', dark: '#E11D48' },
  { name: 'Amber', value: '#F59E0B', dark: '#D97706' },
  { name: 'Cyan', value: '#06B6D4', dark: '#0891B2' },
];

export default function Settings() {
  const { isDark, toggle, setIsDark } = useTheme();
  const { profile: authProfile, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [accent, setAccent] = useState(0);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    emirate: 'Abu Dhabi',
  });

  useEffect(() => {
    if (authProfile) {
      setProfile({
        name: authProfile.full_name || '',
        email: authProfile.email || '',
        phone: authProfile.phone || '',
        title: authProfile.department || '',
        department: authProfile.department || '',
        emirate: 'Abu Dhabi',
      });
    }
  }, [authProfile]);

  const [notifs, setNotifs] = useState({
    overdueTickets: true,
    slaBreaches: true,
    newIncidents: true,
    reportReady: true,
    systemAlerts: true,
    emailDigest: false,
    pushNotifications: true,
    weeklyReport: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '8h',
    loginAlerts: true,
    apiAccess: false,
  });

  const [display, setDisplay] = useState({
    compactMode: false,
    animations: true,
    highContrast: false,
    showGuides: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        full_name: profile.name,
        phone: profile.phone,
        department: profile.department,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'regional', label: 'Regional', icon: Globe },
  ];

  const field = (key, label, type = 'text', opts = null) => (
    <div key={key} className="py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-4)' }}>{label}</label>
      {opts ? (
        <select
          value={profile[key]}
          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
        >
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={profile[key]}
          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
        />
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-1)' }}>Settings</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>Manage your account, appearance, and preferences</p>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: saved ? '#22C55E' : 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
        >
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </motion.button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
            style={activeTab === t.id ? {
              background: 'linear-gradient(135deg, rgba(71,139,235,0.25), rgba(71,139,235,0.10))',
              color: 'var(--accent)',
              border: '1px solid rgba(71,139,235,0.25)',
            } : { color: 'var(--text-3)' }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div>
          <Section title="Profile Information" description="Your account details and contact information" icon={User}>
            {/* Avatar */}
            <div className="flex items-center gap-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
                  style={{ background: 'linear-gradient(135deg, #478BEB, #7C3AED)' }}>
                  AD
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--accent)' }}>
                  <Camera size={13} />
                </button>
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: 'var(--text-1)' }}>{profile.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>{profile.title}</p>
                <button className="text-xs font-semibold mt-1" style={{ color: 'var(--accent)' }}>Change photo</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {field('name', 'Full Name')}
              {field('email', 'Email Address', 'email')}
              {field('phone', 'Phone Number', 'tel')}
              {field('title', 'Job Title')}
              {field('department', 'Department', 'text', ['Quality Assurance', 'Compliance', 'ATM Operations', 'Branch Operations', 'Risk Management'])}
              {field('emirate', 'Based In', 'text', ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'])}
            </div>

            <div className="py-4 pb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-4)' }}>Bio</label>
              <textarea rows={3} defaultValue="Senior compliance officer responsible for branch network governance across the UAE. Specializing in ATM compliance and vendor SLA management."
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none transition-all"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
            </div>
          </Section>
        </div>
      )}

      {/* Appearance tab */}
      {activeTab === 'appearance' && (
        <div>
          <Section title="Theme" description="Choose your preferred display mode" icon={Palette}>
            {/* Light / Dark / System cards */}
            <div className="grid grid-cols-3 gap-3 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                { label: 'Light', icon: Sun, value: false, preview: ['#F1F5F9', '#FFFFFF', '#1E293B'] },
                { label: 'Dark', icon: Moon, value: true, preview: ['#09090C', '#111318', '#F0F2F8'] },
                { label: 'System', icon: Monitor, value: null, preview: ['linear-gradient(135deg, #F1F5F9 50%, #09090C 50%)', '#FFFFFF', '#111318'] },
              ].map(opt => {
                const isActive = opt.value === null ? false : isDark === opt.value;
                return (
                  <motion.button
                    key={opt.label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { if (opt.value !== null) setIsDark(opt.value); }}
                    className="rounded-2xl p-4 text-left transition-all"
                    style={{
                      background: isActive ? 'rgba(71,139,235,0.12)' : 'var(--surface-3)',
                      border: `2px solid ${isActive ? 'rgba(71,139,235,0.40)' : 'var(--border)'}`,
                    }}
                  >
                    {/* Preview */}
                    <div className="rounded-xl h-16 mb-3 overflow-hidden relative" style={{ background: typeof opt.preview[0] === 'string' && opt.preview[0].startsWith('linear') ? opt.preview[0] : opt.preview[0] }}>
                      <div className="absolute bottom-1 right-1 w-10 h-6 rounded-lg" style={{ background: opt.preview[1] }} />
                      <div className="absolute bottom-3 left-2 h-1.5 rounded-full w-8" style={{ background: opt.preview[2] + '40' }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <opt.icon size={14} style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)' }} />
                      <span className="text-sm font-semibold" style={{ color: isActive ? 'var(--accent)' : 'var(--text-2)' }}>{opt.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Accent color */}
            <div className="py-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Accent Color</p>
              <div className="flex items-center gap-3 flex-wrap">
                {ACCENT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setAccent(i)}
                    className="w-9 h-9 rounded-xl transition-all relative"
                    style={{ background: isDark ? c.value : c.dark, transform: accent === i ? 'scale(1.15)' : 'scale(1)' }}
                    title={c.name}
                  >
                    {accent === i && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-4)' }}>Selected: {ACCENT_COLORS[accent].name}</p>
            </div>

            {/* Display toggles */}
            <Toggle value={display.compactMode} onChange={v => setDisplay(p => ({ ...p, compactMode: v }))} label="Compact Mode" description="Reduce spacing and padding across the interface" />
            <Toggle value={display.animations} onChange={v => setDisplay(p => ({ ...p, animations: v }))} label="Animations & Transitions" description="Smooth page transitions and micro-interactions" />
            <Toggle value={display.highContrast} onChange={v => setDisplay(p => ({ ...p, highContrast: v }))} label="High Contrast" description="Increase contrast for improved accessibility" />
            <div className="pb-2">
              <Toggle value={display.showGuides} onChange={v => setDisplay(p => ({ ...p, showGuides: v }))} label="Show Onboarding Guides" description="Display contextual help tips throughout the platform" />
            </div>
          </Section>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <Section title="Notification Preferences" description="Control what alerts you receive and how" icon={Bell}>
          <div className="pb-2">
            <p className="text-xs font-bold uppercase tracking-wider pt-4 pb-2" style={{ color: 'var(--text-4)' }}>In-App Alerts</p>
            <Toggle value={notifs.overdueTickets} onChange={v => setNotifs(p => ({ ...p, overdueTickets: v }))} label="Overdue Tickets" description="Alert when tickets exceed SLA threshold" />
            <Toggle value={notifs.slaBreaches} onChange={v => setNotifs(p => ({ ...p, slaBreaches: v }))} label="Vendor SLA Breaches" description="Alert when a vendor exceeds contracted response time" />
            <Toggle value={notifs.newIncidents} onChange={v => setNotifs(p => ({ ...p, newIncidents: v }))} label="New Critical Incidents" description="Instant alert for severity 4-5 incidents" />
            <Toggle value={notifs.reportReady} onChange={v => setNotifs(p => ({ ...p, reportReady: v }))} label="Report Ready" description="Notify when a generated report is available" />
            <Toggle value={notifs.systemAlerts} onChange={v => setNotifs(p => ({ ...p, systemAlerts: v }))} label="System Alerts" description="ATM offline, connectivity issues, system maintenance" />

            <p className="text-xs font-bold uppercase tracking-wider pt-4 pb-2" style={{ color: 'var(--text-4)' }}>Email & Push</p>
            <Toggle value={notifs.emailDigest} onChange={v => setNotifs(p => ({ ...p, emailDigest: v }))} label="Daily Email Digest" description="Receive a summary of daily compliance activity" />
            <Toggle value={notifs.pushNotifications} onChange={v => setNotifs(p => ({ ...p, pushNotifications: v }))} label="Push Notifications" description="Browser push notifications for critical alerts" />
            <Toggle value={notifs.weeklyReport} onChange={v => setNotifs(p => ({ ...p, weeklyReport: v }))} label="Weekly Report Email" description="Automatic weekly governance report to your inbox" />
          </div>
        </Section>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div>
          <Section title="Account Security" description="Manage authentication and access controls" icon={Shield}>
            <Toggle value={security.twoFactor} onChange={v => setSecurity(p => ({ ...p, twoFactor: v }))} label="Two-Factor Authentication" description="Require a verification code on each login" />
            <Toggle value={security.loginAlerts} onChange={v => setSecurity(p => ({ ...p, loginAlerts: v }))} label="Login Alerts" description="Email notification on new device login" />
            <Toggle value={security.apiAccess} onChange={v => setSecurity(p => ({ ...p, apiAccess: v }))} label="API Access" description="Allow API key access to your account data" />

            <div className="py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Session Timeout</p>
              <div className="flex gap-2 flex-wrap">
                {['1h','4h','8h','24h'].map(t => (
                  <button key={t} onClick={() => setSecurity(p => ({ ...p, sessionTimeout: t }))}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{ background: security.sessionTimeout === t ? 'rgba(71,139,235,0.15)' : 'var(--surface-3)', color: security.sessionTimeout === t ? 'var(--accent)' : 'var(--text-3)', border: `1px solid ${security.sessionTimeout === t ? 'rgba(71,139,235,0.30)' : 'var(--border)'}` }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Change password */}
            <div className="py-4 pb-5">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Change Password</p>
              <div className="space-y-3">
                {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                  <div key={i} className="relative">
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-4)' }}>{label}</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none pr-10 transition-all"
                        style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
                      {i === 1 && (
                        <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white mt-1"
                  style={{ background: 'var(--accent)' }}>
                  <Key size={14} />
                  Update Password
                </button>
              </div>
            </div>
          </Section>

          <Section title="Active Sessions" description="Devices currently logged into your account" icon={Smartphone}>
            <div className="py-2 pb-4 space-y-3">
              {[
                { device: 'MacBook Pro 16"', location: 'Abu Dhabi, UAE', time: 'Now (current session)', icon: Monitor },
                { device: 'iPhone 15 Pro', location: 'Dubai, UAE', time: '2 hours ago', icon: Smartphone },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-3)' }}>
                      <session.icon size={16} style={{ color: 'var(--text-3)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{session.device}</p>
                      <p className="text-xs" style={{ color: 'var(--text-4)' }}>{session.location} · {session.time}</p>
                    </div>
                  </div>
                  {i === 0
                    ? <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>Active</span>
                    : <button className="text-xs font-semibold" style={{ color: '#F14B4B' }}>Revoke</button>
                  }
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Regional tab */}
      {activeTab === 'regional' && (
        <Section title="Language & Regional Settings" description="Localization preferences for your account" icon={Globe}>
          <div className="py-2 pb-4 space-y-4">
            {[
              { label: 'Language', opts: ['English (US)', 'English (UK)', 'Arabic (العربية)', 'French', 'Hindi'] },
              { label: 'Date Format', opts: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
              { label: 'Time Format', opts: ['12-hour (AM/PM)', '24-hour'] },
              { label: 'Currency', opts: ['AED — UAE Dirham', 'USD — US Dollar', 'EUR — Euro'] },
              { label: 'Timezone', opts: ['Asia/Dubai (GST +4)', 'Asia/Riyadh (AST +3)', 'UTC', 'Europe/London (GMT)'] },
              { label: 'Number Format', opts: ['1,234,567.89 (English)', '1.234.567,89 (German)', '1 234 567,89 (French)'] },
            ].map(f => (
              <div key={f.label} className="py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-4)' }}>{f.label}</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                  style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', maxWidth: 400 }}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Save bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between rounded-2xl px-6 py-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>Changes are saved to your account and synced across devices.</p>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl text-sm font-medium transition-all btn-ghost">Discard</button>
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: saved ? '#22C55E' : 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 16px rgba(71,139,235,0.3)' }}
          >
            {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
