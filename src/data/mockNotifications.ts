export interface Notification {
  id: string | number;
  userId: string | number;
  userType: 'student' | 'client' | 'admin';
  type: 'job_application' | 'message' | 'payment' | 'payout' | 'job_posted' | 'milestone' | 'review' | 'system' | 'learning_resource' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  relatedId?: string | number;
  relatedType?: 'job' | 'application' | 'payment' | 'message' | 'review' | 'learning_resource';
  metadata?: {
    amount?: number;
    currency?: string;
    jobTitle?: string;
    clientName?: string;
    studentName?: string;
    rating?: number;
    [key: string]: any;
  };
  expiresAt?: string;
}

export const mockNotifications: Notification[] = [
  // Student notifications
  {
    id: 1,
    userId: 1,
    userType: "student",
    type: "job_application",
    title: "Application Accepted!",
    message: "Congratulations! Local Boutique has accepted your application for the E-commerce Website project.",
    timestamp: "2024-01-17T10:30:00Z",
    isRead: true,
    priority: "high",
    actionUrl: "/applications/1",
    actionText: "View Project",
    relatedId: 1,
    relatedType: "application",
    metadata: {
      jobTitle: "Build E-commerce Website",
      clientName: "Local Boutique"
    }
  },
  {
    id: 2,
    userId: 1,
    userType: "student",
    type: "payment",
    title: "Payment Received",
    message: "You've received $2,660 for completing the E-commerce Website project.",
    timestamp: "2024-01-17T15:45:00Z",
    isRead: true,
    priority: "high",
    actionUrl: "/payments/1",
    actionText: "View Payment",
    relatedId: 1,
    relatedType: "payment",
    metadata: {
      amount: 2660,
      currency: "USD",
      jobTitle: "Build E-commerce Website"
    }
  },
  {
    id: 3,
    userId: 1,
    userType: "student",
    type: "payout",
    title: "Payout Processed",
    message: "Your payout of $2,655 has been successfully transferred to your bank account ****1234.",
    timestamp: "2024-01-22T09:15:00Z",
    isRead: true,
    priority: "medium",
    actionUrl: "/payouts/1",
    actionText: "View Payout",
    relatedId: 1,
    relatedType: "payment",
    metadata: {
      amount: 2655,
      currency: "USD"
    }
  },
  {
    id: 4,
    userId: 1,
    userType: "student",
    type: "review",
    title: "New Review Received",
    message: "Local Boutique left you a 5-star review for the E-commerce Website project!",
    timestamp: "2024-01-28T14:20:00Z",
    isRead: false,
    priority: "medium",
    actionUrl: "/reviews",
    actionText: "View Review",
    relatedId: 1,
    relatedType: "review",
    metadata: {
      rating: 5,
      clientName: "Local Boutique"
    }
  },
  {
    id: 5,
    userId: 2,
    userType: "student",
    type: "message",
    title: "New Message from Client",
    message: "Fitness Studio sent you a message about the Social Media Graphics project.",
    timestamp: "2024-01-21T11:30:00Z",
    isRead: true,
    priority: "medium",
    actionUrl: "/messages/2",
    actionText: "View Message",
    relatedId: 2,
    relatedType: "message",
    metadata: {
      clientName: "Fitness Studio"
    }
  },
  {
    id: 6,
    userId: 2,
    userType: "student",
    type: "milestone",
    title: "Milestone Payment Received",
    message: "You've received $475 for completing Milestone 1 of the Social Media Graphics project.",
    timestamp: "2024-01-20T16:00:00Z",
    isRead: true,
    priority: "high",
    actionUrl: "/payments/2",
    actionText: "View Payment",
    relatedId: 2,
    relatedType: "payment",
    metadata: {
      amount: 475,
      currency: "USD",
      jobTitle: "Social Media Graphics Package"
    }
  },
  {
    id: 7,
    userId: 3,
    userType: "student",
    type: "job_application",
    title: "Interview Scheduled",
    message: "Tech Startup wants to interview you for the 3D Product Visualization project!",
    timestamp: "2024-01-23T16:20:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/applications/3",
    actionText: "View Details",
    relatedId: 3,
    relatedType: "application",
    metadata: {
      jobTitle: "3D Product Visualization",
      clientName: "Tech Startup"
    }
  },
  {
    id: 8,
    userId: 1,
    userType: "student",
    type: "learning_resource",
    title: "Workshop Starting Soon",
    message: "Your Resume Writing Workshop starts in 2 hours. Join link has been sent to your email.",
    timestamp: "2024-02-15T17:00:00Z",
    isRead: false,
    priority: "urgent",
    actionUrl: "/learning/workshop/1",
    actionText: "Join Workshop",
    relatedId: 1,
    relatedType: "learning_resource",
    expiresAt: "2024-02-15T19:00:00Z"
  },
  {
    id: 9,
    userId: 1,
    userType: "student",
    type: "achievement",
    title: "First Project Completed! 🎉",
    message: "Congratulations on completing your first project on MyVillage! You've earned the 'First Success' badge.",
    timestamp: "2024-01-28T10:00:00Z",
    isRead: true,
    priority: "low",
    actionUrl: "/profile/achievements",
    actionText: "View Badges"
  },

  // Client notifications
  {
    id: 10,
    userId: "client_1",
    userType: "client",
    type: "job_application",
    title: "New Application Received",
    message: "Alex Rivera has applied for your E-commerce Website project with a proposal of $2,800.",
    timestamp: "2024-01-16T14:30:00Z",
    isRead: true,
    priority: "medium",
    actionUrl: "/jobs/1/applications",
    actionText: "Review Application",
    relatedId: 1,
    relatedType: "application",
    metadata: {
      studentName: "Alex Rivera",
      amount: 2800,
      currency: "USD"
    }
  },
  {
    id: 11,
    userId: "client_1",
    userType: "client",
    type: "milestone",
    title: "Project Completed",
    message: "Alex Rivera has marked the E-commerce Website project as completed and is requesting final review.",
    timestamp: "2024-01-26T11:45:00Z",
    isRead: true,
    priority: "high",
    actionUrl: "/projects/1/review",
    actionText: "Review & Approve",
    relatedId: 1,
    relatedType: "job",
    metadata: {
      studentName: "Alex Rivera",
      jobTitle: "Build E-commerce Website"
    }
  },
  {
    id: 12,
    userId: "client_2",
    userType: "client",
    type: "message",
    title: "New Message from Student",
    message: "Jamie Patel sent you an update on the Social Media Graphics project.",
    timestamp: "2024-01-21T09:15:00Z",
    isRead: true,
    priority: "medium",
    actionUrl: "/messages/2",
    actionText: "View Message",
    relatedId: 2,
    relatedType: "message",
    metadata: {
      studentName: "Jamie Patel"
    }
  },
  {
    id: 13,
    userId: "client_3",
    userType: "client",
    type: "job_posted",
    title: "Job Posted Successfully",
    message: "Your job posting '3D Product Visualization' is now live and accepting applications.",
    timestamp: "2024-01-20T08:00:00Z",
    isRead: true,
    priority: "low",
    actionUrl: "/jobs/3",
    actionText: "View Job",
    relatedId: 3,
    relatedType: "job",
    metadata: {
      jobTitle: "3D Product Visualization"
    }
  },
  {
    id: 14,
    userId: "client_2",
    userType: "client",
    type: "review",
    title: "Please Leave a Review",
    message: "How was working with Jamie Patel on the Social Media Graphics project? Your feedback helps other students.",
    timestamp: "2024-01-29T12:00:00Z",
    isRead: false,
    priority: "low",
    actionUrl: "/projects/2/review",
    actionText: "Leave Review",
    relatedId: 2,
    relatedType: "job",
    metadata: {
      studentName: "Jamie Patel",
      jobTitle: "Social Media Graphics Package"
    }
  },

  // System notifications
  {
    id: 15,
    userId: 1,
    userType: "student",
    type: "system",
    title: "Platform Maintenance Notice",
    message: "Scheduled maintenance will occur tonight from 2:00 AM - 4:00 AM EST. Service may be temporarily unavailable.",
    timestamp: "2024-02-10T18:00:00Z",
    isRead: false,
    priority: "medium",
    actionUrl: "/system-status",
    actionText: "View Status"
  },
  {
    id: 16,
    userId: 2,
    userType: "student",
    type: "system",
    title: "New Feature: Video Calls",
    message: "You can now schedule video calls directly with clients through the platform! Check out the new feature in your messages.",
    timestamp: "2024-02-05T10:00:00Z",
    isRead: true,
    priority: "low",
    actionUrl: "/features/video-calls",
    actionText: "Learn More"
  },
  {
    id: 17,
    userId: "client_1",
    userType: "client",
    type: "system",
    title: "Payment Method Expires Soon",
    message: "Your credit card ending in ****1234 expires next month. Please update your payment method to avoid service interruption.",
    timestamp: "2024-02-01T09:00:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/billing/payment-methods",
    actionText: "Update Payment",
    expiresAt: "2024-03-01T00:00:00Z"
  },
  {
    id: 18,
    userId: 3,
    userType: "student",
    type: "learning_resource",
    title: "New Course Available",
    message: "Check out the new 'Advanced 3D Rendering Techniques' course - perfect for enhancing your 3D modeling skills!",
    timestamp: "2024-02-08T14:30:00Z",
    isRead: false,
    priority: "low",
    actionUrl: "/learning/courses/advanced-3d-rendering",
    actionText: "View Course",
    relatedId: "new_course_1",
    relatedType: "learning_resource"
  },
  {
    id: 19,
    userId: 4,
    userType: "student",
    type: "job_posted",
    title: "New Job Matches Your Skills",
    message: "A new Unity Developer position has been posted that matches your game development skills!",
    timestamp: "2024-02-09T11:20:00Z",
    isRead: false,
    priority: "medium",
    actionUrl: "/jobs/browse?skills=unity,game-development",
    actionText: "View Jobs",
    metadata: {
      jobTitle: "Unity Game Developer",
      matchPercentage: 95
    }
  },
  {
    id: 20,
    userId: 1,
    userType: "student",
    type: "achievement",
    title: "Top Rated Student! ⭐",
    message: "You've maintained a 5.0 rating across all projects! You've earned the 'Excellence' badge.",
    timestamp: "2024-02-01T16:45:00Z",
    isRead: true,
    priority: "low",
    actionUrl: "/profile/achievements",
    actionText: "View Badge",
    metadata: {
      rating: 5.0,
      projectCount: 3
    }
  }
];

// Notification statistics
export const notificationStats = {
  totalNotifications: mockNotifications.length,
  unreadCount: mockNotifications.filter(n => !n.isRead).length,
  byType: {
    job_application: mockNotifications.filter(n => n.type === 'job_application').length,
    message: mockNotifications.filter(n => n.type === 'message').length,
    payment: mockNotifications.filter(n => n.type === 'payment').length,
    payout: mockNotifications.filter(n => n.type === 'payout').length,
    job_posted: mockNotifications.filter(n => n.type === 'job_posted').length,
    milestone: mockNotifications.filter(n => n.type === 'milestone').length,
    review: mockNotifications.filter(n => n.type === 'review').length,
    system: mockNotifications.filter(n => n.type === 'system').length,
    learning_resource: mockNotifications.filter(n => n.type === 'learning_resource').length,
    achievement: mockNotifications.filter(n => n.type === 'achievement').length
  },
  byPriority: {
    urgent: mockNotifications.filter(n => n.priority === 'urgent').length,
    high: mockNotifications.filter(n => n.priority === 'high').length,
    medium: mockNotifications.filter(n => n.priority === 'medium').length,
    low: mockNotifications.filter(n => n.priority === 'low').length
  },
  byUserType: {
    student: mockNotifications.filter(n => n.userType === 'student').length,
    client: mockNotifications.filter(n => n.userType === 'client').length,
    admin: mockNotifications.filter(n => n.userType === 'admin').length
  }
};

// Helper function to get notifications for a specific user
export const getNotificationsForUser = (userId: string | number, userType: 'student' | 'client' | 'admin') => {
  return mockNotifications
    .filter(notification => notification.userId === userId && notification.userType === userType)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Helper function to get unread notifications for a user
export const getUnreadNotificationsForUser = (userId: string | number, userType: 'student' | 'client' | 'admin') => {
  return getNotificationsForUser(userId, userType).filter(notification => !notification.isRead);
};
