import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ExpertCard = ({ 
  expert,
  isSelected = false,
  onClick,
  className,
  ...props 
}) => {
  return (
    <Card
      hover
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-primary-500 shadow-lg",
        className
      )}
      onClick={() => onClick?.(expert)}
      {...props}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {expert.displayName}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {expert.bio}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {expert.subjects?.slice(0, 3).map((subject, index) => (
              <Badge key={index} variant="primary" size="sm">
                {subject}
              </Badge>
            ))}
            {expert.subjects?.length > 3 && (
              <Badge variant="outline" size="sm">
                +{expert.subjects.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="FileText" className="w-4 h-4" />
              <span>{expert.contentCount} files</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" className="w-4 h-4 text-accent-500" />
              <span>Expert</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpertCard;