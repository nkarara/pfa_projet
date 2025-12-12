import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaPlus, FaEye } from 'react-icons/fa';
import '../styles/Disputes.css';

const Disputes = () => {
    const { user } = useAuth();
    const [disputes, setDisputes] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState(null);

    const [formData, setFormData] = useState({
        contractId: '',
        description: ''
    });

    const [resolutionForm, setResolutionForm] = useState({
        resolution: ''
    });

    useEffect(() => {
        fetchDisputes();
        fetchContracts();
    }, []);

    const fetchDisputes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/disputes/my-disputes');
            if (response.data.success) {
                setDisputes(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch disputes:', error);
            toast.error('Failed to load disputes');
        } finally {
            setLoading(false);
        }
    };

    const fetchContracts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contracts/my-contracts');
            if (response.data.success) {
                const activeContracts = response.data.data.filter(c => c.status === 'active');
                setContracts(activeContracts);
            }
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.contractId || !formData.description) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/disputes', formData);
            if (response.data.success) {
                toast.success('Dispute filed successfully');
                setShowCreateModal(false);
                setFormData({ contractId: '', description: '' });
                fetchDisputes();
            }
        } catch (error) {
            console.error('Failed to create dispute:', error);
            toast.error(error.response?.data?.message || 'Failed to file dispute');
        }
    };

    const handleResolve = async (disputeId) => {
        if (!resolutionForm.resolution) {
            toast.error('Please provide a resolution');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/disputes/${disputeId}/resolve`, resolutionForm);
            if (response.data.success) {
                toast.success('Dispute resolved successfully');
                setSelectedDispute(null);
                setResolutionForm({ resolution: '' });
                fetchDisputes();
            }
        } catch (error) {
            console.error('Failed to resolve dispute:', error);
            toast.error('Failed to resolve dispute');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'red',
            in_review: 'orange',
            resolved: 'green',
            rejected: 'gray'
        };
        return colors[status] || 'gray';
    };

    const openDetailsModal = (dispute) => {
        setSelectedDispute(dispute);
    };

    const closeDetailsModal = () => {
        setSelectedDispute(null);
        setResolutionForm({ resolution: '' });
    };

    return (
        <div className="disputes-container">
            <div className="disputes-header">
                <h1><FaExclamationTriangle /> Disputes</h1>
                <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                    <FaPlus /> File a Dispute
                </button>
            </div>

            {loading ? (
                <p>Loading disputes...</p>
            ) : disputes.length === 0 ? (
                <div className="empty-state">
                    <FaExclamationTriangle size={64} style={{ opacity: 0.3 }} />
                    <p>No disputes found</p>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                        File Your First Dispute
                    </button>
                </div>
            ) : (
                <div className="disputes-list">
                    {disputes.map(dispute => (
                        <div key={dispute.id} className="dispute-card">
                            <div className="dispute-header">
                                <div>
                                    <h3>Dispute #{dispute.id}</h3>
                                    <p className="dispute-property">
                                        Property: {dispute.contract?.property?.address || 'N/A'}
                                    </p>
                                    <p className="dispute-date">
                                        Filed: {new Date(dispute.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`dispute-status-badge status-${dispute.status}`}>
                                    {dispute.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="dispute-body">
                                <p className="dispute-description">{dispute.description}</p>

                                <div className="dispute-meta">
                                    <p><strong>Filed by:</strong> {dispute.filer?.email}</p>
                                    {dispute.resolvedAt && (
                                        <p><strong>Resolved:</strong> {new Date(dispute.resolvedAt).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>

                            <div className="dispute-actions">
                                <button
                                    onClick={() => openDetailsModal(dispute)}
                                    className="btn-secondary"
                                >
                                    <FaEye /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Dispute Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>File a Dispute</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="contractId">Select Contract *</label>
                                <select
                                    id="contractId"
                                    name="contractId"
                                    value={formData.contractId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select a contract --</option>
                                    {contracts.map(contract => (
                                        <option key={contract.id} value={contract.id}>
                                            {contract.property?.address || `Contract #${contract.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Dispute Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Describe the issue in detail..."
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Submit Dispute
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dispute Details Modal */}
            {selectedDispute && (
                <div className="modal-overlay" onClick={closeDetailsModal}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <h2>Dispute Details</h2>

                        <div className="dispute-details-content">
                            <div className="detail-section">
                                <h3>Information</h3>
                                <div className="detail-item">
                                    <label>Status:</label>
                                    <span className={`dispute-status-badge status-${selectedDispute.status}`}>
                                        {selectedDispute.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Property:</label>
                                    <span>{selectedDispute.contract?.property?.address || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Filed by:</label>
                                    <span>{selectedDispute.filer?.email}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Date Filed:</label>
                                    <span>{new Date(selectedDispute.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Description</h3>
                                <p>{selectedDispute.description}</p>
                            </div>

                            {selectedDispute.resolution && (
                                <div className="detail-section">
                                    <h3>Resolution</h3>
                                    <p>{selectedDispute.resolution}</p>
                                    {selectedDispute.resolver && (
                                        <p className="resolver-info">
                                            Resolved by: {selectedDispute.resolver.email} on {new Date(selectedDispute.resolvedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'rejected' && (
                                <div className="detail-section">
                                    <h3>Resolve Dispute</h3>
                                    <div className="form-group">
                                        <label htmlFor="resolution">Resolution</label>
                                        <textarea
                                            id="resolution"
                                            value={resolutionForm.resolution}
                                            onChange={(e) => setResolutionForm({ resolution: e.target.value })}
                                            rows="4"
                                            placeholder="Enter resolution details..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleResolve(selectedDispute.id)}
                                        className="btn-primary"
                                    >
                                        Resolve Dispute
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button onClick={closeDetailsModal} className="btn-secondary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Disputes;
