import React from "react";
import { Spinner } from "./Spinner";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "dark";
}

export function Button({ 
  children, 
  isLoading, 
  variant = "primary", 
  className, 
  ...props 
}: ButtonProps) {
  const baseStyles = "cursor-pointer px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 backdrop-blur-md border shadow-sm hover:shadow-lg active:scale-95";
  
  const variants = {
    primary: "bg-black/80 text-white border-white/20 hover:bg-black/90",
    secondary: "bg-white/60 text-gray-800 border-white/60 hover:bg-white/80",
    dark: "bg-black/80 text-white border-white/20 hover:bg-black/90",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}