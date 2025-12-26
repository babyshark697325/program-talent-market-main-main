export type ResourceStatus = "available" | "coming-soon";
export type ResourceType = "workshop" | "video" | "guide" | "networking";

export interface LearningResource {
    id: number;
    title: string;
    description: string;
    type: ResourceType;
    duration?: string;
    status: ResourceStatus;
    videoUrl?: string; // mapped from video_url
    guideUrl?: string; // mapped from guide_url
    eventDate?: string; // mapped from event_date
    location?: string;
    registrationUrl?: string; // mapped from registration_url
    joinUrl?: string; // mapped from join_url
    created_at?: string;
}
