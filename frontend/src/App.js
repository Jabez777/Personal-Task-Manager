import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  // Existing states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Search / Filter / Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');

  // 🌙 Dark mode toggle
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Filter logic
  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((t) =>
      filterStatus === 'completed'
        ? t.completed
        : filterStatus === 'pending'
        ? !t.completed
        : true
    )
    .sort((a, b) =>
      sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  // Fetch, Add, Update, Delete same as before
  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:8080/tasks');
      if (res.ok) setTasks(await res.json());
    } catch (err) { console.error(err); }
  };

  const addTask = async () => {
    if (!title) return alert('Enter task title');
    await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, completed: false }),
    });
    setTitle(''); setDescription(''); fetchTasks();
  };

  const completeTask = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}/complete`, { method: 'PUT' });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:8080/tasks/${editTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });
    setEditTask(null);
    fetchTasks();
  };

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center transition-colors duration-300 
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>

      {/* Header + Toggle */}
      <div className="flex justify-between w-full max-w-md mb-6 items-center">
        <h1 className="text-4xl font-bold text-blue-500 dark:text-blue-400">Task Manager</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Add Task */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={addTask}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      {/* Search + Filter + Sort */}
      <div className="w-full max-w-md flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="asc">A–Z</option>
          <option value="desc">Z–A</option>
        </select>
      </div>

      {/* Task List */}
      <div className="w-full max-w-md">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded text-white ${
                  task.completed ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {task.completed ? 'Done' : 'Pending'}
              </span>
              {!task.completed && (
                <button
                  onClick={() => completeTask(task.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Done
                </button>
              )}
              <button
                onClick={() => startEdit(task)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Popup */}
      {editTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={saveEdit}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditTask(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
