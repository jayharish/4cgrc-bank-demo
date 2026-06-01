import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Key, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const USERS = [
  { id: 'USR-001', name: 'Ahmed Al Mazrouei', email: 'ahmed.mazrouei@bank.ae', role: 'Branch Inspector', emirate: 'Abu Dhabi', status: 'Active', lastLogin: '2025-06-01' },
  { id: 'USR-002', name: 'Sara Al Hosani', email: 'sara.hosani@bank.ae', role: 'Senior Inspector', emirate: 'Dubai', status: 'Active', lastLogin: '2025-05-31' },
  { id: 'USR-003', name: 'Mohammed Al Suwaidi', email: 'moh.suwaidi@bank.ae', role: 'Branch Inspector', emirate: 'Abu Dhabi', status: 'Active', lastLogin: '2025-05-30' },
  { id: 'USR-004', name: 'Fatima Al Nuaimi', email: 'fatima.nuaimi@bank.ae', role: 'Compliance Manager', emirate: 'Dubai', status: 'Active', lastLogin: '2025-06-01' },
  { id: 'USR-005', name: 'Khalid Al Mansoori', email: 'khalid.mansoori@bank.ae', role: 'ATM Inspector', emirate: 'Abu Dhabi', status: 'Active', lastLogin: '2025-05-29' },
  { id: 'USR-006', name: 'Noura Al Kaabi', email: 'noura.kaabi@bank.ae', role: 'Branch Inspector', emirate: 'Dubai', status: 'Inactive', lastLogin: '2025-05-15' },
  { id: 'USR-007', name: 'Ali Al Shamsi', email: 'ali.shamsi@bank.ae', role: 'Quality Auditor', emirate: 'Sharjah', status: 'Active', lastLogin: '2025-05-28' },
  { id: 'USR-008', name: 'Mariam Al Rashidi', email: 'mariam.rashidi@bank.ae', role: 'Compliance Officer', emirate: 'Ajman', status: 'Active', lastLogin: '2025-05-30' },
];

const ROLES = [
  { name: 'Super Admin', users: 2, permissions: 'Full system access', color: 'bg-red-100 text-red-700' },
  { name: 'Compliance Manager', users: 3, permissions: 'Reports, Analytics, User Mgmt', color: 'bg-purple-100 text-purple-700' },
  { name: 'Senior Inspector', users: 5, permissions: 'Inspections, Incidents, Observations', color: 'bg-blue-100 text-blue-700' },
  { name: 'Branch Inspector', users: 18, permissions: 'Inspections, Observations', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'ATM Inspector', users: 6, permissions: 'ATM Inspections, ATM Incidents', color: 'bg-amber-100 text-amber-700' },
  { name: 'Quality Auditor', users: 4, permissions: 'Checklists, Analytics (read-only)', color: 'bg-slate-100 text-slate-600' },
];

export default function UsersManagement({ tab }) {
  const [activeTab, setActiveTab] = useState(tab || 'users');
  const [search, setSearch] = useState('');

  const filtered = search
    ? USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
    : USERS;

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Users Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage system users, roles and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
          <p className="text-2xl font-bold text-slate-800">38</p>
          <p className="text-xs text-slate-400 mt-0.5">Across all emirates</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Today</p>
          <p className="text-2xl font-bold text-emerald-600">24</p>
          <p className="text-xs text-slate-400 mt-0.5">Logged in within 24h</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Defined Roles</p>
          <p className="text-2xl font-bold text-blue-600">{ROLES.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Permission levels</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'roles', label: 'Roles', icon: Shield },
          { id: 'permissions', label: 'Permissions', icon: Key },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">System Users</h3>
              <p className="text-xs text-slate-400 mt-0.5">{filtered.length} users shown</p>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['User', 'Email', 'Role', 'Emirate', 'Last Login', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{user.emirate}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"><Edit2 size={14} /></button>
                        <button className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map(role => (
            <div key={role.name} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <Shield size={18} className="text-blue-600" />
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${role.color}`}>{role.name}</span>
                </div>
                <span className="text-xs text-slate-400">{role.users} users</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{role.permissions}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(100, (role.users / 20) * 100)}%` }} />
                </div>
                <button className="ml-3 text-xs text-blue-600 hover:underline font-medium whitespace-nowrap">Edit Role</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Permission Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Feature access by role</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
                  {ROLES.slice(0, 4).map(r => (
                    <th key={r.name} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{r.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Executive Summary', true, true, true, true],
                  ['Branch Network', true, true, true, true],
                  ['Branch Incidents', true, true, true, false],
                  ['Vendor Management', true, true, false, false],
                  ['User Management', true, true, false, false],
                  ['Reports', true, true, true, false],
                  ['System Settings', true, false, false, false],
                ].map(([feature, ...perms]) => (
                  <tr key={feature} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{feature}</td>
                    {perms.map((perm, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {perm
                          ? <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-100 rounded-full"><span className="text-emerald-600 text-xs font-bold">✓</span></span>
                          : <span className="inline-flex items-center justify-center w-5 h-5 bg-slate-100 rounded-full"><span className="text-slate-300 text-xs font-bold">✗</span></span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
