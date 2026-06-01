export const VENDORS = [
  { id: 'VND-001', name: 'AlMansoori Facilities', category: 'Cleaning & Janitorial', contractExpiry: '2025-12-31', slaTarget: 24, slaActual: 31, openWOs: 14, status: 'SLA Breach', rating: 3.1 },
  { id: 'VND-002', name: 'Securitas Gulf', category: 'Security Services', contractExpiry: '2026-03-31', slaTarget: 4, slaActual: 3.8, openWOs: 7, status: 'Compliant', rating: 4.6 },
  { id: 'VND-003', name: 'NCR Gulf Solutions', category: 'ATM Servicing', contractExpiry: '2026-06-30', slaTarget: 8, slaActual: 7.2, openWOs: 22, status: 'Compliant', rating: 4.4 },
  { id: 'VND-004', name: 'Emirates FM Services', category: 'Facilities Maintenance', contractExpiry: '2025-09-30', slaTarget: 48, slaActual: 52, openWOs: 18, status: 'SLA Breach', rating: 3.3 },
  { id: 'VND-005', name: 'Diebold Nixdorf Gulf', category: 'ATM Hardware', contractExpiry: '2026-01-31', slaTarget: 12, slaActual: 11.4, openWOs: 9, status: 'Compliant', rating: 4.2 },
  { id: 'VND-006', name: 'Al Futtaim Facilities', category: 'Building Maintenance', contractExpiry: '2026-02-28', slaTarget: 72, slaActual: 68, openWOs: 6, status: 'Compliant', rating: 4.5 },
  { id: 'VND-007', name: 'Gulf Print & Branding', category: 'Signage & Branding', contractExpiry: '2025-11-30', slaTarget: 96, slaActual: 104, openWOs: 8, status: 'SLA Breach', rating: 3.0 },
  { id: 'VND-008', name: 'ENOC Gulf Maintenance', category: 'Electrical & Plumbing', contractExpiry: '2026-04-30', slaTarget: 36, slaActual: 33, openWOs: 5, status: 'Compliant', rating: 4.7 },
];

export const WORK_ORDERS = [
  { id: 'WO-9841', location: 'Mussafah Branch', type: 'Branch', vendor: 'AlMansoori Facilities', category: 'Cleaning', raised: '2025-05-01', due: '2025-05-02', status: 'Overdue' },
  { id: 'WO-9842', location: 'ATM-003 Dubai Metro Union', type: 'ATM', vendor: 'NCR Gulf Solutions', category: 'ATM Repair', raised: '2025-05-15', due: '2025-05-15', status: 'Overdue' },
  { id: 'WO-9843', location: 'Khalidiyah Branch', type: 'Branch', vendor: 'Emirates FM Services', category: 'Maintenance', raised: '2025-05-10', due: '2025-05-12', status: 'Overdue' },
  { id: 'WO-9844', location: 'Gold Souk Branch', type: 'Branch', vendor: 'Gulf Print & Branding', category: 'Signage', raised: '2025-05-18', due: '2025-05-22', status: 'Overdue' },
  { id: 'WO-9845', location: 'DIFC Branch', type: 'Branch', vendor: 'Securitas Gulf', category: 'Security', raised: '2025-05-20', due: '2025-05-21', status: 'Completed' },
  { id: 'WO-9846', location: 'ATM-006 Gold Souk Metro', type: 'ATM', vendor: 'Diebold Nixdorf Gulf', category: 'ATM Repair', raised: '2025-05-22', due: '2025-05-23', status: 'In Progress' },
  { id: 'WO-9847', location: 'Sharjah Central Branch', type: 'Branch', vendor: 'AlMansoori Facilities', category: 'Cleaning', raised: '2025-05-25', due: '2025-05-26', status: 'Open' },
  { id: 'WO-9848', location: 'Al Wahda Mall Branch', type: 'Branch', vendor: 'Al Futtaim Facilities', category: 'Building Maintenance', raised: '2025-05-26', due: '2025-05-28', status: 'Open' },
  { id: 'WO-9849', location: 'Ajman Corniche Branch', type: 'Branch', vendor: 'Emirates FM Services', category: 'Maintenance', raised: '2025-05-27', due: '2025-05-29', status: 'Open' },
  { id: 'WO-9850', location: 'RAK Main Branch', type: 'Branch', vendor: 'ENOC Gulf Maintenance', category: 'Electrical', raised: '2025-05-28', due: '2025-05-30', status: 'In Progress' },
];

export const VENDOR_SLA_CHART = [
  { vendor: 'AlMansoori', target: 24, actual: 31 },
  { vendor: 'Securitas', target: 4, actual: 3.8 },
  { vendor: 'NCR Gulf', target: 8, actual: 7.2 },
  { vendor: 'Emirates FM', target: 48, actual: 52 },
  { vendor: 'Diebold', target: 12, actual: 11.4 },
  { vendor: 'Al Futtaim', target: 72, actual: 68 },
  { vendor: 'Gulf Print', target: 96, actual: 104 },
  { vendor: 'ENOC Gulf', target: 36, actual: 33 },
];
