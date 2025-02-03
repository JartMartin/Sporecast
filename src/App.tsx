import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { LoadingPage } from "@/components/ui/loading-page";

// Lazy load pages with proper default export handling
const AuthPage = lazy(() => import("@/pages/auth"));
const LandingPage = lazy(() => import("@/pages/landing"));
const FeaturesPage = lazy(() => import("@/pages/features"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const StoryPage = lazy(() => import("@/pages/story"));
const SchedulePage = lazy(() => import("@/pages/schedule"));
const CommoditiesPage = lazy(() => import("@/pages/commodities"));

// Dashboard pages
const DashboardLayout = lazy(() => import("@/features/dashboard/layout"));
const DashboardHome = lazy(() => import("@/features/dashboard/home"));
const CommodityStore = lazy(() => import("@/features/dashboard/store"));
const ProfilePage = lazy(() => import("@/features/dashboard/profile"));
const AlertsPage = lazy(() => import("@/features/dashboard/alerts"));

// Wheat pages
const WheatPage = lazy(() => import("@/features/dashboard/commodities/wheat"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/commodities" element={<CommoditiesPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="store" element={<CommodityStore />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="wheat" element={<WheatPage />} />
          </Route>

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export { App }