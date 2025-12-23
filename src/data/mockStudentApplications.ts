// Student Applications - Applications from the student's perspective
// This represents jobs a student has applied to and their status

export interface StudentApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'withdrawn';
  proposedBudget: string;
  estimatedDuration: string;
  lastUpdated: string;
  clientResponse?: {
    message: string;
    responseDate: string;
  };
  interviewDate?: string;
  projectStartDate?: string;
  feedback?: string;
  rating?: number;
}

export const mockStudentApplications: StudentApplication[] = [
  {
    id: 1,
    jobId: 1,
    jobTitle: "Build E-commerce Website",
    company: "Local Boutique",
    appliedDate: "2024-01-16",
    status: "hired",
    proposedBudget: "$3,000",
    estimatedDuration: "5 weeks",
    lastUpdated: "2024-01-22",
    clientResponse: {
      message: "We love your proposal and portfolio! When can you start?",
      responseDate: "2024-01-18"
    },
    interviewDate: "2024-01-19",
    projectStartDate: "2024-01-23",
    rating: 5,
    feedback: "Excellent communication and technical skills. Delivered ahead of schedule with great attention to detail."
  },
  {
    id: 2,
    jobId: 16,
    jobTitle: "Mobile App UI/UX Design",
    company: "FinTech Startup",
    appliedDate: "2024-02-11",
    status: "reviewed",
    proposedBudget: "$1,500",
    estimatedDuration: "3.5 weeks",
    lastUpdated: "2024-02-13",
    clientResponse: {
      message: "Thank you for your application. We're reviewing all proposals and will get back to you by Friday.",
      responseDate: "2024-02-12"
    }
  },
  {
    id: 3,
    jobId: 17,
    jobTitle: "Content Writing & SEO",
    company: "Digital Marketing Agency",
    appliedDate: "2024-02-13",
    status: "shortlisted",
    proposedBudget: "$800",
    estimatedDuration: "Ongoing",
    lastUpdated: "2024-02-15",
    clientResponse: {
      message: "Your writing samples are impressive! We'd like to start with a trial period of 2 weeks. Can you begin next Monday?",
      responseDate: "2024-02-15"
    }
  },
  {
    id: 4,
    jobId: 19,
    jobTitle: "Video Production & Editing",
    company: "Educational Non-Profit",
    appliedDate: "2024-02-17",
    status: "interviewed",
    proposedBudget: "$2,200",
    estimatedDuration: "4.5 weeks",
    lastUpdated: "2024-02-20",
    clientResponse: {
      message: "Great interview! We'll make a decision by end of this week.",
      responseDate: "2024-02-19"
    },
    interviewDate: "2024-02-19"
  },
  {
    id: 5,
    jobId: 21,
    jobTitle: "Brand Identity Package",
    company: "Local Restaurant Chain",
    appliedDate: "2024-02-21",
    status: "pending",
    proposedBudget: "$2,500",
    estimatedDuration: "5 weeks",
    lastUpdated: "2024-02-21"
  },
  {
    id: 6,
    jobId: 23,
    jobTitle: "Social Media Strategy",
    company: "Tech Conference",
    appliedDate: "2024-02-25",
    status: "hired",
    proposedBudget: "$1,400",
    estimatedDuration: "10 weeks",
    lastUpdated: "2024-02-26",
    clientResponse: {
      message: "We're excited to work with you! Your energy and understanding of our audience is exactly what we need.",
      responseDate: "2024-02-26"
    },
    projectStartDate: "2024-03-01",
    rating: 5,
    feedback: "Casey's proposal was comprehensive and showed deep understanding of our needs."
  },
  {
    id: 7,
    jobId: 24,
    jobTitle: "Data Visualization Dashboard",
    company: "Healthcare Analytics",
    appliedDate: "2024-02-27",
    status: "reviewed",
    proposedBudget: "$3,200",
    estimatedDuration: "6.5 weeks",
    lastUpdated: "2024-02-28"
  },
  {
    id: 8,
    jobId: 5,
    jobTitle: "Indie Game Development",
    company: "Game Studio",
    appliedDate: "2024-01-23",
    status: "rejected",
    proposedBudget: "$4,500",
    estimatedDuration: "9 weeks",
    lastUpdated: "2024-01-28",
    clientResponse: {
      message: "Thank you for your application. We decided to go with a developer who has more experience with our specific game engine.",
      responseDate: "2024-01-28"
    },
    feedback: "Strong portfolio but looking for more Unity experience"
  },
  {
    id: 9,
    jobId: 8,
    jobTitle: "Marketing Campaign Design",
    company: "Non-Profit Organization",
    appliedDate: "2024-01-27",
    status: "withdrawn",
    proposedBudget: "$1,800",
    estimatedDuration: "5 weeks",
    lastUpdated: "2024-01-29"
  },
  {
    id: 10,
    jobId: 12,
    jobTitle: "E-learning Platform Development",
    company: "Educational Technology",
    appliedDate: "2024-02-02",
    status: "pending",
    proposedBudget: "$5,500",
    estimatedDuration: "10 weeks",
    lastUpdated: "2024-02-02"
  },
  {
    id: 11,
    jobId: 25,
    jobTitle: "Podcast Production",
    company: "Business Podcast Network",
    appliedDate: "2024-03-01",
    status: "reviewed",
    proposedBudget: "$1,000",
    estimatedDuration: "Ongoing",
    lastUpdated: "2024-03-02",
    clientResponse: {
      message: "We're impressed with your audio samples. Can you handle a weekly production schedule?",
      responseDate: "2024-03-02"
    }
  },
  {
    id: 12,
    jobId: 20,
    jobTitle: "AI Chatbot Development",
    company: "Customer Service Solutions",
    appliedDate: "2024-02-19",
    status: "interviewed",
    proposedBudget: "$3,800",
    estimatedDuration: "7 weeks",
    lastUpdated: "2024-02-22",
    clientResponse: {
      message: "Technical interview went well. We'll be in touch about next steps.",
      responseDate: "2024-02-21"
    },
    interviewDate: "2024-02-21"
  }
];

// Utility functions for student applications
export const getApplicationsByStatus = (status: StudentApplication['status']): StudentApplication[] => {
  return mockStudentApplications.filter(app => app.status === status);
};

export const getActiveApplications = (): StudentApplication[] => {
  return mockStudentApplications.filter(app =>
    ['pending', 'reviewed', 'shortlisted', 'interviewed'].includes(app.status)
  );
};

export const getCompletedApplications = (): StudentApplication[] => {
  return mockStudentApplications.filter(app =>
    ['hired', 'rejected', 'withdrawn'].includes(app.status)
  );
};

export const getSuccessfulApplications = (): StudentApplication[] => {
  return mockStudentApplications.filter(app => app.status === 'hired');
};

export const getRecentApplications = (days: number = 7): StudentApplication[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return mockStudentApplications.filter(app =>
    new Date(app.appliedDate) >= cutoffDate
  );
};

// Statistics for student applications
export const studentApplicationStats = {
  total: mockStudentApplications.length,
  pending: getApplicationsByStatus('pending').length,
  reviewed: getApplicationsByStatus('reviewed').length,
  shortlisted: getApplicationsByStatus('shortlisted').length,
  interviewed: getApplicationsByStatus('interviewed').length,
  hired: getApplicationsByStatus('hired').length,
  rejected: getApplicationsByStatus('rejected').length,
  withdrawn: getApplicationsByStatus('withdrawn').length,
  active: getActiveApplications().length,
  successRate: (getSuccessfulApplications().length / mockStudentApplications.length) * 100,
  averageProposedBudget: mockStudentApplications.reduce((sum, app) => {
    const budget = parseInt(app.proposedBudget.replace(/[$,]/g, ''));
    return sum + budget;
  }, 0) / mockStudentApplications.length,
  totalEarnings: getSuccessfulApplications().reduce((sum, app) => {
    const budget = parseInt(app.proposedBudget.replace(/[$,]/g, ''));
    return sum + budget;
  }, 0)
};