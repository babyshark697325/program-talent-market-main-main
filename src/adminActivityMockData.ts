import { AdminActivity, ActivityType, ActivityStatus } from '@/types/adminActivity';

// Mock data for admin activities
export const mockAdminActivities: AdminActivity[] = [
  {
    id: 1,
    type: ActivityType.USER_REGISTRATION,
    message: "New student registered: Alex Johnson",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: ActivityStatus.SUCCESS,
    data: { userName: "Alex Johnson", userId: 123 },
    isRead: false
  },
  {
    id: 2,
    type: ActivityType.JOB_POSTED,
    message: "Job posted: Senior React Developer at TechCorp",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: ActivityStatus.SUCCESS,
    data: { jobTitle: "Senior React Developer", company: "TechCorp", jobId: 456 },
    isRead: false
  },
  {
    id: 3,
    type: ActivityType.REPORT_GENERATED,
    message: "Monthly analytics report generated",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: ActivityStatus.INFO,
    data: { reportType: "Monthly Analytics", reportId: 789 },
    isRead: true
  },
  {
    id: 5,
    type: ActivityType.PAYMENT_PROCESSED,
    message: "Payment processed: $350 for Web Development project",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: ActivityStatus.SUCCESS,
    data: { amount: 350, projectName: "Web Development project" },
    isRead: true
  },
  {
    id: 6,
    type: ActivityType.SYSTEM_ALERT,
    message: "System maintenance scheduled for tonight",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: ActivityStatus.WARNING,
    data: { maintenanceTime: "2024-01-15 02:00 AM" },
    isRead: false
  },
  {
    id: 7,
    type: ActivityType.CONTENT_MODERATED,
    message: "Inappropriate content removed from job posting",
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
    status: ActivityStatus.WARNING,
    data: { jobId: 789, reason: "Inappropriate language" },
    isRead: true
  },
  {
    id: 8,
    type: ActivityType.DATA_BACKUP,
    message: "Daily database backup completed successfully",
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    status: ActivityStatus.SUCCESS,
    data: { backupSize: "2.3GB", duration: "45 minutes" },
    isRead: true
  },
  {
    id: 9,
    type: ActivityType.USER_REPORTS,
    message: "Student reported harassment from client",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    status: ActivityStatus.ERROR,
    data: { reportedBy: "Sarah Chen", reportType: "Harassment", clientId: 456, reason: "Inappropriate messages and unprofessional behavior" },
    isRead: false
  },
  {
    id: 10,
    type: ActivityType.USER_ISSUES,
    message: "Client reported payment processing issue",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: ActivityStatus.ERROR,
    data: { reportedBy: "TechCorp Ltd", issueType: "Payment", description: "Payment failed during checkout", ticketId: "ISS-2024-001" },
    isRead: false
  },
  {
    id: 11,
    type: ActivityType.USER_ISSUES,
    message: "Student reported profile verification delay - resolved",
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
    status: ActivityStatus.SUCCESS,
    data: { reportedBy: "Alex Johnson", issueType: "Verification", description: "Profile pending verification for 2 weeks", ticketId: "ISS-2024-002" },
    isRead: true
  },
  {
    id: 12,
    type: ActivityType.USER_REPORTS,
    message: "Client reported fraudulent work submission",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
    status: ActivityStatus.ERROR,
    data: { reportedBy: "StartupXYZ", reportType: "Fraud", studentId: 789, reason: "Submitted plagiarized work as original" },
    isRead: true
  },
  {
    id: 13,
    type: ActivityType.USER_REPORTS,
    message: "Student reported unpaid work by client",
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
    status: ActivityStatus.WARNING,
    data: { reportedBy: "Mike Rodriguez", reportType: "Non-payment", clientId: 234, reason: "Client refused to pay after work completion" },
    isRead: true
  },
  {
    id: 14,
    type: ActivityType.USER_REPORTS,
    message: "Client reported abusive language from student",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    status: ActivityStatus.WARNING,
    data: { reportedBy: "DesignCorp", reportType: "Abusive Behavior", studentId: 567, reason: "Used offensive language during project discussion" },
    isRead: true
  }
];

export const mockRootProps = {
  activities: mockAdminActivities,
  onActivityClick: (activityId: number) => console.log('Activity clicked:', activityId),
  onFilterChange: (filter: string) => console.log('Filter changed:', filter)
};