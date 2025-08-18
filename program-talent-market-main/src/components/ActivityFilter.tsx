import React from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ActivityType, ActivityStatus } from '@/types/adminActivity';

interface ActivityFilterProps {
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  currentFilters: {
    type: string;
    status: string;
    timeRange: string;
  };
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({ 
  onFilterChange, 
  onClearFilters, 
  currentFilters 
}) => {
  const hasActiveFilters = currentFilters.type !== 'all' || 
                          currentFilters.status !== 'all' || 
                          currentFilters.timeRange !== 'all';

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <Filter size={14} />
        Filter:
      </div>
      
      <Select value={currentFilters.type} onValueChange={(value) => onFilterChange('type', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value={ActivityType.USER_REGISTRATION}>User Registration</SelectItem>
          <SelectItem value={ActivityType.JOB_POSTED}>Job Posted</SelectItem>
          <SelectItem value={ActivityType.REPORT_GENERATED}>Report Generated</SelectItem>
          <SelectItem value={ActivityType.PAYMENT_PROCESSED}>Payment Processed</SelectItem>
          <SelectItem value={ActivityType.USER_REPORTS}>Reports</SelectItem>
          <SelectItem value={ActivityType.USER_ISSUES}>User Issues</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentFilters.status} onValueChange={(value) => onFilterChange('status', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={ActivityStatus.SUCCESS}>Success</SelectItem>
          <SelectItem value={ActivityStatus.WARNING}>Warning</SelectItem>
          <SelectItem value={ActivityStatus.INFO}>Info</SelectItem>
          <SelectItem value={ActivityStatus.ERROR}>Error</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentFilters.timeRange} onValueChange={(value) => onFilterChange('timeRange', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="All Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearFilters}
          className="text-xs"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default ActivityFilter;