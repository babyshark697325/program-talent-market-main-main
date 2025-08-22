import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BookOpen, Eye } from "lucide-react";
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

const AdminLearningResources: React.FC = () => {
  const [resources, setResources] = React.useState<LearningResource[]>(loadResources());

  const [newRes, setNewRes] = React.useState<Omit<LearningResource, "id">>({
    title: "",
    description: "",
    type: "workshop",
    duration: "1 hour",
    status: "available",
  });

  const addResource = () => {
    const title = newRes.title.trim();
    if (!title) return;
    const next: LearningResource = {
      id: resources.length ? Math.max(...resources.map((r) => r.id)) + 1 : 1,
      ...newRes,
    } as LearningResource;
    const updated = [...resources, next];
    setResources(updated);
    setNewRes({ title: "", description: "", type: "workshop", duration: "1 hour", status: "available" });
  };

  const removeResource = (id: number) => {
    setResources(resources.filter((r) => r.id !== id));
  };



  const saveAll = () => {
    saveResources(resources);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight mb-2">Learning Resources Settings</h1>
            <p className="text-muted-foreground text-lg">Add, edit, or remove items shown in Student Resources</p>
          </div>
          <Button onClick={saveAll}>Save Changes</Button>
        </div>

        {/* Add new resource form */}
        <Card className="bg-secondary/40 border border-primary/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen size={18} /> Add New Resource</CardTitle>
            <CardDescription>Create a new learning resource</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Title</Label>
                <Input
                  placeholder="e.g., Resume Writing Workshop"
                  value={newRes.title}
                  onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm">Duration</Label>
                <Input
                  placeholder="e.g., 1 hour"
                  value={newRes.duration}
                  onChange={(e) => setNewRes({ ...newRes, duration: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">Description</Label>
              <Textarea
                rows={3}
                placeholder="Short description"
                value={newRes.description}
                onChange={(e) => setNewRes({ ...newRes, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Type</Label>
                <Select value={newRes.type} onValueChange={(v) => setNewRes({ ...newRes, type: v as ResourceType })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <Select value={newRes.status} onValueChange={(v) => setNewRes({ ...newRes, status: v as ResourceStatus })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" onClick={addResource}>Add Resource</Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Existing Resources</h2>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/admin/learning-resources/list">
                  <Eye className="mr-2 h-4 w-4" />
                  See All in List View
                </Link>
              </Button>
              <Button onClick={saveAll}>Save All Changes</Button>
            </div>
          </div>
          
          {resources.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No resources yet. Add one above to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r) => (
                <Card key={r.id} className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight mb-2">{r.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground capitalize">{r.type}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{r.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            r.status === 'available' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {r.status === 'available' ? 'Available' : 'Coming Soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{r.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-muted-foreground">ID: {r.id}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="h-8 px-3"
                        >
                          <Link to={`/admin/learning-resources/edit/${r.id}`}>
                            Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeResource(r.id)}
                          className="h-8 px-3"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLearningResources;
