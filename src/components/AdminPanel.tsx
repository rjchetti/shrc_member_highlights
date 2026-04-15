import { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { generateClubRunnerHTML, type Submission } from '../utils/exporter';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Search, Archive, RotateCcw, SortAsc, SortDesc, Calendar, User } from 'lucide-react';

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportLang, setExportLang] = useState<'en' | 'ko'>('en');

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'archived'>('pending');
  const [sortKey, setSortKey] = useState<'date' | 'name'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

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

  const handleArchive = async (e: React.MouseEvent, id: string, currentStatus: string) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'archived' ? 'pending' : 'archived';
    try {
      await updateDoc(doc(db, 'submissions', id), { status: newStatus });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const selected = submissions.filter(s => selectedIds.has(s.id));
    if (selected.length === 0) return alert('Please select at least one highlight');
    
    const html = generateClubRunnerHTML(selected, exportLang);
    navigator.clipboard.writeText(html);
    alert('ClubRunner HTML copied to clipboard!');
  };

  // Process Submissions (Filter & Sort)
  const processedSubmissions = useMemo(() => {
    return submissions
      .filter(s => {
        const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.clubName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = (s.status || 'pending') === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'date') {
          const dateA = a.submittedAt?.seconds || 0;
          const dateB = b.submittedAt?.seconds || 0;
          comparison = dateA - dateB;
        } else {
          comparison = a.fullName.localeCompare(b.fullName);
        }
        return sortDir === 'asc' ? comparison : -comparison;
      });
  }, [submissions, searchTerm, statusFilter, sortKey, sortDir]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="admin-container fade-in">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <select value={exportLang} onChange={e => setExportLang(e.target.value as 'en' | 'ko')} className="btn glass-btn">
            <option value="en">Export EN</option>
            <option value="ko">Export KO</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <Copy size={18} />
            Copy ClubRunner HTML
          </button>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or club..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Sort:</span>
          <div className="filter-chips">
            <button 
              className={`chip ${sortKey === 'date' ? 'active' : ''}`} 
              onClick={() => setSortKey('date')}
            >
              <Calendar size={14} style={{marginRight: 4}} /> Date
            </button>
            <button 
              className={`chip ${sortKey === 'name' ? 'active' : ''}`} 
              onClick={() => setSortKey('name')}
            >
              <User size={14} style={{marginRight: 4}} /> Name
            </button>
            <button className="chip" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
              {sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
            </button>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="filter-chips">
            <button 
              className={`chip ${statusFilter === 'pending' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`chip ${statusFilter === 'archived' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('archived')}
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      <div className="submission-list">
        {loading ? (
          <div className="loader">Loading submissions...</div>
        ) : processedSubmissions.length === 0 ? (
          <div className="empty-state">No submissions found matching your filters.</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {processedSubmissions.map(sub => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={sub.id}
                className={`submission-card ${selectedIds.has(sub.id) ? 'selected' : ''}`}
                onClick={() => toggleSelection(sub.id)}
              >
                <img src={sub.photoUrl} alt="Member" className="admin-photo" />
                <div className="sub-info">
                  <div className="sub-header-row">
                    <h3>{sub.fullName}</h3>
                    <span className="sub-date">{formatDate(sub.submittedAt)}</span>
                  </div>
                  <p className="sub-meta">{sub.clubName}</p>
                  <p className="sub-role">{sub.professionalTitle} @ {sub.company}</p>
                  
                  {sub.highlightTitle && (
                    <p className="sub-title-preview">{sub.highlightTitle}</p>
                  )}
                  
                  <div 
                    className="sub-text-preview" 
                    dangerouslySetInnerHTML={{ __html: sub.highlightText }} 
                  />

                  <div className="action-bar">
                    <button 
                      className={`action-btn ${sub.status === 'archived' ? 'btn-restore' : 'btn-archive'}`}
                      onClick={(e) => handleArchive(e, sub.id, sub.status || 'pending')}
                    >
                      {sub.status === 'archived' ? (
                        <><RotateCcw size={14} /> Restore to Pending</>
                      ) : (
                        <><Archive size={14} /> Archive Submission</>
                      )}
                    </button>
                  </div>
                </div>

                <div className={`status-badge status-${sub.status || 'pending'}`}>
                  {sub.status || 'pending'}
                </div>

                <div className="selection-indicator">
                  {selectedIds.has(sub.id) && <Check size={24} color="#003399" />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        .sub-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
        .sub-date { font-size: 0.8rem; color: #94a3b8; font-weight: 600; font-family: 'Open Sans', sans-serif; }
        .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 12px; color: #64748b; font-style: italic; }
        .glass-btn { border: 1px solid var(--rotary-grey); border-radius: 8px; padding: 0.5rem; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
