import { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  projectId: string;
  project?: { name: string };
  assignee?: { id: string; name: string };
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'TODO': return <span className="badge badge-todo">To Do</span>;
      case 'IN_PROGRESS': return <span className="badge badge-in-progress">In Progress</span>;
      case 'DONE': return <span className="badge badge-done">Done</span>;
      default: return null;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>My Tasks</h1>
          <p>{user?.role === 'ADMIN' ? 'All tasks across projects.' : 'Tasks assigned to you.'}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {tasks.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Task</th>
                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Project</th>
                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assignee</th>
                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{task.description}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{task.project?.name || 'N/A'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{task.assignee?.name || 'Unassigned'}</td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(task.status)}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-control" 
                      style={{ padding: '0.25rem 0.5rem', width: 'auto', display: 'inline-block' }}
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3>No tasks found</h3>
            <p>You don't have any tasks assigned to you right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
