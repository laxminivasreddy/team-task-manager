import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import api from '../api';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Here's what's happening with your tasks today.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 mb-8">
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            <ListTodo className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Total Tasks</p>
            <h2 style={{ margin: 0 }}>{stats?.totalTasks || 0}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--radius-lg)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Completed</p>
            <h2 style={{ margin: 0 }}>{stats?.completedTasks || 0}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'var(--warning-bg)', borderRadius: 'var(--radius-lg)' }}>
            <Clock className="w-8 h-8" style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>In Progress</p>
            <h2 style={{ margin: 0 }}>{stats?.inProgressTasks || 0}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4" style={{ borderColor: stats?.overdueTasks ? 'var(--danger)' : 'var(--border)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--radius-lg)' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Overdue</p>
            <h2 style={{ margin: 0, color: stats?.overdueTasks ? 'var(--danger)' : 'inherit' }}>
              {stats?.overdueTasks || 0}
            </h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        <p>A summary of your task status.</p>
        <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', marginTop: '1.5rem' }}>
          {stats?.totalTasks ? (
            <>
              <div style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%`, backgroundColor: 'var(--success)' }}></div>
              <div style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100}%`, backgroundColor: 'var(--warning)' }}></div>
              <div style={{ width: `${(stats.todoTasks / stats.totalTasks) * 100}%`, backgroundColor: 'var(--bg-secondary)' }}></div>
            </>
          ) : (
            <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)' }}></div>
          )}
        </div>
        <div className="flex justify-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>{stats?.completedTasks || 0} Done</span>
          <span>{stats?.inProgressTasks || 0} In Progress</span>
          <span>{stats?.todoTasks || 0} To Do</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
