import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { StudentService } from "@/data/mockStudents";
import { supabase } from "@/integrations/supabase/client";

const LS_QUOTE_KEY = "spotlight.quote";
const LS_STUDENT_ID_KEY = "spotlight.studentId";
const LS_SHOWCASE_IMAGE_KEY = "spotlight.showcaseImage";

// Transform database profile to StudentService format (same as in Index.tsx)
interface DatabaseProfile {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const transformProfileToStudent = (profile: DatabaseProfile): StudentService => {
  const displayName = profile.display_name || 
    [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 
    profile.email.split('@')[0];
  
  return {
    id: parseInt(profile.id),
    name: displayName,
    title: "Student Developer", // Default title
    description: profile.bio || "Talented student developer ready to help with your projects.", // Added required description field
    avatarUrl: profile.avatar_url || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80`,
    skills: [], // Default empty skills
    price: "$25/hr", // Changed from hourlyRate to price (string format)
    affiliation: "student" as const, // Default affiliation
    aboutMe: profile.bio || "", // Optional field
    contact: {
      email: profile.email // Properly nested email within contact object
    },
    portfolio: [] // Default empty portfolio
  };
};

const getInitials = (name: string) => {
  const parts = (name || "").split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase() || "U";
};

const AdminSpotlightSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quote, setQuote] = React.useState("");
  const [studentId, setStudentId] = React.useState<number | null>(null);
  const [showcaseImage, setShowcaseImage] = React.useState<string>("");
  const [showcaseFile, setShowcaseFile] = React.useState<File | null>(null);
  const [students, setStudents] = React.useState<StudentService[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch students from database
  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get profiles for users with 'student' role
        const { data: studentRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'student');

        if (rolesError) {
          console.error('Error fetching student roles:', rolesError);
          setError('Failed to load student roles');
          return;
        }

        if (!studentRoles || studentRoles.length === 0) {
          setStudents([]);
          return;
        }

        const studentUserIds = studentRoles.map(role => role.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', studentUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setError('Failed to load student profiles');
          return;
        }

        const transformedStudents = (profiles || []).map(transformProfileToStudent);
        setStudents(transformedStudents);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  React.useEffect(() => {
    try {
      const q = localStorage.getItem(LS_QUOTE_KEY) || "";
      const sid = localStorage.getItem(LS_STUDENT_ID_KEY);
      const img = localStorage.getItem(LS_SHOWCASE_IMAGE_KEY) || "";
      setQuote(q);
      setStudentId(sid ? Number(sid) : null);
      setShowcaseImage(img);
    } catch {
      /* ignore */
    }
  }, []);

  const selectedStudent: StudentService | undefined = React.useMemo(
    () => (studentId ? students.find((s) => s.id === studentId) : undefined),
    [studentId, students]
  );

  const profilePath = selectedStudent ? `/student/${selectedStudent.id}` : "";

  const save = async () => {
    try {
      localStorage.setItem(LS_QUOTE_KEY, quote);
      if (studentId) localStorage.setItem(LS_STUDENT_ID_KEY, String(studentId));
      else localStorage.removeItem(LS_STUDENT_ID_KEY);

      // If a new file was chosen this session, compress and store it; otherwise
      // only store if the current preview is a data URL (not a blob URL)
      if (showcaseFile) {
        const dataUrl = await compressImage(showcaseFile, 1600, 0.8);
        localStorage.setItem(LS_SHOWCASE_IMAGE_KEY, dataUrl);
        setShowcaseImage(dataUrl);
        setShowcaseFile(null);
      } else if (showcaseImage && showcaseImage.startsWith('data:')) {
        localStorage.setItem(LS_SHOWCASE_IMAGE_KEY, showcaseImage);
      } else if (!showcaseImage) {
        localStorage.removeItem(LS_SHOWCASE_IMAGE_KEY);
      }

      toast({ title: "Spotlight saved", description: "Your spotlight settings were updated." });
      try { window.dispatchEvent(new Event('spotlight:updated')); } catch {}
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e?.message ?? String(e), variant: "destructive" });
    }
  };

  const reset = () => {
    setQuote("");
    setStudentId(null);
    setShowcaseImage("");
    try {
      localStorage.removeItem(LS_QUOTE_KEY);
      localStorage.removeItem(LS_STUDENT_ID_KEY);
      localStorage.removeItem(LS_SHOWCASE_IMAGE_KEY);
    } catch {
      /* ignore */
    }
    toast({ title: "Spotlight cleared", description: "Fields were reset." });
  };

  const goProfile = (e?: any) => {
    e?.preventDefault?.();
    if (!selectedStudent) return;
    navigate(profilePath);
  };

  // Downscale/compress image to keep under localStorage limits and ensure reliability
  const compressImage = (file: File, maxSize = 1600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const onPickShowcase = async (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    // Immediate preview as data URL (robust across browsers); compress original on save
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        setShowcaseImage(result);
        setShowcaseFile(file);
      };
      reader.onerror = () => toast({ title: "Couldn't load image", description: "Please try a different file.", variant: "destructive" });
      reader.readAsDataURL(file);
    } catch (e: any) {
      toast({ title: "Couldn't load image", description: e?.message ?? String(e), variant: "destructive" });
    }
  };

  const clearShowcase = () => {
    setShowcaseImage("");
    setShowcaseFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">Spotlight Success Settings</h1>
            <p className="text-muted-foreground">Pick a featured student and configure the quote and action button</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Settings form */}
          <Card>
            <CardHeader>
              <CardTitle>Spotlight Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label>Pick Featured Student</Label>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading students...</span>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    <p className="text-sm">{error}</p>
                  </div>
                ) : (
                  <Select
                    value={studentId ? String(studentId) : ""}
                    onValueChange={(v) => setStudentId(v ? Number(v) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name} — {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-muted-foreground">Autofills name, role, skills, and profile picture.</p>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="spotlight-quote">Spotlight Quote / Personal Statement</Label>
                <Textarea
                  id="spotlight-quote"
                  placeholder="Enter a motivational quote or personal statement..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label>Showcase Image (Optional)</Label>
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickShowcase(e.target.files?.[0])}
                  />
                  {showcaseImage && (
                    <div className="relative">
                      <img
                        src={showcaseImage}
                        alt="Showcase preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={clearShowcase}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={save} className="flex-1">
                  Save Settings
                </Button>
                <Button onClick={reset} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <img src={selectedStudent.avatarUrl} alt={selectedStudent.name} />
                      <AvatarFallback>{getInitials(selectedStudent.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedStudent.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedStudent.title}</p>
                    </div>
                  </div>
                  
                  {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {quote && (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      "{quote}"
                    </blockquote>
                  )}
                  
                  {showcaseImage && (
                    <div className="rounded-md overflow-hidden border">
                      <img
                        src={showcaseImage}
                        alt="Showcase"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  <Button
                    onClick={goProfile}
                    className="w-full"
                    disabled={!profilePath}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a student to see the preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSpotlightSuccess;
