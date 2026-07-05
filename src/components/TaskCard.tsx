import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

interface Task {
  id?: number;
  title: string;
  priority: string;
  status: string;
  due_date: string;
  tags: string[];
}

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  low:    { color: '#059669', bg: '#d1fae5', label: 'Low' },
  medium: { color: '#d97706', bg: '#fef3c7', label: 'Medium' },
  high:   { color: '#dc2626', bg: '#fee2e2', label: 'High' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  const pc = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <Draggable draggableId={String(task.id ?? 0)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            background: snapshot.isDragging ? '#f0f9ff' : '#fff',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 10,
            border: snapshot.isDragging ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(2,132,199,0.25)'
              : '0 1px 3px rgba(0,0,0,0.04)',
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            ...provided.draggableProps.style,
          }}
        >
          <div style={styles.top}>
            <span style={{ ...styles.badge, color: pc.color, background: pc.bg }}>
              {pc.label}
            </span>
            <div style={styles.actions}>
              <button
                style={styles.iconBtn}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onEdit(task)}
                title="Edit"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5l2 2L4 12H2v-2l7.5-7.5z" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                style={{ ...styles.iconBtn, ...styles.deleteBtn }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => task.id && onDelete(task.id)}
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5.5 3.5V2h3v1.5M5 6v4.5M9 6v4.5M3.5 3.5l.5 8h6l.5-8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <p style={styles.title}>{task.title}</p>

          <div style={styles.footer}>
            <div style={styles.dateRow}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#94a3b8">
                <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#94a3b8" strokeWidth="1.2" fill="none"/>
                <path d="M4 1v2M8 1v2M1 5h10" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span style={styles.date}>{task.due_date}</span>
            </div>
            {task.tags.length > 0 && (
              <div style={styles.tags}>
                {task.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} style={styles.tag}>{tag}</span>
                ))}
                {task.tags.length > 2 && <span style={styles.tagMore}>+{task.tags.length - 2}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const styles: Record<string, React.CSSProperties> = {
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 20,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  actions: {
    display: 'flex',
    gap: 4,
  },
  iconBtn: {
    width: 28,
    height: 28,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    background: '#f8fafc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    background: '#fff5f5',
    borderColor: '#fecaca',
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 1.4,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500,
  },
  tags: {
    display: 'flex',
    gap: 4,
  },
  tag: {
    background: '#e0f2fe',
    color: '#0284c7',
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 20,
    fontWeight: 600,
  },
  tagMore: {
    background: '#f1f5f9',
    color: '#64748b',
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 20,
    fontWeight: 600,
  },
};

export default TaskCard;
