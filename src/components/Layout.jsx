import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, MapPin, AlertTriangle, Eye,
  BarChart2, ClipboardList, Users, Settings, ChevronDown,
  ChevronRight, Bell, Menu, X, Building2, Cpu, Store,
  Package, LogOut, Search, Moon, Sun, Shield, ChevronLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'summary', label: 'Executive Summary', icon: LayoutDashboard, path: '/', exact: true },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  {
    id: 'locations', label: 'Locations', icon: MapPin,
    children: [
      { label: 'Branches', path: '/locations/branches', icon: Building2 },
      { label: 'ATMs', path: '/locations/atms', icon: Cpu },
    ],
  },
  {
    id: 'incidents', label: 'Incidents', icon: AlertTriangle,
    children: [
      { label: 'Branches', path: '/incidents/branches', icon: Building2 },
      { label: 'ATMs', path: '/incidents/atms', icon: Cpu },
    ],
  },
  {
    id: 'observations', label: 'Observations', icon: Eye,
    children: [
      { label: 'Branches', path: '/observations/branches', icon: Building2 },
      { label: 'ATMs', path: '/observations/atms', icon: Cpu },
    ],
  },
  {
    id: 'analytics', label: 'Analytics', icon: BarChart2,
    children: [
      { label: 'Branches', path: '/analytics/branches', icon: Building2 },
      { label: 'ATMs', path: '/analytics/atms', icon: Cpu },
    ],
  },
  {
    id: 'inspections', label: 'Inspections', icon: ClipboardList,
    children: [
      { label: 'Branches', path: '/inspections/branches', icon: Building2 },
      { label: 'ATMs', path: '/inspections/atms', icon: Cpu },
    ],
  },
  {
    id: 'checklists', label: 'Quality Checklists', icon: ClipboardList,
    children: [
      { label: 'Templates', path: '/checklists/templates', icon: FileText },
      { label: 'Submissions', path: '/checklists/submissions', icon: FileText },
    ],
  },
  { id: 'vendors', label: 'Vendor Management', icon: Package, path: '/vendors', badge: 'NEW' },
  { id: 'merchants', label: 'Merchant Compliance', icon: Store, path: '/merchants', badge: 'NEW' },
  {
    id: 'users', label: 'Users Management', icon: Users,
    children: [
      { label: 'Users', path: '/users', icon: Users },
      { label: 'Roles', path: '/users/roles', icon: Shield },
      { label: 'Permissions', path: '/users/permissions', icon: Users },
    ],
  },
];

const PAGE_TITLES = {
  '/': { title: 'Executive Summary', subtitle: 'Compliance Command Center' },
  '/reports': { title: 'Reports', subtitle: 'Generate & export compliance reports' },
  '/locations/branches': { title: 'Branch Network', subtitle: 'Locations / Branches' },
  '/locations/atms': { title: 'ATM Network', subtitle: 'Locations / ATMs' },
  '/incidents/branches': { title: 'Branch Incidents', subtitle: 'Incidents / Branches' },
  '/incidents/atms': { title: 'ATM Incidents', subtitle: 'Incidents / ATMs' },
  '/observations/branches': { title: 'Branch Observations', subtitle: 'Observations / Branches' },
  '/observations/atms': { title: 'ATM Observations', subtitle: 'Observations / ATMs' },
  '/analytics/branches': { title: 'Branch Analytics', subtitle: 'Analytics / Branches' },
  '/analytics/atms': { title: 'ATM Analytics', subtitle: 'Analytics / ATMs' },
  '/inspections/branches': { title: 'Branch Inspections', subtitle: 'Inspections / Branches' },
  '/inspections/atms': { title: 'ATM Inspections', subtitle: 'Inspections / ATMs' },
  '/checklists/templates': { title: 'Checklist Templates', subtitle: 'Quality Checklists / Templates' },
  '/checklists/submissions': { title: 'Submissions', subtitle: 'Quality Checklists / Submissions' },
  '/vendors': { title: 'Vendor Management', subtitle: 'Vendor Accountability Dashboard' },
  '/merchants': { title: 'Merchant Compliance', subtitle: 'Merchant Compliance Monitoring' },
  '/users': { title: 'Users Management', subtitle: 'Users & Roles' },
  '/users/roles': { title: 'Roles', subtitle: 'Users Management / Roles' },
  '/users/permissions': { title: 'Permissions', subtitle: 'Users Management / Permissions' },
  '/settings': { title: 'Settings', subtitle: 'Account, appearance & preferences' },
};

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        background: isDark ? 'rgba(71,139,235,0.12)' : 'rgba(37,99,235,0.08)',
        border: `1px solid ${isDark ? 'rgba(71,139,235,0.25)' : 'rgba(37,99,235,0.2)'}`,
        color: isDark ? '#478BEB' : '#2563EB',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </motion.div>
      <span className="hidden lg:inline text-xs">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}

function NavGroup({ item, collapsed }) {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
  const [open, setOpen] = useState(isChildActive);

  useEffect(() => { if (isChildActive) setOpen(true); }, [isChildActive]);

  const activeStyle = {
    background: 'linear-gradient(135deg, rgba(71,139,235,0.20), rgba(71,139,235,0.08))',
    color: '#478BEB',
    borderColor: 'rgba(71,139,235,0.25)',
  };
  const hoverClass = 'transition-all duration-150';

  if (item.path) {
    return (
      <NavLink
        to={item.path}
        end={item.exact}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${hoverClass} group relative border border-transparent ${
            isActive ? 'font-semibold' : 'opacity-70 hover:opacity-100'
          }`
        }
        style={({ isActive }) => isActive ? activeStyle : {}}
      >
        {({ isActive }) => (
          <>
            <item.icon size={17} className="shrink-0" style={{ color: isActive ? '#478BEB' : 'var(--text-3)' }} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate" style={{ color: isActive ? '#478BEB' : 'var(--text-2)' }}>{item.label}</span>
                {item.badge && <span className="badge-new">{item.badge}</span>}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${hoverClass} border border-transparent ${
          isChildActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
        }`}
        style={isChildActive && !open ? { background: 'rgba(71,139,235,0.08)', borderColor: 'rgba(71,139,235,0.12)' } : {}}
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={17} className="shrink-0" style={{ color: isChildActive ? '#478BEB' : 'var(--text-3)' }} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate" style={{ color: isChildActive ? 'var(--text-1)' : 'var(--text-2)' }}>{item.label}</span>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={13} style={{ color: 'var(--text-4)' }} />
            </motion.div>
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 pl-3 space-y-0.5" style={{ borderLeft: '1px solid var(--border)' }}>
              {item.children.map(child => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 border border-transparent"
                  style={({ isActive }) => isActive ? activeStyle : {}}
                >
                  {({ isActive }) => (
                    <>
                      <child.icon size={13} style={{ color: isActive ? '#478BEB' : 'var(--text-4)' }} />
                      <span style={{ color: isActive ? '#478BEB' : 'var(--text-3)', fontWeight: isActive ? 600 : 400 }}>
                        {child.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() || 'U';
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Dashboard', subtitle: '' };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sidebarStyle = {
    background: 'var(--sidebar)',
    borderRight: '1px solid var(--border)',
    width: collapsed ? '64px' : '256px',
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
  };

  const headerStyle = {
    background: 'var(--header)',
    borderBottom: '1px solid var(--border)',
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="flex flex-col shrink-0 overflow-hidden z-20" style={sidebarStyle}>
        {/* Logo */}
        <div
          className="flex items-center shrink-0"
          style={{
            padding: collapsed ? '16px 12px' : '16px 20px',
            borderBottom: '1px solid var(--border)',
            height: 64,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          {collapsed ? (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              4C
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                4C
              </div>
              <div>
                <div className="font-black text-base leading-tight tracking-tight" style={{ color: 'var(--text-1)' }}>4CGRC</div>
                <div className="text-xs font-medium leading-tight" style={{ color: 'var(--text-4)' }}>Banking Operations</div>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(item => (
            <NavGroup key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all border border-transparent opacity-70 hover:opacity-100"
            title={collapsed ? 'Settings' : undefined}
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(71,139,235,0.20), rgba(71,139,235,0.08))',
              color: '#478BEB', borderColor: 'rgba(71,139,235,0.25)', opacity: 1,
            } : {}}
          >
            {({ isActive }) => (
              <>
                <Settings size={17} className="shrink-0" style={{ color: isActive ? '#478BEB' : 'var(--text-3)' }} />
                {!collapsed && <span style={{ color: isActive ? '#478BEB' : 'var(--text-2)' }}>Settings</span>}
              </>
            )}
          </NavLink>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all opacity-70 hover:opacity-100"
            style={{ color: 'var(--danger)' }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center px-5 gap-4 shrink-0 z-10" style={headerStyle}>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-3)', ':hover': { background: 'var(--surface-3)' } }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className="flex-1 min-w-0">
            <motion.h1
              key={location.pathname + '-title'}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base font-bold leading-tight truncate"
              style={{ color: 'var(--text-1)' }}
            >
              {pageInfo.title}
            </motion.h1>
            <p className="text-xs leading-tight" style={{ color: 'var(--text-4)' }}>{pageInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-48 cursor-text"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={13} style={{ color: 'var(--text-4)' }} />
              <span className="text-sm" style={{ color: 'var(--text-4)' }}>Search...</span>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--text-4)', border: '1px solid var(--border)' }}>⌘K</span>
            </div>

            <ThemeToggle />

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="p-2 rounded-xl transition-all relative"
                style={{ color: 'var(--text-3)', background: notifOpen ? 'var(--surface-3)' : 'transparent' }}
              >
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>Notifications</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">4 new</span>
                      </div>
                    </div>
                    {[
                      { msg: '563 tickets are overdue — escalate immediately', time: '2m ago', type: 'danger' },
                      { msg: 'AlMansoori Facilities SLA breach (+7h over target)', time: '1h ago', type: 'warning' },
                      { msg: 'Monthly compliance report is ready for download', time: '3h ago', type: 'success' },
                      { msg: '3 ATMs offline — Dubai Metro, Ajman City Centre, Gold Souk', time: '4h ago', type: 'danger' },
                    ].map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse ${
                          n.type === 'danger' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{n.msg}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{n.time}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="px-4 py-2.5 text-center">
                      <button className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2.5 pl-3 ml-1 transition-opacity hover:opacity-80"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #478BEB, #7C3AED)' }}>
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-tight" style={{ color: 'var(--text-1)' }}>{profile?.full_name || profile?.email || 'User'}</p>
                <p className="text-xs leading-tight capitalize" style={{ color: 'var(--text-4)' }}>{profile?.role || 'viewer'}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
