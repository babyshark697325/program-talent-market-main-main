import React from 'react';
import { CircleCheck, TriangleAlert, Info, CircleX } from 'lucide-react';
import { ActivityStatus } from '@/types/adminActivity';

interface StatusIndicatorProps {
  status: ActivityStatus;
  size?: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 16 }) => {
  const getStatusIcon = () => {
    switch (status) {
      case ActivityStatus.SUCCESS:
        return <CircleCheck size={size} className="text-green-500" />;
      case ActivityStatus.WARNING:
        return <TriangleAlert size={size} className="text-orange-500" />;
      case ActivityStatus.INFO:
        return <Info size={size} className="text-blue-500" />;
      case ActivityStatus.ERROR:
        return <CircleX size={size} className="text-red-500" />;
      default:
        return <Info size={size} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex-shrink-0">
      {getStatusIcon()}
    </div>
  );
};

export default StatusIndicator;