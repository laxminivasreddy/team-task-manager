import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Layout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="nav-brand">
          <Layout className="w-6 h-6" />
          TaskFlow
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link flex items-center gap-2 ${isActive('/')}`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/projects" className={`nav-link flex items-center gap-2 ${isActive('/projects')}`}>
            <FolderKanban className="w-4 h-4" />
            Projects
          </Link>
          <Link to="/tasks" className={`nav-link flex items-center gap-2 ${isActive('/tasks')}`}>
            <CheckSquare className="w-4 h-4" />
            Tasks
          </Link>
          
          <div className="flex items-center gap-4 ml-auto pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
            <div className="text-sm">
              <span style={{ color: 'var(--text-primary)' }}>{user.name}</span>
              <span className={`badge ml-2 ${user.role === 'ADMIN' ? 'badge-role-admin' : 'badge-role-member'}`}>
                {user.role}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
