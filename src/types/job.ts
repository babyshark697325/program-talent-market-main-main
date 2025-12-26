
export interface JobPosting {
  id: number | string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  budget: string;
  duration: string;
  postedDate: string;
  contactEmail?: string;
  requirements?: string[];
  location?: string;
  experienceLevel?: string;
  // Stats for the job card
  applicantsCount?: number;
  isNew?: boolean; 
  isRemote?: boolean;
}
