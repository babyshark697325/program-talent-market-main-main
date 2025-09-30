import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface JobFormData {
  title: string;
  company: string;
  description: string;
  budget: string;
  duration: string;
  contactEmail: string;
  skills?: string; // comma-separated list on submit
}

interface PostJobFormProps {
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
}

const noFocusRing =
  "focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none";

const PostJobForm: React.FC<PostJobFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>();

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (skills.includes(s)) {
      setSkillInput("");
      return;
    }
    setSkills(prev => [...prev, s]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const onFormSubmit = (data: JobFormData) => {
    const payload: JobFormData = {
      ...data,
      skills: skills.join(", "),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Row 1: Title / Company */}
      <div>
        <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          {...register("title", { required: "Job title is required" })}
          placeholder="e.g., Build E-commerce Website"
          className={noFocusRing}
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="company">Company/Organization <span className="text-red-500">*</span></Label>
        <Input
          id="company"
          {...register("company", { required: "Company name is required" })}
          placeholder="e.g., Local Boutique"
          className={noFocusRing}
        />
        {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>}
      </div>

      {/* Row 2: Description (full width) */}
      <div className="md:col-span-2">
        <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          placeholder="I would like a website for my upcoming boutique..."
          rows={5}
          className={noFocusRing}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Row 3: Budget / Duration */}
      <div>
        <Label htmlFor="budget">Budget Range <span className="text-red-500">*</span></Label>
        <Input
          id="budget"
          {...register("budget", { required: "Budget is required" })}
          placeholder="e.g., $2,000 - $3,500"
          className={noFocusRing}
        />
        {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget.message}</p>}
      </div>

      <div>
        <Label htmlFor="duration">Expected Duration <span className="text-red-500">*</span></Label>
        <Input
          id="duration"
          {...register("duration", { required: "Duration is required" })}
          placeholder="e.g., 2–3 weeks"
          className={noFocusRing}
        />
        {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>}
      </div>

      {/* Row 4: Contact Email (full width) */}
      <div className="md:col-span-2">
        <Label htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></Label>
        <Input
          id="contactEmail"
          type="email"
          {...register("contactEmail", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address",
            },
          })}
        
          placeholder="your@email.com"
          className={noFocusRing}
        />
        {errors.contactEmail && (
          <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>
        )}
      </div>

      {/* Row 5: Required Skills (full width) */}
      <div className="md:col-span-2">
        <Label htmlFor="skillsInput">Required Skills</Label>
        <div className="flex gap-3">
          <Input
            id="skillsInput"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Type a skill and press Enter"
            className={`flex-1 ${noFocusRing}`}
          />
          <Button type="button" variant="outline" onClick={addSkill}>
            Add
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((s) => (
              <Badge key={s} className="flex items-center gap-1 pr-1">
                <span>{s}</span>
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  onClick={() => removeSkill(s)}
                  className="ml-1 rounded hover:opacity-80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions (full width, big rectangles across bottom) */}
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button type="submit" className="w-full h-12 text-base">Post Job</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full h-12 text-base">Cancel</Button>
      </div>
    </form>
  );
};

export default PostJobForm;
