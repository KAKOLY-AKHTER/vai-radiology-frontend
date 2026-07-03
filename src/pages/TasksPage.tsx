import React, { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DateSelector from '../components/DateSelector';
import Board from '../components/Board';
import TaskModal from '../components/TaskModal';

interface Task {
  id?: number;
  title: string;
  priority: string;
  status: string;
  due_date: string;
  tags: string[];
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const dateStr = selectedDate.toISOString().split('T')[0];

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/?date=${dateStr}`);
    setTasks(res.data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTasks(); }, [dateStr]);

  const handleSave = async (task: Task) => {
    if (task.id) {
      await api.put(`/tasks/${task.id}/`, task);
    } else {
      await api.post('/tasks/', { ...task, due_date: dateStr });
    }
    setModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this task?')) {
      await api.delete(`/tasks/${id}/`);
      fetchTasks();
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId;
    const taskId = parseInt(result.draggableId);
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.id || task.status === newStatus) return;
    const updated = { ...task, status: newStatus };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    await api.patch(`/tasks/${taskId}/`, { status: newStatus });
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10C4 6.686 6.686 4 10 4C13.314 4 16 6.686 16 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 7v3l2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="15" r="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <span style={styles.logoText}>VAI Radiology</span>
            <span style={styles.logoSep}>/</span>
            <span style={styles.pageTitle}>Task Board</span>
          </div>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navLink} onClick={() => navigate('/annotate')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
              <path d="M5 8h6M8 5v6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Annotate
          </button>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </nav>
      </header>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageH1}>Task Board</h1>
            <p style={styles.pageSub}>Manage and organize your daily tasks</p>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <span style={styles.statNum}>{totalTasks}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statCard}>
              <span style={{ ...styles.statNum, color: '#10b981' }}>{doneTasks}</span>
              <span style={styles.statLabel}>Done</span>
            </div>
            <div style={styles.statCard}>
              <span style={{ ...styles.statNum, color: '#f59e0b' }}>{totalTasks - doneTasks}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
          </div>
        </div>

        <div style={styles.toolbar}>
          <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
          <button style={styles.addBtn} onClick={() => { setEditingTask(null); setModalOpen(true); }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Task
          </button>
        </div>

        <Board tasks={tasks} onDragEnd={handleDragEnd} onEdit={(t) => { setEditingTask(t); setModalOpen(true); }} onDelete={handleDelete} />
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          selectedDate={dateStr}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    padding: '0 32px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 12px rgba(79,70,229,0.3)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 36,
    height: 36,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: 700, fontSize: 16 },
  logoSep: { color: 'rgba(255,255,255,0.4)', margin: '0 8px', fontSize: 16 },
  pageTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  nav: { display: 'flex', alignItems: 'center', gap: 8 },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 16px',
    background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  logoutBtn: {
    padding: '7px 16px',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
  },
  content: { padding: '32px', flex: 1 },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  pageH1: { fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' },
  pageSub: { color: '#64748b', fontSize: 14, marginTop: 4 },
  statsRow: { display: 'flex', gap: 12 },
  statCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    minWidth: 70,
  },
  statNum: { fontSize: 22, fontWeight: 800, color: '#6366f1' },
  statLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 22px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  },
};

export default TasksPage;
