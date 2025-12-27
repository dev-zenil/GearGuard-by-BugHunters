import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const activeClass = (path) => isActive(path) ? 'bg-blue-800 px-3 py-1 rounded' : 'hover:text-blue-200';

  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          ⚙️ GearGuard
        </Link>
        <nav className="flex gap-6 items-center">
          <Link to="/dashboard" className={`${activeClass('/dashboard')} transition`}>Dashboard</Link>
          <Link to="/equipment" className={`${(isActive('/equipment') || location.pathname.includes('/equipment')) ? 'bg-blue-800 px-3 py-1 rounded' : 'hover:text-blue-200'} transition`}>Equipment</Link>
          <Link to="/activity" className={`${activeClass('/activity')} transition`}>Activities</Link>
          <Link to="/kanban" className={`${activeClass('/kanban')} transition`}>Status Board</Link>
          <Link to="/calendar" className={`${activeClass('/calendar')} transition`}>Calendar</Link>
          <Link to="/teams" className={`${activeClass('/teams')} transition`}>Teams</Link>
          <Link to="/suppliers" className={`${activeClass('/suppliers')} transition`}>Suppliers</Link>
          <Link to="/reports" className={`${activeClass('/reports')} transition`}>Reports</Link>
          <div className="flex items-center gap-4">
            <span>{user?.fullName}</span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
