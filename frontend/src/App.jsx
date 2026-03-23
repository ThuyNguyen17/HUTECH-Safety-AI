import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/DashboardPage";
import CameraManagement from "./pages/CameraManagement";
import AlertSystem from "./pages/AlertSystem";
import AdminPanel from "./pages/AdminPanel";
import ModelTest from "./pages/ModelTest";

import "./styles/tailwind.css";
import DocumentPageSimple from "./pages/doc/DocumentPageSimple";

/* ================= AUTH GUARD ================= */
const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

/* ================= ADMIN GUARD ================= */
const RequireAdmin = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

/* ================= APP ================= */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* ===== PUBLIC ===== */}
            <Route path="/login" element={<Login />} />

            {/* ===== AUTHENTICATED ===== */}
            <Route element={<RequireAuth />}>
              <Route index element={<Dashboard />} />
              <Route path="cameras" element={<CameraManagement />} />
              <Route path="alerts" element={<AlertSystem />} />
              <Route path="testing/model" element={<ModelTest />} />
              <Route path="/info/docs" element={<DocumentPageSimple/>} />

              {/* ===== ADMIN ONLY ===== */}
              <Route element={<RequireAdmin />}>
                <Route path="admin" element={<AdminPanel />} />
              </Route>
            </Route>

            {/* ===== FALLBACK ===== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
