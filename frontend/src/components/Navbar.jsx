import React, { useState } from 'react';
import { Flame, Menu, X, Grid, Mail, LogOut, UserCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ 
  user,
  onLogout,
  onOpenLogin, 
  onOpenRegister, 
  onOpenContact
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isContact = location.pathname === '/contact';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-rose-200 text-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* 1. Logo with Name */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-5.5 h-5.5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  PDF<span className="text-rose-600">Forge</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links & Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Center Tabs: All Tools & Contact Us */}
            <nav className="flex items-center space-x-2.5">
              {/* 2. All Tools Tab */}
              <button
                onClick={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-extrabold border transition-all shadow-sm cursor-pointer ${
                  isHome 
                    ? 'text-rose-600 bg-rose-50 border-rose-300' 
                    : 'text-slate-800 hover:text-rose-600 border-rose-300 hover:border-rose-400 hover:bg-rose-50'
                }`}
              >
                <Grid className="w-4 h-4 text-rose-600" />
                <span>All Tools</span>
              </button>

              {/* 3. Contact */}
              <button
                onClick={() => {
                  if (onOpenContact) onOpenContact();
                  navigate('/contact');
                }}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-extrabold border transition-all shadow-sm cursor-pointer ${
                  isContact
                    ? 'text-rose-600 bg-rose-50 border-rose-300'
                    : 'text-slate-800 hover:text-rose-600 border-rose-300 hover:border-rose-400 hover:bg-rose-50'
                }`}
              >
                <Mail className="w-4 h-4 text-rose-600" />
                <span>Contact</span>
              </button>
            </nav>

            {/* Auth State Handling */}
            <div className="flex items-center space-x-2.5 ml-1">
              {user ? (
                /* User is Logged In */
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-slate-900 text-sm font-extrabold shadow-sm">
                    <span className="truncate max-w-[140px] text-rose-950">{user.name}</span>
                  </div>

                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-extrabold border border-rose-300 bg-white text-rose-700 hover:bg-rose-50 hover:border-rose-400 transition-all shadow-sm cursor-pointer"
                    title="Sign Out"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                /* User is NOT Logged In */
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => {
                      if (onOpenLogin) onOpenLogin();
                      navigate('/login');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-extrabold border transition-all shadow-sm cursor-pointer ${
                      isLogin
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'text-slate-800 hover:text-rose-600 border-rose-300 hover:border-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenRegister) onOpenRegister();
                      navigate('/register');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      isRegister
                        ? 'bg-red-700 text-white shadow-md'
                        : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-rose-600/20'
                    }`}
                  >
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-200 bg-white p-4 space-y-2.5 animate-in slide-in-from-top-2 duration-200 text-slate-900 shadow-2xl">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
              isHome ? 'bg-rose-50 text-rose-600 border border-rose-300 shadow-sm' : 'text-slate-800 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Grid className="w-4 h-4 text-rose-600" />
            <span>All Tools</span>
          </button>

          <button
            onClick={() => {
              if (onOpenContact) onOpenContact();
              navigate('/contact');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
              isContact ? 'bg-rose-50 text-rose-600 border border-rose-300 shadow-sm' : 'text-slate-800 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-600" />
            <span>Contact</span>
          </button>

          <div className="pt-2 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="px-4 py-2 bg-rose-50 rounded-xl text-sm font-extrabold text-slate-900 border border-rose-200">
                  Signed in as <span className="text-rose-600 font-extrabold">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-sm font-extrabold flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (onOpenLogin) onOpenLogin();
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-300 text-slate-800 hover:bg-rose-50 text-sm font-extrabold text-center cursor-pointer"
                >
                  <span>Login</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenRegister) onOpenRegister();
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white text-sm font-extrabold shadow-md text-center cursor-pointer"
                >
                  <span>Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
