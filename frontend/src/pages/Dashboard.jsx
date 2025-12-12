import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHome, FaFileContract, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user, updateProfile } = useAuth();
    const { account, isConnected, connectWallet } = useWeb3();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        // Update user's blockchain address when wallet is connected
        if (isConnected && account && user && account !== user.blockchainAddress) {
            updateProfile({ blockchainAddress: account });
        }
    }, [isConnected, account, user]);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contracts/my-contracts');
            if (response.data.success) {
                setContracts(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
            toast.error('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    const handleConnectWallet = async () => {
        const result = await connectWallet();
        if (result.success) {
            await updateProfile({ blockchainAddress: result.address });
        }
    };

    const activeContracts = contracts.filter(c => c.status === 'active');
    const pendingContracts = contracts.filter(c => c.status === 'pending_signature' || c.status === 'draft');

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.firstName}!</h1>
                <p className="role-badge">{user?.role === 'landlord' ? '🏠 Landlord' : '🔑 Tenant'}</p>
            </div>

            {!isConnected && (
                <div className="wallet-connect-banner">
                    <p>⚠️ Connect your MetaMask wallet to interact with smart contracts</p>
                    <button onClick={handleConnectWallet} className="btn-primary">
                        Connect MetaMask
                    </button>
                </div>
            )}

            {isConnected && (
                <div className="wallet-info">
                    <p>
                        <strong>Connected Wallet:</strong>{' '}
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                    </p>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#4CAF50' }}>
                        <FaFileContract />
                    </div>
                    <div className="stat-content">
                        <h3>{activeContracts.length}</h3>
                        <p>Active Contracts</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#FF9800' }}>
                        <FaHome />
                    </div>
                    <div className="stat-content">
                        <h3>{pendingContracts.length}</h3>
                        <p>Pending Contracts</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#2196F3' }}>
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-content">
                        <h3>0</h3>
                        <p>Total Payments</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#F44336' }}>
                        <FaExclamationTriangle />
                    </div>
                    <div className="stat-content">
                        <h3>0</h3>
                        <p>Open Disputes</p>
                    </div>
                </div>
            </div>

            <div className="contracts-section">
                <h2>Recent Contracts</h2>

                {loading ? (
                    <p>Loading contracts...</p>
                ) : contracts.length === 0 ? (
                    <div className="empty-state">
                        <p>No contracts found</p>
                        <p className="empty-state-hint">
                            {user?.role === 'landlord'
                                ? 'Create your first rental contract to get started'
                                : 'Wait for a landlord to invite you to a contract'}
                        </p>
                    </div>
                ) : (
                    <div className="contracts-list">
                        {contracts.slice(0, 5).map(contract => (
                            <div key={contract.id} className="contract-card">
                                <div className="contract-header">
                                    <h3>{contract.property?.address || 'Property'}</h3>
                                    <span className={`status-badge status-${contract.status}`}>
                                        {contract.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="contract-details">
                                    <p><strong>Rent:</strong> {contract.rentAmount} ETH/month</p>
                                    <p><strong>Duration:</strong> {contract.durationMonths} months</p>
                                    <p><strong>Deposit:</strong> {contract.depositAmount} ETH</p>
                                    {user?.role === 'landlord' && (
                                        <p><strong>Tenant:</strong> {contract.tenant?.email || 'Not assigned'}</p>
                                    )}
                                    {user?.role === 'tenant' && (
                                        <p><strong>Landlord:</strong> {contract.landlord?.email}</p>
                                    )}
                                </div>
                                <button className="btn-secondary">View Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
