import React from "react";
import { useNavigate } from "react-router-dom";

// Existing dashboard UIs
import AdminDashboard from "@/components/AdminDashboard";
import StudentDashboard from "@/components/StudentDashboard";

// Existing data
import { mockJobs } from "@/data/mockJobs";

// Existing client functionality we can reuse for now
import ManageJobs from "@/pages/ManageJobs";

// Admin Dashboard Page wrapper
export const AdminDashboardPage: React.FC = () => {
  return <AdminDashboard jobs={mockJobs} />;
};

// Student Dashboard Page wrapper
export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // StudentDashboard expects setActiveTab to switch between sections in Index.
  // In a dedicated page context, send users to the relevant pages.
  const handleSetActiveTab = (tab: "students" | "jobs") => {
    if (tab === "jobs") navigate("/browse-jobs");
    else navigate("/");
  };

  return <StudentDashboard jobs={mockJobs} setActiveTab={handleSetActiveTab} />;
};

// Client Dashboard Page wrapper
export const ClientDashboardPage: React.FC = () => {
  // For now, reuse ManageJobs as the main client dashboard content.
  // This can be expanded later with KPIs, quick actions, and recommendations.
  return <ManageJobs />;
};
