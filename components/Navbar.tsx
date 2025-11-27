import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, PlusCircle, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => 
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path) 
        ? 'bg-brand-600 text-white' 
        : 'text-gray-300 hover:bg-brand-900 hover:text-white'
    }`;

  const handleInspireMe = () => {
    window.dispatchEvent(new CustomEvent('inspire-me'));
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-accent-500" />
              <span className="text-xl font-bold text-white tracking-tight">Robo AI</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={navLinkClass('/')}>
                Explore
              </Link>
              <Link to="/create" className={navLinkClass('/create')}>
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Start Project
              </Link>
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Creator Studio
              </Link>
            </div>

            <button
              onClick={handleInspireMe}
              className="ml-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-orange-500/20 text-sm"
            >
              <Sparkles size={16} />
              <span className="hidden lg:inline">Inspire Me</span>
            </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Explore</Link>
            <Link to="/create" className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Start Project</Link>
            <Link to="/dashboard" className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Creator Studio</Link>
            <button
              onClick={() => {
                handleInspireMe();
                setIsOpen(false);
              }}
              className="w-full text-left text-amber-400 hover:bg-slate-700 hover:text-amber-300 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Sparkles size={18} /> Inspire Me
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;