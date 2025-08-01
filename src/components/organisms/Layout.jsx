import { useState } from "react";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = ({ children, currentUser, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header 
        currentUser={currentUser}
        onLogout={onLogout}
        onToggleSidebar={toggleSidebar}
      />
      
      <div className="flex">
        <Sidebar 
          currentUser={currentUser}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;