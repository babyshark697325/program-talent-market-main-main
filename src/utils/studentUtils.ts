import { StudentService } from '@/types/student';

// Updated interface to match the profiles table structure
export interface PrelaunchStudent {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    city?: string;
    role: string;
    created_at: string;
    status?: string;
    cic_id?: string;
}

// Transform database profile to component format
export const transformStudent = (dbStudent: PrelaunchStudent): StudentService => {
    let displayName = '';
    if (dbStudent.first_name && dbStudent.last_name) {
        displayName = `${dbStudent.first_name} ${dbStudent.last_name}`;
    } else if (dbStudent.first_name) {
        displayName = dbStudent.first_name;
    } else if (dbStudent.last_name) {
        displayName = dbStudent.last_name;
    } else if (dbStudent.email) {
        displayName = dbStudent.email.split('@')[0];
    } else {
        displayName = 'Unnamed Student';
    }
    return {
        id: parseInt(dbStudent.id.slice(-8), 16),
        cic_id: dbStudent.cic_id || dbStudent.id,
        name: displayName,
        title: 'Student',
        description: 'This student has not added a description yet.',
        avatarUrl: '',
        skills: [],
        price: '$25/hr',
        affiliation: 'student',
        rating: 5, // Default to 5 stars for new/unreviewed students
        aboutMe: '',
        contact: {
            email: dbStudent.email,
            phone: undefined,
            linkedinUrl: undefined,
            githubUrl: undefined,
            upworkUrl: undefined,
            fiverrUrl: undefined,
        },
        portfolio: [],
    };
};
