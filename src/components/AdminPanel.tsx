import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { generateClubRunnerHTML, type Submission } from '../utils/exporter';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportLang, setExportLang] = useState<'en' | 'ko'>('en');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleExport = () => {
    const selected = submissions.filter(s => selectedIds.has(s.id));
    if (selected.length === 0) return alert('Please select at least one highlight');
    
    const html = generateClubRunnerHTML(selected, exportLang);
    navigator.clipboard.writeText(html);
    alert('ClubRunner HTML copied to clipboard!');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <select value={exportLang} onChange={e => setExportLang(e.target.value as 'en' | 'ko')} className="btn">
            <option value="en">Export EN</option>
            <option value="ko">Export KO</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <Copy size={18} />
            Copy ClubRunner HTML
          </button>
        </div>
      </div>

      <div className="submission-list">
        {loading ? (
          <div className="loader">Loading submissions...</div>
        ) : (
          submissions.map(sub => (
            <motion.div 
              key={sub.id}
              className={`submission-card ${selectedIds.has(sub.id) ? 'selected' : ''}`}
              onClick={() => toggleSelection(sub.id)}
            >
              <img src={sub.photoUrl} alt="Member" className="admin-photo" />
              <div className="sub-info">
                <h3>{sub.fullName}</h3>
                <p className="sub-meta">{sub.clubName}</p>
                <p className="sub-role">{sub.professionalTitle} @ {sub.company}</p>
                <p className="sub-text">{sub.highlightText}</p>
              </div>
              <div className="selection-indicator">
                {selectedIds.has(sub.id) && <Check size={24} color="#003399" />}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <style>{`
        .admin-container {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }
        .admin-actions {
          display: flex;
          gap: 1rem;
        }
        .submission-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .submission-card {
          display: flex;
          gap: 1.5rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          cursor: pointer;
          position: relative;
          border: 2px solid transparent;
          transition: var(--transition);
        }
        .submission-card.selected {
          border-color: var(--rotary-blue);
          background: #f0f4ff;
        }
        .admin-photo {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }
        .sub-info {
          flex: 1;
        }
        .sub-meta {
          color: var(--rotary-blue);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .sub-role {
          font-style: italic;
          margin-bottom: 0.75rem;
          color: #666;
        }
        .sub-text {
          font-size: 1rem;
          line-height: 1.5;
        }
        .selection-indicator {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
