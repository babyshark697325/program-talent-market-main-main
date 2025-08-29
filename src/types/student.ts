export interface StudentPortfolioItem {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  link?: string;
}

export interface StudentContact {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  upworkUrl?: string;
  fiverrUrl?: string;
  githubUrl?: string;
}

export interface StudentService {
  id: number;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  skills: string[];
  price: string;
  affiliation?: "student" | "alumni";
  portfolio?: StudentPortfolioItem[];
  aboutMe?: string;
  contact?: StudentContact;
}