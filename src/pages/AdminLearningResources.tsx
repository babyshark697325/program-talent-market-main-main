import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import PageHeader from '@/components/PageHeader';

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
  // No default seed; start empty until you add your own
  return [];
}

function saveResources(r: LearningResource[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(r));
  // Let the student resources view know
  window.dispatchEvent(new Event("resources:updated"));
}

const AdminLearningResources: React.FC = () => {
  const [resources, setResources] = React.useState<LearningResource[]>(loadResources());

  const updateResource = (id: number, updates: Partial<LearningResource>) => {
    const next = resources.map(r => r.id === id ? { ...r, ...updates } : r);
    setResources(next);
    saveResources(next);
  };

  const removeResource = (id: number) => {
    const next = resources.filter(r => r.id !== id);
    setResources(next);
    saveResources(next);
  };

  const saveAll = () => {
    saveResources(resources);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Learning Resources Settings" 
        description="Manage items shown in Student Resources"
      >
        <Button asChild>
          <Link to="/admin/learning-resources/edit/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Resource
          </Link>
        </Button>
        <Button variant="outline" onClick={saveAll}>Save Changes</Button>
      </PageHeader>

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
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={saveAll}>Save All Changes</Button>
        </div>
      </div>
      
      {resources.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources yet. Use the "Add New Resource" button above to get started.</p>
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
                      <Badge
                        variant={r.status === 'available' ? 'default' : 'secondary'}
                        className="text-xs px-2 py-0.5 rounded-full"
                      >
                        {r.status === 'available' ? 'Available' : 'Soon'}
                      </Badge>
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
  );
};

export default AdminLearningResources;
