import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';

interface Task {
  id?: number;
  title: string;
  priority: string;
  status: string;
  due_date: string;
  tags: string[];
}

interface BoardProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const COLUMNS = [
  { id: 'todo',       title: 'To Do',       color: '#6366f1', icon: '📋' },
  { id: 'inprogress', title: 'In Progress',  color: '#f59e0b', icon: '⚡' },
  { id: 'done',       title: 'Done',         color: '#10b981', icon: '✅' },
];

const Board: React.FC<BoardProps> = ({ tasks, onDragEnd, onEdit, onDelete }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.board}>
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            columnId={col.id}
            title={col.title}
            color={col.color}
            icon={col.icon}
            tasks={tasks.filter((t) => t.status === col.id)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

const styles: Record<string, React.CSSProperties> = {
  board: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    overflowX: 'auto',
    paddingBottom: 20,
  },
};

export default Board;
