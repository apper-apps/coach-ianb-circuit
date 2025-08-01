import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200";
  
  const variants = {
    default: "p-6",
    compact: "p-4",
    large: "p-8",
    glass: "bg-white/80 backdrop-blur-sm border-white/20 shadow-xl"
  };
  
  const hoverStyles = hover ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer" : "";
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;