import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ChatMessage = ({ 
  message,
  isUser = false,
  isTyping = false,
  sources = [],
  timestamp,
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex gap-4 mb-6", isUser ? "justify-end" : "justify-start", className)} {...props}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="Bot" className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className={cn("max-w-[80%] space-y-2", isUser && "order-first")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser 
              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white ml-auto" 
              : "bg-white border border-gray-200 text-gray-900"
          )}
        >
          {isTyping ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">AI is thinking</span>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          )}
        </div>
        
        {sources && sources.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <Badge key={index} variant="outline" size="sm">
                <ApperIcon name="FileText" className="w-3 h-3 mr-1" />
                {source}
              </Badge>
            ))}
          </div>
        )}
        
        {timestamp && (
          <div className={cn("text-xs text-gray-500", isUser && "text-right")}>
            {format(new Date(timestamp), "HH:mm")}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;