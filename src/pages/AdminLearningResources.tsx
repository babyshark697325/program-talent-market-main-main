
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import PageHeader from '@/components/PageHeader';
import { supabase } from "@/integrations/supabase/client";
import { LearningResource } from "@/types/learning-resource";
import { useToast } from "@/components/ui/use-toast";

const AdminLearningResources: React.FC = () => {
  const [resources, setResources] = React.useState<LearningResource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: LearningResource[] = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          type: r.type,
          duration: r.duration,
          status: r.status,
          videoUrl: r.video_url,
          guideUrl: r.guide_url,
          eventDate: r.event_date,
          location: r.location,
          registrationUrl: r.registration_url,
          joinUrl: r.join_url,
          created_at: r.created_at
        }));
        setResources(mapped);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load learning resources.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResources();
  }, []);

  const removeResource = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      const { error } = await supabase
        .from('learning_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResources(resources.filter(r => r.id !== id));
      toast({
        title: "Success",
        description: "Resource deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "Failed to delete resource.",
        variant: "destructive"
      });
    }
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
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : resources.length === 0 ? (
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
                    <CardTitle className="text-lg leading-tight mb-2 h-14 flex items-start line-clamp-2">{r.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2 h-6">
                      <span className="text-sm text-muted-foreground capitalize">{r.type}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{r.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 h-8">
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
                <div className="text-sm text-muted-foreground mb-4 flex-1 h-20 overflow-hidden flex items-start">
                  <p className="line-clamp-4 leading-relaxed">{r.description}</p>
                </div>

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
