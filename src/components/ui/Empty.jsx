import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item.",
  icon = "FileText",
  action,
  actionLabel = "Get Started",
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)} {...props}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        
        {action && (
          <Button 
            onClick={action}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Zap" className="w-4 h-4 text-accent-500" />
            <span>Quick Setup</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Shield" className="w-4 h-4 text-success" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;