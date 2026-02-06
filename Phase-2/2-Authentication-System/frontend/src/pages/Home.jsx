import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Secure Authentication',
      description: 'Industry-standard JWT tokens with secure storage',
      icon: '🔒',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Role-Based Access',
      description: 'Fine-grained permissions for users and administrators',
      icon: '👑',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Modern UI/UX',
      description: 'Beautiful, responsive design with gradient colors',
      icon: '🎨',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Real-time Updates',
      description: 'Instant feedback and smooth transitions',
      icon: '⚡',
      color: 'from-orange-500 to-amber-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Modern Authentication
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
            Made Simple
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          A beautiful, secure, and fully-featured authentication system with role-based access control,
          modern UI design, and seamless user experience.
        </p>
        
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-indigo-600 bg-white border-2 border-indigo-600 rounded-full hover:bg-indigo-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-medium">Welcome back, {user.name}! 👋</span>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className={`absolute top-0 left-0 w-full h-2 bg-linear-to-r ${feature.color} rounded-t-2xl`}></div>
            <div className="text-4xl mb-6">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
            <div className="mt-6">
              <div className={`h-1 w-8 bg-linear-to-r ${feature.color} rounded-full transition-all duration-300 group-hover:w-16`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-linear-to-br from-gray-900 to-black text-white rounded-3xl p-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">99.9%</div>
            <div className="text-gray-300">Uptime</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">256-bit</div>
            <div className="text-gray-300">Encryption</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">24/7</div>
            <div className="text-gray-300">Support</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to get started?
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust our authentication system for their applications.
        </p>
        {!user && (
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium text-white bg-linear-to-r from-emerald-500 to-teal-600 rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Free Account
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;