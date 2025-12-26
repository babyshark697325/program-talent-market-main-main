import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Trash2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LearningResource, ResourceType, ResourceStatus } from "@/types/learning-resource";
import { useToast } from "@/components/ui/use-toast";

const AdminLearningResourceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [resource, setResource] = React.useState<LearningResource | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const fetchResource = async () => {
      if (id === 'new') {
        const dummyId = Math.floor(Math.random() * 1000000); // temporary ID for UI, not used in insert if handled correctly
        setResource({
          id: dummyId,
          title: '',
          description: '',
          type: 'workshop',
          duration: '',
          status: 'available',
        });
        setLoading(false);
        return;
      }

      try {
        const resourceId = parseInt(id || "0");
        if (!resourceId) throw new Error("Invalid ID");

        const { data, error } = await supabase
          .from('learning_resources')
          .select('*')
          .eq('id', resourceId)
          .single();

        if (error) throw error;

        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: LearningResource = {
            id: data.id,
            title: data.title,
            description: data.description,
            type: data.type,
            duration: data.duration,
            status: data.status,
            videoUrl: data.video_url,
            guideUrl: data.guide_url,
            eventDate: data.event_date,
            location: data.location,
            registrationUrl: data.registration_url,
            joinUrl: data.join_url,
            created_at: data.created_at
          };
          setResource(mapped);
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
        navigate("/admin/learning-resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!resource) return;

    setSaving(true);
    try {
      const isNew = id === 'new';

      const dbPayload = {
        title: resource.title,
        description: resource.description,
        type: resource.type,
        duration: resource.duration,
        status: resource.status,
        video_url: resource.videoUrl || null,
        guide_url: resource.guideUrl || null,
        event_date: resource.eventDate || null,
        location: resource.location || null,
        registration_url: resource.registrationUrl || null,
        join_url: resource.joinUrl || null
      };

      let error;
      if (isNew) {
        const { error: insertError } = await supabase
          .from('learning_resources')
          .insert([dbPayload]);
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('learning_resources')
          .update(dbPayload)
          .eq('id', resource.id);
        error = updateError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: isNew ? "Resource created successfully." : "Resource updated successfully.",
      });
      navigate("/admin/learning-resources");
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: "Failed to save resource. Ensure the 'learning_resources' table exists.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resource) return;
    if (window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from('learning_resources')
          .delete()
          .eq('id', resource.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Resource deleted successfully.",
        });
        navigate("/admin/learning-resources");
      } catch (error) {
        console.error("Error deleting resource:", error);
        toast({
          title: "Error",
          description: "Failed to delete resource.",
          variant: "destructive"
        });
      }
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
          <Button onClick={() => navigate("/admin/learning-resources")} className="mt-4">
            Back
          </Button>
        </div>
      </div>
    );
  }

  const isNew = id === 'new';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => navigate("/admin/learning-resources")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">
              {isNew ? 'Create Learning Resource' : 'Edit Learning Resource'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isNew ? 'Fill out the details to add a new resource' : `Update the details for "${resource.title}"`}
            </p>
          </div>
          <div className="flex gap-3">
            {!isNew && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : isNew ? "Create Resource" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Revamped Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - main form */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border border-primary/10 bg-secondary/30">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core details that describe this resource</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Resume Writing Workshop"
                    value={resource.title}
                    onChange={(e) => setResource({ ...resource, title: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Make it clear and action-oriented.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Provide a concise description of what this covers..."
                    value={resource.description}
                    onChange={(e) => setResource({ ...resource, description: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">1-3 sentences about the content and outcomes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select
                      value={resource.type}
                      onValueChange={(v) => setResource({ ...resource, type: v as ResourceType })}
                    >
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
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g., 1 hour (Optional)"
                      value={resource.duration || ''}
                      onChange={(e) => setResource({ ...resource, duration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select
                      value={resource.status}
                      onValueChange={(v) => setResource({ ...resource, status: v as ResourceStatus })}
                    >
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
              </CardContent>
            </Card>

            {/* Type-specific details */}
            {resource.type === 'video' && (
              <Card>
                <CardHeader>
                  <CardTitle>Video Details</CardTitle>
                  <CardDescription>Link to the video content users will watch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL *</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      placeholder="https://..."
                      value={resource.videoUrl || ''}
                      onChange={(e) => setResource({ ...resource, videoUrl: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">YouTube, Vimeo, or a hosted URL.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {resource.type === 'guide' && (
              <Card>
                <CardHeader>
                  <CardTitle>Guide Details</CardTitle>
                  <CardDescription>Link to the guide PDF or page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="guideUrl">Guide URL *</Label>
                    <Input
                      id="guideUrl"
                      type="url"
                      placeholder="https://..."
                      value={resource.guideUrl || ''}
                      onChange={(e) => setResource({ ...resource, guideUrl: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Link to a PDF or documentation page.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {resource.type === 'workshop' && (
              <Card>
                <CardHeader>
                  <CardTitle>Workshop Details</CardTitle>
                  <CardDescription>Scheduling and location information (Optional)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date & Time</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      value={resource.eventDate || ''}
                      onChange={(e) => setResource({ ...resource, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Room 101 or Zoom"
                      value={resource.location || ''}
                      onChange={(e) => setResource({ ...resource, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="registrationUrl">Registration URL</Label>
                    <Input
                      id="registrationUrl"
                      type="url"
                      placeholder="https://..."
                      value={resource.registrationUrl || ''}
                      onChange={(e) => setResource({ ...resource, registrationUrl: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {resource.type === 'networking' && (
              <Card>
                <CardHeader>
                  <CardTitle>Networking Details</CardTitle>
                  <CardDescription>Event information and how to join (Optional)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date & Time</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      value={resource.eventDate || ''}
                      onChange={(e) => setResource({ ...resource, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / Platform</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Auditorium or Google Meet"
                      value={resource.location || ''}
                      onChange={(e) => setResource({ ...resource, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="joinUrl">Join URL</Label>
                    <Input
                      id="joinUrl"
                      type="url"
                      placeholder="https://..."
                      value={resource.joinUrl || ''}
                      onChange={(e) => setResource({ ...resource, joinUrl: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - sticky preview */}
          <div className="md:col-span-1 md:sticky md:top-4 space-y-6">
            <Card className="border border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Live Preview
                </CardTitle>
                <CardDescription>How this will appear to students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg mb-1 truncate">{resource.title || 'Untitled resource'}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{resource.description || 'Add a short description...'}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="capitalize px-2 py-0.5 rounded-full">{resource.type}</Badge>
                      <span>•</span>
                      <Badge variant="outline" className="px-2 py-0.5 rounded-full">{resource.duration || '—'}</Badge>
                      <span>•</span>
                      <Badge
                        variant={resource.status === 'available' ? 'default' : 'secondary'}
                        className="text-xs px-2 py-0.5 rounded-full"
                      >
                        {resource.status === 'available' ? 'Available' : 'Soon'}
                      </Badge>
                    </div>

                    {/* Quick links */}
                    {resource.type === 'video' && resource.videoUrl && (
                      <div className="mt-3 text-sm">
                        <a href={resource.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Watch video
                        </a>
                      </div>
                    )}
                    {resource.type === 'guide' && resource.guideUrl && (
                      <div className="mt-3 text-sm">
                        <a href={resource.guideUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View guide
                        </a>
                      </div>
                    )}
                    {(resource.type === 'workshop' || resource.type === 'networking') && (
                      <div className="mt-3 text-sm text-muted-foreground space-x-3">
                        {resource.eventDate && <span>{new Date(resource.eventDate).toLocaleString()}</span>}
                        {resource.location && <span>{resource.location}</span>}
                        {resource.registrationUrl && (
                          <a href={resource.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Register
                          </a>
                        )}
                        {resource.joinUrl && (
                          <a href={resource.joinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Join
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLearningResourceEdit;
