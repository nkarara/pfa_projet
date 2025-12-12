import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Contracts from './pages/Contracts';
import CreateContract from './pages/CreateContract';
import ContractDetails from './pages/ContractDetails';
import Payments from './pages/Payments';
import Disputes from './pages/Disputes';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
};

// App Content (needs to be inside AuthProvider to use useAuth)
const AppContent = () => {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/properties"
                    element={
                        <ProtectedRoute>
                            <Properties />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts"
                    element={
                        <ProtectedRoute>
                            <Contracts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts/create"
                    element={
                        <ProtectedRoute>
                            <CreateContract />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts/:id"
                    element={
                        <ProtectedRoute>
                            <ContractDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute>
                            <Payments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/disputes"
                    element={
                        <ProtectedRoute>
                            <Disputes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Web3Provider>
                    <AppContent />
                </Web3Provider>
            </AuthProvider>
        </Router>
    );
}

export default App;
