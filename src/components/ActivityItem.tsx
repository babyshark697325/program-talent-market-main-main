import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import StatusIndicator from './StatusIndicator';
import { AdminActivity, ActivityStatus } from '@/types/adminActivity';
import { formatActivityTime } from '@/utils/activityFormatters';

interface ActivityItemProps {
  activity: AdminActivity;
  onClick?: (activityId: number) => void;
  onMarkAsRead?: (activityId: number) => void;
  onViewDetails?: (activityId: number) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  onClick, 
  onMarkAsRead, 
  onViewDetails 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(activity.id);
    }
  };

  const handleMarkAsRead = (e: Event) => {
    e.preventDefault();
    if (onMarkAsRead) {
      onMarkAsRead(activity.id);
    }
  };

  const handleViewDetails = (e: Event) => {
    e.preventDefault();
    if (onViewDetails) {
      onViewDetails(activity.id);
    }
  };

  const getStatusDot = () => {
    const baseClasses = "w-2 h-2 rounded-full mt-2 flex-shrink-0";
    switch (activity.status) {
      case ActivityStatus.SUCCESS:
        return `${baseClasses} bg-green-500`;
      case ActivityStatus.WARNING:
        return `${baseClasses} bg-orange-500`;
      case ActivityStatus.INFO:
        return `${baseClasses} bg-blue-500`;
      case ActivityStatus.ERROR:
        return `${baseClasses} bg-red-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer ${
        !activity.isRead ? 'border-l-2 border-primary' : ''
      }`}
      onClick={handleClick}
    >
      <div className={getStatusDot()}></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2">{activity.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatActivityTime(activity.timestamp)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusIndicator status={activity.status} size={14} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-0 rounded-md shadow-lg">
            <DropdownMenuItem onSelect={handleViewDetails}>
              View Details
            </DropdownMenuItem>
            {!activity.isRead && (
              <DropdownMenuItem onSelect={handleMarkAsRead}>
                Mark as Read
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ActivityItem;
