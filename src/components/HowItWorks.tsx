import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Search, Handshake, Rocket } from "lucide-react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Browse Talent",
      description: "Discover skilled students ready to bring your projects to life. "
    },
    {
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: "Post Your Job",
      description: "Share what you need,and let top talent apply."
    },
    {
      icon: <Handshake className="w-8 h-8 text-primary" />,
      title: "Hire & Collaborate",
      description: "Chat, hire, and work directly with students."
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Launch Success",
      description: "Watch your project thrive with fresh ideas"
    }
  ];

  return (
    <Card className="w-full bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-primary/20 shadow-xl mb-12">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          How It Works
        </CardTitle>
        <p className="text-muted-foreground text-lg mt-2">
          Connect with talented students and professionals in just a few simple steps
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
              {/* Connector line removed for cleaner UI */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HowItWorks;