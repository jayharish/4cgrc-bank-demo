import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ExecutiveSummary from './pages/ExecutiveSummary';
import BranchNetwork from './pages/BranchNetwork';
import ATMNetwork from './pages/ATMNetwork';
import BranchIncidents from './pages/BranchIncidents';
import BranchObservations from './pages/BranchObservations';
import Analytics from './pages/Analytics';
import VendorManagement from './pages/VendorManagement';
import MerchantCompliance from './pages/MerchantCompliance';
import Reports from './pages/Reports';
import QualityChecklists from './pages/QualityChecklists';
import UsersManagement from './pages/UsersManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExecutiveSummary />} />
          <Route path="locations/branches" element={<BranchNetwork />} />
          <Route path="locations/atms" element={<ATMNetwork />} />
          <Route path="incidents/branches" element={<BranchIncidents />} />
          <Route path="incidents/atms" element={<BranchIncidents type="atm" />} />
          <Route path="observations/branches" element={<BranchObservations />} />
          <Route path="observations/atms" element={<BranchObservations type="atm" />} />
          <Route path="analytics/branches" element={<Analytics />} />
          <Route path="analytics/atms" element={<Analytics type="atm" />} />
          <Route path="inspections/branches" element={<BranchNetwork type="inspection" />} />
          <Route path="inspections/atms" element={<ATMNetwork type="inspection" />} />
          <Route path="checklists" element={<QualityChecklists />} />
          <Route path="checklists/templates" element={<QualityChecklists />} />
          <Route path="checklists/submissions" element={<QualityChecklists tab="submissions" />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="merchants" element={<MerchantCompliance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="users/roles" element={<UsersManagement tab="roles" />} />
          <Route path="users/permissions" element={<UsersManagement tab="permissions" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
