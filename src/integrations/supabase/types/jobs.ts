export interface Job {
    id: number;
    title: string;
    company: string;
    description: string;
    skills: string[];
    budget: string;
    duration: string;
    posted_date: string;
    contact_email: string;
    location: string;
    experience_level: string;
    requirements: string[];
    user_id?: string;
    created_at?: string;
}
