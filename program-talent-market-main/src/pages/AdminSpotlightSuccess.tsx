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
import { mockStudents, StudentService } from "@/data/mockStudents";

const LS_QUOTE_KEY = "spotlight.quote";
const LS_STUDENT_ID_KEY = "spotlight.studentId";
const LS_SHOWCASE_IMAGE_KEY = "spotlight.showcaseImage";

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
    () => (studentId ? mockStudents.find((s) => s.id === studentId) : undefined),
    [studentId]
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
      toast({ title: "Couldn’t save", description: e?.message ?? String(e), variant: "destructive" });
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
      reader.onerror = () => toast({ title: "Couldn’t load image", description: "Please try a different file.", variant: "destructive" });
      reader.readAsDataURL(file);
    } catch (e: any) {
      toast({ title: "Couldn’t load image", description: e?.message ?? String(e), variant: "destructive" });
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
            <h1 className="text-4xl font-bold leading-tight mb-2">Spotlight Success Settings</h1>
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
                <Select
                  value={studentId ? String(studentId) : ""}
                  onValueChange={(v) => setStudentId(v ? Number(v) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name} — {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Autofills name, role, skills, and profile picture.</p>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="spotlight-quote">Spotlight Quote / Personal Statement</Label>
                <Textarea
                  id="spotlight-quote"
                  placeholder="Add a compelling personal statement to highlight on the homepage or dashboard."
                  rows={6}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label>Showcase Work (Image)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickShowcase(e.target.files?.[0])}
                  />
                  {showcaseImage && (
                    <Button variant="outline" size="sm" onClick={clearShowcase}>
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">This image will appear on the client Spotlight Success card as “Showcase Work”.</p>
                <ul className="text-xs text-muted-foreground pl-5 list-disc space-y-1 mt-1">
                  <li>Recommended landscape: 1200×675 (16:9)</li>
                  <li>Recommended portrait: 1200×1500 (4:5)</li>
                  <li>Maximum processed size: long edge up to 1600px (larger files are downscaled)</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <Button variant="outline" onClick={reset}>Reset</Button>
                <Button onClick={save}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Live preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-2xl border p-4 bg-secondary/30">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      {selectedStudent?.avatarUrl ? (
                        <img src={selectedStudent.avatarUrl} alt={selectedStudent.name} className="h-12 w-12 object-cover rounded-full" />
                      ) : (
                        <AvatarFallback>{getInitials(selectedStudent?.name || "")}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold leading-tight truncate">
                          {selectedStudent?.name || "No student selected"}
                        </h3>
                        {selectedStudent?.affiliation && (
                          <Badge variant={selectedStudent.affiliation === 'alumni' ? 'secondary' : 'default'}>
                            {selectedStudent.affiliation === 'alumni' ? 'MyVillage Alumni' : 'MyVillage Student'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {selectedStudent?.title || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                    {quote || "Your spotlight quote will appear here."}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selectedStudent?.skills || []).slice(0, 5).map((t) => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>

                  {showcaseImage && (
                    <div className="mt-4">
                      <div className="text-xs font-medium mb-2">Showcase Work</div>
                      <div className="relative w-full overflow-hidden rounded-xl border aspect-video">
                        <img
                          src={showcaseImage}
                          alt="Showcase Work"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button
                      onClick={goProfile}
                      disabled={!selectedStudent}
                      className="gap-2"
                      aria-disabled={!selectedStudent}
                      title={selectedStudent ? "View Full Profile" : "Pick a student to enable"}
                    >
                      <ExternalLink size={16} /> View Full Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSpotlightSuccess;
