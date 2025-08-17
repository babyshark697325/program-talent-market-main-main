
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
  budget: string;
}

const mockApplications: Application[] = [
  {
    id: 1,
    jobTitle: "Social Media Content Creation",
    company: "TechStart Inc",
    appliedDate: "2024-01-15",
    status: "pending",
    budget: "$150"
  },
  {
    id: 2,
    jobTitle: "Website Design & Development",
    company: "Local Business Solutions",
    appliedDate: "2024-01-12",
    status: "accepted",
    budget: "$500"
  },
  {
    id: 3,
    jobTitle: "Data Analysis Project",
    company: "Research Corp",
    appliedDate: "2024-01-10",
    status: "rejected",
    budget: "$300"
  }
];

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications] = useState<Application[]>(mockApplications);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">
            My Applications
          </h1>
          <p className="text-muted-foreground text-lg">
            Track the status of your job applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Accepted</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === "accepted").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(application.status)}
                        <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <p className="text-muted-foreground mb-2">{application.company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                        <span>Budget: {application.budget}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/job/${application.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-secondary/60 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Applications Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start applying to jobs to track your applications here.
              </p>
              <Button 
                onClick={() => navigate("/browse-jobs")}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Browse Jobs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
