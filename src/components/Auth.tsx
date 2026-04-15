import React from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { LogIn, LogOut } from 'lucide-react';

const Auth = () => {
  const { t } = useLanguage();
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-profile">
          <div className="user-info">
            {user.photoURL && <img src={user.photoURL} alt="User" className="avatar" />}
            <span className="user-name">{user.displayName}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={18} />
            {t('auth_logout')}
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="btn btn-primary btn-large">
          <LogIn size={20} />
          {t('auth_login')}
        </button>
      )}
      
      <style>{`
        .auth-container {
          display: flex;
          justify-content: flex-end;
          padding: 1rem;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--rotary-gold);
        }
        .user-name {
          font-weight: 600;
          color: var(--rotary-royal);
        }
        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: 50px;
        }
      `}</style>
    </div>
  );
};

export default Auth;
