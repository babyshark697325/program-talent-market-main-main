export interface LearningResource {
  id: string | number;
  title: string;
  description: string;
  category: 'Workshop' | 'Tutorial' | 'Course' | 'Webinar' | 'Article' | 'Tool' | 'Template';
  type: 'Live' | 'Recorded' | 'Self-paced' | 'Interactive';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor?: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  skills: string[];
  thumbnailUrl: string;
  contentUrl?: string;
  materials?: {
    slides?: string;
    resources?: string[];
    assignments?: string[];
  };
  schedule?: {
    startDate: string;
    endDate?: string;
    meetingTime?: string;
    timezone: string;
    location?: string;
    meetingUrl?: string;
  };
  enrollment: {
    currentStudents: number;
    maxCapacity?: number;
    waitlist: number;
  };
  rating: number;
  reviews: number;
  price: number;
  tags: string[];
  prerequisites?: string[];
  learningObjectives: string[];
  createdDate: string;
  lastUpdated: string;
  isActive: boolean;
}

export const mockLearningResources: LearningResource[] = [
  {
    id: 1,
    title: "Resume Writing Workshop for Tech Professionals",
    description: "Learn how to craft compelling resumes that get noticed by tech recruiters. Cover formatting, keyword optimization, and showcasing technical projects effectively.",
    category: "Workshop",
    type: "Live",
    difficulty: "Beginner",
    duration: "2 hours",
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Career Coach & Former Tech Recruiter",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1a9?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "Former tech recruiter at Google and Microsoft with 8+ years of experience helping developers land dream jobs."
    },
    skills: ["Resume Writing", "Career Development", "Personal Branding"],
    thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&h=280&q=80",
    materials: {
      slides: "resume_workshop_slides.pdf",
      resources: ["resume_templates.zip", "action_verbs_list.pdf", "tech_resume_examples.pdf"],
      assignments: ["resume_review_checklist.pdf"]
    },
    schedule: {
      startDate: "2024-02-15",
      meetingTime: "7:00 PM",
      timezone: "EST",
      location: "Virtual",
      meetingUrl: "https://zoom.us/j/1234567890"
    },
    enrollment: {
      currentStudents: 28,
      maxCapacity: 30,
      waitlist: 5
    },
    rating: 4.8,
    reviews: 42,
    price: 29.99,
    tags: ["Career Development", "Job Search", "Professional Growth"],
    learningObjectives: [
      "Write compelling technical resumes",
      "Optimize resumes for ATS systems",
      "Showcase projects effectively",
      "Tailor resumes for specific roles"
    ],
    createdDate: "2024-01-10",
    lastUpdated: "2024-02-01",
    isActive: true
  },
  {
    id: 2,
    title: "Introduction to Freelancing: Building Your Client Base",
    description: "Complete guide to starting your freelancing career, from setting rates to finding clients and managing projects professionally.",
    category: "Course",
    type: "Self-paced",
    difficulty: "Beginner",
    duration: "4 weeks",
    instructor: {
      name: "Marcus Thompson",
      title: "Successful Freelancer & Business Mentor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "6-figure freelancer with 10+ years of experience helping creatives build sustainable freelance businesses."
    },
    skills: ["Freelancing", "Business Development", "Client Management", "Pricing Strategy"],
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&h=280&q=80",
    contentUrl: "https://courses.myvillage.com/freelancing-basics",
    materials: {
      resources: ["freelance_contract_templates.zip", "pricing_calculator.xlsx", "client_onboarding_checklist.pdf"],
      assignments: ["business_plan_template.pdf", "portfolio_review_exercise.pdf"]
    },
    enrollment: {
      currentStudents: 156,
      waitlist: 0
    },
    rating: 4.9,
    reviews: 89,
    price: 79.99,
    tags: ["Freelancing", "Business", "Entrepreneurship", "Income Generation"],
    prerequisites: ["Basic professional experience in your field"],
    learningObjectives: [
      "Set competitive freelance rates",
      "Find and onboard quality clients",
      "Manage projects professionally",
      "Build a sustainable freelance business"
    ],
    createdDate: "2023-11-15",
    lastUpdated: "2024-01-20",
    isActive: true
  },
  {
    id: 3,
    title: "Portfolio Website Design Masterclass",
    description: "Learn to design and build stunning portfolio websites that showcase your work and attract clients. Covers design principles, development, and optimization.",
    category: "Tutorial",
    type: "Recorded",
    difficulty: "Intermediate",
    duration: "6 hours",
    instructor: {
      name: "Emily Rodriguez",
      title: "UX Designer & Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "Award-winning designer with expertise in creating conversion-focused portfolio websites for creative professionals."
    },
    skills: ["Web Design", "Portfolio Development", "Personal Branding", "HTML/CSS"],
    thumbnailUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=400&h=280&q=80",
    contentUrl: "https://tutorials.myvillage.com/portfolio-design",
    materials: {
      resources: ["design_templates.figma", "code_examples.zip", "optimization_checklist.pdf"],
      assignments: ["portfolio_wireframe_exercise.pdf", "final_portfolio_project.pdf"]
    },
    enrollment: {
      currentStudents: 203,
      waitlist: 0
    },
    rating: 4.7,
    reviews: 127,
    price: 49.99,
    tags: ["Web Design", "Portfolio", "Personal Branding", "Career Development"],
    prerequisites: ["Basic HTML/CSS knowledge", "Design software familiarity"],
    learningObjectives: [
      "Design effective portfolio layouts",
      "Optimize for user experience",
      "Implement responsive design",
      "Drive conversions with portfolio"
    ],
    createdDate: "2023-12-05",
    lastUpdated: "2024-01-15",
    isActive: true
  },
  {
    id: 4,
    title: "Networking for Introverts: Building Professional Relationships",
    description: "Practical strategies for introverted professionals to build meaningful networks and advance their careers without draining their energy.",
    category: "Webinar",
    type: "Live",
    difficulty: "Beginner",
    duration: "90 minutes",
    instructor: {
      name: "Dr. Angela Kim",
      title: "Career Psychology Expert",
      avatar: "https://images.unsplash.com/photo-1559833109-b5e3b8b1a3d4?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "Ph.D. in Psychology specializing in introversion and workplace dynamics. Author of 'The Introvert's Guide to Professional Success.'"
    },
    skills: ["Networking", "Communication", "Professional Development", "Personal Growth"],
    thumbnailUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&h=280&q=80",
    materials: {
      slides: "networking_strategies_slides.pdf",
      resources: ["conversation_starters.pdf", "follow_up_templates.docx"],
      assignments: ["networking_action_plan.pdf"]
    },
    schedule: {
      startDate: "2024-02-20",
      meetingTime: "12:00 PM",
      timezone: "PST",
      location: "Virtual",
      meetingUrl: "https://zoom.us/j/0987654321"
    },
    enrollment: {
      currentStudents: 85,
      maxCapacity: 100,
      waitlist: 12
    },
    rating: 4.6,
    reviews: 34,
    price: 19.99,
    tags: ["Networking", "Professional Development", "Communication", "Introversion"],
    learningObjectives: [
      "Understand networking for introverts",
      "Develop authentic networking strategies",
      "Practice low-energy networking techniques",
      "Build lasting professional relationships"
    ],
    createdDate: "2024-01-25",
    lastUpdated: "2024-02-01",
    isActive: true
  },
  {
    id: 5,
    title: "Time Management for Creative Professionals",
    description: "Master time management techniques specifically designed for creative work. Learn to balance creativity with productivity and meet deadlines consistently.",
    category: "Workshop",
    type: "Interactive",
    difficulty: "Intermediate",
    duration: "3 hours",
    instructor: {
      name: "James Cooper",
      title: "Productivity Coach & Creative Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "Former creative director turned productivity coach, helping creative professionals optimize their workflow and achieve work-life balance."
    },
    skills: ["Time Management", "Productivity", "Workflow Optimization", "Creative Process"],
    thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&h=280&q=80",
    materials: {
      slides: "time_management_creative_slides.pdf",
      resources: ["productivity_templates.zip", "time_tracking_tools.pdf", "creative_blocks_guide.pdf"],
      assignments: ["weekly_schedule_template.pdf", "productivity_assessment.pdf"]
    },
    schedule: {
      startDate: "2024-02-25",
      meetingTime: "2:00 PM",
      timezone: "EST",
      location: "Virtual",
      meetingUrl: "https://zoom.us/j/1122334455"
    },
    enrollment: {
      currentStudents: 45,
      maxCapacity: 50,
      waitlist: 8
    },
    rating: 4.8,
    reviews: 56,
    price: 39.99,
    tags: ["Time Management", "Productivity", "Creative Work", "Work-Life Balance"],
    prerequisites: ["Experience in creative field"],
    learningObjectives: [
      "Implement creative-friendly time management",
      "Balance creativity with deadlines",
      "Optimize creative workflow",
      "Prevent creative burnout"
    ],
    createdDate: "2024-01-12",
    lastUpdated: "2024-01-28",
    isActive: true
  },
  {
    id: 6,
    title: "Client Communication Masterclass",
    description: "Learn professional communication strategies that build trust, manage expectations, and turn one-time clients into repeat customers.",
    category: "Course",
    type: "Self-paced",
    difficulty: "Intermediate",
    duration: "3 weeks",
    instructor: {
      name: "Lisa Chen",
      title: "Business Communication Expert",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "Former corporate communications manager with 12+ years of experience training professionals in effective client communication."
    },
    skills: ["Client Communication", "Professional Writing", "Relationship Management", "Conflict Resolution"],
    thumbnailUrl: "https://images.unsplash.com/photo-1553028826-f4804151e06b?auto=format&fit=crop&w=400&h=280&q=80",
    contentUrl: "https://courses.myvillage.com/client-communication",
    materials: {
      resources: ["email_templates.zip", "communication_scripts.pdf", "difficult_conversation_guide.pdf"],
      assignments: ["communication_practice_scenarios.pdf", "client_feedback_analysis.pdf"]
    },
    enrollment: {
      currentStudents: 178,
      waitlist: 0
    },
    rating: 4.9,
    reviews: 95,
    price: 59.99,
    tags: ["Communication", "Client Relations", "Business Skills", "Professional Development"],
    prerequisites: ["Experience working with clients"],
    learningObjectives: [
      "Master professional communication",
      "Handle difficult conversations",
      "Set clear expectations",
      "Build long-term client relationships"
    ],
    createdDate: "2023-10-20",
    lastUpdated: "2024-01-10",
    isActive: true
  },
  {
    id: 7,
    title: "Pricing Your Services: Value-Based Strategies",
    description: "Move beyond hourly pricing and learn to price your services based on value delivered. Increase your income while providing better client outcomes.",
    category: "Tutorial",
    type: "Recorded",
    difficulty: "Advanced",
    duration: "4 hours",
    instructor: {
      name: "Robert Martinez",
      title: "Business Strategy Consultant",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "Business strategy consultant who has helped hundreds of freelancers and agencies implement value-based pricing models."
    },
    skills: ["Pricing Strategy", "Value Proposition", "Business Development", "Sales"],
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&h=280&q=80",
    contentUrl: "https://tutorials.myvillage.com/value-based-pricing",
    materials: {
      resources: ["pricing_calculator.xlsx", "value_discovery_templates.pdf", "proposal_templates.zip"],
      assignments: ["pricing_audit_worksheet.pdf", "value_proposition_exercise.pdf"]
    },
    enrollment: {
      currentStudents: 134,
      waitlist: 0
    },
    rating: 4.7,
    reviews: 78,
    price: 69.99,
    tags: ["Pricing", "Business Strategy", "Revenue Growth", "Value Creation"],
    prerequisites: ["Established freelance/consulting practice", "Basic business knowledge"],
    learningObjectives: [
      "Understand value-based pricing",
      "Calculate value for clients",
      "Transition from hourly pricing",
      "Increase profit margins"
    ],
    createdDate: "2023-11-30",
    lastUpdated: "2024-01-22",
    isActive: true
  },
  {
    id: 8,
    title: "Building Your Personal Brand on LinkedIn",
    description: "Optimize your LinkedIn profile and create content that establishes you as a thought leader in your field. Attract opportunities through strategic networking.",
    category: "Workshop",
    type: "Live",
    difficulty: "Beginner",
    duration: "2.5 hours",
    instructor: {
      name: "Michelle Adams",
      title: "LinkedIn Marketing Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
      bio: "LinkedIn marketing specialist with 500K+ followers who has helped 1000+ professionals build their personal brands on LinkedIn."
    },
    skills: ["Personal Branding", "LinkedIn Marketing", "Content Creation", "Professional Networking"],
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&h=280&q=80",
    materials: {
      slides: "linkedin_branding_slides.pdf",
      resources: ["profile_optimization_checklist.pdf", "content_calendar_template.xlsx", "post_templates.docx"],
      assignments: ["profile_makeover_exercise.pdf", "content_strategy_plan.pdf"]
    },
    schedule: {
      startDate: "2024-03-05",
      meetingTime: "6:00 PM",
      timezone: "EST",
      location: "Virtual",
      meetingUrl: "https://zoom.us/j/5566778899"
    },
    enrollment: {
      currentStudents: 67,
      maxCapacity: 75,
      waitlist: 15
    },
    rating: 4.8,
    reviews: 91,
    price: 34.99,
    tags: ["Personal Branding", "LinkedIn", "Professional Networking", "Content Marketing"],
    learningObjectives: [
      "Optimize LinkedIn profile for visibility",
      "Create engaging professional content",
      "Build strategic professional network",
      "Establish thought leadership"
    ],
    createdDate: "2024-02-01",
    lastUpdated: "2024-02-10",
    isActive: true
  }
];

// Learning resource statistics
export const learningResourceStats = {
  totalResources: mockLearningResources.length,
  totalEnrolled: mockLearningResources.reduce((sum, resource) => sum + resource.enrollment.currentStudents, 0),
  byCategory: {
    workshop: mockLearningResources.filter(r => r.category === 'Workshop').length,
    course: mockLearningResources.filter(r => r.category === 'Course').length,
    tutorial: mockLearningResources.filter(r => r.category === 'Tutorial').length,
    webinar: mockLearningResources.filter(r => r.category === 'Webinar').length
  },
  byDifficulty: {
    beginner: mockLearningResources.filter(r => r.difficulty === 'Beginner').length,
    intermediate: mockLearningResources.filter(r => r.difficulty === 'Intermediate').length,
    advanced: mockLearningResources.filter(r => r.difficulty === 'Advanced').length
  },
  averageRating: Number((mockLearningResources.reduce((sum, resource) => sum + resource.rating, 0) / mockLearningResources.length).toFixed(1)),
  totalRevenue: mockLearningResources.reduce((sum, resource) => sum + (resource.price * resource.enrollment.currentStudents), 0)
};
