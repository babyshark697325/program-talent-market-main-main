import { ActivityType, ActivityData } from '@/types/adminActivity';

export const formatActivityTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

export const formatActivityMessage = (type: ActivityType, data: ActivityData): string => {
  switch (type) {
    case ActivityType.USER_REGISTRATION:
      if ('userName' in data) {
        return `New student registered: ${data.userName}`;
      }
      break;
    case ActivityType.JOB_POSTED:
      if ('jobTitle' in data && 'company' in data) {
        return `Job posted: ${data.jobTitle} at ${data.company}`;
      }
      break;
    case ActivityType.REPORT_GENERATED:
      if ('reportType' in data) {
        return `${data.reportType} report generated`;
      }
      break;
    case ActivityType.USER_REPORTS:
      if ('reportedBy' in data && 'reportType' in data && 'reason' in data) {
        return `${data.reportedBy} reported: ${data.reportType} - ${data.reason}`;
      }
      break;
    case ActivityType.USER_ISSUES:
      if ('reportedBy' in data && 'issueType' in data && 'description' in data) {
        return `${data.reportedBy} reported issue: ${data.issueType} - ${data.description}`;
      }
      break;
  }
  
  // Fallback to generic message
  if ('message' in data) {
    return data.message;
  }
  
  return 'Unknown activity';
};
