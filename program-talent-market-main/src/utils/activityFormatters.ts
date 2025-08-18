import { ActivityType } from '@/types/adminActivity';

export const formatActivityTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

export const formatActivityMessage = (type: ActivityType, data: any): string => {
  switch (type) {
    case ActivityType.USER_REGISTRATION:
      return `New student registered: ${data.userName}`;
    case ActivityType.JOB_POSTED:
      return `Job posted: ${data.jobTitle} at ${data.company}`;
    case ActivityType.REPORT_GENERATED:
      return `${data.reportType} report generated`;
    case ActivityType.USER_REPORTS:
      return `${data.reportedBy} reported: ${data.reportType} - ${data.reason}`;
    case ActivityType.USER_ISSUES:
      return `${data.reportedBy} reported issue: ${data.issueType} - ${data.description}`;
    default:
      return data.message;
  }
};