import React, { useState, useEffect } from 'react';
import TaskForm from './components/taskform';
import TaskList from './components/Tasklist';
import './index.css';

const API_BASE_URL = "http://localhost:8080/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handleSaveTask = async (task) => {
    const method = task.id ? 'PUT' : 'POST';
    const url = task.id ? `${API_BASE_URL}/${task.id}` : API_BASE_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        const savedTask = await res.json();
        setTasks((prevTasks) =>
          task.id
            ? prevTasks.map((t) => (t.id === savedTask.id ? savedTask : t))
            : [...prevTasks, savedTask]
        );

        setTaskToEdit(null);
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.error('Error saving task', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsSidebarOpen(true);
  };

  const handleProgressChange = async (id, newProgress) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = { ...task, progress: newProgress };

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const saved = await res.json();
        setTasks(prev =>
          prev.map(t => (t.id === saved.id ? saved : t))
        );

        if (newProgress === "Completed") {
          showToast(`✅ Task "${saved.title}" marked as completed!`);
        }
      }
    } catch (err) {
      console.error("Progress update error", err);
    }
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="app-container">
      <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '✖ Close' : '➕ Add Task'}
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h1 className="main-heading">Task Manager</h1>
        <TaskForm onAddTask={handleSaveTask} taskToEdit={taskToEdit} />
      </aside>

      <main className="main-content">
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onProgressChange={handleProgressChange}
        />
      </main>
    </div>
  );
}

export default App;
