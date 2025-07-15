import React, { useState, useEffect } from 'react';

const TaskForm = ({ onAddTask, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDeadline(taskToEdit.deadline || '');
      setCategory(taskToEdit.category || '');
      setDescription(taskToEdit.description || '');
    }
  }, [taskToEdit]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !deadline || !category) return;

    const task = {
      id: taskToEdit?.id,  
      title,
      deadline,
      category,
      description,
    };

    onAddTask(task); 
    setTitle('');
    setDeadline('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div>
        <label>Task Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={getTodayDate()}
        />
      </div>

      <div>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled hidden>Select category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      <div>
        <label>Description (optional)</label>
        <textarea
          placeholder="Additional details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit">{taskToEdit ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
