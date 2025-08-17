
export interface JobPosting {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  budget: string;
  duration: string;
  postedDate: string;
  contactEmail: string;
  skills: string[];
}

export const mockJobs: JobPosting[] = [
  {
    id: 1,
    title: "Build E-commerce Website",
    company: "Local Boutique",
    description: "Looking for a developer to create a modern e-commerce website with payment integration and inventory management.",
    requirements: ["Web Development", "Programming", "UI/UX Design"],
    budget: "$2,000 - $3,500",
    duration: "4-6 weeks",
    postedDate: "2024-01-15",
    contactEmail: "contact@localboutique.com",
    skills: ["Web Development", "Programming", "UI/UX Design"]
  },
  {
    id: 2,
    title: "Social Media Graphics Package",
    company: "Fitness Studio",
    description: "Need a complete social media graphics package including Instagram posts, stories, and promotional materials.",
    requirements: ["Graphic Design", "Logo Design", "Animation"],
    budget: "$800 - $1,200",
    duration: "2-3 weeks",
    postedDate: "2024-01-18",
    contactEmail: "marketing@fitnessstudio.com",
    skills: ["Graphic Design", "Logo Design", "Animation"]
  },
  {
    id: 3,
    title: "3D Product Visualization",
    company: "Tech Startup",
    description: "Create 3D models and animations for our new product line to use in marketing materials.",
    requirements: ["3D Modeling", "Blender", "Animation"],
    budget: "$1,500 - $2,500",
    duration: "3-4 weeks",
    postedDate: "2024-01-20",
    contactEmail: "creative@techstartup.com",
    skills: ["3D Modeling", "Blender", "Animation"]
  },
  {
    id: 4,
    title: "Indie Game Development",
    company: "Indie Studio",
    description: "Join our team to develop a 2D platformer game. Need someone skilled in game mechanics and level design.",
    requirements: ["Game Design", "Programming", "Animation"],
    budget: "$3,000 - $5,000",
    duration: "8-10 weeks",
    postedDate: "2024-01-22",
    contactEmail: "dev@indiestudio.com",
    skills: ["Game Design", "Programming", "Animation"]
  }
];
