import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChange }) => {
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div style={styles.wrapper}>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => date && onChange(date)}
        dateFormat="yyyy-MM-dd"
        customInput={
          <button style={styles.button}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2.5" width="14" height="12" rx="2" stroke="#6366f1" strokeWidth="1.5" fill="none"/>
              <path d="M5 1v3M11 1v3M1 6.5h14" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>
              {isToday ? 'Today — ' : ''}
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        }
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'inline-block' },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: '#fff',
    color: '#0369a1',
    border: '1.5px solid #bae6fd',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(2,132,199,0.1)',
  },
};

export default DateSelector;
