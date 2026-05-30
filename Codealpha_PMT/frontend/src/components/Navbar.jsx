import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLink = (to, label) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
          isActive
            ? "bg-primary-100 text-primary-700"
            : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="font-semibold text-gray-800 text-base">V-TaskFlow</span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="hidden sm:flex items-center gap-1">
            {navLink("/dashboard", "Dashboard")}
            {navLink("/tasks", "Tasks")}
            {navLink("/profile", "Profile")}
          </div>
        )}

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hi, <span className="font-medium text-gray-700">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn-secondary text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Register</Link>
          </div>
        )}
      </div>

      {/* Mobile nav */}
      {user && (
        <div className="sm:hidden border-t border-gray-100 px-4 py-2 flex gap-2">
          {navLink("/dashboard", "Dashboard")}
          {navLink("/tasks", "Tasks")}
          {navLink("/profile", "Profile")}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
