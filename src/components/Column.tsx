import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

interface Task {
  id?: number;
  title: string;
  priority: string;
  status: string;
  due_date: string;
  tags: string[];
}

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  color: string;
  icon: string;
}

const Column: React.FC<ColumnProps> = ({ columnId, title, tasks, onEdit, onDelete, color, icon }) => {
  return (
    <div className="anim-col" style={styles.column}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <h3 style={styles.title}>{title}</h3>
        </div>
        <span style={{ ...styles.count, background: color + '20', color }}>
          {tasks.length}
        </span>
      </div>
      <div style={{ ...styles.strip, background: color }} />
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              ...styles.list,
              background: snapshot.isDraggingOver ? '#f1f5f9' : 'transparent',
              border: snapshot.isDraggingOver ? '2px dashed #cbd5e1' : '2px dashed transparent',
              borderRadius: 10,
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div style={styles.empty}>
                <p style={styles.emptyText}>No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  column: {
    flex: 1,
    minWidth: 300,
    background: '#f8fafc',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '18px 18px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  strip: {
    height: 3,
    margin: '14px 18px 0',
    borderRadius: 2,
  },
  title: {
    fontWeight: 700,
    fontSize: 14,
    color: '#1e293b',
    letterSpacing: '-0.2px',
  },
  count: {
    fontSize: 13,
    fontWeight: 700,
    width: 26,
    height: 26,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: '12px',
    minHeight: 300,
    flex: 1,
    transition: 'background 0.15s, border 0.15s',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  emptyText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: 500,
  },
};

export default Column;
