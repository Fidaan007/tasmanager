import React, { useState } from 'react';
import './tasklist.css';

const TaskList = ({ tasks, onDelete, onEdit, onProgressChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedTask, setSelectedTask] = useState(null);

  const getCategoryColor = (category) =>
    category === 'Work' ? '#3498db' : '#e91e63';

  const groupedTasks = tasks.reduce((acc, task) => {
    (acc[task.category] = acc[task.category] || []).push(task);
    return acc;
  }, {});

  Object.values(groupedTasks).forEach(group =>
    group.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  );

  return (
    <div className="task-list">
      <h2>Tasks</h2>

      {Object.entries(groupedTasks).map(([category, tasks]) => (
        <div key={category}>
          <h3 className="category-heading">{category}</h3>
          <div className="pill-grid">
            {tasks.map(task => (
              <div
                key={task.id}
                className="task-pill"
                onClick={() => setSelectedTask(task)}
                style={{ borderColor: getCategoryColor(category) }}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedTask(null)}>❌</button>
            <div
              className={`task-card ${selectedTask.deadline < today ? 'overdue' : ''} ${selectedTask.progress === 'Completed' ? 'completed' : ''}`}
              style={{ borderLeft: `6px solid ${getCategoryColor(selectedTask.category)}` }}
            >
              <div className="card-header">
                <h3>{selectedTask.title}</h3>
                <span className="badge">{selectedTask.category}</span>
              </div>
              <p className="description">{selectedTask.description || 'No description'}</p>
              <div className="card-footer">
                <span className="deadline">📅 {selectedTask.deadline}</span>
                <button className="edit-btn" onClick={() => { onEdit?.(selectedTask); setSelectedTask(null); }}>
                  ✏️ Edit
                </button>
                <button className="delete-btn" onClick={() => { onDelete(selectedTask.id); setSelectedTask(null); }}>
                  🗑 Delete
                </button>
              </div>
              <div className="progress-section">
                <label>Progress:</label>
                <select
                  value={selectedTask.progress || ''}
                  onChange={(e) => {
                    onProgressChange(selectedTask.id, e.target.value);
                    setSelectedTask({ ...selectedTask, progress: e.target.value });
                  }}
                  disabled={selectedTask.progress === 'Completed'}
                  className="progress-dropdown"
                >                
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
