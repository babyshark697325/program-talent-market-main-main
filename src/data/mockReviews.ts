export interface Review {
  id: string | number;
  reviewerId: string | number;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerType: 'student' | 'client';
  targetId: string | number;
  targetType: 'student' | 'client' | 'learning_resource';
  rating: number;
  title: string;
  comment: string;
  date: string;
  projectTitle?: string;
  projectId?: string | number;
  helpfulCount: number;
  response?: {
    text: string;
    date: string;
  };
  verified: boolean;
  tags?: string[];
}

export interface Rating {
  overall: number;
  communication: number;
  quality?: number;
  timeline: number;
  value?: number;
  professionalism?: number;
}

export const mockReviews: Review[] = [
  // Reviews for students
  {
    id: 1,
    reviewerId: "client_1",
    reviewerName: "Local Boutique",
    reviewerAvatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&h=200&q=80",
    reviewerType: "client",
    targetId: 1,
    targetType: "student",
    rating: 5,
    title: "Exceptional E-commerce Development",
    comment: "Alex delivered an outstanding e-commerce website that exceeded our expectations. The site is fast, user-friendly, and the payment integration works flawlessly. Alex was professional throughout the project, communicated regularly, and delivered ahead of schedule. Highly recommended!",
    date: "2024-01-28",
    projectTitle: "Build E-commerce Website",
    projectId: 1,
    helpfulCount: 12,
    response: {
      text: "Thank you for the fantastic review! It was a pleasure working with you and bringing your vision to life. Looking forward to future collaborations!",
      date: "2024-01-29"
    },
    verified: true,
    tags: ["E-commerce", "Professional", "On-time", "Excellent Communication"]
  },
  {
    id: 2,
    reviewerId: "client_2",
    reviewerName: "Fitness Studio",
    reviewerAvatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=200&h=200&q=80",
    reviewerType: "client",
    targetId: 2,
    targetType: "student",
    rating: 5,
    title: "Creative and Professional Design Work",
    comment: "Jamie created amazing social media graphics that perfectly captured our brand aesthetic. The designs are vibrant, engaging, and have significantly increased our social media engagement. Great attention to detail and very responsive to feedback.",
    date: "2024-01-25",
    projectTitle: "Social Media Graphics Package",
    projectId: 2,
    helpfulCount: 8,
    response: {
      text: "So happy to hear the designs are working well for your social media! It was fun working on such a dynamic fitness brand.",
      date: "2024-01-26"
    },
    verified: true,
    tags: ["Creative", "Brand-focused", "High Quality", "Responsive"]
  },
  {
    id: 3,
    reviewerId: "client_5",
    reviewerName: "HealthTech Inc",
    reviewerAvatar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=200&h=200&q=80",
    reviewerType: "client",
    targetId: 3,
    targetType: "student",
    rating: 5,
    title: "Solid 3D Visualization Work",
    comment: "Morgan delivered quality 3D product visualizations that look professional and detailed. The models were accurate and the lighting/texturing was well done. Could have been a bit faster with revisions, but overall satisfied with the final result.",
    date: "2024-02-05",
    projectTitle: "3D Product Visualization",
    projectId: 3,
    helpfulCount: 5,
    verified: true,
    tags: ["3D Modeling", "Professional Quality", "Detailed Work"]
  },
  {
    id: 4,
    reviewerId: "client_7",
    reviewerName: "Marketing Agency Pro",
    reviewerAvatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=200&h=200&q=80",
    reviewerType: "client",
    targetId: 4,
    targetType: "student",
    rating: 5,
    title: "Outstanding Game Development Skills",
    comment: "Samira built an incredible 2D platformer prototype that impressed our entire team. The gameplay mechanics are smooth, the level design is creative, and the code is clean and well-documented. Excellent communication and project management skills.",
    date: "2024-02-08",
    projectTitle: "Indie Game Development",
    projectId: 4,
    helpfulCount: 15,
    response: {
      text: "Thank you! Game development is my passion, and I loved bringing your vision to life. The team was amazing to work with!",
      date: "2024-02-09"
    },
    verified: true,
    tags: ["Game Development", "Creative", "Technical Excellence", "Team Player"]
  },
  {
    id: 5,
    reviewerId: "client_8",
    reviewerName: "Design Co",
    reviewerAvatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?auto=format&fit=crop&w=200&h=200&q=80",
    reviewerType: "client",
    targetId: 5,
    targetType: "student",
    rating: 5,
    title: "Quality Graphic Design Services",
    comment: "Ethan provided solid graphic design work for our marketing materials. The designs were professional and aligned with our brand guidelines. Good communication throughout the project. Would work with again.",
    date: "2024-01-30",
    projectTitle: "Marketing Materials Design",
    projectId: "custom_1",
    helpfulCount: 6,
    verified: true,
    tags: ["Graphic Design", "Professional", "Brand-aligned"]
  },

  // Reviews for clients
  {
    id: 6,
    reviewerId: 1,
    reviewerName: "Alex Rivera",
    reviewerAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: "client_1",
    targetType: "client",
    rating: 5,
    title: "Excellent Client - Clear Communication",
    comment: "Local Boutique was fantastic to work with! They provided clear requirements, prompt feedback, and were very professional throughout the project. Payment was made on time as agreed. Would definitely work with them again.",
    date: "2024-01-28",
    projectTitle: "Build E-commerce Website",
    projectId: 1,
    helpfulCount: 9,
    verified: true,
    tags: ["Clear Requirements", "Prompt Payment", "Professional", "Good Communication"]
  },
  {
    id: 7,
    reviewerId: 2,
    reviewerName: "Jamie Patel",
    reviewerAvatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: "client_2",
    targetType: "client",
    rating: 5,
    title: "Great Client with Creative Vision",
    comment: "Fitness Studio knew exactly what they wanted and gave me creative freedom to bring their vision to life. They were responsive, appreciative of the work, and paid promptly. Really enjoyed this collaboration!",
    date: "2024-01-25",
    projectTitle: "Social Media Graphics Package",
    projectId: 2,
    helpfulCount: 7,
    verified: true,
    tags: ["Creative Freedom", "Responsive", "Appreciative", "Prompt Payment"]
  },
  {
    id: 8,
    reviewerId: 4,
    reviewerName: "Samira Chen",
    reviewerAvatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: "client_7",
    targetType: "client",
    rating: 5,
    title: "Dream Client for Game Development",
    comment: "Marketing Agency Pro understood the gaming industry and gave valuable input throughout development. They were collaborative, respected deadlines, and created a positive working environment. Perfect client for creative projects!",
    date: "2024-02-08",
    projectTitle: "Indie Game Development",
    projectId: 4,
    helpfulCount: 11,
    verified: true,
    tags: ["Industry Knowledge", "Collaborative", "Respectful", "Creative Support"]
  },

  // Reviews for learning resources
  {
    id: 9,
    reviewerId: 1,
    reviewerName: "Alex Rivera",
    reviewerAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: 1,
    targetType: "learning_resource",
    rating: 5,
    title: "Transformed My Resume Game",
    comment: "Sarah's workshop was incredibly valuable! I learned how to showcase my technical projects effectively and optimize my resume for ATS systems. Within two weeks of implementing her advice, I got three interview calls. Highly recommend!",
    date: "2024-02-16",
    helpfulCount: 23,
    verified: true,
    tags: ["Practical Advice", "Immediate Results", "Technical Focus", "Career Boost"]
  },
  {
    id: 10,
    reviewerId: 3,
    reviewerName: "Morgan Lee",
    reviewerAvatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: 2,
    targetType: "learning_resource",
    rating: 5,
    title: "Complete Freelancing Roadmap",
    comment: "Marcus's course covers everything you need to know about freelancing. The pricing strategies alone paid for the course within a month. The contract templates and client onboarding process have been game-changers for my business.",
    date: "2024-01-20",
    helpfulCount: 18,
    verified: true,
    tags: ["Comprehensive", "Practical Tools", "Business Growth", "ROI Positive"]
  },
  {
    id: 11,
    reviewerId: 5,
    reviewerName: "Ethan Smith",
    reviewerAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: 3,
    targetType: "learning_resource",
    rating: 4,
    title: "Great Portfolio Design Tutorial",
    comment: "Emily's tutorial helped me redesign my portfolio with a much more professional look. The design principles and code examples were very helpful. Could use more examples for different creative fields, but overall excellent content.",
    date: "2024-01-18",
    helpfulCount: 14,
    verified: true,
    tags: ["Professional Design", "Practical Examples", "Code Included", "Well Structured"]
  },
  {
    id: 12,
    reviewerId: 2,
    reviewerName: "Jamie Patel",
    reviewerAvatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    reviewerType: "student",
    targetId: 4,
    targetType: "learning_resource",
    rating: 5,
    title: "Perfect for Introverted Professionals",
    comment: "As an introvert, networking always felt overwhelming. Dr. Kim's strategies are practical and energy-efficient. I've built more meaningful professional relationships in the past month than in the previous year. The actionable tips are gold!",
    date: "2024-02-21",
    helpfulCount: 31,
    verified: true,
    tags: ["Introvert-Friendly", "Actionable Tips", "Energy-Efficient", "Relationship Building"]
  }
];

export const mockRatings: { [key: string]: Rating } = {
  // Student ratings
  "student_1": {
    overall: 4.9,
    communication: 5.0,
    quality: 4.8,
    timeline: 5.0,
    professionalism: 4.9
  },
  "student_2": {
    overall: 4.8,
    communication: 4.9,
    quality: 4.8,
    timeline: 4.7,
    professionalism: 4.8
  },
  "student_3": {
    overall: 4.5,
    communication: 4.3,
    quality: 4.7,
    timeline: 4.2,
    professionalism: 4.6
  },
  "student_4": {
    overall: 4.9,
    communication: 4.8,
    quality: 5.0,
    timeline: 4.9,
    professionalism: 4.9
  },
  "student_5": {
    overall: 4.6,
    communication: 4.5,
    quality: 4.7,
    timeline: 4.6,
    professionalism: 4.7
  },

  // Client ratings
  "client_1": {
    overall: 4.9,
    communication: 5.0,
    timeline: 4.8,
    value: 4.9,
    professionalism: 5.0
  },
  "client_2": {
    overall: 4.8,
    communication: 4.9,
    timeline: 4.7,
    value: 4.8,
    professionalism: 4.8
  },
  "client_3": {
    overall: 4.7,
    communication: 4.6,
    timeline: 4.8,
    value: 4.7,
    professionalism: 4.7
  },
  "client_7": {
    overall: 4.9,
    communication: 4.8,
    timeline: 5.0,
    value: 4.9,
    professionalism: 4.9
  }
};

// Review statistics
export const reviewStats = {
  totalReviews: mockReviews.length,
  averageRating: Number((mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length).toFixed(1)),
  byRating: {
    5: mockReviews.filter(r => r.rating === 5).length,
    4: mockReviews.filter(r => r.rating === 4).length,
    3: mockReviews.filter(r => r.rating === 3).length,
    2: mockReviews.filter(r => r.rating === 2).length,
    1: mockReviews.filter(r => r.rating === 1).length
  },
  byTargetType: {
    student: mockReviews.filter(r => r.targetType === 'student').length,
    client: mockReviews.filter(r => r.targetType === 'client').length,
    learning_resource: mockReviews.filter(r => r.targetType === 'learning_resource').length
  },
  verifiedReviews: mockReviews.filter(r => r.verified).length,
  totalHelpfulVotes: mockReviews.reduce((sum, review) => sum + review.helpfulCount, 0)
};
