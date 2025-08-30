import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, DollarSign, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhyHireStudents: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Rocket className="w-6 h-6 text-primary" />,
      title: "Fresh Ideas",
      description: "Students bring creativity and innovation"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      title: "Affordable Talent",
      description: "High-quality work at student-friendly rates"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
      title: "Support Future Leaders",
      description: "Every project helps students grow"
    }
  ];

  return (
    <Card className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 shadow-2xl mb-12 overflow-hidden">
      <CardContent className="p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Student Collaboration Image */}
          <div className="flex justify-center lg:justify-start">
            <img 
              src="/images/StudentsCollab.png" 
              alt="Students collaborating on laptops" 
              className="w-full max-w-sm h-auto rounded-lg"
            />
          </div>

          {/* Right side - Content */}
          <div className="text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Hire Students?
            </h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => navigate('/browse-students')}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg mt-6 transition-colors duration-200"
            >
              Hire Talented Students
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhyHireStudents;