import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
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
import InspectionEngine from './pages/InspectionEngine';
import UsersManagement from './pages/UsersManagement';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<ExecutiveSummary />} />
          <Route path="locations/branches" element={<BranchNetwork />} />
          <Route path="locations/atms" element={<ATMNetwork />} />
          <Route path="incidents/branches" element={<BranchIncidents />} />
          <Route path="incidents/atms" element={<BranchIncidents type="atm" />} />
          <Route path="observations/branches" element={<BranchObservations />} />
          <Route path="observations/atms" element={<BranchObservations type="atm" />} />
          <Route path="analytics/branches" element={<Analytics />} />
          <Route path="analytics/atms" element={<Analytics type="atm" />} />
          <Route path="inspections" element={<InspectionEngine />} />
          <Route path="inspections/engine" element={<InspectionEngine />} />
          <Route path="inspections/branches" element={<InspectionEngine />} />
          <Route path="inspections/atms" element={<InspectionEngine />} />
          <Route path="checklists" element={<QualityChecklists />} />
          <Route path="checklists/templates" element={<QualityChecklists />} />
          <Route path="checklists/submissions" element={<QualityChecklists tab="submissions" />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="merchants" element={<MerchantCompliance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<ProtectedRoute requiredRole="admin"><UsersManagement /></ProtectedRoute>} />
          <Route path="users/roles" element={<ProtectedRoute requiredRole="admin"><UsersManagement tab="roles" /></ProtectedRoute>} />
          <Route path="users/permissions" element={<ProtectedRoute requiredRole="admin"><UsersManagement tab="permissions" /></ProtectedRoute>} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
