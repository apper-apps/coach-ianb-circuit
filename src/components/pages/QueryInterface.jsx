import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ChatMessage from "@/components/molecules/ChatMessage";
import { expertService } from "@/services/api/expertService";
import { queryService } from "@/services/api/queryService";

const QueryInterface = ({ currentUser }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExpert, setSelectedExpert] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const loadExperts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await expertService.getAll();
      setExperts(data);
    } catch (err) {
      setError("Failed to load experts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const expertOptions = experts.map(expert => ({
    value: expert.Id.toString(),
    label: expert.displayName
  }));

  const subjectOptions = selectedExpert 
    ? experts.find(e => e.Id.toString() === selectedExpert)?.subjects?.map(subject => ({
        value: subject,
        label: subject
      })) || []
    : [];

  const handleExpertChange = (e) => {
    setSelectedExpert(e.target.value);
    setSelectedSubject("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    if (!selectedExpert) {
      toast.error("Please select an expert");
      return;
    }

    if (currentUser.role === "client" && currentUser.credits <= 0) {
      toast.error("You don't have enough credits for this query");
      return;
    }

    const userMessage = {
      Id: Date.now(),
      message: query,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    try {
      const queryData = {
        clientId: currentUser.Id,
        expertId: parseInt(selectedExpert),
        subject: selectedSubject || "General",
        question: query,
        creditsUsed: 1
      };

      const response = await queryService.create(queryData);
const aiMessage = {
        Id: Date.now() + 1,
        message: response.response,
        isUser: false,
        timestamp: new Date().toISOString(),
        sources: response.sources || [],
        isFromFallback: response.isFromFallback || false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      if (currentUser.role === "client") {
        if (response.isFromFallback) {
          toast.warning("Query processed with backup system. AI service may be unavailable.");
        } else {
          toast.success("Query processed successfully with AI!");
        }
      }

    } catch (err) {
      setIsTyping(false);
      toast.error("Failed to process your query. Please try again.");
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedExpert("");
    setSelectedSubject("");
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadExperts} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          AI Expert Consultation
        </h1>
        <p className="text-gray-600">
          Ask questions and get expert insights powered by AI
        </p>
        {currentUser.role === "client" && (
          <div className="mt-2 flex items-center justify-center space-x-2">
            <ApperIcon name="Coins" className="w-4 h-4 text-accent-600" />
            <span className="text-sm text-accent-700 font-medium">
              {currentUser.credits} credits available
            </span>
          </div>
        )}
      </div>

      {/* Expert and Subject Selection */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Select Expert"
            value={selectedExpert}
            onChange={handleExpertChange}
            options={expertOptions}
            placeholder="Choose an expert..."
            required
          />
          
          <Select
            label="Subject Area (Optional)"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={subjectOptions}
            placeholder="Choose a subject..."
            disabled={!selectedExpert}
          />
        </div>

        {selectedExpert && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
            {(() => {
              const expert = experts.find(e => e.Id.toString() === selectedExpert);
              return expert ? (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{expert.displayName}</h3>
                    <p className="text-sm text-gray-600">{expert.bio}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <ApperIcon name="FileText" className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{expert.contentCount} resources available</span>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </Card>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card className="h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversation</h2>
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearChat}>
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="MessageCircle" className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to help!</h3>
                    <p className="text-gray-600">
                      Select an expert and ask your first question to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.Id}
                      message={message.message}
                      isUser={message.isUser}
                      sources={message.sources}
                      timestamp={message.timestamp}
                    />
                  ))}
                  
                  {isTyping && (
                    <ChatMessage
                      message=""
                      isUser={false}
                      isTyping={true}
                    />
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Query Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex-1">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask your question here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="2"
                    disabled={isTyping}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!query.trim() || !selectedExpert || isTyping || (currentUser.role === "client" && currentUser.credits <= 0)}
                  className="px-6"
                >
                  {isTyping ? (
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Send" className="w-4 h-4" />
                  )}
                </Button>
              </form>
              
              {currentUser.role === "client" && currentUser.credits <= 0 && (
                <p className="text-sm text-error mt-2">
                  You need credits to ask questions. Please purchase more credits.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Available Experts</h3>
            <div className="space-y-3">
              {experts.slice(0, 4).map((expert) => (
                <div
                  key={expert.Id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedExpert === expert.Id.toString()
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                  onClick={() => setSelectedExpert(expert.Id.toString())}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {expert.displayName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {expert.contentCount} resources
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Lightbulb" className="w-4 h-4 text-accent-500 mt-0.5" />
                <p>Be specific in your questions for better answers</p>
              </div>
              <div className="flex items-start space-x-2">
                <ApperIcon name="Target" className="w-4 h-4 text-primary-500 mt-0.5" />
                <p>Select relevant subject areas when available</p>
              </div>
              <div className="flex items-start space-x-2">
                <ApperIcon name="BookOpen" className="w-4 h-4 text-secondary-500 mt-0.5" />
                <p>Responses include source references when available</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryInterface;