export enum ActivityType {
  USER_REGISTRATION = "user_registration",
  WAITLIST_JOINED = "waitlist_joined",
  JOB_POSTED = "job_posted", 
  REPORT_GENERATED = "report_generated",
  PAYMENT_PROCESSED = "payment_processed",
  PROFILE_UPDATED = "profile_updated",
  CONTENT_MODERATED = "content_moderated",
  SYSTEM_ALERT = "system_alert",
  DATA_BACKUP = "data_backup",
  USER_REPORTS = "user_reports",
  USER_ISSUES = "user_issues"
}

export enum ActivityStatus {
  SUCCESS = "success",
  WARNING = "warning", 
  INFO = "info",
  ERROR = "error"
}

// Activity data types for different activity types
export interface UserRegistrationData {
  userName: string;
  userId?: string;
}

export interface JobPostedData {
  jobTitle: string;
  company: string;
  jobId?: string;
}

export interface ReportGeneratedData {
  reportType: string;
  reportId?: string;
}

export interface UserReportsData {
  reportedBy: string;
  reportType: string;
  reason: string;
  reportedUserId?: string;
}

export interface UserIssuesData {
  reportedBy: string;
  issueType: string;
  description: string;
  issueId?: string;
}

export interface GenericActivityData {
  message: string;
  [key: string]: unknown;
}

export type ActivityData = 
  | UserRegistrationData
  | JobPostedData
  | ReportGeneratedData
  | UserReportsData
  | UserIssuesData
  | GenericActivityData;

export interface AdminActivity {
  id: number;
  type: ActivityType;
  message: string;
  timestamp: Date;
  status: ActivityStatus;
  data: ActivityData;
  isRead?: boolean;
}
