import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  options = [], 
  className, 
  label,
  error,
  required,
  placeholder = "Select an option",
  ...props 
}, ref) => {
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white transition-all duration-200 appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "hover:border-gray-400",
            error && "border-error focus:ring-error",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;