import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, MapPin, AlertTriangle, Eye,
  BarChart2, ClipboardList, Users, Settings, ChevronDown,
  ChevronRight, Bell, Menu, X, Building2, Cpu, Store,
  Package, LogOut, Search, Maximize2
} from 'lucide-react';

const NAV_ITEMS = [
  {
    id: 'summary',
    label: 'Executive Summary',
    icon: LayoutDashboard,
    path: '/',
    exact: true,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: MapPin,
    children: [
      { label: 'Branches', path: '/locations/branches', icon: Building2 },
      { label: 'ATMs', path: '/locations/atms', icon: Cpu },
    ],
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: AlertTriangle,
    children: [
      { label: 'Branches', path: '/incidents/branches', icon: Building2 },
      { label: 'ATMs', path: '/incidents/atms', icon: Cpu },
    ],
  },
  {
    id: 'observations',
    label: 'Observations',
    icon: Eye,
    children: [
      { label: 'Branches', path: '/observations/branches', icon: Building2 },
      { label: 'ATMs', path: '/observations/atms', icon: Cpu },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart2,
    children: [
      { label: 'Branches', path: '/analytics/branches', icon: Building2 },
      { label: 'ATMs', path: '/analytics/atms', icon: Cpu },
    ],
  },
  {
    id: 'inspections',
    label: 'Inspections',
    icon: ClipboardList,
    children: [
      { label: 'Branches', path: '/inspections/branches', icon: Building2 },
      { label: 'ATMs', path: '/inspections/atms', icon: Cpu },
    ],
  },
  {
    id: 'checklists',
    label: 'Quality Checklists',
    icon: ClipboardList,
    children: [
      { label: 'Templates', path: '/checklists/templates', icon: FileText },
      { label: 'Submissions', path: '/checklists/submissions', icon: FileText },
    ],
  },
  {
    id: 'vendors',
    label: 'Vendor Management',
    icon: Package,
    path: '/vendors',
    badge: 'NEW',
  },
  {
    id: 'merchants',
    label: 'Merchant Compliance',
    icon: Store,
    path: '/merchants',
    badge: 'NEW',
  },
  {
    id: 'users',
    label: 'Users Management',
    icon: Users,
    children: [
      { label: 'Users', path: '/users', icon: Users },
      { label: 'Roles', path: '/users/roles', icon: Users },
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
  '/checklists': { title: 'Quality Checklists', subtitle: 'Templates & Submissions' },
  '/checklists/templates': { title: 'Checklist Templates', subtitle: 'Quality Checklists / Templates' },
  '/checklists/submissions': { title: 'Checklist Submissions', subtitle: 'Quality Checklists / Submissions' },
  '/vendors': { title: 'Vendor Management', subtitle: 'Vendor Accountability Dashboard' },
  '/merchants': { title: 'Merchant Compliance', subtitle: 'Merchant Compliance Monitoring' },
  '/users': { title: 'Users Management', subtitle: 'Users Management / Users' },
  '/users/roles': { title: 'Roles', subtitle: 'Users Management / Roles' },
  '/users/permissions': { title: 'Permissions', subtitle: 'Users Management / Permissions' },
};

function NavGroup({ item, collapsed }) {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname === c.path);
  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  if (item.path) {
    return (
      <NavLink
        to={item.path}
        end={item.exact}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
            isActive
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`
        }
        title={collapsed ? item.label : undefined}
      >
        {({ isActive }) => (
          <>
            <item.icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 group-hover:bg-blue-200">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
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
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
          isChildActive && !open
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        }`}
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={18} className={`shrink-0 ${isChildActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
          </>
        )}
      </button>

      {!collapsed && open && (
        <div className="ml-4 mt-0.5 border-l-2 border-slate-100 pl-3 space-y-0.5">
          {item.children.map(child => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <child.icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {child.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{ boxShadow: '2px 0 8px 0 rgba(0,0,0,0.06)' }}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-slate-100 ${sidebarCollapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4'}`}>
          {sidebarCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">4C</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">4C</span>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-base leading-tight tracking-tight">4CGRC</div>
                <div className="text-xs text-slate-400 font-medium leading-tight">Banking Operations</div>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavGroup key={item.id} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Bottom */}
        <div className={`border-t border-slate-100 py-3 px-2 space-y-0.5`}>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition-all"
            title={sidebarCollapsed ? 'Settings' : undefined}
          >
            <Settings size={18} className="text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} className="text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-800 leading-tight">{pageInfo.title}</h1>
            <p className="text-xs text-slate-400 leading-tight">{pageInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-56">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(o => !o)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all relative"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                  </div>
                  {[
                    { msg: '563 tickets are overdue — immediate action required', time: '2m ago', type: 'danger' },
                    { msg: 'AlMansoori Facilities SLA breach detected (31h vs 24h target)', time: '1h ago', type: 'warning' },
                    { msg: 'Monthly compliance report ready for download', time: '3h ago', type: 'success' },
                    { msg: '8 ATMs offline — Gulf Mall, ADNEC, Al Wahda', time: '4h ago', type: 'danger' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.type === 'danger' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.msg}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 text-center">
                    <button className="text-xs text-blue-600 font-medium hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 ml-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              {!sidebarCollapsed && (
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-700 leading-tight">Admin User</p>
                  <p className="text-xs text-slate-400 leading-tight">Compliance Officer</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div key={location.pathname} className="page-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
