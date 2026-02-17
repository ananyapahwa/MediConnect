import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, User, Menu, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Determine home link based on role
    const homeLink = user.role === 'doctor' ? '/doctor-home' : '/patient-home';

    // Define navigation items based on role
    const getNavItems = () => {
        if (!token) {
            return [];
        }

        if (user.role === 'doctor') {
            return [
                { label: 'Home', path: '/doctor-home' },
                { label: 'Dashboard', path: '/doctor-dashboard' },
            ];
        } else {
            // Patient navigation
            return [
                { label: 'Home', path: '/patient-home' },
                { label: 'Appointments', path: '/appointments' },
                { label: 'Find Doctors', path: '/doctors' },
            ];
        }
    };

    const navItems = getNavItems();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
                <Link to={token ? homeLink : '/'} className="flex items-center gap-2 group">
                    <div className="bg-lavender-100 p-2 rounded-lg group-hover:bg-lavender-200 transition-colors">
                        <Stethoscope className="w-6 h-6 text-lavender-600" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-lavender-700 to-lavender-500 bg-clip-text text-transparent">
                        MediConnect
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="text-gray-600 hover:text-lavender-600 font-medium transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {token ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600 font-medium hidden md:block">
                                Hi, {user.name ? user.name.split(' ')[0] : 'User'}
                                {user.role === 'doctor' && <span className="text-lavender-600 ml-1">(Dr.)</span>}
                            </span>
                            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 hover:bg-red-50 text-red-600 font-medium transition-all">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-lavender-200 hover:bg-lavender-50 text-lavender-700 font-medium transition-all">
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    )}
                    <button className="md:hidden p-2 text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
