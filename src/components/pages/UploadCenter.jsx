import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import FileUploadZone from "@/components/molecules/FileUploadZone";
import ContentCard from "@/components/molecules/ContentCard";
import { contentService } from "@/services/api/contentService";

const UploadCenter = ({ currentUser }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    subject: "",
    description: ""
  });

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = currentUser.role === "super_admin" 
        ? await contentService.getAll()
        : await contentService.getBySME(currentUser.Id);
      
      setContent(data);
    } catch (err) {
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [currentUser.Id, currentUser.role]);

  const subjectOptions = [
    { value: "Leadership", label: "Leadership & Management" },
    { value: "Business Strategy", label: "Business Strategy" },
    { value: "Personal Development", label: "Personal Development" },
    { value: "Health & Wellness", label: "Health & Wellness" },
    { value: "Technology", label: "Technology" },
    { value: "Finance", label: "Finance" },
    { value: "Marketing", label: "Marketing" },
    { value: "Operations", label: "Operations" }
  ];

  const handleFileSelect = (files) => {
    setSelectedFiles(Array.isArray(files) ? files : [files]);
  };

  const handleUploadFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFileType = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "pdf";
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) return "video";
    if (["mp3", "wav", "m4a", "aac"].includes(extension)) return "audio";
    if (["ppt", "pptx"].includes(extension)) return "ppt";
    return "pdf"; // default
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (!uploadForm.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!uploadForm.subject) {
      toast.error("Please select a subject");
      return;
    }

    setUploadLoading(true);

    try {
      for (const file of selectedFiles) {
        const contentData = {
          smeId: currentUser.Id,
          title: selectedFiles.length === 1 ? uploadForm.title : `${uploadForm.title} - ${file.name}`,
          type: getFileType(file),
          fileUrl: `/uploads/${file.name}`,
          subject: uploadForm.subject,
          metadata: {
            description: uploadForm.description,
            fileName: file.name,
            fileSize: file.size,
            originalName: file.name
          }
        };

        await contentService.create(contentData);
      }

      toast.success(`Successfully uploaded ${selectedFiles.length} file(s)!`);
      setShowUploadModal(false);
      setSelectedFiles([]);
      setUploadForm({ title: "", subject: "", description: "" });
      loadContent();
    } catch (err) {
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (contentItem) => {
    if (!window.confirm("Are you sure you want to delete this content?")) {
      return;
    }

    try {
      await contentService.delete(contentItem.Id);
      toast.success("Content deleted successfully!");
      loadContent();
    } catch (err) {
      toast.error("Failed to delete content. Please try again.");
    }
  };

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContent} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser.role === "super_admin" ? "All Content" : "Content Library"}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentUser.role === "super_admin" 
              ? `Manage all content across the platform (${content.length} items)`
              : `Upload and manage your expert content (${content.length} items)`
            }
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Upload Content
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Files",
            value: content.length,
            icon: "FileText",
            color: "primary"
          },
          {
            label: "PDF Documents",
            value: content.filter(c => c.type === "pdf").length,
            icon: "FileText",
            color: "error"
          },
          {
            label: "Video Files",
            value: content.filter(c => c.type === "video").length,
            icon: "Video",
            color: "secondary"
          },
          {
            label: "Audio Files",
            value: content.filter(c => c.type === "audio").length,
            icon: "Mic",
            color: "accent"
          }
        ].map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <ApperIcon name={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      {content.length === 0 ? (
        <Empty
          title="No content uploaded yet"
          description="Start building your knowledge base by uploading your first piece of content."
          icon="Upload"
          action={() => setShowUploadModal(true)}
          actionLabel="Upload Content"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <ContentCard
              key={item.Id}
              content={item}
              showActions={true}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowUploadModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Upload New Content</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Files
                  </label>
                  <FileUploadZone
                    onFileSelect={handleFileSelect}
                    accept=".pdf,.mp4,.avi,.mov,.wmv,.mp3,.wav,.m4a,.aac,.ppt,.pptx"
                    multiple={true}
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                          >
                            <ApperIcon name="X" className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="title"
                    label="Content Title"
                    value={uploadForm.title}
                    onChange={handleUploadFormChange}
                    placeholder="Enter content title"
                    required
                  />

                  <Select
                    name="subject"
                    label="Subject Area"
                    value={uploadForm.subject}
                    onChange={handleUploadFormChange}
                    options={subjectOptions}
                    placeholder="Select subject area"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleUploadFormChange}
                    placeholder="Brief description of the content..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                {/* Upload Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploadLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploadLoading || selectedFiles.length === 0}
                  >
                    {uploadLoading ? (
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                    )}
                    {uploadLoading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadCenter;