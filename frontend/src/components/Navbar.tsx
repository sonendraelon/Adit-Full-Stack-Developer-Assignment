import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { Sun, Moon, CheckSquare } from 'lucide-react';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleDarkMode, isDarkMode }: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 px-4 py-4 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center glass-panel shadow-lg rounded-2xl">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          <CheckSquare size={32} className="text-primary" />
          <span>TaskMaster</span>
        </Link>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:block tracking-wide">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-primary/90 text-primary-foreground rounded-xl hover:bg-primary hover:shadow-lg transition-all text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-primary/90 text-primary-foreground rounded-xl hover:bg-primary hover:shadow-lg transition-all text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
