import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CheckinWelcome from "@/pages/Checkin/Welcome";
import CheckinForm from "@/pages/Checkin/Form";
import CheckinSuccess from "@/pages/Checkin/Success";
import Login from "@/pages/Login";
import SalesList from "@/pages/Sales/List";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import { useAuthStore } from "@/store/useAuthStore";
import { useConfigStore } from "@/store/useConfigStore";
import { useCheckinStore } from "@/store/useCheckinStore";
import { seedData } from "@/data/seed";

function RequireAuth({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const loadConfig = useConfigStore((state) => state.loadConfig);
  const loadRecords = useCheckinStore((state) => state.loadRecords);

  useEffect(() => {
    seedData();
    loadConfig();
    loadRecords();
  }, [loadConfig, loadRecords]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/checkin" replace />} />
      <Route path="/checkin" element={<CheckinWelcome />} />
      <Route path="/checkin/form" element={<CheckinForm />} />
      <Route path="/checkin/success" element={<CheckinSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/sales"
        element={
          <RequireAuth allowedRoles={["sales", "admin"]}>
            <SalesList />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth allowedRoles={["sales", "admin"]}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <Admin />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,146,60,0.1),transparent_50%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        <div className="relative z-10">
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}
