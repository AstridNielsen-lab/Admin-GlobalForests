import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTasks(data);
      }
      setLoading(false);
    }

    fetchTasks();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border-l-4 border-green-600 pl-4 py-2"
            >
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2">
                <span className={`
                  inline-block px-2 py-1 text-sm rounded-full
                  ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}
                `}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-600">No tasks assigned to you yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}