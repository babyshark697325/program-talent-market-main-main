import React, { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ActivityItem from './ActivityItem';
import ActivityFilter from './ActivityFilter';
import { AdminActivity, ActivityType, ActivityStatus } from '@/types/adminActivity';
import ActivityDetailsModal from '@/components/ActivityDetailsModal';

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
  
  // Add state for modal and read activities
  const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readActivities, setReadActivities] = useState<Set<number>>(new Set());

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

    // Exclude items that were marked as read in this session
    filtered = filtered.filter(a => !readActivities.has(a.id));

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit results
    return filtered.slice(0, maxItems);
  }, [activities, filters, maxItems, readActivities]);

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
    setReadActivities(prev => new Set([...prev, activityId]));
    console.log('Marked as read:', activityId);
  };

  const handleViewDetails = (activityId: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsModalOpen(true);
    }
    if (onActivityClick) {
      onActivityClick(activityId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  // Update filtered activities to include read status
  const activitiesWithReadStatus = useMemo(() => {
    return activities.map(activity => ({
      ...activity,
      isRead: activity.isRead || readActivities.has(activity.id)
    }));
  }, [activities, readActivities]);

  return (
    <Card className="p-8 bg-secondary/40 backdrop-blur-sm border border-primary/10">
      <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
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
          filteredActivities.map((activity) => {
            const activityWithReadStatus = {
              ...activity,
              isRead: activity.isRead || readActivities.has(activity.id)
            };
            
            return (
              <ActivityItem
                key={activity.id}
                activity={activityWithReadStatus}
                onClick={onActivityClick}
                onMarkAsRead={handleMarkAsRead}
                onViewDetails={handleViewDetails}
              />
            );
          })
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

      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
};

export default RecentActivity;
