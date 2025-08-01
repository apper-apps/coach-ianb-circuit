import "@/index.css";
import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { userService } from "@/services/api/userService";
import Layout from "@/components/organisms/Layout";
import AccountSettings from "@/components/pages/AccountSettings";
import UserManagement from "@/components/pages/UserManagement";
import SMEDashboard from "@/components/pages/SMEDashboard";
import Login from "@/components/pages/Login";
import PromptPassword from "@/components/pages/PromptPassword";
import SuperAdminDashboard from "@/components/pages/SuperAdminDashboard";
import ResetPassword from "@/components/pages/ResetPassword";
import Analytics from "@/components/pages/Analytics";
import UploadCenter from "@/components/pages/UploadCenter";
import ClientDashboard from "@/components/pages/ClientDashboard";
import Callback from "@/components/pages/Callback";
import QueryInterface from "@/components/pages/QueryInterface";
import ErrorPage from "@/components/pages/ErrorPage";
import Signup from "@/components/pages/Signup";
import { clearUser, setUser } from "@/store/userSlice";

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const currentUser = userState?.user;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
onError: function(error) {
        // Enhanced error handling to deal with various error object structures
        let errorMessage = "Authentication failed. Please try again.";
        
        if (error) {
          if (typeof error === 'string' && error.trim()) {
            errorMessage = error;
          } else if (error.message && error.message.trim()) {
            errorMessage = error.message;
          } else if (error.error && error.error.trim()) {
            errorMessage = error.error;
          } else if (error.stack && Array.isArray(error.stack) && error.stack.length > 0) {
            errorMessage = "Authentication error occurred. Please check your credentials.";
          } else if (typeof error === 'object' && Object.keys(error).length > 0) {
            errorMessage = "Authentication service error. Please try again later.";
          }
        }
        
        console.error("Authentication failed:", errorMessage);
        console.error("Full error object:", JSON.stringify(error, null, 2));
      }
    });

    // Create default admin user if none exists
    const createDefaultAdmin = async () => {
      try {
        const { userService } = await import('./services/api/userService');
        await userService.createDefaultAdmin();
      } catch (error) {
        console.error("Failed to create default admin:", error);
      }
};
    
    // Call createDefaultAdmin after SDK initialization
    createDefaultAdmin();
  }, []);// No props and state should be bound
// Create default admin user on initialization
  useEffect(() => {
    const createDefaultAdmin = async () => {
      if (isInitialized) {
        try {
          const { userService } = await import('@/services/api/userService');
          await userService.createDefaultAdmin();
        } catch (error) {
          console.error("Error during admin creation:", error);
        }
      }
    };
    
    createDefaultAdmin();
  }, [isInitialized]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          
          {/* Protected Routes */}
{isAuthenticated && currentUser && (
            <>
              {/* Client Routes */}
              {currentUser.role === "client" && (
                <>
                  <Route path="/" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><QueryInterface currentUser={currentUser} /></Layout>} />
                  <Route path="/chat" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><QueryInterface currentUser={currentUser} /></Layout>} />
                  <Route path="/account" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><AccountSettings currentUser={currentUser} /></Layout>} />
                </>
              )}
              
              {/* SME Routes */}
              {currentUser.role === "sme" && (
                <>
                  <Route path="/" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><SMEDashboard currentUser={currentUser} /></Layout>} />
                  <Route path="/uploads" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><UploadCenter currentUser={currentUser} /></Layout>} />
                  <Route path="/analytics" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><Analytics currentUser={currentUser} /></Layout>} />
                  <Route path="/account" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><AccountSettings currentUser={currentUser} /></Layout>} />
                </>
              )}
              
{/* Super Admin Routes */}
              {currentUser.role === "super_admin" && (
                <>
                  <Route path="/" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><SuperAdminDashboard currentUser={currentUser} /></Layout>} />
                  <Route path="/chat" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><QueryInterface currentUser={currentUser} /></Layout>} />
                  <Route path="/uploads" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><UploadCenter currentUser={currentUser} /></Layout>} />
                  <Route path="/analytics" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><Analytics currentUser={currentUser} /></Layout>} />
                  <Route path="/users" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><UserManagement currentUser={currentUser} /></Layout>} />
                  <Route path="/account" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><AccountSettings currentUser={currentUser} /></Layout>} />
                </>
              )}
              
              {/* Fallback Routes - Prevent blank screen for role mismatches */}
              {currentUser.role !== "client" && currentUser.role !== "sme" && currentUser.role !== "super_admin" && (
                <>
                  {console.warn("User role not recognized:", currentUser.role, "Defaulting to query interface")}
                  <Route path="/" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><QueryInterface currentUser={currentUser} /></Layout>} />
                  <Route path="/chat" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><QueryInterface currentUser={currentUser} /></Layout>} />
                  <Route path="/account" element={<Layout currentUser={currentUser} onLogout={authMethods.logout}><AccountSettings currentUser={currentUser} /></Layout>} />
                </>
              )}
            </>
          )}
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;