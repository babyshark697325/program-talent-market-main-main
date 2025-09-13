import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useSavedJobs } from '@/contexts/SavedJobsContext';

interface BookmarkButtonProps {
  jobId: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  jobId, 
  className = '', 
  size = 'icon' 
}) => {
  const { isSaved, toggleSavedJob } = useSavedJobs();
  const saved = isSaved(jobId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedJob(jobId);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      className={`hover:bg-primary/10 transition-colors ${className}`}
      aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
      title={saved ? 'Remove from saved jobs' : 'Save job'}
    >
      <Bookmark 
        size={16} 
        className={`transition-colors ${
          saved 
            ? 'fill-primary text-primary' 
            : 'text-muted-foreground hover:text-primary'
        }`}
      />
    </Button>
  );
};

export default BookmarkButton;