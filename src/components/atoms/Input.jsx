import React, { forwardRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
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
  const [showPassword, setShowPassword] = useState(false);
  
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
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
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "hover:border-gray-400",
            error && "border-error focus:ring-error",
            isPasswordType && "pr-12", // Add padding for toggle button
            className
          )}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            tabIndex={-1}
          >
            <ApperIcon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={20}
            />
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;