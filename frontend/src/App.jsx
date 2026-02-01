import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
  };

  return (
    <div className="bg-[#020617] min-h-screen text-gray-100">
      
      <Navbar />

   
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onLabSelect={handleLabSelect}
        selectedLabId={selectedLab?.id}
      />

    
      <main
        className={`min-h-screen bg-[#120c33] transition-all duration-300
          pt-16 px-6
          ${sidebarCollapsed ? "ml-16" : "ml-64"}
        `}
      >
        <Dashboard sidebarCollapsed={sidebarCollapsed} />
      </main>
    </div>
  );
}

export default App;
