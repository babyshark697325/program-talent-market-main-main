export interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalClients: number;
    totalJobs: number;
    totalApplications: number;
    totalCompletedProjects: number;
    totalRevenue: number;
    platformGrowth: number; // percentage
  };
  
  userMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    newUsersThisMonth: number;
    userRetentionRate: number;
    avgSessionDuration: number; // in minutes
  };
  
  jobMetrics: {
    jobsPostedThisMonth: number;
    averageJobValue: number;
    mostDemandedSkills: Array<{ skill: string; count: number }>;
    jobCompletionRate: number;
    averageTimeToHire: number; // in days
    jobsByCategory: Array<{ category: string; count: number }>;
  };
  
  financialMetrics: {
    monthlyRevenue: number;
    platformFees: number;
    payoutVolume: number;
    averageProjectValue: number;
    revenueGrowth: number; // percentage
    topEarningStudents: Array<{ name: string; earnings: number }>;
  };
  
  engagementMetrics: {
    averageRating: number;
    totalReviews: number;
    messageVolume: number;
    learningResourceEnrollments: number;
    communityActivity: number;
  };
  
  geographicData: {
    usersByRegion: Array<{ region: string; users: number }>;
    topCities: Array<{ city: string; users: number }>;
    internationalGrowth: number;
  };
  
  timeSeriesData: {
    userRegistrations: Array<{ date: string; count: number }>;
    jobPostings: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
    applicationSubmissions: Array<{ date: string; count: number }>;
  };
  
  performanceMetrics: {
    platformUptime: number;
    averageLoadTime: number;
    errorRate: number;
    supportTickets: number;
    userSatisfactionScore: number;
  };
}

export const mockAnalytics: AnalyticsData = {
  overview: {
    totalUsers: 1247,
    totalStudents: 856,
    totalClients: 391,
    totalJobs: 234,
    totalApplications: 1123,
    totalCompletedProjects: 189,
    totalRevenue: 287650,
    platformGrowth: 23.5
  },
  
  userMetrics: {
    dailyActiveUsers: 189,
    weeklyActiveUsers: 534,
    monthlyActiveUsers: 923,
    newUsersThisMonth: 156,
    userRetentionRate: 78.3,
    avgSessionDuration: 24.7
  },
  
  jobMetrics: {
    jobsPostedThisMonth: 47,
    averageJobValue: 2340,
    mostDemandedSkills: [
      { skill: "Web Development", count: 89 },
      { skill: "Graphic Design", count: 76 },
      { skill: "UI/UX Design", count: 67 },
      { skill: "Content Writing", count: 54 },
      { skill: "Social Media Marketing", count: 48 },
      { skill: "Data Analysis", count: 42 },
      { skill: "Mobile Development", count: 38 },
      { skill: "Video Editing", count: 35 },
      { skill: "Photography", count: 31 },
      { skill: "SEO", count: 28 }
    ],
    jobCompletionRate: 87.2,
    averageTimeToHire: 3.8,
    jobsByCategory: [
      { category: "Technology", count: 78 },
      { category: "Design & Creative", count: 65 },
      { category: "Marketing", count: 43 },
      { category: "Writing & Content", count: 32 },
      { category: "Business", count: 16 }
    ]
  },
  
  financialMetrics: {
    monthlyRevenue: 34200,
    platformFees: 14380,
    payoutVolume: 198450,
    averageProjectValue: 1520,
    revenueGrowth: 18.7,
    topEarningStudents: [
      { name: "Alex Rivera", earnings: 8950 },
      { name: "Samira Chen", earnings: 7640 },
      { name: "Morgan Lee", earnings: 6890 },
      { name: "Jamie Patel", earnings: 5670 },
      { name: "Ethan Smith", earnings: 4320 }
    ]
  },
  
  engagementMetrics: {
    averageRating: 4.7,
    totalReviews: 456,
    messageVolume: 2847,
    learningResourceEnrollments: 892,
    communityActivity: 1234
  },
  
  geographicData: {
    usersByRegion: [
      { region: "North America", users: 567 },
      { region: "Europe", users: 342 },
      { region: "Asia Pacific", users: 198 },
      { region: "Latin America", users: 87 },
      { region: "Middle East & Africa", users: 53 }
    ],
    topCities: [
      { city: "San Francisco", users: 89 },
      { city: "New York", users: 76 },
      { city: "London", users: 54 },
      { city: "Toronto", users: 43 },
      { city: "Austin", users: 38 },
      { city: "Berlin", users: 32 },
      { city: "Sydney", users: 28 },
      { city: "Vancouver", users: 24 }
    ],
    internationalGrowth: 31.2
  },
  
  timeSeriesData: {
    userRegistrations: [
      { date: "2024-01-01", count: 23 },
      { date: "2024-01-02", count: 18 },
      { date: "2024-01-03", count: 31 },
      { date: "2024-01-04", count: 27 },
      { date: "2024-01-05", count: 19 },
      { date: "2024-01-06", count: 24 },
      { date: "2024-01-07", count: 32 },
      { date: "2024-01-08", count: 28 },
      { date: "2024-01-09", count: 35 },
      { date: "2024-01-10", count: 41 },
      { date: "2024-01-11", count: 29 },
      { date: "2024-01-12", count: 33 },
      { date: "2024-01-13", count: 37 },
      { date: "2024-01-14", count: 26 },
      { date: "2024-01-15", count: 42 }
    ],
    jobPostings: [
      { date: "2024-01-01", count: 5 },
      { date: "2024-01-02", count: 3 },
      { date: "2024-01-03", count: 8 },
      { date: "2024-01-04", count: 6 },
      { date: "2024-01-05", count: 4 },
      { date: "2024-01-06", count: 7 },
      { date: "2024-01-07", count: 9 },
      { date: "2024-01-08", count: 5 },
      { date: "2024-01-09", count: 11 },
      { date: "2024-01-10", count: 8 },
      { date: "2024-01-11", count: 6 },
      { date: "2024-01-12", count: 10 },
      { date: "2024-01-13", count: 7 },
      { date: "2024-01-14", count: 4 },
      { date: "2024-01-15", count: 12 }
    ],
    revenue: [
      { date: "2024-01-01", amount: 2340 },
      { date: "2024-01-02", amount: 1890 },
      { date: "2024-01-03", amount: 3200 },
      { date: "2024-01-04", amount: 2750 },
      { date: "2024-01-05", amount: 1560 },
      { date: "2024-01-06", amount: 2980 },
      { date: "2024-01-07", amount: 3450 },
      { date: "2024-01-08", amount: 2100 },
      { date: "2024-01-09", amount: 4200 },
      { date: "2024-01-10", amount: 3780 },
      { date: "2024-01-11", amount: 2890 },
      { date: "2024-01-12", amount: 3650 },
      { date: "2024-01-13", amount: 2420 },
      { date: "2024-01-14", amount: 1920 },
      { date: "2024-01-15", amount: 4680 }
    ],
    applicationSubmissions: [
      { date: "2024-01-01", count: 34 },
      { date: "2024-01-02", count: 28 },
      { date: "2024-01-03", count: 45 },
      { date: "2024-01-04", count: 52 },
      { date: "2024-01-05", count: 31 },
      { date: "2024-01-06", count: 38 },
      { date: "2024-01-07", count: 41 },
      { date: "2024-01-08", count: 36 },
      { date: "2024-01-09", count: 49 },
      { date: "2024-01-10", count: 56 },
      { date: "2024-01-11", count: 43 },
      { date: "2024-01-12", count: 47 },
      { date: "2024-01-13", count: 39 },
      { date: "2024-01-14", count: 33 },
      { date: "2024-01-15", count: 58 }
    ]
  },
  
  performanceMetrics: {
    platformUptime: 99.7,
    averageLoadTime: 1.2,
    errorRate: 0.8,
    supportTickets: 23,
    userSatisfactionScore: 4.6
  }
};

// Helper functions for analytics
export const getAnalyticsSummary = () => {
  return {
    totalUsers: mockAnalytics.overview.totalUsers,
    monthlyGrowth: mockAnalytics.overview.platformGrowth,
    revenue: mockAnalytics.financialMetrics.monthlyRevenue,
    satisfaction: mockAnalytics.performanceMetrics.userSatisfactionScore
  };
};

export const getTopMetrics = () => {
  return {
    topSkills: mockAnalytics.jobMetrics.mostDemandedSkills.slice(0, 5),
    topEarners: mockAnalytics.financialMetrics.topEarningStudents.slice(0, 3),
    topRegions: mockAnalytics.geographicData.usersByRegion.slice(0, 3),
    recentTrends: {
      userGrowth: mockAnalytics.userMetrics.newUsersThisMonth,
      jobGrowth: mockAnalytics.jobMetrics.jobsPostedThisMonth,
      revenueGrowth: mockAnalytics.financialMetrics.revenueGrowth
    }
  };
};

export const getChartData = (chartType: 'users' | 'jobs' | 'revenue' | 'applications') => {
  switch (chartType) {
    case 'users':
      return mockAnalytics.timeSeriesData.userRegistrations;
    case 'jobs':
      return mockAnalytics.timeSeriesData.jobPostings;
    case 'revenue':
      return mockAnalytics.timeSeriesData.revenue;
    case 'applications':
      return mockAnalytics.timeSeriesData.applicationSubmissions;
    default:
      return [];
  }
};

// Industry benchmarks for comparison
export const industryBenchmarks = {
  averageJobCompletionRate: 82.5,
  averageUserRetentionRate: 71.2,
  averagePlatformUptime: 99.2,
  averageUserSatisfaction: 4.3,
  averageTimeToHire: 4.5
};

// Goals and targets
export const platformGoals = {
  monthlyRevenueTarget: 40000,
  userGrowthTarget: 200,
  jobCompletionTarget: 90,
  satisfactionTarget: 4.8,
  uptimeTarget: 99.9
};
