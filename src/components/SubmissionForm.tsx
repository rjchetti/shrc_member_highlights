import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, Globe, Info, AlertTriangle } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface SubmissionData {
  id?: string;
  fullName: string;
  clubName: string;
  email: string;
  phoneNumber: string;
  professionalTitle: string;
  company: string;
  highlightTitle: string;
  highlightText: string;
  photoUrl: string;
  monthYear: string;
  userId: string;
  status: 'pending' | 'selected' | 'archived';
  submittedAt: any;
}

const SubmissionForm = () => {
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingSubmissionId, setExistingSubmissionId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    clubName: '',
    email: '',
    phoneNumber: '',
    professionalTitle: '',
    company: '',
    highlightTitle: '',
    highlightText: '',
    photoUrl: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const currentMonthYear = new Date().toISOString().slice(0, 7); // YYYY-MM

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      checkExistingSubmission();
      setFormData(prev => ({ ...prev, email: user.email || '', fullName: user.displayName || '' }));
    }
  }, [user]);

  const checkExistingSubmission = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'submissions'),
        where('userId', '==', user.uid),
        where('monthYear', '==', currentMonthYear)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data() as SubmissionData;
        setExistingSubmissionId(querySnapshot.docs[0].id);
        setFormData({
          fullName: docData.fullName || '',
          clubName: docData.clubName || '',
          email: docData.email || '',
          phoneNumber: docData.phoneNumber || '',
          professionalTitle: docData.professionalTitle || '',
          company: docData.company || '',
          highlightTitle: docData.highlightTitle || '',
          highlightText: docData.highlightText || '',
          photoUrl: docData.photoUrl || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) { // 1MB limit
        setFileError(language === 'en' 
          ? 'File size must be under 1MB for this free version.' 
          : '파일 크기는 1MB 이하여야 합니다.');
        setFile(null);
      } else {
        setFileError(null);
        setFile(selectedFile);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let finalPhotoUrl = formData.photoUrl;
      if (file) {
        finalPhotoUrl = await fileToBase64(file);
      }

      const payload = {
        ...formData,
        photoUrl: finalPhotoUrl,
        userId: user.uid,
        monthYear: currentMonthYear,
        updatedAt: serverTimestamp(),
        status: 'pending' as const
      };

      if (existingSubmissionId) {
        await updateDoc(doc(db, 'submissions', existingSubmissionId), payload);
      } else {
        await addDoc(collection(db, 'submissions'), {
          ...payload,
          submittedAt: serverTimestamp(),
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="form-header">
        <h2>{existingSubmissionId ? t('form_update') : t('form_submit')}</h2>
        <button 
          className="lang-toggle"
          onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
        >
          <Globe size={18} />
          {language === 'en' ? '한국어' : 'English'}
        </button>
      </div>

      <p className="privacy-note">
        {t('form_consent')}
      </p>

      <form onSubmit={handleSubmit} className="highlight-form">
        <div className="grid">
          <div className="form-group">
            <label>{t('form_name')}</label>
            <input 
              className="form-input" 
              required 
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>{t('form_club')}</label>
            <input 
              className="form-input" 
              required 
              placeholder={t('form_district_note')}
              value={formData.clubName}
              onChange={e => setFormData({ ...formData, clubName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <label>{t('form_email')}</label>
            <input 
              className="form-input" 
              type="email" 
              required 
              readOnly
              value={formData.email}
            />
          </div>
          <div className="form-group">
            <label>{t('form_phone')}</label>
            <input 
              className="form-input" 
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <label>{t('form_role')}</label>
            <input 
              className="form-input" 
              required 
              value={formData.professionalTitle}
              onChange={e => setFormData({ ...formData, professionalTitle: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>{t('form_company')}</label>
            <input 
              className="form-input" 
              required 
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t('form_highlight_title')}</label>
          <input 
            className="form-input" 
            required 
            placeholder="e.g., Appointed as Regional Director"
            value={formData.highlightTitle}
            onChange={e => setFormData({ ...formData, highlightTitle: e.target.value })}
          />
        </div>

        <div className="writing-tip-box">
          <div className="tip-header">
            <Info size={18} />
            <span>{t('form_writing_tip_title')}</span>
          </div>
          <p>{t('form_writing_tip_body')}</p>
        </div>

        <div className="form-group">
          <label>{t('form_highlight')}</label>
          <RichTextEditor 
            value={formData.highlightText}
            onChange={(val) => setFormData({ ...formData, highlightText: val })}
            placeholder="Describe your achievement..."
          />
        </div>

        <div className="form-group">
          <label>{t('form_photo')}</label>
          <div className="file-upload-zone">
            {formData.photoUrl && !file && (
              <img src={formData.photoUrl} alt="Previous" className="preview-small" />
            )}
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={onFileChange}
              className={`file-input ${fileError ? 'error' : ''}`}
            />
            {fileError && (
              <p className="error-message">
                <AlertTriangle size={14} />
                {fileError}
              </p>
            )}
            <p className="field-hint">{t('form_photo_hint')} (Max 1MB)</p>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? <Loader2 className="spin" /> : <Send size={20} />}
          {existingSubmissionId ? t('form_update') : t('form_submit')}
        </button>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="success-banner"
            >
              <CheckCircle size={20} />
              {t('success_msg')}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <style>{`
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .lang-toggle {
          background: var(--rotary-white);
          border: 1px solid var(--rotary-grey);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--rotary-blue);
          transition: var(--transition);
        }
        .lang-toggle:hover {
          background: var(--rotary-blue);
          color: white;
        }
        .privacy-note {
          background: #fff9db;
          border-left: 4px solid var(--rotary-gold);
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .writing-tip-box {
          background: #eef2ff;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border: 1px solid #c7d2fe;
        }
        .tip-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--rotary-royal);
          margin-bottom: 0.5rem;
        }
        .writing-tip-box p {
          font-size: 0.9rem;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }
        .highlight-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--rotary-royal);
        }
        .btn-full {
          width: 100%;
          justify-content: center;
          padding: 1rem;
          font-size: 1.1rem;
          margin-top: 1rem;
        }
        .file-upload-zone {
          border: 2px dashed var(--rotary-grey);
          border-radius: 8px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        .preview-small {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }
        .success-banner {
          margin-top: 1rem;
          background: #d3f9d8;
          color: #2b8a3e;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-weight: 600;
        }
        .spin {
          animation: rotate 1s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default SubmissionForm;
