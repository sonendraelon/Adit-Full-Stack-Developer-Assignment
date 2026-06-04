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
    <nav className="sticky top-0 z-50 px-2 sm:px-4 py-2 sm:py-4 backdrop-blur-md w-full">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center glass-panel shadow-lg rounded-xl sm:rounded-2xl gap-2">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 min-w-0">
          <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
          <span className="truncate hidden xs:inline-block sm:inline-block">TaskMaster</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex-shrink-0"
          >
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm font-medium hidden sm:block tracking-wide truncate max-w-[80px] md:max-w-[200px]">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-primary/90 text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary hover:shadow-lg transition-all text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap flex-shrink-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-primary/90 text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary hover:shadow-lg transition-all text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
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
