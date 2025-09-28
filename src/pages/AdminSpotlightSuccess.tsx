import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Star, User, Quote, Image as ImageIcon, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import FeaturedStudent from "@/components/FeaturedStudent";
import { StudentService } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";

const LS_QUOTE_KEY = "spotlight.quote";
const LS_STUDENT_ID_KEY = "spotlight.studentId";
const LS_SHOWCASE_IMAGE_KEY = "spotlight.showcaseImage";
const LS_REVIEW_KEY = "spotlight.review";

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

// Add interface for database review
interface DatabaseReview {
  id: string;
  reviewer_name: string;
  reviewer_company: string | null;
  review_text: string;
  rating: number;
  created_at: string;
}

const transformProfileToStudent = (profile: DatabaseProfile): StudentService => {
  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 
    profile.display_name || 
    profile.email.split('@')[0];
  
  return {
    id: parseInt(profile.id.slice(-8), 16),
    name: displayName,
    title: profile.bio || "Student",
    description: profile.bio || "",
    avatarUrl: profile.avatar_url || "",
    skills: [],
    price: "$0/hr",
    affiliation: "student" as const,
    aboutMe: profile.bio || "",
    contact: {
      email: profile.email
    },
    portfolio: []
  };
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

function AdminSpotlightSuccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for student selection and data
  const [quote, setQuote] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [showcaseImage, setShowcaseImage] = useState<string>("");
  const [students, setStudents] = useState<StudentService[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentService | null>(null);
  
  // State for reviews
  const [reviews, setReviews] = useState<DatabaseReview[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<string>("");
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch students from Supabase
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: true });

      if (error) throw error;

      const transformedStudents = (data || []).map(transformProfileToStudent);
      setStudents(transformedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch reviews for selected student
  const fetchStudentReviews = async (studentId: string) => {
    if (!studentId) {
      setReviews([]);
      return;
    }

    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, reviewer_name, reviewer_company, review_text, rating, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Load existing data from localStorage
  useEffect(() => {
    const savedQuote = localStorage.getItem(LS_QUOTE_KEY);
    const savedStudentId = localStorage.getItem(LS_STUDENT_ID_KEY);
    const savedImage = localStorage.getItem(LS_SHOWCASE_IMAGE_KEY);
    const savedReviewId = localStorage.getItem(LS_REVIEW_KEY);

    if (savedQuote) setQuote(savedQuote);
    if (savedStudentId) setSelectedStudentId(savedStudentId);
    if (savedImage) setShowcaseImage(savedImage);
    if (savedReviewId) setSelectedReviewId(savedReviewId);

    fetchStudents();
  }, []);

  // Update selected student when studentId changes
  useEffect(() => {
    if (selectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === parseInt(selectedStudentId)); // Convert selectedStudentId to number for comparison
      setSelectedStudent(student || null);
    }
  }, [selectedStudentId, students]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple image compression and conversion to base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions (compress to max 800px width)
      const maxWidth = 800;
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setShowcaseImage(compressedDataUrl);
    };

    img.src = URL.createObjectURL(file);
  };

  const save = () => {
    if (!selectedStudentId) {
      toast({
        title: "Error",
        description: "Please select a student first",
        variant: "destructive",
      });
      return;
    }

    if (!quote.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quote/personal statement",
        variant: "destructive",
      });
      return;
    }

    // Save spotlight data including selected review
    localStorage.setItem(LS_STUDENT_ID_KEY, selectedStudentId);
    localStorage.setItem(LS_QUOTE_KEY, quote.trim());
    localStorage.setItem(LS_SHOWCASE_IMAGE_KEY, showcaseImage || "");
    localStorage.setItem(LS_REVIEW_KEY, selectedReviewId || "");

    toast({
      title: "Success",
      description: "Spotlight settings saved successfully!",
    });
  };

  const reset = () => {
    setQuote("");
    setSelectedStudentId("");
    setShowcaseImage("");
    setSelectedReviewId("");
    setSelectedStudent(null);
    setReviews([]);
    
    localStorage.removeItem(LS_QUOTE_KEY);
    localStorage.removeItem(LS_STUDENT_ID_KEY);
    localStorage.removeItem(LS_SHOWCASE_IMAGE_KEY);
    localStorage.removeItem(LS_REVIEW_KEY);

    toast({
      title: "Success",
      description: "Spotlight settings reset successfully!",
    });
  };

  const selectedReview = reviews.find(r => r.id === selectedReviewId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">Spotlight Success Settings</h1>
        <p className="text-muted-foreground">
          Configure the featured student showcase that appears on the homepage.
        </p>
      </div>

      {/* Top: 2x2 grid of settings cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="student-select">Select Student</Label>
                {loadingStudents ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-muted-foreground">Loading students...</span>
                    </div>
                  ) : students.length === 0 ? (
                  <p className="text-sm text-red-600 mt-2">No students found. Please check your database connection.</p>
                ) : (
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a student to feature" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-sm text-muted-foreground">• {student.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote/Personal Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="quote">Student Quote</Label>
                <Textarea
                  id="quote"
                  placeholder="Enter an inspiring quote or personal statement from the student..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Showcase Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Upload Showcase Image</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                </div>
                {showcaseImage && (
                  <div className="mt-4">
                    <img
                      src={showcaseImage}
                      alt="Showcase preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Review Selection - always show the card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="review-select">Select Client Review (Optional)</Label>
                {!selectedStudentId ? (
                  <p className="text-sm text-muted-foreground">Select a student to view their reviews.</p>
                ) : loadingReviews ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-muted-foreground">Loading reviews...</span>
                  </div>
                ) : reviews.length > 0 ? (
                  <Select value={selectedReviewId} onValueChange={setSelectedReviewId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a review to feature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No review selected</SelectItem>
                      {reviews.map((review) => (
                        <SelectItem key={review.id} value={review.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {review.reviewer_name}
                              {review.reviewer_company && ` - ${review.reviewer_company}`}
                            </span>
                            <span className="text-sm text-muted-foreground truncate max-w-xs">
                              {"★".repeat(review.rating)} {review.review_text.substring(0, 60)}...
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews found for this student.</p>
                )}
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <Button onClick={save} className="flex-1 sm:flex-none sm:min-w-[180px]">Save Settings</Button>
        <Button onClick={reset} variant="outline" className="flex-1 sm:flex-none sm:min-w-[120px]">Reset</Button>
      </div>

      {/* Bottom: Full-width live preview */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold text-primary">Live Preview</h2>
        {selectedStudent ? (
          <FeaturedStudent
            student={{
              id: selectedStudent.id,
              name: selectedStudent.name,
              title: selectedStudent.title,
              avatarUrl: selectedStudent.avatarUrl || '',
              skills: selectedStudent.skills || [],
              quote: quote || '',
              showcaseImage: showcaseImage || undefined,
              clientReview: selectedReview
                ? {
                    text: selectedReview.review_text,
                    clientName: selectedReview.reviewer_company
                      ? `${selectedReview.reviewer_name}, ${selectedReview.reviewer_company}`
                      : selectedReview.reviewer_name,
                    rating: selectedReview.rating,
                  }
                : { text: '', clientName: '', rating: 0 },
            }}
            onViewProfile={() => navigate(`/view-student/${selectedStudent.id}`)}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Select a student to see the preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSpotlightSuccess;
