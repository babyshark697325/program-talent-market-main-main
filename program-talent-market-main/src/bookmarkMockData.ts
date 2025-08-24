// Mock data for saved jobs state
export const mockSavedJobIds = [1, 3] as const;

// Props data for JobCard component
export const mockRootProps = {
  savedJobIds: [1, 3],
  onSaveJob: (jobId: number) => { /* Handle save job logic */ },
  onUnsaveJob: (jobId: number) => { /* Handle unsave job logic */ }
};

// Mock data for admin activities
export const mockAdminActivities = [
  {
    id: 1,
    type: "user_registration" as const,
    message: "New student registered: Alex Johnson",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "success" as const,
    data: { userName: "Alex Johnson", userId: 123 }
  },
  {
    id: 2,
    type: "job_posted" as const,
    message: "Job posted: Senior React Developer at TechCorp",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "success" as const,
    data: { jobTitle: "Senior React Developer", company: "TechCorp", jobId: 456 }
  },
  {
    id: 3,
    type: "report_generated" as const,
    message: "Monthly analytics report generated",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "info" as const,
    data: { reportType: "Monthly Analytics", reportId: 789 }
  },
  {
    id: 4,
    type: "user_verification" as const,
    message: "Student profile verification completed: Sarah Chen",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "success" as const,
    data: { userName: "Sarah Chen", userId: 234 }
  },
  {
    id: 5,
    type: "payment_processed" as const,
    message: "Payment processed: $350 for Web Development project",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "success" as const,
    data: { amount: 350, projectName: "Web Development project" }
  }
];