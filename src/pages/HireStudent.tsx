import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, CheckCircle, Smartphone, Mail, MapPin, ChevronRight, ChevronLeft, Clock, Star, CalendarDays, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const HireStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1 = Details, 2 = Schedule, 3 = Review, 4 = Confirm
    const [date, setDate] = useState<Date>();

    // Derived state for intro card logic (mocked logic for now)
    const [isOnline, setIsOnline] = useState(true); // Ideally check real presence

    const [formData, setFormData] = useState({
        projectTitle: '', // Mapped to "Consultation Topic"
        description: '',
        duration: '30 min',
        timeSlot: '',
        budget: '',
        timeline: '',
        projectType: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!id) return;
            setLoading(true);

            // 1. Try 'profiles'
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', id)
                .maybeSingle();

            if (profileData) {
                setStudent({
                    name: [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || profileData.display_name,
                    title: profileData.title || 'Student',
                    rate: profileData.hourly_rate || '$25/hr',
                    avatarUrl: profileData.avatar_url,
                    location: profileData.city || 'Remote',
                    email: profileData.email
                });
                setLoading(false);
                return;
            }

            // 2. Try 'prelaunch_signups'
            const isNumericId = /^\d+$/.test(id);
            const col = isNumericId ? 'id' : 'cic_id';
            const val = isNumericId ? Number(id) : id;
            const { data: waitlistData } = await supabase
                .from('prelaunch_signups')
                .select('*')
                .eq(col, val)
                .maybeSingle();

            if (waitlistData) {
                setStudent({
                    name: [waitlistData.first_name, waitlistData.last_name].filter(Boolean).join(' ') || waitlistData.display_name,
                    title: waitlistData.title || 'Student',
                    rate: waitlistData.price || '$25/hr',
                    avatarUrl: waitlistData.avatar_url,
                    location: waitlistData.city || 'Remote',
                    email: waitlistData.email
                });
            }
            setLoading(false);
        };
        fetchStudent();
    }, [id]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // Go to confirmation step instead of showing success immediately
            setCurrentStep(4);
            toast({
                title: "Request Sent!",
                description: `Your consultation request has been sent to ${student?.name}.`,
            });
        }, 1500);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (!student) return <div>Student not found</div>;

    if (success) {
        return (
            <div className="container mx-auto max-w-2xl p-8 min-h-[80vh] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Request Sent!</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    We've notified {student.name} about your consultation request for "<strong>{formData.projectTitle}</strong>". You'll receive a confirmation email once they accept.
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
                    <Button onClick={() => navigate('/client-dashboard')}>Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    // Unified Steps Definition
    const steps = [
        { id: 1, label: "Intro" },
        { id: 2, label: "Details" },
        { id: 3, label: "Schedule" },
        { id: 4, label: "Review" },
        { id: 5, label: "Confirm" }
    ];

    // Helper navigators
    // Note: currentStep is 0-indexed in state? Using 1-based for the steps array logic above for display.
    // Let's standardise: currentStep state 0..3
    // Step 1 (Intro) = 0
    // Step 2 (Details) = 1
    // Step 3 (Schedule) = 2
    // Step 4 (Review) = 3

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-2 md:p-3 pt-4 md:pt-6 animate-in fade-in duration-500">
            {/* Header / Nav Area */}
            <div className="w-full max-w-2xl px-2 mb-2 md:mb-3">
                {currentStep > 0 && (
                    <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent hover:text-primary text-sm" onClick={prevStep}>
                        <ArrowLeft className="mr-1 h-3 w-3" /> Back
                    </Button>
                )}

                {/* Step Indicator */}
                <div className="flex items-center justify-center relative mb-3 md:mb-4">
                    {/* Steps */}
                    {steps.map((step, index) => {
                        const stepIndex = step.id - 1;
                        const isCompleted = currentStep > stepIndex;
                        const isCurrent = currentStep === stepIndex;
                        const isUpcoming = currentStep < stepIndex;

                        return (
                            <div key={step.id} className="flex items-center">
                                {/* Step Circle */}
                                <div
                                    className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 relative z-10",
                                        isCompleted && "bg-primary border-2 border-primary text-primary-foreground shadow-lg shadow-primary/30",
                                        isCurrent && "bg-primary border-2 border-primary text-primary-foreground shadow-lg shadow-primary/30",
                                        isUpcoming && "bg-muted/50 border-2 border-muted-foreground/20 text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                                    ) : (
                                        step.id
                                    )}
                                </div>

                                {/* Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "h-[2px] w-16 md:w-24 transition-all duration-300",
                                            currentStep > stepIndex ? "bg-primary" : "bg-muted-foreground/20"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Centered Content Card */}
            <div className="w-full max-w-2xl mb-2">

                {/* Step 0: Intro / Confirm Hiring */}
                {currentStep === 0 && (
                    <div className="space-y-2 md:space-y-3">
                        <div className="text-center mb-2 space-y-0.5">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Confirm Hiring</h1>
                            <p className="text-muted-foreground text-xs md:text-sm">Review the student details before proceeding</p>
                        </div>

                        <div className="bg-card/80 backdrop-blur-xl text-card-foreground rounded-2xl border border-border/40 shadow-2xl shadow-primary/5 p-3 md:p-4 space-y-2 md:space-y-3 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                            {/* Student Details Box */}
                            <div className="border border-border/40 rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm relative z-10">
                                <Avatar className="h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-primary/20 shadow-lg shadow-primary/10 ring-2 ring-background">
                                    <AvatarImage src={student.avatarUrl} className="object-cover" />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <h2 className="text-base md:text-lg font-bold">{student.name}</h2>
                                    <p className="text-muted-foreground text-xs md:text-sm">{student.title}</p>
                                    <div className="flex items-center gap-2 pt-0.5">
                                        <div className="flex items-center text-yellow-500 gap-0.5 text-xs md:text-sm font-medium">
                                            <Star className="w-3 h-3 md:w-4 h-4 fill-current" />
                                            <span>4.9</span>
                                        </div>
                                        <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                                            {student.rate}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 md:gap-3 relative z-10">
                                <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-border/40 rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-background/60 hover:border-primary/30 transition-all duration-300 group">
                                    <CalendarDays className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="font-semibold text-xs md:text-sm">Available Now</h3>
                                        <p className="text-[10px] md:text-xs text-muted-foreground">Can start immediately</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-border/40 rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-background/60 hover:border-primary/30 transition-all duration-300 group">
                                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="font-semibold text-xs md:text-sm">Quick Response</h3>
                                        <p className="text-[10px] md:text-xs text-muted-foreground">Replies within 2-4 hours</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold h-9 md:h-10 rounded-xl text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all relative z-10 border border-primary/20"
                                onClick={nextStep}
                            >
                                Continue with {student.name}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 1: Project Details */}
                {currentStep === 1 && (
                    <div className="space-y-2 md:space-y-3">
                        <div className="text-center mb-2 space-y-0.5">
                            <h2 className="text-lg md:text-xl font-bold">Project Details</h2>
                            <p className="text-muted-foreground text-xs md:text-sm">Tell {student.name} about your project</p>
                        </div>

                        <div className="bg-card/80 backdrop-blur-xl text-card-foreground rounded-2xl border border-border/40 shadow-2xl shadow-primary/5 p-4 md:p-6 space-y-3 md:space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                            {/* Project Type Chips */}
                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Project Type</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Web Development', 'UI/UX Design', 'Mobile App', 'Design System', 'Other'].map((type) => (
                                        <div
                                            key={type}
                                            onClick={() => setFormData({ ...formData, projectType: type })}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-300 font-medium text-xs md:text-sm",
                                                formData.projectType === type
                                                    ? "bg-gradient-to-r from-primary to-primary/90 border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                                    : "bg-background/50 backdrop-blur-sm border-border/40 hover:border-primary/40 hover:bg-background/80 hover:scale-105"
                                            )}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Consultation Topic (Formerly Project Title) - Keep this?
                             The screenshot didn't show 'Project Title', but it's useful.
                             I will keep 'Detail' inputs but style them cleanly
                          */}
                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Consultation Topic</Label>
                                <Input
                                    placeholder="e.g. New Website Build"
                                    className="h-8 md:h-9 bg-background/50 backdrop-blur-sm border-border/40 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.projectTitle}
                                    onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                                />
                            </div>

                            {/* Budget Range */}
                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Budget Range</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                                    <Input
                                        className="pl-8 h-8 md:h-9 bg-background/50 backdrop-blur-sm border-border/40 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="500 - 2,000"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Timeline</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <CalendarIcon className="w-4 h-4" />
                                    </span>
                                    <Input
                                        className="pl-10 h-8 md:h-9 bg-background/50 backdrop-blur-sm border-border/40 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="e.g. 2-3 weeks"
                                        value={formData.timeline}
                                        onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1.5 relative z-10">
                                <Button variant="outline" className="flex-1 h-8 md:h-9 rounded-lg text-xs md:text-sm border-border/40 hover:bg-background/80 hover:border-primary/30 transition-all" onClick={prevStep}>
                                    Go Back
                                </Button>
                                <Button
                                    className="flex-[2] h-8 md:h-9 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold text-xs md:text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 border border-primary/20 transition-all"
                                    onClick={nextStep}
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Schedule (Simplified Visuals) */}
                {currentStep === 2 && (
                    <div className="space-y-2 md:space-y-3">
                        <div className="text-center mb-2 space-y-0.5">
                            <h2 className="text-lg md:text-xl font-bold">Schedule Consultation</h2>
                            <p className="text-muted-foreground text-xs md:text-sm">Pick a time that works for you</p>
                        </div>

                        <div className="bg-card/80 backdrop-blur-xl text-card-foreground rounded-2xl border border-border/40 shadow-2xl shadow-primary/5 p-3 md:p-4 space-y-2 md:space-y-3 animate-in fade-in slide-in-from-right-4 duration-300 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Preferred Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full h-8 md:h-9 justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-border/40 rounded-lg text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Time Preference</Label>
                                <Select value={formData.timeSlot} onValueChange={(val) => setFormData({ ...formData, timeSlot: val })}>
                                    <SelectTrigger className="h-8 md:h-9 bg-background/50 backdrop-blur-sm border-border/40 rounded-lg text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all">
                                        <SelectValue placeholder="Select best time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Morning (9am - 12pm)">Morning (9am - 12pm)</SelectItem>
                                        <SelectItem value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</SelectItem>
                                        <SelectItem value="Evening (4pm - 8pm)">Evening (4pm - 8pm)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5 relative z-10">
                                <Label className="text-xs md:text-sm font-medium">Duration</Label>
                                <Select value={formData.duration} onValueChange={(val) => setFormData({ ...formData, duration: val })}>
                                    <SelectTrigger className="h-8 md:h-9 bg-background/50 backdrop-blur-sm border-border/40 rounded-lg text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all">
                                        <SelectValue placeholder="How long?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15 min">15 min (Quick Chat)</SelectItem>
                                        <SelectItem value="30 min">30 min (Standard)</SelectItem>
                                        <SelectItem value="1 hour">1 hour (Deep Dive)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-1.5 relative z-10">
                                <Button variant="outline" className="flex-1 h-8 md:h-9 rounded-lg text-xs md:text-sm border-border/40 hover:bg-background/80 hover:border-primary/30 transition-all" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button
                                    className="flex-[2] h-8 md:h-9 rounded-lg font-semibold text-xs md:text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 border border-primary/20 transition-all"
                                    onClick={nextStep}
                                >
                                    Review Details
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review / Confirm */}
                {currentStep === 3 && (
                    <div className="space-y-2 md:space-y-3">
                        <div className="text-center mb-2 space-y-0.5">
                            <h2 className="text-lg md:text-xl font-bold">Review Request</h2>
                            <p className="text-muted-foreground text-xs md:text-sm">Verify details before sending</p>
                        </div>

                        <div className="bg-card/80 backdrop-blur-xl text-card-foreground rounded-2xl border border-border/40 shadow-2xl shadow-primary/5 p-3 md:p-4 space-y-2 md:space-y-3 animate-in fade-in slide-in-from-right-4 duration-300 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                            <div className="bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm p-3 rounded-xl space-y-2 border border-border/40 relative z-10">
                                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                                    <Avatar className="h-10 w-10 md:h-12 md:w-12">
                                        <AvatarImage src={student.avatarUrl} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">{student.name}</p>
                                        <p className="text-xs text-muted-foreground">{student.title}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] md:text-xs uppercase tracking-wider">Project</span>
                                        <span className="font-medium">{formData.projectType || 'General'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] md:text-xs uppercase tracking-wider">Topic</span>
                                        <span className="font-medium truncate block">{formData.projectTitle}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] md:text-xs uppercase tracking-wider">Budget</span>
                                        <span className="font-medium">${formData.budget || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] md:text-xs uppercase tracking-wider">Timeline</span>
                                        <span className="font-medium">{formData.timeline || 'Flexible'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] md:text-xs uppercase tracking-wider">When</span>
                                        <span className="font-medium">{date ? format(date, 'MMM d') : 'ASAP'} ({formData.timeSlot.split(' ')[0]})</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] md:text-xs uppercase tracking-wider">Duration</span>
                                        <span className="font-medium">{formData.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 relative z-10">
                                <Button variant="outline" className="flex-1 h-10 md:h-11 rounded-lg text-sm border-border/40 hover:bg-background/80 hover:border-primary/30 transition-all" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button
                                    className="flex-[2] h-8 md:h-9 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold text-xs md:text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 border border-primary/20 transition-all"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Request Consultation"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirmation / Almost There */}
                {currentStep === 4 && (
                    <div className="space-y-2 md:space-y-3">
                        <div className="text-center mb-2 space-y-0.5">
                            <h2 className="text-lg md:text-xl font-bold">Almost There!</h2>
                            <p className="text-muted-foreground text-xs md:text-sm">Your request is being sent to {student.name}</p>
                        </div>

                        <div className="bg-card/80 backdrop-blur-xl text-card-foreground rounded-2xl border border-border/40 shadow-2xl shadow-primary/5 p-3 md:p-4 space-y-3 md:space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                            {/* Success Icon */}
                            <div className="flex justify-center relative z-10">
                                <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 rounded-full flex items-center justify-center">
                                    <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                                </div>
                            </div>

                            {/* Notification Sent */}
                            <div className="text-center space-y-1 relative z-10">
                                <h3 className="text-base md:text-lg font-bold">Notification Sent!</h3>
                                <p className="text-muted-foreground text-xs md:text-sm">
                                    {student.name} will receive your project details and respond within 2-4 hours.
                                </p>
                            </div>

                            {/* What happens next */}
                            <div className="bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-border/40 relative z-10">
                                <h4 className="font-semibold text-sm md:text-base mb-2">What happens next?</h4>
                                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>{student.name} reviews your project details</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>They'll send you a custom proposal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>You can chat directly to discuss specifics</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>Once agreed, work begins!</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Complete Request Button */}
                            <Button
                                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold h-9 md:h-10 rounded-xl text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all relative z-10 border border-primary/20"
                                onClick={() => navigate('/')}
                            >
                                Complete Request
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HireStudent;
