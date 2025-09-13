import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AdminActivity, ActivityStatus, ActivityType } from '@/types/adminActivity';
import { formatActivityTime } from '@/utils/activityFormatters';
import { Calendar, User, Briefcase, DollarSign, AlertTriangle, Info, CheckCircle, Flag } from 'lucide-react';

interface ActivityDetailsModalProps {
  activity: AdminActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({ activity, isOpen, onClose }) => {
  if (!activity) return null;

  const getActivityIcon = () => {
    switch (activity.type) {
      case ActivityType.USER_REGISTRATION:
        return <User className="w-5 h-5" />;
      case ActivityType.JOB_POSTED:
        return <Briefcase className="w-5 h-5" />;
      case ActivityType.PAYMENT_PROCESSED:
        return <DollarSign className="w-5 h-5" />;
      case ActivityType.WAITLIST_JOINED:
        return <Info className="w-5 h-5" />;
      case ActivityType.USER_REPORTS:
      case ActivityType.USER_ISSUES:
        return <AlertTriangle className="w-5 h-5" />;
      case ActivityType.CONTENT_MODERATED:
        return <Flag className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      [ActivityStatus.SUCCESS]: 'default',
      [ActivityStatus.WARNING]: 'secondary',
      [ActivityStatus.INFO]: 'outline',
      [ActivityStatus.ERROR]: 'destructive'
    } as const;

    const colors = {
      [ActivityStatus.SUCCESS]: 'text-green-600',
      [ActivityStatus.WARNING]: 'text-orange-600',
      [ActivityStatus.INFO]: 'text-blue-600',
      [ActivityStatus.ERROR]: 'text-red-600'
    };

    return (
      <Badge variant={variants[activity.status]} className={colors[activity.status]}>
        {activity.status.toUpperCase()}
      </Badge>
    );
  };

  const renderActivityData = () => {
    const data = activity.data;
    
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          if (key === 'message') return null; // Skip generic message
          
          return (
            <div key={key} className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-sm text-right max-w-[200px] break-words">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getActivityIcon()}
            Activity Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-relaxed flex-1">
                  {activity.message}
                </p>
                {getStatusBadge()}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatActivityTime(activity.timestamp)}
                <span className="text-xs">({activity.timestamp.toLocaleString()})</span>
              </div>
            </CardContent>
          </Card>

          {activity.data && Object.keys(activity.data).length > 1 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-3">Additional Details</h4>
                {renderActivityData()}
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Activity ID: {activity.id}</span>
            <span>Type: {activity.type.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailsModal;