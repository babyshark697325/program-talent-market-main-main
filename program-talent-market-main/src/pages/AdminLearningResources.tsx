import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

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

  const updateResource = (id: number, patch: Partial<LearningResource>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add new resource */}
          <Card className="bg-secondary/40 border border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen size={18} /> Add Resource</CardTitle>
              <CardDescription>Create a new learning resource</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Title</Label>
                <Input
                  placeholder="e.g., Resume Writing Workshop"
                  value={newRes.title}
                  onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label className="text-sm">Duration</Label>
                  <Input
                    placeholder="e.g., 1 hour"
                    value={newRes.duration}
                    onChange={(e) => setNewRes({ ...newRes, duration: e.target.value })}
                  />
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

          {/* Edit existing resources */}
          <Card className="bg-secondary/40 border border-primary/10">
            <CardHeader>
              <CardTitle>Existing Resources</CardTitle>
              <CardDescription>Inline edit and remove resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.length === 0 && (
                <p className="text-sm text-muted-foreground">No resources yet. Add one on the left.</p>
              )}
              {resources.map((r) => (
                <div key={r.id} className="border rounded-lg p-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Title</Label>
                      <Input value={r.title} onChange={(e) => updateResource(r.id, { title: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm">Duration</Label>
                      <Input value={r.duration} onChange={(e) => updateResource(r.id, { duration: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Description</Label>
                    <Textarea rows={3} value={r.description} onChange={(e) => updateResource(r.id, { description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Type</Label>
                      <Select value={r.type} onValueChange={(v) => updateResource(r.id, { type: v as ResourceType })}>
                        <SelectTrigger>
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
                    <div>
                      <Label className="text-sm">Status</Label>
                      <Select value={r.status} onValueChange={(v) => updateResource(r.id, { status: v as ResourceStatus })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="coming-soon">Coming Soon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">ID: {r.id}</span>
                    <Button variant="destructive" size="sm" onClick={() => removeResource(r.id)}>Remove</Button>
                  </div>
                </div>
              ))}
              {resources.length > 0 && (
                <div className="text-right">
                  <Button onClick={saveAll}>Save Changes</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLearningResources;
