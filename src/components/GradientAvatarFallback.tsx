import React from "react";
import { AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientAvatarFallbackProps {
    children?: React.ReactNode;
    className?: string;
}

export const GradientAvatarFallback: React.FC<GradientAvatarFallbackProps> = ({
    children,
    className
}) => (
    <AvatarFallback className={cn("bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center", className)}>
        {children || <User className="w-1/2 h-1/2" />}
    </AvatarFallback>
);
