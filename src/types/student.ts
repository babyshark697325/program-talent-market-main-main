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
  cic_id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  skills: string[];
  price: string;
  affiliation?: "student" | "alumni";
  rating?: number; // Star rating out of 5
  portfolio?: StudentPortfolioItem[];
  aboutMe?: string;
  contact?: StudentContact;
}