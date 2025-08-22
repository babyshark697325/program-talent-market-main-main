import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

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
  return [];
}

function saveResources(r: LearningResource[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(r));
  window.dispatchEvent(new Event("resources:updated"));
}

const AdminLearningResourceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resources, setResources] = React.useState<LearningResource[]>(loadResources());
  const [resource, setResource] = React.useState<LearningResource | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const resourceId = parseInt(id || "0");
    const foundResource = resources.find(r => r.id === resourceId);
    
    if (foundResource) {
      setResource(foundResource);
    } else {
      // Resource not found, redirect back to list
      navigate("/admin/learning-resources/list");
    }
    setLoading(false);
  }, [id, resources, navigate]);

  const handleSave = async () => {
    if (!resource) return;
    
    setSaving(true);
    try {
      const updatedResources = resources.map(r => r.id === resource.id ? resource : r);
      setResources(updatedResources);
      saveResources(updatedResources);
      
      // Show success feedback and redirect back to list
      navigate("/admin/learning-resources/list");
    } catch (error) {
      console.error("Error saving resource:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resource) return;
    
    if (window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      const updatedResources = resources.filter(r => r.id !== resource.id);
      setResources(updatedResources);
      saveResources(updatedResources);
      navigate("/admin/learning-resources/list");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading resource...</div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Resource not found</div>
          <Button onClick={() => navigate("/admin/learning-resources/list")} className="mt-4">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => navigate("/admin/learning-resources/list")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">
              Edit Learning Resource
            </h1>
            <p className="text-muted-foreground text-lg">
              Update the details for "{resource.title}"
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Resource
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
              <CardDescription>
                Update the information for this learning resource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={resource.title}
                    onChange={(e) => setResource({ ...resource, title: e.target.value })}
                    placeholder="e.g., Resume Writing Workshop"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={resource.type}
                    onValueChange={(v) => setResource({ ...resource, type: v as ResourceType })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={resource.duration}
                    onChange={(e) => setResource({ ...resource, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={resource.status}
                    onValueChange={(v) => setResource({ ...resource, status: v as ResourceStatus })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={resource.description}
                  onChange={(e) => setResource({ ...resource, description: e.target.value })}
                  placeholder="Provide a clear description of what this resource covers..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Resource Preview */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-semibold text-primary">
                        {resource.type.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="capitalize">{resource.type}</span>
                          <span>•</span>
                          <span>{resource.duration}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            resource.status === 'available' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {resource.status === 'available' ? 'Available' : 'Coming Soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLearningResourceEdit;
