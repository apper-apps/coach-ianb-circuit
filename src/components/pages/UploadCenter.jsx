import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FileUploadZone from '@/components/molecules/FileUploadZone';
import Loading from '@/components/ui/Loading';
import { contentService } from '@/services/api/contentService';
import { transcriptionService } from '@/services/api/transcriptionService';

const UploadCenter = ({ currentUser }) => {
  const navigate = useNavigate();
const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [transcriptionStatus, setTranscriptionStatus] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    type: 'document',
    videoUrl: ''
  });

  const subjects = [
    'Mathematics', 'Science', 'Technology', 'Business', 'Arts', 'Language',
    'History', 'Psychology', 'Medicine', 'Engineering', 'Finance', 'Marketing'
  ];

  const handleFileSelect = useCallback((files) => {
    setSelectedFiles(Array.from(files));
    
    // Check if any files need transcription
    const hasMediaFiles = Array.from(files).some(file => 
      file.type.startsWith('audio/') || file.type.startsWith('video/')
    );
    
    if (hasMediaFiles) {
      setTranscriptionStatus({ isProcessing: false });
    }
  }, []);

const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValidVideoUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      // Check for common video platforms and file extensions
      const isVideoUrl = /\.(mp4|webm|mov|avi|mkv)$/i.test(urlObj.pathname) ||
                        urlObj.hostname.includes('youtube.com') ||
                        urlObj.hostname.includes('youtu.be') ||
                        urlObj.hostname.includes('vimeo.com') ||
                        urlObj.hostname.includes('dailymotion.com') ||
                        urlObj.hostname.includes('twitch.tv');
      return isVideoUrl;
    } catch {
      return false;
    }
  };

  const processTranscription = async (file) => {
    if (!transcriptionService.isSupported(file.type)) {
      return null;
    }

    setTranscriptionStatus({ isProcessing: true });
    
    try {
      const transcription = await transcriptionService.transcribeFile(file);
      setTranscriptionStatus({ isProcessing: false });
      toast.success(`Transcription completed for ${file.name}`);
      return transcription;
    } catch (error) {
      setTranscriptionStatus({ isProcessing: false });
      toast.error(`Transcription failed: ${error.message}`);
      return null;
    }
  };

const handleUpload = async () => {
    const hasFiles = selectedFiles.length > 0;
    const hasVideoUrl = formData.videoUrl.trim();

    if (!hasFiles && !hasVideoUrl) {
      toast.error('Please select files to upload or provide a video URL');
      return;
    }

    if (hasVideoUrl && !isValidVideoUrl(formData.videoUrl)) {
      toast.error('Please provide a valid video URL');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }

    setIsUploading(true);

    try {
      // Handle file uploads
      if (hasFiles) {
        for (const file of selectedFiles) {
          // Process transcription for media files
          let transcription = null;
          if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
            transcription = await processTranscription(file);
          }

          // Create content entry for file
          const contentData = {
            title: formData.title,
            subject: formData.subject,
            type: file.type.startsWith('video/') ? 'video' : 
                  file.type.startsWith('audio/') ? 'audio' : 'document',
            smeId: currentUser?.Id || 1,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            transcription,
            metadata: JSON.stringify({
              description: formData.description,
              originalFileName: file.name,
              uploadedBy: currentUser?.name || 'Expert User'
            })
          };

          await contentService.create(contentData);
        }
      }

      // Handle video URL
      if (hasVideoUrl) {
        const contentData = {
          title: formData.title,
          subject: formData.subject,
          type: 'video',
          fileUrl: formData.videoUrl,
          smeId: currentUser?.Id || 1,
          metadata: JSON.stringify({
            description: formData.description,
            source: 'url',
            uploadedBy: currentUser?.name || 'Expert User'
          })
        };

        await contentService.create(contentData);
      }

      const itemCount = selectedFiles.length + (hasVideoUrl ? 1 : 0);
      const itemType = hasVideoUrl && !hasFiles ? 'video URL' : 'file(s)';
      toast.success(`Successfully added ${itemCount} ${itemType}`);
      
      // Reset form
      setSelectedFiles([]);
      setFormData({
        title: '',
        subject: '',
        description: '',
        type: 'document',
        videoUrl: ''
      });
      setTranscriptionStatus(null);
      
      // Navigate back to dashboard
      navigate('/sme-dashboard');
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setTranscriptionStatus(null);
    }
  };

  const clearVideoUrl = () => {
    setFormData(prev => ({ ...prev, videoUrl: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Upload Content
          </h1>
          <p className="text-gray-600 mt-1">
            Share your expertise with automatic transcription for audio and video files
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/sme-dashboard')}
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Content Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter content title"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <Select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  disabled={isUploading}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your content (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  disabled={isUploading}
                />
              </div>
            </div>
          </Card>
<Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add Video URL
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <div className="relative">
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    placeholder="Enter video URL (YouTube, Vimeo, direct video link, etc.)"
                    disabled={isUploading}
                    className={formData.videoUrl && !isValidVideoUrl(formData.videoUrl) ? 'border-red-300' : ''}
                  />
                  {formData.videoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearVideoUrl}
                      disabled={isUploading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {formData.videoUrl && !isValidVideoUrl(formData.videoUrl) && (
                  <p className="text-xs text-red-600 mt-1">
                    Please enter a valid video URL
                  </p>
                )}
                {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
                    <ApperIcon name="CheckCircle" className="w-4 h-4" />
                    <span>Valid video URL detected</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Info" className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Supported video platforms:</p>
                  <p className="text-xs mt-1">
                    YouTube, Vimeo, Dailymotion, Twitch, or direct video file links (.mp4, .webm, .mov)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              File Upload
            </h2>
            
            <FileUploadZone
              onFileSelect={handleFileSelect}
              accept="*/*"
              multiple={true}
              showTranscriptionStatus={!!transcriptionStatus}
              transcriptionStatus={transcriptionStatus}
              disabled={isUploading}
            />

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Selected Files ({selectedFiles.length})
                </h3>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon 
                        name={
                          file.type.startsWith('video/') ? 'Video' :
                          file.type.startsWith('audio/') ? 'AudioLines' :
                          file.type.includes('pdf') ? 'FileText' : 'File'
                        } 
                        className="w-4 h-4 text-gray-600" 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                          {(file.type.startsWith('audio/') || file.type.startsWith('video/')) && 
                            ' • Will be transcribed'
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {selectedFiles.length === 0 && !formData.videoUrl && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Upload files or add a video URL above to get started
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Upload Summary */}
        <div className="space-y-6">
<Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Content Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Files selected:</span>
                <span className="font-medium">{selectedFiles.length}</span>
              </div>
              
              {formData.videoUrl && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Video URL:</span>
                  <span className="font-medium">
                    {isValidVideoUrl(formData.videoUrl) ? '✓ Valid' : '⚠ Invalid'}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total file size:</span>
                <span className="font-medium">
                  {selectedFiles.length > 0 
                    ? `${(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                    : '0 MB'
                  }
                </span>
              </div>

              {selectedFiles.some(file => file.type.startsWith('audio/') || file.type.startsWith('video/')) && (
                <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                  <ApperIcon name="FileAudio" className="w-4 h-4" />
                  <span>Auto-transcription enabled</span>
                </div>
              )}

              {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
                <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 p-2 rounded">
                  <ApperIcon name="Video" className="w-4 h-4" />
                  <span>Video URL will be processed</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="w-full mt-4"
            >
              {isUploading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Supported Formats
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="w-4 h-4" />
                <span>Documents: PDF, DOC, DOCX</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Video" className="w-4 h-4" />
                <span>Videos: MP4, WebM, MOV</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="AudioLines" className="w-4 h-4" />
                <span>Audio: MP3, WAV, M4A</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Presentation" className="w-4 h-4" />
                <span>Presentations: PPT, PPTX</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;