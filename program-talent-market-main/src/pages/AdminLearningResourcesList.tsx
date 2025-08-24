import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Filter, Plus, Edit3, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Types
export type ResourceStatus = "available" | "coming-soon";
export type ResourceType = "workshop" | "video" | "guide" | "networking";

export interface LearningResource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  duration: string;
  status: ResourceStatus;
}

const LS_KEY = "student.resources";

function loadResources(): LearningResource[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LearningResource[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  // Default seed
  return [
    {
      id: 1,
      title: "Resume Writing Workshop",
      description: "Learn how to create compelling resumes that get noticed",
      type: "workshop",
      duration: "2 hours",
      status: "available",
    },
    {
      id: 2,
      title: "Interview Skills Masterclass",
      description: "Master the art of interviewing with practice sessions",
      type: "video",
      duration: "1.5 hours",
      status: "available",
    },
    {
      id: 3,
      title: "Portfolio Development Guide",
      description: "Build a portfolio that showcases your best work",
      type: "guide",
      duration: "3 hours",
      status: "coming-soon",
    },
    {
      id: 4,
      title: "Networking for Students",
      description: "Connect with industry professionals and peers",
      type: "networking",
      duration: "1 hour",
      status: "available",
    },
  ];
}

function saveResources(r: LearningResource[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(r));
  // Let the student resources view know
  window.dispatchEvent(new Event("resources:updated"));
}

const AdminLearningResourcesList: React.FC = () => {
  const [resources, setResources] = React.useState<LearningResource[]>(loadResources());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<ResourceType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<ResourceStatus | "all">("all");
  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const removeResource = (id: number) => {
    const next = resources.filter((r) => r.id !== id);
    setResources(next);
    saveResources(next);
  };

  const saveAll = () => {
    saveResources(resources);
  };

  const getTypeIcon = (type: ResourceType) => {
    return <BookOpen className="h-4 w-4 text-primary" />;
  };

  const getStatusBadge = (status: ResourceStatus) => {
    return (
      <Badge variant={status === "available" ? "default" : "secondary"}>
        {status === "available" ? "Available" : "Coming Soon"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">
              Learning Resources Settings
            </h1>
            <p className="text-muted-foreground text-lg">Manage all learning resources in a comprehensive list format</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/learning-resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Grid View
              </Link>
            </Button>
            <Button onClick={saveAll}>
              <Plus className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Type</Label>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ResourceType | "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ResourceStatus | "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        {/* Resources List */}
        {filteredResources.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {resources.length === 0 
                  ? "No resources found. Add some resources to get started." 
                  : "No resources match your current filters. Try adjusting your search criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Type Icon */}
                    <div className="lg:col-span-1">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-semibold text-primary">
                        {getTypeIcon(resource.type)}
                      </div>
                    </div>
                    
                    {/* Title and Description */}
                    <div className="lg:col-span-4">
                      <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                    </div>
                    
                    {/* Type */}
                    <div className="lg:col-span-2">
                      <Badge variant="outline" className="capitalize">
                        {resource.type}
                      </Badge>
                    </div>
                    
                    {/* Duration */}
                    <div className="lg:col-span-2">
                      <span className="text-sm text-muted-foreground">{resource.duration}</span>
                    </div>
                    
                    {/* Status */}
                    <div className="lg:col-span-2">
                      {getStatusBadge(resource.status)}
                    </div>
                    
                    {/* Actions */}
                    <div className="lg:col-span-1">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link to={`/admin/learning-resources/edit/${resource.id}`}>
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResource(resource.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLearningResourcesList;
