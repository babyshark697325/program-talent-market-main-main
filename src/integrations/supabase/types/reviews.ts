export interface Review {
    id: number;
    reviewer_id: string | number; // This might be a UUID string in real DB
    reviewer_name: string;
    reviewer_avatar: string | null;
    reviewer_type: 'student' | 'client';
    target_id: string | number;
    target_type: 'student' | 'client' | 'learning_resource';
    rating: number;
    title: string | null;
    comment: string | null;
    created_at: string;
    project_title: string | null;
    project_id: string | number | null;
    helpful_count: number;
    verified: boolean;
    tags: string[];
}
