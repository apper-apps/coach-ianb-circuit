import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  label,
  error,
  required,
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "hover:border-gray-400",
          error && "border-error focus:ring-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;