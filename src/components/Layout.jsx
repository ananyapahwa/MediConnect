import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-lavender-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                {children}
            </main>
            <footer className="bg-white py-6 border-t border-gray-100 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
