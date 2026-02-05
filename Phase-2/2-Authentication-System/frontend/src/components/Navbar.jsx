import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            AuthSystem
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="hover:text-indigo-200 transition-colors duration-200"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="hover:text-indigo-200 transition-colors duration-200"
                >
                  Profile
                </Link>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Admin Panel
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-indigo-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;