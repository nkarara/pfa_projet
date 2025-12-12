import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFileContract, FaEye, FaFilter } from 'react-icons/fa';
import '../styles/Contracts.css';

const Contracts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchContracts();
    }, []);

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

    const filteredContracts = contracts.filter(contract => {
        if (filter === 'all') return true;
        return contract.status === filter;
    });

    const getStatusColor = (status) => {
        const colors = {
            draft: 'gray',
            pending_signature: 'orange',
            active: 'green',
            terminated: 'red'
        };
        return colors[status] || 'gray';
    };

    return (
        <div className="contracts-container">
            <div className="contracts-header">
                <h1><FaFileContract /> My Contracts</h1>
                {user?.role === 'landlord' && (
                    <button
                        onClick={() => navigate('/contracts/create')}
                        className="btn-primary"
                    >
                        Create New Contract
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <FaFilter /> <span>Filter:</span>
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({contracts.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active ({contracts.filter(c => c.status === 'active').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'pending_signature' ? 'active' : ''}`}
                    onClick={() => setFilter('pending_signature')}
                >
                    Pending ({contracts.filter(c => c.status === 'pending_signature').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
                    onClick={() => setFilter('draft')}
                >
                    Draft ({contracts.filter(c => c.status === 'draft').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'terminated' ? 'active' : ''}`}
                    onClick={() => setFilter('terminated')}
                >
                    Terminated ({contracts.filter(c => c.status === 'terminated').length})
                </button>
            </div>

            {loading ? (
                <p>Loading contracts...</p>
            ) : filteredContracts.length === 0 ? (
                <div className="empty-state">
                    <FaFileContract size={64} style={{ opacity: 0.3 }} />
                    <p>No {filter !== 'all' ? filter : ''} contracts found</p>
                    {user?.role === 'landlord' && filter === 'all' && (
                        <button
                            onClick={() => navigate('/contracts/create')}
                            className="btn-primary"
                        >
                            Create Your First Contract
                        </button>
                    )}
                </div>
            ) : (
                <div className="contracts-grid">
                    {filteredContracts.map(contract => (
                        <div key={contract.id} className="contract-item">
                            <div className="contract-item-header">
                                <h3>{contract.property?.address || 'Property'}</h3>
                                <span className={`status-badge status-${contract.status}`}>
                                    {contract.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="contract-item-body">
                                <div className="contract-info-row">
                                    <span className="label">Monthly Rent:</span>
                                    <span className="value">{contract.rentAmount} ETH</span>
                                </div>
                                <div className="contract-info-row">
                                    <span className="label">Duration:</span>
                                    <span className="value">{contract.durationMonths} months</span>
                                </div>
                                <div className="contract-info-row">
                                    <span className="label">Deposit:</span>
                                    <span className="value">{contract.depositAmount} ETH</span>
                                </div>

                                {user?.role === 'landlord' && (
                                    <div className="contract-info-row">
                                        <span className="label">Tenant:</span>
                                        <span className="value">
                                            {contract.tenant
                                                ? `${contract.tenant.firstName} ${contract.tenant.lastName}`
                                                : 'Not assigned'
                                            }
                                        </span>
                                    </div>
                                )}

                                {user?.role === 'tenant' && (
                                    <div className="contract-info-row">
                                        <span className="label">Landlord:</span>
                                        <span className="value">
                                            {contract.landlord?.firstName} {contract.landlord?.lastName}
                                        </span>
                                    </div>
                                )}

                                {contract.startDate && (
                                    <div className="contract-info-row">
                                        <span className="label">Period:</span>
                                        <span className="value">
                                            {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                {/* Signature Status */}
                                <div className="signature-status">
                                    <div className={`signature-indicator ${contract.landlordSigned ? 'signed' : 'unsigned'}`}>
                                        {contract.landlordSigned ? '✓' : '○'} Landlord
                                    </div>
                                    <div className={`signature-indicator ${contract.tenantSigned ? 'signed' : 'unsigned'}`}>
                                        {contract.tenantSigned ? '✓' : '○'} Tenant
                                    </div>
                                </div>
                            </div>

                            <div className="contract-item-footer">
                                <button
                                    onClick={() => navigate(`/contracts/${contract.id}`)}
                                    className="btn-secondary"
                                >
                                    <FaEye /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contracts;
