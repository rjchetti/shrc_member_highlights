import { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Auth from './components/Auth';
import SubmissionForm from './components/SubmissionForm';
import AdminPanel from './components/AdminPanel';
import { Globe, Shield, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainContent = () => {
  const { t, language, setLanguage } = useLanguage();
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="https://www.rotary.org/sites/all/themes/rotary_foundation/favicons/favicon-32x32.png" alt="Rotary" />
            <span>SHRC Member Highlights</span>
          </div>

          <div className="nav-links desktop-only">
            <button className={`nav-btn ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
              <Home size={18} /> {t('nav_home')}
            </button>
            <button className={`nav-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
              <Shield size={18} /> {t('nav_admin')}
            </button>
            <button className="nav-btn lang-btn" onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}>
              <Globe size={18} /> {language.toUpperCase()}
            </button>
          </div>

          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}>{t('nav_home')}</button>
            <button onClick={() => { setView('admin'); setIsMobileMenuOpen(false); }}>{t('nav_admin')}</button>
            <button onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}>{language.toUpperCase()}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container">
        {view === 'home' ? (
          <div className="home-view">
            <header className="hero">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {t('title')}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hero-subtitle"
              >
                {t('subtitle')}
              </motion.p>
              <Auth />
            </header>

            <div className="content-section">
              <SubmissionForm />
            </div>
          </div>
        ) : (
          <AdminPanel />
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Seoul Hanmaum Rotary Club. District 3650.</p>
      </footer>

      <style>{`
        .layout { min-height: 100vh; display: flex; flex-direction: column; }
        .navbar { 
          background: white; 
          border-bottom: 2px solid var(--rotary-gold);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 0.75rem 0;
        }
        .nav-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; color: var(--rotary-royal); font-size: 1.2rem; }
        .nav-links { display: flex; gap: 1rem; }
        .nav-btn {
          border: none;
          background: transparent;
          color: var(--rotary-charcoal);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: var(--transition);
        }
        .nav-btn:hover { background: #f0f0f0; }
        .nav-btn.active { color: var(--rotary-blue); background: #eef2ff; }
        .lang-btn { background: var(--rotary-royal); color: white !important; }
        
        .hero { text-align: center; padding: 4rem 0; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; background: linear-gradient(45deg, var(--rotary-royal), var(--rotary-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-subtitle { font-size: 1.25rem; color: #666; max-width: 700px; margin: 0 auto 2rem; }
        
        .footer { margin-top: auto; padding: 2rem; text-align: center; border-top: 1px solid var(--rotary-grey); font-size: 0.9rem; color: #888; }
        
        .mobile-toggle { display: none; border: none; background: transparent; cursor: pointer; }
        .mobile-menu { display: none; }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-toggle { display: block; }
          .mobile-menu {
            display: flex;
            flex-direction: column;
            background: white;
            border-bottom: 1px solid var(--rotary-grey);
            padding: 1rem;
            gap: 1rem;
          }
          .mobile-menu button {
            padding: 1rem;
            text-align: left;
            border: none;
            background: #f8fafc;
            border-radius: 8px;
            font-weight: 600;
          }
          .hero h1 { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}

export default App;
