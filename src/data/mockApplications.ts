export interface JobApplication {
  id: string | number;
  jobId: string | number;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  proposal: {
    coverLetter: string;
    proposedBudget: string;
    estimatedDuration: string;
    milestones?: string[];
  };
  attachments?: {
    portfolioUrl?: string;
    resumeUrl?: string;
    additionalFiles?: string[];
  };
  clientResponse?: {
    message: string;
    responseDate: string;
  };
  rating?: number;
  feedback?: string;
}

export interface Message {
  id: string | number;
  applicationId: string | number;
  senderId: string | number;
  senderName: string;
  senderType: 'student' | 'client';
  message: string;
  timestamp: string;
  attachments?: string[];
  isRead: boolean;
}

export const mockApplications: JobApplication[] = [
  {
    id: 1,
    jobId: 1,
    studentId: 1,
    studentName: "Alex Rivera",
    studentAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-01-16",
    status: "hired",
    proposal: {
      coverLetter: "I'm excited about this e-commerce project! With 3+ years of full-stack development experience, I can deliver a modern, responsive website with seamless payment integration. I specialize in React, Node.js, and have worked with Stripe and PayPal APIs. My approach includes thorough testing and mobile-first design.",
      proposedBudget: "$2,800",
      estimatedDuration: "5 weeks",
      milestones: [
        "Week 1-2: Design mockups and database setup",
        "Week 3-4: Frontend development and API integration",
        "Week 5: Payment system, testing, and deployment"
      ]
    },
    attachments: {
      portfolioUrl: "https://alexrivera.dev",
      resumeUrl: "https://alexrivera.dev/resume.pdf"
    },
    clientResponse: {
      message: "Great proposal! Your portfolio shows exactly what we're looking for. Let's discuss the project timeline.",
      responseDate: "2024-01-17"
    },
    rating: 5,
    feedback: "Excellent work! Alex delivered ahead of schedule and the quality exceeded our expectations."
  },
  {
    id: 2,
    jobId: 2,
    studentId: 2,
    studentName: "Jamie Patel",
    studentAvatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-01-19",
    status: "shortlisted",
    proposal: {
      coverLetter: "As a brand designer specializing in fitness and wellness brands, I understand the importance of creating visually appealing content that motivates and inspires. I'll create a cohesive social media package that reflects your studio's energy and attracts your target audience.",
      proposedBudget: "$1,000",
      estimatedDuration: "3 weeks",
      milestones: [
        "Week 1: Brand analysis and design concepts",
        "Week 2: Create Instagram posts and stories templates",
        "Week 3: Final designs and brand guidelines delivery"
      ]
    },
    attachments: {
      portfolioUrl: "https://jamiepatel.design",
      resumeUrl: "https://jamiepatel.design/resume.pdf"
    },
    clientResponse: {
      message: "Love your design style! Can we schedule a call to discuss the project details?",
      responseDate: "2024-01-20"
    }
  },
  {
    id: 3,
    jobId: 3,
    studentId: 3,
    studentName: "Morgan Lee",
    studentAvatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-01-21",
    status: "interviewed",
    proposal: {
      coverLetter: "3D visualization is my passion! I have extensive experience with Blender and have created product visualizations for tech companies. I can deliver photorealistic 3D models and animations that will make your products stand out in marketing materials.",
      proposedBudget: "$2,200",
      estimatedDuration: "4 weeks",
      milestones: [
        "Week 1: Product analysis and 3D modeling",
        "Week 2-3: Texturing, lighting, and animation",
        "Week 4: Final renders and animation sequences"
      ]
    },
    attachments: {
      portfolioUrl: "https://morganlee3d.com"
    },
    clientResponse: {
      message: "Impressive portfolio! We'd like to interview you next week. Are you available for a video call?",
      responseDate: "2024-01-22"
    }
  },
  {
    id: 4,
    jobId: 4,
    studentId: 4,
    studentName: "Samira Chen",
    studentAvatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-01-23",
    status: "pending",
    proposal: {
      coverLetter: "Indie game development is my specialty! I have experience with Unity, C#, and have shipped 2 indie games on Steam. I excel at creating engaging gameplay mechanics and can handle both programming and game design aspects of your 2D platformer.",
      proposedBudget: "$4,500",
      estimatedDuration: "9 weeks",
      milestones: [
        "Week 1-2: Game design document and prototype",
        "Week 3-5: Core mechanics and level design",
        "Week 6-8: Polish, testing, and optimization",
        "Week 9: Final build and deployment"
      ]
    },
    attachments: {
      portfolioUrl: "https://samirachen.games",
      resumeUrl: "https://samirachen.games/resume.pdf",
      additionalFiles: ["game_demo_video.mp4", "previous_games_showcase.pdf"]
    }
  },
  {
    id: 5,
    jobId: 5,
    studentId: 1,
    studentName: "Alex Rivera",
    studentAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-01-26",
    status: "reviewed",
    proposal: {
      coverLetter: "Mobile UI/UX design for healthcare apps requires a deep understanding of accessibility and user empathy. I have experience designing for health tech applications and understand the importance of creating intuitive, calming interfaces for sensitive topics like mental health.",
      proposedBudget: "$2,400",
      estimatedDuration: "6 weeks"
    },
    attachments: {
      portfolioUrl: "https://alexrivera.dev"
    },
    clientResponse: {
      message: "Thank you for your application. We're reviewing all proposals and will get back to you soon.",
      responseDate: "2024-01-27"
    }
  },
  {
    id: 6,
    jobId: 7,
    studentId: 5,
    studentName: "Ethan Smith",
    studentAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-01-29",
    status: "rejected",
    proposal: {
      coverLetter: "I'd love to help with your data analysis project. While my background is primarily in graphic design, I have some experience with Excel and basic data visualization.",
      proposedBudget: "$1,800",
      estimatedDuration: "8 weeks"
    },
    clientResponse: {
      message: "Thank you for your interest. We're looking for someone with more specialized data analysis experience for this project.",
      responseDate: "2024-01-30"
    }
  },
  {
    id: 7,
    jobId: 16,
    studentId: 1,
    studentName: "Alex Rivera",
    studentAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-02-11",
    status: "reviewed",
    proposal: {
      coverLetter: "I'm excited about this mobile app UI/UX project! As a student myself, I understand the target audience perfectly. I have experience designing intuitive financial interfaces and believe in creating accessible, user-friendly designs that make personal finance less intimidating for college students.",
      proposedBudget: "$1,500",
      estimatedDuration: "3.5 weeks",
      milestones: [
        "Week 1: User research and wireframes",
        "Week 2: High-fidelity designs and prototypes",
        "Week 3: User testing and iterations",
        "Week 3.5: Final designs and handoff"
      ]
    },
    attachments: {
      portfolioUrl: "https://alexrivera.design",
      additionalFiles: ["mobile_design_portfolio.pdf", "fintech_case_study.pdf"]
    }
  },
  {
    id: 8,
    jobId: 17,
    studentId: 3,
    studentName: "Morgan Taylor",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-02-13",
    status: "shortlisted",
    proposal: {
      coverLetter: "Content writing and SEO is my passion! I've been running my own blog for 2 years and have helped several local businesses improve their search rankings. I'm skilled at adapting my writing style for different industries and understand the importance of keyword research and on-page optimization.",
      proposedBudget: "$800",
      estimatedDuration: "Ongoing basis",
      milestones: [
        "First week: SEO audit and content strategy",
        "Ongoing: 4-6 articles per week",
        "Monthly: Performance analysis and optimization"
      ]
    },
    attachments: {
      portfolioUrl: "https://morgantaylorwrites.com",
      additionalFiles: ["writing_samples.pdf", "seo_case_studies.pdf"]
    },
    clientResponse: {
      message: "Your writing samples are impressive! We'd like to start with a trial period of 2 weeks. Can you begin next Monday?",
      responseDate: "2024-02-15"
    }
  },
  {
    id: 9,
    jobId: 19,
    studentId: 2,
    studentName: "Jordan Kim",
    studentAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-02-17",
    status: "interviewed",
    proposal: {
      coverLetter: "Educational video production is incredibly meaningful to me! I believe in the power of visual storytelling to make learning engaging and accessible. I have experience creating animated explainer videos and understand learning principles that make content stick.",
      proposedBudget: "$2,200",
      estimatedDuration: "4.5 weeks",
      milestones: [
        "Week 1: Script development and storyboarding",
        "Week 2-3: Video production and animation",
        "Week 4: Post-production and editing",
        "Week 4.5: Final review and delivery"
      ]
    },
    attachments: {
      portfolioUrl: "https://jordankimvideo.com",
      additionalFiles: ["educational_video_reel.mp4", "animation_portfolio.pdf"]
    },
    rating: 5,
    feedback: "Jordan's portfolio shows excellent understanding of educational content design. The interview went very well and they demonstrated strong technical skills."
  },
  {
    id: 10,
    jobId: 21,
    studentId: 5,
    studentName: "Taylor Rodriguez",
    studentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-02-21",
    status: "pending",
    proposal: {
      coverLetter: "Brand identity design is my specialty! I love helping businesses discover their visual voice and create cohesive brand experiences. I have experience working with food and hospitality brands and understand the importance of creating appetizing, memorable brand identities.",
      proposedBudget: "$2,500",
      estimatedDuration: "5 weeks",
      milestones: [
        "Week 1: Brand discovery and research",
        "Week 2: Logo concepts and iterations",
        "Week 3: Color palette and typography",
        "Week 4: Brand guidelines development",
        "Week 5: Final deliverables and brand manual"
      ]
    },
    attachments: {
      portfolioUrl: "https://taylorrodriguez.design",
      additionalFiles: ["brand_portfolio.pdf", "restaurant_case_study.pdf"]
    }
  },
  {
    id: 11,
    jobId: 23,
    studentId: 6,
    studentName: "Casey Williams",
    studentAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-02-25",
    status: "hired",
    proposal: {
      coverLetter: "I'm passionate about tech and social media! As a digital native, I understand how to create engaging content that resonates with tech audiences. I've managed social media for my university's computer science department and have experience with conference promotion.",
      proposedBudget: "$1,400",
      estimatedDuration: "10 weeks",
      milestones: [
        "Week 1-2: Strategy development and content calendar",
        "Week 3-8: Content creation and community management",
        "Week 9-10: Conference execution and post-event analysis"
      ]
    },
    attachments: {
      portfolioUrl: "https://caseywilliams.social",
      additionalFiles: ["social_media_case_studies.pdf", "content_examples.pdf"]
    },
    clientResponse: {
      message: "We're excited to work with you Casey! Your energy and understanding of our audience is exactly what we need. Let's schedule a kickoff meeting.",
      responseDate: "2024-02-26"
    },
    rating: 5,
    feedback: "Casey's proposal was comprehensive and showed deep understanding of our needs. Looking forward to working together!"
  },
  {
    id: 12,
    jobId: 24,
    studentId: 4,
    studentName: "Samira Chen",
    studentAvatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    appliedDate: "2024-02-27",
    status: "reviewed",
    proposal: {
      coverLetter: "Data visualization is where art meets science! I have experience creating interactive dashboards and believe healthcare data deserves beautiful, intuitive presentation. My background includes work with medical data and understanding of healthcare workflows.",
      proposedBudget: "$3,200",
      estimatedDuration: "6.5 weeks",
      milestones: [
        "Week 1: Data analysis and dashboard planning",
        "Week 2-4: Core dashboard development",
        "Week 5-6: Interactive features and optimization",
        "Week 6.5: Testing and deployment"
      ]
    },
    attachments: {
      portfolioUrl: "https://samirachen.dev",
      additionalFiles: ["dashboard_portfolio.pdf", "healthcare_viz_examples.pdf"]
    }
  }
];

export const mockMessages: Message[] = [
  {
    id: 1,
    applicationId: 1,
    senderId: 1,
    senderName: "Alex Rivera",
    senderType: "student",
    message: "Hi! Thank you for accepting my proposal. I'm excited to get started. When would be a good time for our kickoff call?",
    timestamp: "2024-01-18T10:30:00Z",
    isRead: true
  },
  {
    id: 2,
    applicationId: 1,
    senderId: "client_1",
    senderName: "Local Boutique",
    senderType: "client",
    message: "Great! How about tomorrow at 2 PM EST? I'll send you the brand guidelines and product catalog.",
    timestamp: "2024-01-18T14:15:00Z",
    isRead: true
  },
  {
    id: 3,
    applicationId: 1,
    senderId: 1,
    senderName: "Alex Rivera",
    senderType: "student",
    message: "Perfect! I'll be ready. Looking forward to reviewing the materials.",
    timestamp: "2024-01-18T14:45:00Z",
    isRead: true
  },
  {
    id: 4,
    applicationId: 2,
    senderId: "client_2",
    senderName: "Fitness Studio",
    senderType: "client",
    message: "Hi Jamie! Your portfolio is impressive. Can we schedule a 30-minute call this week to discuss the project scope?",
    timestamp: "2024-01-21T09:00:00Z",
    isRead: true
  },
  {
    id: 5,
    applicationId: 2,
    senderId: 2,
    senderName: "Jamie Patel",
    senderType: "student",
    message: "Absolutely! I'm available Wednesday or Friday afternoon. What works better for you?",
    timestamp: "2024-01-21T11:30:00Z",
    isRead: true
  },
  {
    id: 6,
    applicationId: 3,
    senderId: "client_3",
    senderName: "Tech Startup",
    senderType: "client",
    message: "Hi Morgan! We'd like to move forward with an interview. Are you available for a video call next Tuesday at 3 PM PST?",
    timestamp: "2024-01-23T16:20:00Z",
    isRead: false
  }
];

// Application statistics
export const applicationStats = {
  totalApplications: mockApplications.length,
  byStatus: {
    pending: mockApplications.filter(app => app.status === 'pending').length,
    reviewed: mockApplications.filter(app => app.status === 'reviewed').length,
    shortlisted: mockApplications.filter(app => app.status === 'shortlisted').length,
    interviewed: mockApplications.filter(app => app.status === 'interviewed').length,
    hired: mockApplications.filter(app => app.status === 'hired').length,
    rejected: mockApplications.filter(app => app.status === 'rejected').length
  },
  averageApplicationsPerJob: mockApplications.length / 7,
  hireRate: (mockApplications.filter(app => app.status === 'hired').length / mockApplications.length) * 100
};
