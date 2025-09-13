import StudentSettings from "./pages/StudentSettings";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useRole } from "./contexts/RoleContext";

// Dark mode
import { ThemeProvider } from "next-themes";

// Sidebar primitives + app sidebar
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

// Header widgets
import RoleSelector from "./components/RoleSelector";
import UserMenu from "./components/UserMenu";
import { ThemeToggle } from "./components/ThemeToggle";

// shadcn toasts host
import { Toaster } from "./components/ui/toaster";
import BackToTop from "./components/BackToTop";
import GlobalPreferencesBoot from "./components/GlobalPreferencesBoot";

// ---- Pages that exist in your repo (per screenshot) ----
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import ManageJobs from "./pages/ManageJobs";
import PostJob from "./pages/PostJob";
import BrowseJobs from "./pages/BrowseJobs";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import ClientSettings from "./pages/ClientSettings";
import ClientProfile from "./pages/ClientProfile";

import StudentResources from "./pages/StudentResources";
import BrowseStudents from "./pages/BrowseStudents";
import StudentProfile from "./pages/StudentProfile";
import AllResources from "./pages/AllResources";
import Payouts from "./pages/Payouts";

import AdminStats from "./pages/AdminStats";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import AdminReviewJobs from "./pages/AdminReviewJobs";
import AdminSpotlightSuccess from "./pages/AdminSpotlightSuccess";
import AdminLearningResources from "./pages/AdminLearningResources";
import AdminLearningResourcesList from "./pages/AdminLearningResourcesList";
import AdminLearningResourceEdit from "./pages/AdminLearningResourceEdit";
import AdminUsersList from "./pages/AdminUsersList";
import AdminWaitlist from "./pages/AdminWaitlist";
import Waitlist from "./pages/Waitlist";

// New dashboard pages
import { AdminDashboardPage, StudentDashboardPage, ClientDashboardPage } from "./pages/Dashboards";

// ---------- Inline layout with sidebar + header ----------
function Layout({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const { userRole, isDeveloper } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <div className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b border-border/40 dark:border-white/5 px-2 md:px-4">
            <SidebarTrigger className="h-6 w-6 md:h-8 md:w-8" />
            <div className="h-4 w-px bg-border mx-1 md:mx-2" />
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-xs md:text-sm text-muted-foreground hidden sm:block">
                MyVillage Talent
              </span>
              <span className="font-semibold text-xs text-muted-foreground sm:hidden">
                MyVillage
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <ThemeToggle />
              {(userRole === 'admin' || userRole === 'developer' || isDeveloper) && <RoleSelector />}
              <UserMenu />
            </div>
          </div>
          <div className="flex-1">{children}</div>
          {role === 'client' && <BackToTop />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem 
      disableTransitionOnChange
      storageKey="myvillage-theme"
    >
      <AuthProvider>
        <RoleProvider>
          <SavedJobsProvider>
            <Router>
            <GlobalPreferencesBoot />
            <Routes>
              {/* ---------- PUBLIC ---------- */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout><Index /></Layout>} />

              {/* ---------- CLIENT (protected) ---------- */}
              <Route
                path="/client-dashboard"
                element={
                  <ProtectedRoute>
                    <Layout><ClientDashboardPage /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-jobs"
                element={
                  <ProtectedRoute>
                    <Layout><ManageJobs /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <Layout><PostJob /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/browse-jobs"
                element={
                  <ProtectedRoute>
                    <Layout><BrowseJobs /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute>
                    <Layout><MyApplications /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute>
                    <Layout><SavedJobs /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job/:id"
                element={
                  <ProtectedRoute>
                    <Layout><JobDetail /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout><Profile /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/settings"
                element={
                  <ProtectedRoute>
                    <Layout><ClientSettings /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/profile"
                element={
                  <ProtectedRoute>
                    <Layout><ClientProfile /></Layout>
                  </ProtectedRoute>
                }
              />

              {/* ---------- STUDENT (protected) ---------- */}
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute>
                    <Layout><StudentDashboardPage /></Layout>
                  </ProtectedRoute>
                }
              />
              {/* Resources paths so the sidebar link won’t 404 */}
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Layout><StudentResources /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/resources"
                element={
                  <ProtectedRoute>
                    <Layout><StudentResources /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/all-resources"
                element={
                  <ProtectedRoute>
                    <Layout><AllResources /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/browse-students"
                element={
                  <ProtectedRoute>
                    <Layout><BrowseStudents /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/settings"
                element={
                  <ProtectedRoute>
                    <Layout><StudentSettings /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payouts"
                element={
                  <ProtectedRoute>
                    <Layout><Payouts /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/:id"
                element={
                  <ProtectedRoute>
                    <Layout><StudentProfile /></Layout>
                  </ProtectedRoute>
                }
              />

              {/* ---------- ADMIN (protected + role) ---------- */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminDashboardPage /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminUsers /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminAnalytics /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stats"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminStats /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminReports /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/review-jobs"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminReviewJobs /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminSettings /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/spotlight"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminSpotlightSuccess /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/learning-resources"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminLearningResources /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/learning-resources/list"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminLearningResourcesList /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/learning-resources/edit/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminLearningResourceEdit /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/list"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminUsersList /></Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/waitlist"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminWaitlist /></Layout>
                  </ProtectedRoute>
                }
              />

              {/* ---------- 404 ---------- */}
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
            </Router>

            {/* shadcn toasts host */}
            <Toaster />
          </SavedJobsProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
