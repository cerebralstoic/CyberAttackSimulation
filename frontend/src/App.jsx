import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

import Navbar from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import LabInterface from "./components/LabInterface.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgetPass.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPage, setAuthPage] = useState("login");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  if (!user) {
    if (authPage === "signup") {
      return <SignupPage onNavigateToLogin={() => setAuthPage("login")} />;
    }

    if (authPage === "forgot") {
      return <ForgotPasswordPage onNavigateToLogin={() => setAuthPage("login")} />;
    }

    return (
      <LoginPage
        onNavigateToSignup={() => setAuthPage("signup")}
        onNavigateToForgotPassword={() => setAuthPage("forgot")}
      />
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen text-gray-100">
      <Navbar user={user} />

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
          <LabInterface
            lab={selectedLab}
            onBack={() => setSelectedLab(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
