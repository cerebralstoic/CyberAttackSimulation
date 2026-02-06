import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import LabInterface from "./components/LabInterface.jsx";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  return (
    <div className="bg-[#020617] min-h-screen text-gray-100">
      <Navbar />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        onLabSelect={setSelectedLab}
        selectedLabId={selectedLab?.id}
      />

      <main
        className={`pt-16 px-6 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {!selectedLab ? (
          <Dashboard onLabSelect={setSelectedLab} />
        ) : (
          <LabInterface lab={selectedLab} onBack={() => setSelectedLab(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
