import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Sidebar } from './components/Sidebar.jsx'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
  };
  
  
  const [count, setCount] = useState(0)

  return (
    <>
    <main>
      <Navbar />
       <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onLabSelect={handleLabSelect}
        selectedLabId={selectedLab?.id}
      />
    </main>
    </>
  )
}

export default App
