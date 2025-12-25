import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { FaWallet, FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { account, isConnected, connectWallet } = useWeb3();
    const navigate = useNavigate();

    // Theme toggle state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    🏠 BlockRental
                </Link>

                {user && (
                    <div className="navbar-menu">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>

                        {user.role === 'landlord' && (
                            <>
                                <Link to="/properties" className="nav-link">Properties</Link>
                                <Link to="/contracts/create" className="nav-link">New Contract</Link>
                            </>
                        )}

                        <Link to="/contracts" className="nav-link">Contracts</Link>
                        <Link to="/payments" className="nav-link">Payments</Link>
                    </div>
                )}

                <div className="navbar-actions">
                    {/* Theme Toggle Button */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>

                    {user ? (
                        <>
                            {isConnected ? (
                                <div className="wallet-badge">
                                    <FaWallet />
                                    <span>{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                                </div>
                            ) : (
                                <button onClick={connectWallet} className="btn-connect">
                                    <FaWallet /> Connect Wallet
                                </button>
                            )}

                            <div className="user-menu">
                                <button className="user-button">
                                    <FaUserCircle />
                                    <span>{user.firstName}</span>
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">
                                        <FaUserCircle /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-secondary">Login</Link>
                            <Link to="/register" className="btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
