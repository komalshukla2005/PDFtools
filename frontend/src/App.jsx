import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolCard from './components/ToolCard';
import ProcessingModal from './components/ProcessingModal';
import AuthModal from './components/AuthModal';
import ContactPage from './components/ContactPage';
import FeatureSection from './components/FeatureSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import { TOOLS } from './data/toolsData';

import MergeTool from './components/tools/MergeTool';
import SplitTool from './components/tools/SplitTool';
import EditPdfTool from './components/tools/EditPdfTool';
import ZipTool from './components/tools/ZipTool';
import WatermarkTool from './components/tools/WatermarkTool';
import DeletePagesTool from './components/tools/DeletePagesTool';
import LockTool from './components/tools/LockTool';
import UnlockTool from './components/tools/UnlockTool';
import PdfToWordTool from './components/tools/PdfToWordTool';
import WordToPdfTool from './components/tools/WordToPdfTool';
import PdfToPptTool from './components/tools/PdfToPptTool';
import PdfToImagesTool from './components/tools/PdfToImagesTool';
import ImagesToPdfTool from './components/tools/ImagesToPdfTool';

import Toast from './components/Toast';

import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  Merge, 
  Scissors,
  Edit3, 
  Archive, 
  Stamp, 
  Trash2, 
  Lock, 
  Unlock, 
  FileText,
  FileCode,
  Presentation,
  FileImage, 
  Image as ImageIcon 
} from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [globalToast, setGlobalToast] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pdfforge_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('pdfforge_user', JSON.stringify(userData));
    setErrorMessage(null);
    setGlobalToast({
      type: 'success',
      message: 'Login successful!'
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pdfforge_user');
    setGlobalToast({
      type: 'info',
      message: 'You have been logged out.'
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const getToolIcon = (iconName) => {
    switch (iconName) {
      case 'Merge': return Merge;
      case 'Scissors': return Scissors;
      case 'Edit3': return Edit3;
      case 'Archive': return Archive;
      case 'Stamp': return Stamp;
      case 'Trash2': return Trash2;
      case 'Lock': return Lock;
      case 'Unlock': return Unlock;
      case 'FileText': return FileText;
      case 'FileCode': return FileCode;
      case 'Presentation': return Presentation;
      case 'FileImage': return FileImage;
      case 'Image': return ImageIcon;
      default: return Merge;
    }
  };

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartProcess = (initialProgress = 10, text = 'Initializing...') => {
    setModalOpen(true);
    setIsProcessing(true);
    setProgress(initialProgress);
    setStatusText(text);
    setErrorMessage(null);
  };

  const handleProcessFinished = (url, filename, successMessage) => {
    setIsProcessing(false);
    setProgress(100);
    setStatusText('Complete!');
    setDownloadUrl(url);
    setDownloadFilename(filename);
    if (successMessage) {
      setGlobalToast({
        type: 'success',
        message: successMessage
      });
    }
  };

  const handleProcessError = (msg) => {
    setIsProcessing(false);
    setModalOpen(false);
    setGlobalToast({
      type: 'error',
      message: msg || 'An error occurred while processing PDF'
    });
  };

  const commonToolProps = {
    onStartProcess: handleStartProcess,
    onProcessFinished: handleProcessFinished,
    onProcessError: handleProcessError
  };

  const renderToolWorkspace = (tool, Component) => {
    if (!tool) return null;
    const ToolIcon = getToolIcon(tool.icon);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-slate-900 mb-8 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border bg-rose-50 hover:bg-rose-100 border-rose-300 text-slate-900 hover:text-rose-700 text-sm sm:text-base font-extrabold transition-all shrink-0 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4.5 h-4.5 text-rose-600" />
                <span>Back to All Tools</span>
              </button>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white flex items-center justify-center shadow-md shrink-0">
                <ToolIcon className="w-6 h-6" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {tool.title}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <span className="px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-extrabold flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{tool.badge}</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-extrabold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Private</span>
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-lg text-slate-600 font-medium mt-3 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {user ? (
          <div className="text-slate-900">
            <Component {...commonToolProps} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-rose-300 shadow-2xl text-center space-y-6 max-w-2xl mx-auto my-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-rose-600" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
                🔒 Mandatory Authentication Required
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Login Required to Access {tool.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
                You must be signed in to use PDFForge tools and process PDF files. Please log in or create a free account to continue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Sign In to Unlock Tool
              </button>

              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-slate-800 font-extrabold text-base transition-all cursor-pointer"
              >
                Create Free Account
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col libertinus-math-regular font-['Libertinus_Math',system-ui] bg-halka-red-gradient text-slate-900 bg-grid-pattern-red">
      
      {globalToast && (
        <Toast
          type={globalToast.type}
          message={globalToast.message}
          onClose={() => setGlobalToast(null)}
          duration={5000}
        />
      )}

      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => navigate('/login')}
        onOpenRegister={() => navigate('/register')}
        onOpenContact={() => navigate('/contact')}
      />

      <main className="flex-grow">
        
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 flex items-center justify-between text-base shadow-sm font-bold">
              <span>⚠️ {errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="font-extrabold underline text-sm ml-4 hover:text-rose-950 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Hero
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        Available PDF Tools ({filteredTools.length})
                      </h2>
                      <p className="text-base sm:text-lg text-rose-100 font-medium mt-1.5">
                        Select any feature below to process files in your browser (Login required)
                      </p>
                    </div>
                  </div>

                  {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                      {filteredTools.map((tool) => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          onSelect={() => {
                            if (!user) {
                              navigate('/login');
                              setErrorMessage('🔒 Login Required: Please sign in or register to use any PDF tool.');
                            } else {
                              navigate(tool.path);
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 rounded-3xl p-8 bg-white border border-rose-300 text-slate-700 shadow-sm">
                      <p className="text-xl font-bold">No tools found matching "{searchQuery}".</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-md shadow-rose-600/25 cursor-pointer"
                      >
                        Reset Search & Filters
                      </button>
                    </div>
                  )}
                </section>

                <FeatureSection />
                <FAQSection />
              </div>
            }
          />

          <Route
            path="/merge-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'merge'), MergeTool)}
          />
          <Route
            path="/split-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'split'), SplitTool)}
          />
          <Route
            path="/edit-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'edit-pdf'), EditPdfTool)}
          />
          <Route
            path="/make-zip"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'zip'), ZipTool)}
          />
          <Route
            path="/add-watermark"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'watermark'), WatermarkTool)}
          />
          <Route
            path="/delete-pages"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'delete-pages'), DeletePagesTool)}
          />
          <Route
            path="/lock-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'lock'), LockTool)}
          />
          <Route
            path="/unlock-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'unlock'), UnlockTool)}
          />
          <Route
            path="/pdf-to-word"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'pdf-to-word'), PdfToWordTool)}
          />
          <Route
            path="/word-to-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'word-to-pdf'), WordToPdfTool)}
          />
          <Route
            path="/pdf-to-ppt"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'pdf-to-ppt'), PdfToPptTool)}
          />
          <Route
            path="/pdf-to-images"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'pdf-to-img'), PdfToImagesTool)}
          />
          <Route
            path="/images-to-pdf"
            element={renderToolWorkspace(TOOLS.find(t => t.id === 'img-to-pdf'), ImagesToPdfTool)}
          />

          <Route
            path="/login"
            element={
              <AuthModal
                isOpen={true}
                mode="login"
                onClose={() => navigate('/')}
                onSwitchMode={(mode) => navigate(`/${mode}`)}
                onLoginSuccess={(userData) => {
                  handleLoginSuccess(userData);
                  navigate('/');
                }}
              />
            }
          />
          <Route
            path="/register"
            element={
              <AuthModal
                isOpen={true}
                mode="register"
                onClose={() => navigate('/')}
                onSwitchMode={(mode) => navigate(`/${mode}`)}
                onLoginSuccess={(userData) => {
                  handleLoginSuccess(userData);
                  navigate('/');
                }}
              />
            }
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 px-4 py-2 bg-white text-rose-900 font-bold rounded-xl cursor-pointer"
                >
                  Return Home
                </button>
              </div>
            }
          />
        </Routes>

      </main>

      <ProcessingModal
        isOpen={modalOpen}
        isProcessing={isProcessing}
        progress={progress}
        statusText={statusText}
        downloadUrl={downloadUrl}
        downloadFilename={downloadFilename}
        onReset={() => {
          setModalOpen(false);
          setDownloadUrl(null);
        }}
        toolTitle="PDF"
      />

      <Footer
        onSelectTool={(id) => {
          const t = TOOLS.find(tool => tool.id === id);
          if (t) {
            if (!user) {
              navigate('/login');
              setErrorMessage('🔒 Login Required: Please sign in or register to use any PDF tool.');
            } else {
              navigate(t.path);
            }
          }
        }}
      />

    </div>
  );
}