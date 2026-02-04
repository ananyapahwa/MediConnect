import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Stethoscope, CheckCircle } from 'lucide-react';
import Popup from '../components/Popup';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [popup, setPopup] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success', // or 'error'
        onClose: () => { }
    });

    const navigate = useNavigate();

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
        if (popup.onClose) {
            popup.onClose();
        }
    };

    const showPopup = (title, message, type = 'success', onClose = () => { }) => {
        setPopup({
            isOpen: true,
            title,
            message,
            type,
            onClose
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showPopup("Error", "Passwords don't match!", "error");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showPopup("Success", "Registration successful!", "success", () => navigate('/'));
            } else {
                showPopup("Registration Failed", data.error || 'Registration failed', "error");
            }
        } catch (error) {
            console.error('Error:', error);
            showPopup("Network Error", "Network error occurred. Please try again later.", "error");
        }
    };

    return (
        <>
            <Popup
                isOpen={popup.isOpen}
                onClose={closePopup}
                title={popup.title}
                message={popup.message}
                type={popup.type}
            />
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-lavender-100">

                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-lavender-100 rounded-xl flex items-center justify-center mb-4">
                            <Stethoscope className="h-8 w-8 text-lavender-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join MediConnect for better healthcare
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

                        {/* Name Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-lavender-500 transition-colors" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-lavender-500 transition-colors" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-lavender-500 transition-colors" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-gray-400 group-focus-within:text-lavender-500 transition-colors" />
                            </div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-lavender-600 hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-lavender-600 hover:text-lavender-500 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Register;
