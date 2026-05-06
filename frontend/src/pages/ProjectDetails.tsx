import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Calendar } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  assignee?: User;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  owner: User;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Task Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { user } = useAuth();

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (user?.role === 'ADMIN') {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    }
  };

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        projectId: id,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setAssigneeId('');
      setDueDate('');
      fetchProject();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  const renderTaskColumn = (status: string, label: string) => {
    const tasks = project.tasks.filter(t => t.status === status);
    
    return (
      <div className="card" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <h3 className="flex justify-between items-center mb-4">
          {label}
          <span className="badge" style={{ backgroundColor: 'var(--bg-card)' }}>{tasks.length}</span>
        </h3>
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div key={task.id} className="card" style={{ padding: '1rem', cursor: 'pointer' }}>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>{task.title}</h4>
              {task.description && (
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  {task.description}
                </p>
              )}
              
              <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>{task.assignee?.name || 'Unassigned'}</span>
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-6 text-muted" style={{ fontSize: '0.875rem' }}>
              No tasks
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <Link to="/projects" className="btn btn-secondary mb-4 inline-flex items-center gap-2" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
        <ArrowLeft className="w-3 h-3" /> Back to Projects
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description || 'No description'}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-3">
        {renderTaskColumn('TODO', 'To Do')}
        {renderTaskColumn('IN_PROGRESS', 'In Progress')}
        {renderTaskColumn('DONE', 'Done')}
      </div>

      {/* Task Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4">Add Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select 
                    className="form-control" 
                    value={assigneeId}
                    onChange={e => setAssigneeId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
