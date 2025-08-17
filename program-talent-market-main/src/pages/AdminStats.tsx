import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AdminStats = () => {
  const platformStats = [
    { label: 'Total Users', value: 1247, change: '+12%', period: 'vs last month' },
    { label: 'Active Projects', value: 89, change: '+23%', period: 'vs last month' },
    { label: 'Total Revenue', value: '$45,230', change: '+18%', period: 'vs last month' },
    { label: 'Success Rate', value: '94.2%', change: '+2.1%', period: 'vs last month' },
  ];

  const skillDemand = [
    { skill: 'Web Development', demand: 85 },
    { skill: 'Graphic Design', demand: 72 },
    { skill: 'Content Writing', demand: 68 },
    { skill: 'Data Analysis', demand: 55 },
    { skill: 'Social Media', demand: 45 },
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'Alex Johnson', time: '2 minutes ago' },
    { action: 'Job posted', user: 'Tech Corp', time: '15 minutes ago' },
    { action: 'Project completed', user: 'Sarah Davis', time: '1 hour ago' },
    { action: 'Payment processed', user: 'Design Studio', time: '2 hours ago' },
    { action: 'New review submitted', user: 'Mike Wilson', time: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight mb-2">Platform Statistics</h1>
            <p className="text-muted-foreground text-lg">Comprehensive platform performance overview</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {platformStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> {stat.period}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Demand</CardTitle>
                <CardDescription>Most in-demand skills on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillDemand.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.skill}</span>
                      <span>{item.demand}%</span>
                    </div>
                    <Progress value={item.demand} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Server Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">8.5/10</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2.4 hrs</div>
                  <p className="text-sm text-muted-foreground">Avg Session Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">76%</div>
                  <p className="text-sm text-muted-foreground">Return Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Revenue</span>
                  <span className="font-medium">$12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platform Fees</span>
                  <span className="font-medium">$2,890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processing Costs</span>
                  <span className="font-medium">$340</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Net Profit</span>
                  <span>$9,220</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
