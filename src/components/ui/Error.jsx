import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry, 
  className,
  title = "Oops!",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)} {...props}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        
        {onRetry && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onRetry}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          If this problem persists, please contact support.
        </div>
      </div>
    </div>
  );
};

export default Error;