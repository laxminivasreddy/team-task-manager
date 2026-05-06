import React, { useState, useEffect } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Project {
  id: string;
  name: string;
  description: string;
  _count?: { tasks: number };
  createdAt: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Projects</h1>
          <p>Manage your team's projects.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-3">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <FolderKanban className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ margin: 0 }}>{project.name}</h3>
              </div>
              <p style={{ flex: 1 }}>{project.description || 'No description provided.'}</p>
              
              <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="badge badge-todo">{project._count?.tasks || 0} Tasks</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-3 text-center py-12 card">
            <FolderKanban className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3>No projects found</h3>
            <p>Get started by creating a new project.</p>
          </div>
        )}
      </div>

      {/* Modal - Basic implementation without external libraries */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4">Create Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={name}
                  onChange={e => setName(e.target.value)}
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
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
