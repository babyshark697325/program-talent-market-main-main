export interface CompanyProfile {
  id: string | number;
  name: string;
  industry: string;
  size: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  location: string;
  description: string;
  website?: string;
  logoUrl?: string;
  founded?: number;
  rating: number;
  totalReviews: number;
  totalJobsPosted: number;
  totalHires: number;
  paymentVerified: boolean;
  responseTime: string;
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  preferredSkills: string[];
  averageBudget: string;
  completedProjects: number;
  memberSince: string;
}

export const mockCompanies: CompanyProfile[] = [
  {
    id: 1,
    name: "Local Boutique",
    industry: "Retail & Fashion",
    size: "Small",
    location: "Portland, OR",
    description: "Trendy boutique specializing in sustainable fashion and unique accessories for the modern consumer.",
    website: "https://localboutique.com",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2019,
    rating: 4.8,
    totalReviews: 23,
    totalJobsPosted: 12,
    totalHires: 8,
    paymentVerified: true,
    responseTime: "Usually responds within 4 hours",
    contactInfo: {
      email: "contact@localboutique.com",
      phone: "(503) 555-0123",
      address: "123 Main St, Portland, OR 97205"
    },
    preferredSkills: ["E-commerce", "Web Development", "Photography", "Social Media"],
    averageBudget: "$2,000 - $5,000",
    completedProjects: 8,
    memberSince: "2023-03-15"
  },
  {
    id: 2,
    name: "Fitness Studio",
    industry: "Health & Wellness",
    size: "Small",
    location: "Austin, TX",
    description: "Modern fitness studio offering personalized training and wellness programs for all fitness levels.",
    website: "https://fitnessstudio.com",
    logoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2020,
    rating: 4.6,
    totalReviews: 18,
    totalJobsPosted: 15,
    totalHires: 12,
    paymentVerified: true,
    responseTime: "Usually responds within 2 hours",
    contactInfo: {
      email: "marketing@fitnessstudio.com",
      phone: "(512) 555-0456",
      address: "456 Wellness Way, Austin, TX 78701"
    },
    preferredSkills: ["Graphic Design", "Video Editing", "Social Media Marketing", "Photography"],
    averageBudget: "$800 - $2,000",
    completedProjects: 12,
    memberSince: "2023-01-20"
  },
  {
    id: 3,
    name: "Tech Startup",
    industry: "Technology",
    size: "Startup",
    location: "San Francisco, CA",
    description: "Innovative tech startup developing cutting-edge solutions for the modern workplace.",
    website: "https://techstartup.com",
    logoUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2022,
    rating: 4.9,
    totalReviews: 31,
    totalJobsPosted: 28,
    totalHires: 22,
    paymentVerified: true,
    responseTime: "Usually responds within 1 hour",
    contactInfo: {
      email: "creative@techstartup.com",
      phone: "(415) 555-0789",
      address: "789 Innovation Ave, San Francisco, CA 94105"
    },
    preferredSkills: ["3D Modeling", "UI/UX Design", "React", "Python", "Machine Learning"],
    averageBudget: "$3,000 - $10,000",
    completedProjects: 22,
    memberSince: "2023-05-10"
  },
  {
    id: 4,
    name: "Indie Studio",
    industry: "Gaming & Entertainment",
    size: "Small",
    location: "Montreal, Canada",
    description: "Independent game development studio creating innovative and engaging gaming experiences.",
    website: "https://indiestudio.com",
    logoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2018,
    rating: 4.7,
    totalReviews: 42,
    totalJobsPosted: 35,
    totalHires: 28,
    paymentVerified: true,
    responseTime: "Usually responds within 3 hours",
    contactInfo: {
      email: "dev@indiestudio.com",
      phone: "+1 (514) 555-0321",
      address: "321 Game St, Montreal, QC H3A 0G4"
    },
    preferredSkills: ["Game Design", "Unity", "C#", "2D Art", "Sound Design"],
    averageBudget: "$2,500 - $8,000",
    completedProjects: 28,
    memberSince: "2022-11-08"
  },
  {
    id: 5,
    name: "HealthTech Inc",
    industry: "Healthcare Technology",
    size: "Medium",
    location: "Boston, MA",
    description: "Healthcare technology company focused on improving patient outcomes through innovative digital solutions.",
    website: "https://healthtech.com",
    logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2017,
    rating: 4.8,
    totalReviews: 67,
    totalJobsPosted: 52,
    totalHires: 43,
    paymentVerified: true,
    responseTime: "Usually responds within 2 hours",
    contactInfo: {
      email: "design@healthtech.com",
      phone: "(617) 555-0654",
      address: "654 Health Plaza, Boston, MA 02115"
    },
    preferredSkills: ["UI/UX Design", "Healthcare Compliance", "Mobile Design", "React Native"],
    averageBudget: "$4,000 - $12,000",
    completedProjects: 43,
    memberSince: "2023-02-14"
  },
  {
    id: 6,
    name: "Green Energy Solutions",
    industry: "Renewable Energy",
    size: "Large",
    location: "Denver, CO",
    description: "Leading provider of renewable energy solutions and sustainability consulting services.",
    website: "https://greenenergy.com",
    logoUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2015,
    rating: 4.9,
    totalReviews: 89,
    totalJobsPosted: 73,
    totalHires: 61,
    paymentVerified: true,
    responseTime: "Usually responds within 1 hour",
    contactInfo: {
      email: "analytics@greenenergy.com",
      phone: "(303) 555-0987",
      address: "987 Solar Way, Denver, CO 80202"
    },
    preferredSkills: ["Data Analysis", "Python", "Tableau", "Environmental Science", "Statistics"],
    averageBudget: "$3,500 - $15,000",
    completedProjects: 61,
    memberSince: "2022-08-22"
  },
  {
    id: 7,
    name: "FinTech Startup",
    industry: "Financial Technology",
    size: "Startup",
    location: "New York, NY",
    description: "Revolutionary fintech startup disrupting traditional banking with innovative financial solutions.",
    website: "https://fintechstartup.com",
    logoUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 2023,
    rating: 4.6,
    totalReviews: 15,
    totalJobsPosted: 18,
    totalHires: 12,
    paymentVerified: true,
    responseTime: "Usually responds within 30 minutes",
    contactInfo: {
      email: "dev@fintechstartup.com",
      phone: "(212) 555-0147",
      address: "147 Wall St, New York, NY 10005"
    },
    preferredSkills: ["Backend Development", "Node.js", "Financial APIs", "Security", "Blockchain"],
    averageBudget: "$5,000 - $20,000",
    completedProjects: 12,
    memberSince: "2023-09-05"
  },
  {
    id: 8,
    name: "Regional Hospital Network",
    industry: "Healthcare",
    size: "Large",
    location: "Atlanta, GA",
    description: "Comprehensive healthcare network serving the southeastern region with cutting-edge medical facilities.",
    website: "https://regionalhospital.com",
    logoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=200&h=200&q=80",
    founded: 1985,
    rating: 4.5,
    totalReviews: 124,
    totalJobsPosted: 95,
    totalHires: 78,
    paymentVerified: true,
    responseTime: "Usually responds within 6 hours",
    contactInfo: {
      email: "security@regionalhospital.com",
      phone: "(404) 555-0258",
      address: "258 Medical Center Dr, Atlanta, GA 30309"
    },
    preferredSkills: ["Cybersecurity", "Healthcare Compliance", "HIPAA", "Network Security", "Risk Assessment"],
    averageBudget: "$10,000 - $50,000",
    completedProjects: 78,
    memberSince: "2022-04-12"
  }
];

// Company statistics for analytics
export const companyStats = {
  totalCompanies: mockCompanies.length,
  averageRating: 4.7,
  totalJobsPosted: mockCompanies.reduce((sum, company) => sum + company.totalJobsPosted, 0),
  totalHires: mockCompanies.reduce((sum, company) => sum + company.totalHires, 0),
  industriesRepresented: [...new Set(mockCompanies.map(company => company.industry))].length,
  verifiedCompanies: mockCompanies.filter(company => company.paymentVerified).length
};
