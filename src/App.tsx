import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { LoadingPage } from "@/components/ui/loading-page";

// Lazy load pages with proper default export handling
const AuthPage = lazy(() => import("@/pages/auth").then(module => ({ default: module.AuthPage })));
const LandingPage = lazy(() => import("@/pages/landing").then(module => ({ default: module.LandingPage })));
const FeaturesPage = lazy(() => import("@/pages/features").then(module => ({ default: module.FeaturesPage })));
const PricingPage = lazy(() => import("@/pages/pricing").then(module => ({ default: module.PricingPage })));
const StoryPage = lazy(() => import("@/pages/story").then(module => ({ default: module.StoryPage })));
const SchedulePage = lazy(() => import("@/pages/schedule").then(module => ({ default: module.SchedulePage })));
const CommoditiesPage = lazy(() => import("@/pages/commodities").then(module => ({ default: module.CommoditiesPage })));

// Dashboard pages
const DashboardLayout = lazy(() => import("@/features/dashboard/layout").then(module => ({ default: module.DashboardLayout })));
const DashboardHome = lazy(() => import("@/features/dashboard/home").then(module => ({ default: module.DashboardHome })));
const CommodityStore = lazy(() => import("@/features/dashboard/store").then(module => ({ default: module.CommodityStore })));
const ProfilePage = lazy(() => import("@/features/dashboard/profile").then(module => ({ default: module.ProfilePage })));
const AlertsPage = lazy(() => import("@/features/dashboard/alerts").then(module => ({ default: module.AlertsPage })));
const CommodityPage = lazy(() => import("@/features/dashboard/commodity").then(module => ({ default: module.DynamicCommodityPage })));

export function App() {
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
            <Route path=":commodity" element={<CommodityPage />} />
          </Route>

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;