// Mock saved jobs data for demonstration purposes
// This can be used to pre-populate saved jobs in the application

export interface SavedJobData {
  jobId: number;
  savedDate: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  applied?: boolean;
  applicationDate?: string;
}

export const mockSavedJobs: SavedJobData[] = [
  {
    jobId: 1,
    savedDate: "2024-01-16",
    priority: "high",
    notes: "Great fit for my web development skills, good budget",
    applied: true,
    applicationDate: "2024-01-16"
  },
  {
    jobId: 16,
    savedDate: "2024-02-11",
    priority: "high",
    notes: "Perfect for UI/UX portfolio, targets my demographic",
    applied: true,
    applicationDate: "2024-02-11"
  },
  {
    jobId: 3,
    savedDate: "2024-01-20",
    priority: "medium",
    notes: "Interesting 3D modeling project, need to improve Blender skills first",
    applied: false
  },
  {
    jobId: 17,
    savedDate: "2024-02-12",
    priority: "high",
    notes: "Ongoing content writing work, good for steady income",
    applied: true,
    applicationDate: "2024-02-13"
  },
  {
    jobId: 7,
    savedDate: "2024-01-25",
    priority: "medium",
    notes: "Data science project, might be good for learning new skills",
    applied: false
  },
  {
    jobId: 21,
    savedDate: "2024-02-20",
    priority: "high",
    notes: "Brand design for restaurant chain, great portfolio piece",
    applied: true,
    applicationDate: "2024-02-21"
  },
  {
    jobId: 12,
    savedDate: "2024-02-05",
    priority: "low",
    notes: "Marketing campaign work, outside comfort zone but good experience",
    applied: false
  },
  {
    jobId: 19,
    savedDate: "2024-02-16",
    priority: "high",
    notes: "Educational video production, aligns with my passion for education",
    applied: true,
    applicationDate: "2024-02-17"
  },
  {
    jobId: 23,
    savedDate: "2024-02-24",
    priority: "medium",
    notes: "Social media for tech conference, good networking opportunity",
    applied: false
  },
  {
    jobId: 25,
    savedDate: "2024-02-28",
    priority: "medium",
    notes: "Podcast production, ongoing work potential",
    applied: false
  }
];

// Utility functions for working with saved jobs
export const getSavedJobIds = (): number[] => {
  return mockSavedJobs.map(job => job.jobId);
};

export const getAppliedJobIds = (): number[] => {
  return mockSavedJobs.filter(job => job.applied).map(job => job.jobId);
};

export const getHighPriorityJobs = (): SavedJobData[] => {
  return mockSavedJobs.filter(job => job.priority === 'high');
};

export const getPendingApplications = (): SavedJobData[] => {
  return mockSavedJobs.filter(job => !job.applied);
};

// Initialize saved jobs in localStorage (can be called on app start)
export const initializeSavedJobs = (): void => {
  try {
    const existing = localStorage.getItem('savedJobIds');
    if (!existing) {
      localStorage.setItem('savedJobIds', JSON.stringify(getSavedJobIds()));
    }
  } catch (error) {
    console.error('Failed to initialize saved jobs:', error);
  }
};

// Statistics about saved jobs
export const savedJobsStats = {
  total: mockSavedJobs.length,
  applied: getAppliedJobIds().length,
  pending: getPendingApplications().length,
  highPriority: getHighPriorityJobs().length,
  applicationRate: (getAppliedJobIds().length / mockSavedJobs.length) * 100
};
