
import React from "react";
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
  skills: string;
}

interface PostJobFormProps {
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<JobFormData>();
  const [skillTags, setSkillTags] = React.useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = React.useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !skillTags.includes(currentSkill.trim())) {
      const newSkills = [...skillTags, currentSkill.trim()];
      setSkillTags(newSkills);
      setValue("skills", newSkills.join(", "));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skillTags.filter(skill => skill !== skillToRemove);
    setSkillTags(newSkills);
    setValue("skills", newSkills.join(", "));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            {...register("title", { required: "Job title is required" })}
            placeholder="e.g., Build E-commerce Website"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="company">Company/Organization *</Label>
          <Input
            id="company"
            {...register("company", { required: "Company name is required" })}
            placeholder="e.g., Local Boutique"
          />
          {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          placeholder="Describe what you need help with..."
          rows={4}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget">Budget Range *</Label>
          <Input
            id="budget"
            {...register("budget", { required: "Budget is required" })}
            placeholder="e.g., $500 - $1,000"
          />
          {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="duration">Expected Duration *</Label>
          <Input
            id="duration"
            {...register("duration", { required: "Duration is required" })}
            placeholder="e.g., 2-3 weeks"
          />
          {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact Email *</Label>
        <Input
          id="contactEmail"
          type="email"
          {...register("contactEmail", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          placeholder="your@email.com"
        />
        {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>}
      </div>

      <div>
        <Label>Required Skills</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a skill and press Enter"
            className="flex-1"
          />
          <Button type="button" onClick={addSkill} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillTags.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X 
                size={14} 
                className="cursor-pointer hover:text-red-500" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
        <Input type="hidden" {...register("skills")} />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Post Job
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PostJobForm;
