import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFileContract, FaSignature, FaMoneyBillWave } from 'react-icons/fa';
import '../styles/ContractDetails.css';

const ContractDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [id]);

    const fetchContract = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/contracts/${id}`);
            if (response.data.success) {
                setContract(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch contract:', error);
            toast.error('Failed to load contract');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSignContract = async () => {
        setSigning(true);

        try {
            const isLandlord = user.id === contract.landlordId;
            const party = isLandlord ? 'landlord' : 'tenant';

            toast.info('Signing contract...');

            await axios.post(`http://localhost:5000/api/contracts/${id}/sign`, {
                party,
                transactionHash: null
            });

            toast.success('Contract signed successfully!');
            fetchContract();
        } catch (error) {
            console.error('Signing error:', error);
            toast.error(error.response?.data?.message || 'Failed to sign contract');
        } finally {
            setSigning(false);
        }
    };

    const handleTerminateContract = async () => {
        if (!window.confirm('Are you sure you want to terminate this contract?')) {
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/contracts/${id}/terminate`);
            if (response.data.success) {
                toast.success('Contract terminated successfully');
                fetchContract();
            }
        } catch (error) {
            console.error('Termination error:', error);
            toast.error('Failed to terminate contract');
        }
    };

    if (loading) {
        return <div className="loading-screen">Loading contract...</div>;
    }

    if (!contract) {
        return <div className="loading-screen">Contract not found</div>;
    }

    const isLandlord = user.id === contract.landlordId;
    const isTenant = user.id === contract.tenantId;
    const canSign = (isLandlord && !contract.landlordSigned) || (isTenant && !contract.tenantSigned);

    return (
        <div className="contract-details-container">
            <div className="contract-header">
                <div>
                    <h1><FaFileContract /> Contract Details</h1>
                    <span className={`status-badge status-${contract.status}`}>
                        {contract.status.replace('_', ' ')}
                    </span>
                </div>

                {contract.status === 'active' && isLandlord && (
                    <button onClick={handleTerminateContract} className="btn-danger">
                        Terminate Contract
                    </button>
                )}
            </div>

            <div className="contract-content">
                <div className="info-section">
                    <h2>Property Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Address</label>
                            <p>{contract.property?.address || 'N/A'}</p>
                        </div>
                        <div className="info-item">
                            <label>Type</label>
                            <p>{contract.property?.type || 'N/A'}</p>
                        </div>
                        <div className="info-item">
                            <label>Area</label>
                            <p>{contract.property?.area || 'N/A'} m²</p>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>Contract Parties</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Landlord</label>
                            <p>{contract.landlord?.firstName} {contract.landlord?.lastName}</p>
                            <small>{contract.landlord?.email}</small>
                            {contract.landlordSigned && (
                                <span className="signed-badge">✓ Signed</span>
                            )}
                        </div>
                        <div className="info-item">
                            <label>Tenant</label>
                            <p>{contract.tenant?.firstName || 'Not assigned'} {contract.tenant?.lastName || ''}</p>
                            {contract.tenant && <small>{contract.tenant.email}</small>}
                            {contract.tenantSigned && (
                                <span className="signed-badge">✓ Signed</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2><FaMoneyBillWave /> Financial Terms</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Monthly Rent</label>
                            <p className="amount">{contract.rentAmount} ETH</p>
                        </div>
                        <div className="info-item">
                            <label>Security Deposit</label>
                            <p className="amount">{contract.depositAmount} ETH</p>
                        </div>
                        <div className="info-item">
                            <label>Duration</label>
                            <p>{contract.durationMonths} months</p>
                        </div>
                        <div className="info-item">
                            <label>Total Rent</label>
                            <p className="amount">{(contract.rentAmount * contract.durationMonths).toFixed(3)} ETH</p>
                        </div>
                    </div>
                </div>

                {contract.startDate && (
                    <div className="info-section">
                        <h2>Contract Period</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Start Date</label>
                                <p>{new Date(contract.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="info-item">
                                <label>End Date</label>
                                <p>{new Date(contract.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="info-section">
                    <h2>Terms & Conditions</h2>
                    <div className="terms-box">
                        <p>{contract.terms || 'No specific terms defined'}</p>
                    </div>
                </div>

                <div className="info-section">
                    <h2>Blockchain Information</h2>
                    <div className="blockchain-info">
                        <div className="info-item">
                            <label>Smart Contract Address</label>
                            <code>{contract.smartContractAddress || 'Not deployed (Database mode)'}</code>
                        </div>
                        {contract.paymentManagerAddress && (
                            <div className="info-item">
                                <label>Payment Manager Address</label>
                                <code>{contract.paymentManagerAddress}</code>
                            </div>
                        )}
                    </div>
                </div>

                {canSign && (
                    <div className="signing-section">
                        <h2><FaSignature /> Sign Contract</h2>

                        {!contract.smartContractAddress && (
                            <div className="info-box">
                                ℹ️ Contract will be signed in database mode (blockchain features disabled)
                            </div>
                        )}

                        <button
                            onClick={handleSignContract}
                            className="btn-primary btn-large"
                            disabled={signing}
                        >
                            {signing ? 'Signing...' : 'Sign Contract'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractDetails;
