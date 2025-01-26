import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  due_date: string;
  assigned_to: string;
}

// Local Storage helper functions
const getStoredTasks = (): Task[] => {
  const stored = localStorage.getItem('tasks');
  return stored ? JSON.parse(stored) : [];
};

const storeTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending' as const
  });

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = () => {
    try {
      const storedTasks = getStoredTasks();
      setTasks(storedTasks.filter(task => task.assigned_to === user?.id));
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newTaskData: Task = {
        id: crypto.randomUUID(),
        ...newTask,
        assigned_to: user.id
      };

      const updatedTasks = [...tasks, newTaskData];
      storeTasks(updatedTasks);
      setTasks(updatedTasks);
      setShowForm(false);
      setNewTask({ title: '', description: '', due_date: '', status: 'pending' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = (taskId: string, newStatus: 'pending' | 'completed' | 'overdue') => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      storeTasks(updatedTasks);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      storeTasks(updatedTasks);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'pending' | 'completed' | 'overdue' })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleUpdateTask(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                      className="hover:opacity-75 transition-opacity"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}