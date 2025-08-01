import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FileUploadZone = ({ 
  onFileSelect, 
  accept = "*/*", 
  multiple = false,
  className,
  showTranscriptionStatus = false,
  transcriptionStatus = null,
  ...props 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFileSelect) {
      onFileSelect(multiple ? files : files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onFileSelect) {
      onFileSelect(multiple ? files : files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
        "hover:border-primary-400 hover:bg-primary-50/50",
        isDragOver && "border-primary-500 bg-primary-50 scale-[1.02]",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      {...props}
    >
      <input
ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {showTranscriptionStatus && transcriptionStatus && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name={transcriptionStatus.isProcessing ? "Loader2" : "FileAudio"} 
              className={`w-4 h-4 text-blue-600 ${transcriptionStatus.isProcessing ? 'animate-spin' : ''}`} 
            />
            <span className="text-sm text-blue-800 font-medium">
              {transcriptionStatus.isProcessing ? 'Transcribing audio/video...' : 'Transcription ready'}
            </span>
          </div>
          {transcriptionStatus.isProcessing && (
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="Upload" className="w-8 h-8 text-primary-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
<p className="text-gray-600 text-sm">
            Supports PDFs, videos, audio files, and presentations
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Audio and video files will be automatically transcribed
          </p>
        </div>
        
        <Button variant="outline" className="mt-4">
          <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>
    </div>
  );
};

export default FileUploadZone;