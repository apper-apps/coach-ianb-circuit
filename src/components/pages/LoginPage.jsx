import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import { mockUsers } from "@/services/mockData/users.json";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: "client", label: "Client - Query AI experts" },
    { value: "sme", label: "Subject Matter Expert - Upload content" },
    { value: "super_admin", label: "Super Admin - Full access" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email and role
      const user = mockUsers.find(u => 
        u.email.toLowerCase() === formData.email.toLowerCase() && 
        u.role === formData.role
      );

      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
      } else {
        toast.error("Invalid credentials or role selection");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userType) => {
    const user = mockUsers.find(u => u.role === userType);
    if (user) {
      setFormData({
        email: user.email,
        password: "password123",
        role: user.role
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Brain" className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Coach IanB AI
          </h1>
          <p className="text-gray-600 mt-2">
            Expert knowledge at your fingertips
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h2>
              <p className="text-sm text-gray-600">
                Choose your role and sign in to get started
              </p>
            </div>

            <Select
              name="role"
              label="Select Your Role"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
              required
              className="mb-4"
            />

            <Input
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />

            <Input
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.email || !formData.password || !formData.role}
            >
              {isLoading ? (
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Quick Login Demo */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Demo Access</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              onClick={() => quickLogin("client")}
              className="justify-start"
            >
              <ApperIcon name="User" className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Client Demo</div>
                <div className="text-xs text-gray-500">Query AI experts</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => quickLogin("sme")}
              className="justify-start"
            >
              <ApperIcon name="Lightbulb" className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Expert Demo</div>
                <div className="text-xs text-gray-500">Upload and manage content</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => quickLogin("super_admin")}
              className="justify-start"
            >
              <ApperIcon name="Crown" className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Admin Demo</div>
                <div className="text-xs text-gray-500">Full system access</div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Demo application - No real authentication required</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;