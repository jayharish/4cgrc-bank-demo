import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Shield } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
          <Shield size={22} className="text-white" />
        </div>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && profile) {
    const hierarchy = { admin: 4, manager: 3, auditor: 2, viewer: 1 };
    if ((hierarchy[profile.role] || 0) < (hierarchy[requiredRole] || 0)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
