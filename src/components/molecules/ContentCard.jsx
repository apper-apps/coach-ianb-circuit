import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const ContentCard = ({ 
  content,
  showActions = false,
  onEdit,
  onDelete,
  className,
  ...props 
}) => {
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf": return "FileText";
      case "video": return "Video";
      case "audio": return "Mic";
      case "ppt": return "Presentation";
      default: return "File";
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case "pdf": return "error";
      case "video": return "primary";
      case "audio": return "secondary";
      case "ppt": return "accent";
      default: return "default";
    }
  };

  return (
    <Card hover className={cn("group", className)} {...props}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <ApperIcon name={getFileIcon(content.type)} className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {content.title}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(content.uploadedAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          
          <Badge variant={getFileTypeColor(content.type)} size="sm">
            {content.type.toUpperCase()}
          </Badge>
        </div>
        
<div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Tag" className="w-4 h-4" />
            <span>{content.subject}</span>
          </div>
          
          {content.hasTranscription && (
            <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <ApperIcon name="FileAudio" className="w-3 h-3" />
              <span>Transcription available</span>
            </div>
          )}
          
          {content.metadata?.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {content.metadata.description}
            </p>
          )}
          
          {content.transcription && !content.metadata?.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {content.transcription.text}
            </p>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" onClick={() => onEdit?.(content)}>
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete?.(content)}>
                <ApperIcon name="Trash2" className="w-4 h-4 text-error" />
              </Button>
            </div>
            
            <Button size="sm" variant="outline">
              <ApperIcon name="Download" className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentCard;