import React, { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ActivityItem from './ActivityItem';
import ActivityFilter from './ActivityFilter';
import { AdminActivity, ActivityType, ActivityStatus } from '@/types/adminActivity';

interface RecentActivityProps {
  activities: AdminActivity[];
  onActivityClick?: (activityId: number) => void;
  maxItems?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  onActivityClick, 
  maxItems = 10 
}) => {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    timeRange: 'all'
  });

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }

    // Filter by time range
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(activity => {
        const activityDate = activity.timestamp;
        switch (filters.timeRange) {
          case 'today':
            return activityDate >= startOfDay;
          case 'week':
            return activityDate >= startOfWeek;
          case 'month':
            return activityDate >= startOfMonth;
          default:
            return true;
        }
      });
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit results
    return filtered.slice(0, maxItems);
  }, [activities, filters, maxItems]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      timeRange: 'all'
    });
  };

  const handleMarkAsRead = (activityId: number) => {
    // In a real app, this would update the activity's read status
    console.log('Mark as read:', activityId);
  };

  const handleViewDetails = (activityId: number) => {
    // In a real app, this would open a detailed view
    console.log('View details:', activityId);
    if (onActivityClick) {
      onActivityClick(activityId);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-r from-secondary/60 to-accent/10 backdrop-blur-sm border border-accent/10">
      <h2 className="text-2xl font-bold mb-6 text-accent flex items-center gap-3">
        <TrendingUp size={28} />
        Recent Activity
      </h2>
      
      <ActivityFilter 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        currentFilters={filters}
      />

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onClick={onActivityClick}
              onMarkAsRead={handleMarkAsRead}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities found matching the current filters.</p>
          </div>
        )}
      </div>
      
      {filteredActivities.length > 0 && filteredActivities.length === maxItems && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Showing {filteredActivities.length} of {activities.length} activities
          </p>
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;