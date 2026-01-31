import {Shield, User} from 'lucide-react';

const Navbar = () => {
   const navItems = [
    { id: 'dashboard' , label: 'Dashboard' },
    { id: 'labs' , label: 'Labs' },
    { id: 'progress' , label: 'Progress' },
    { id: 'about' , label: 'About' },
  ];
  const currentView = 'dashboard';

  const onNavigate = (viewId) => {
    console.log(`Navigating to ${viewId}`);
  };
  return (
     <nav className="bg-[#0d1238] border-b border-gray-800 h-16 flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3 mr-12">
        <Shield className="size-7 text-blue-500" />
        <span className="text-xl font-semibold tracking-tight text-white">Cyber Attack Simulation</span>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === item.id
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Active Session</span>
        </div>
        <button className="size-9 bg-gray-800/50 rounded-lg flex items-center justify-center hover:bg-gray-700/50 transition-colors">
          <User className="size-5 text-gray-400" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar