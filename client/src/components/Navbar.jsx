import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Calendar, BarChart2, Compass, Menu, X, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useUser();
    const { theme, toggleTheme } = useTheme();

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: <Cloud size={20} /> },
        { name: 'Forecast', path: '/forecast', icon: <Calendar size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
        { name: 'Assistant', path: '/assistant', icon: <Compass size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <Cloud className="logo-icon" />
                        <span>SkyCast</span>
                    </Link>

                    <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </div>

                    <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                        {navLinks.map((link) => (
                            <li key={link.name} className="nav-item">
                                <Link
                                    to={link.path}
                                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        ))}

                        {/* Theme Toggle */}
                        <li className="nav-item">
                            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </li>

                        {/* Auth Section */}
                        <li className="nav-item auth-item">
                            {user ? (
                                <div className="user-profile">
                                    <span className="username">Welcome, {user.fullName}</span>
                                    <button onClick={logout} className="logout-btn" title="Logout">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button className="login-btn" onClick={() => { setIsAuthOpen(true); setIsOpen(false); }}>
                                    <UserIcon size={18} />
                                    <span>Login/Signup</span>
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};

export default Navbar;
