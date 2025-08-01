import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import ClientDashboard from "@/components/pages/ClientDashboard";
import SMEDashboard from "@/components/pages/SMEDashboard";
import SuperAdminDashboard from "@/components/pages/SuperAdminDashboard";
import LoginPage from "@/components/pages/LoginPage";
import QueryInterface from "@/components/pages/QueryInterface";
import UploadCenter from "@/components/pages/UploadCenter";
import Analytics from "@/components/pages/Analytics";
import AccountSettings from "@/components/pages/AccountSettings";
import UserManagement from "@/components/pages/UserManagement";
import { useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState({
    Id: 1,
    email: "coach@ianb.ai",
    role: "super_admin",
    name: "Coach IanB",
    credits: 1000
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <LoginPage onLogin={handleLogin} />
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
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Layout currentUser={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            {/* Client Routes */}
            {currentUser.role === "client" && (
              <>
                <Route path="/" element={<QueryInterface currentUser={currentUser} />} />
                <Route path="/chat" element={<QueryInterface currentUser={currentUser} />} />
                <Route path="/account" element={<AccountSettings currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
            
            {/* SME Routes */}
            {currentUser.role === "sme" && (
              <>
                <Route path="/" element={<SMEDashboard currentUser={currentUser} />} />
                <Route path="/uploads" element={<UploadCenter currentUser={currentUser} />} />
                <Route path="/analytics" element={<Analytics currentUser={currentUser} />} />
                <Route path="/account" element={<AccountSettings currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
{/* Super Admin Routes */}
            {currentUser.role === "super_admin" && (
              <>
                <Route path="/" element={<SuperAdminDashboard currentUser={currentUser} />} />
                <Route path="/chat" element={<QueryInterface currentUser={currentUser} />} />
                <Route path="/uploads" element={<UploadCenter currentUser={currentUser} />} />
                <Route path="/analytics" element={<Analytics currentUser={currentUser} />} />
                <Route path="/users" element={<UserManagement currentUser={currentUser} />} />
                <Route path="/account" element={<AccountSettings currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </Layout>
        
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
    </BrowserRouter>
  );
}

export default App;