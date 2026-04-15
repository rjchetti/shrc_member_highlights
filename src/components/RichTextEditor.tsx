import React, { useRef, useEffect } from 'react';
import { Bold, Link as LinkIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync state to editor only on mount or if external value changes significantly
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const addLink = () => {
    const url = window.prompt('Enter the URL (e.g., https://example.com):');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-toolbar">
        <button 
          type="button" 
          className="toolbar-btn" 
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button 
          type="button" 
          className="toolbar-btn" 
          onClick={addLink}
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        placeholder={placeholder}
      />
      <style>{`
        .rich-editor-container {
          border: 1px solid var(--rotary-grey);
          border-radius: 8px;
          background: white;
          overflow: hidden;
          transition: var(--transition);
        }
        .rich-editor-container:focus-within {
          border-color: var(--rotary-blue);
          box-shadow: 0 0 0 3px rgba(0, 51, 153, 0.1);
        }
        .rich-editor-toolbar {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-bottom: 1px solid var(--rotary-grey);
        }
        .toolbar-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          color: #475569;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .toolbar-btn:hover {
          background: var(--rotary-blue);
          color: white;
          border-color: var(--rotary-blue);
        }
        .rich-editor-content {
          padding: 1rem;
          min-height: 150px;
          max-height: 400px;
          overflow-y: auto;
          outline: none;
          line-height: 1.6;
        }
        .rich-editor-content[contenteditable]:empty:before {
          content: attr(placeholder);
          color: #94a3b8;
        }
        .rich-editor-content a {
          color: var(--rotary-blue);
          text-decoration: underline;
        }
        .rich-editor-content b {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
