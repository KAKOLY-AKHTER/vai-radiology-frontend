import React, { useState, useEffect } from 'react';

interface Task {
  id?: number;
  title: string;
  priority: string;
  status: string;
  due_date: string;
  tags: string[];
}

interface TaskModalProps {
  task: Task | null;
  selectedDate: string;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, selectedDate, onSave, onClose }) => {
  const [form, setForm] = useState<Task>({
    title: '',
    priority: 'medium',
    status: 'todo',
    due_date: selectedDate,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) setForm(task);
  }, [task]);

  const handleTagAdd = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>{task?.id ? 'Edit Task' : 'Create Task'}</h2>
            <p style={styles.modalSub}>{task?.id ? 'Update task details' : 'Add a new task to your board'}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#64748b">
              <path d="M6 6l8 8M14 6l-8 8" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Task Title <span style={styles.req}>*</span></label>
            <input
              style={styles.input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select style={styles.input} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Status</label>
              <select style={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">📋 To Do</option>
                <option value="inprogress">⚡ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Due Date <span style={styles.req}>*</span></label>
            <input
              style={styles.input}
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tags</label>
            <div style={styles.tagInput}>
              <input
                style={{ ...styles.input, flex: 1 }}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Type a tag and press Add..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTagAdd(); } }}
              />
              <button type="button" style={styles.addTagBtn} onClick={handleTagAdd}>Add</button>
            </div>
            {form.tags.length > 0 && (
              <div style={styles.tagList}>
                {form.tags.map((tag, i) => (
                  <span key={i} style={styles.tag}>
                    {tag}
                    <button type="button" style={styles.removeTag} onClick={() => handleTagRemove(tag)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.saveBtn}>
              {task?.id ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#fff',
    borderRadius: 20,
    padding: '32px',
    width: 500,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.3px',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    background: '#f8fafc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  row: {
    display: 'flex',
    gap: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  req: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box',
  },
  tagInput: {
    display: 'flex',
    gap: 8,
  },
  addTagBtn: {
    padding: '11px 18px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    background: '#ede9fe',
    color: '#7c3aed',
    fontSize: 12,
    padding: '4px 10px',
    borderRadius: 20,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  removeTag: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7c3aed',
    fontSize: 16,
    padding: 0,
    lineHeight: 1,
    fontWeight: 700,
  },
  footer: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  cancelBtn: {
    padding: '11px 24px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  saveBtn: {
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  },
};

export default TaskModal;
