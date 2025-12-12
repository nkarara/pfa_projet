import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { FaMoneyBillWave, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import '../styles/Payments.css';

const Payments = () => {
    const { user } = useAuth();
    const { account, isConnected, signer } = useWeb3();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contractId = searchParams.get('contract');

    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(contractId || '');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(null);

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        if (selectedContract) {
            fetchPayments();
        }
    }, [selectedContract]);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contracts/my-contracts');
            if (response.data.success) {
                // Filter only active contracts
                const activeContracts = response.data.data.filter(c => c.status === 'active');
                setContracts(activeContracts);

                if (activeContracts.length > 0 && !contractId) {
                    setSelectedContract(activeContracts[0].id.toString());
                }
            }
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
            toast.error('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        if (!selectedContract) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/payments/contract/${selectedContract}`);
            if (response.data.success) {
                setPayments(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            toast.error('Failed to load payments');
        }
    };

    const handlePayRent = async (payment) => {
        if (!isConnected) {
            toast.error('Please connect your MetaMask wallet');
            return;
        }

        const contract = contracts.find(c => c.id === parseInt(selectedContract));
        if (!contract?.paymentManagerAddress) {
            toast.error('Payment manager contract not found');
            return;
        }

        setPaying(payment.id);

        try {
            // Create contract instance
            const paymentContract = new ethers.Contract(
                contract.paymentManagerAddress,
                [
                    'function payRent() external payable',
                    'function getRentDueDate() external view returns (uint256 paymentId, uint256 dueDate, uint256 amount, uint256 estimatedPenalty, uint8 status)'
                ],
                signer
            );

            // Get the next due payment info from contract
            const [paymentId, dueDate, amount, estimatedPenalty, status] = await paymentContract.getRentDueDate();

            // Calculate total amount (rent + potential penalty)
            let totalAmount = amount + estimatedPenalty;

            if (estimatedPenalty > 0) {
                toast.info(`Late fee of ${ethers.formatEther(estimatedPenalty)} ETH will be added`);
            }

            toast.info(`Please confirm payment of ${ethers.formatEther(totalAmount)} ETH...`);

            // Send payment transaction
            const tx = await paymentContract.payRent({
                value: totalAmount
            });

            toast.info('Transaction sent. Waiting for confirmation...');
            const receipt = await tx.wait();

            // Record payment in backend
            await axios.post(`http://localhost:5000/api/payments/${payment.id}/record`, {
                transactionHash: receipt.hash,
                paidDate: new Date().toISOString()
            });

            toast.success('Payment successful!');
            fetchPayments(); // Refresh payments
        } catch (error) {
            console.error('Payment error:', error);
            if (error.code === 'ACTION_REJECTED') {
                toast.error('Transaction rejected by user');
            } else {
                toast.error(error.message || 'Payment failed');
            }
        } finally {
            setPaying(null);
        }
    };

    const getPaymentStatus = (payment) => {
        if (payment.status === 'paid') return 'paid';
        const dueDate = new Date(payment.dueDate);
        const today = new Date();

        if (dueDate < today) return 'overdue';
        if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 7) return 'upcoming';
        return 'pending';
    };

    const currentContract = contracts.find(c => c.id === parseInt(selectedContract));

    if (loading) {
        return <div className="loading-screen">Loading payments...</div>;
    }

    if (contracts.length === 0) {
        return (
            <div className="payments-container">
                <h1><FaMoneyBillWave /> Payments</h1>
                <div className="empty-state">
                    <p>No active contracts found</p>
                    <button onClick={() => navigate('/contracts')} className="btn-primary">
                        View Contracts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payments-container">
            <div className="payments-header">
                <h1><FaMoneyBillWave /> Rent Payments</h1>
            </div>

            {/* Contract Selector */}
            <div className="contract-selector">
                <label htmlFor="contract">Select Contract:</label>
                <select
                    id="contract"
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                >
                    {contracts.map(contract => (
                        <option key={contract.id} value={contract.id}>
                            {contract.property?.address || `Contract #${contract.id}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Contract Info */}
            {currentContract && (
                <div className="contract-info-box">
                    <div className="info-item">
                        <h3>Property</h3>
                        <p>{currentContract.property?.address}</p>
                    </div>
                    <div className="info-item">
                        <h3>Monthly Rent</h3>
                        <p className="amount">{currentContract.rentAmount} ETH</p>
                    </div>
                    <div className="info-item">
                        <h3>Contract Period</h3>
                        <p>
                            {new Date(currentContract.startDate).toLocaleDateString()} -
                            {new Date(currentContract.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}

            {!isConnected && user?.role === 'tenant' && (
                <div className="warning-box">
                    ⚠️ Connect your MetaMask wallet to make payments
                </div>
            )}

            {/* Payment Schedule */}
            <div className="payments-section">
                <h2>Payment Schedule</h2>

                {payments.length === 0 ? (
                    <p>No payments scheduled</p>
                ) : (
                    <div className="payments-list">
                        {payments.map(payment => {
                            const status = getPaymentStatus(payment);
                            const isPaid = payment.status === 'paid';
                            const isOverdue = status === 'overdue' && !isPaid;
                            const canPay = user?.role === 'tenant' && !isPaid && isConnected;

                            return (
                                <div key={payment.id} className={`payment-card ${status}`}>
                                    <div className="payment-header">
                                        <div>
                                            <h3>Payment #{payment.paymentIndex + 1}</h3>
                                            <p className="due-date">
                                                Due: {new Date(payment.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`payment-status-badge ${status}`}>
                                            {isPaid && <FaCheckCircle />}
                                            {isOverdue && <FaExclamationTriangle />}
                                            {status === 'upcoming' && <FaClock />}
                                            {isPaid ? 'Paid' : isOverdue ? 'Overdue' : status === 'upcoming' ? 'Due Soon' : 'Pending'}
                                        </span>
                                    </div>

                                    <div className="payment-details">
                                        <div className="detail-row">
                                            <span>Amount:</span>
                                            <span className="amount">{payment.amount} ETH</span>
                                        </div>

                                        {payment.penalty > 0 && (
                                            <div className="detail-row penalty">
                                                <span>Late Fee:</span>
                                                <span className="amount">+{payment.penalty} ETH</span>
                                            </div>
                                        )}

                                        {isPaid && payment.paidDate && (
                                            <div className="detail-row">
                                                <span>Paid On:</span>
                                                <span>{new Date(payment.paidDate).toLocaleDateString()}</span>
                                            </div>
                                        )}

                                        {isPaid && payment.transactionHash && (
                                            <div className="detail-row">
                                                <span>Tx Hash:</span>
                                                <code className="tx-hash">
                                                    {payment.transactionHash.slice(0, 10)}...{payment.transactionHash.slice(-8)}
                                                </code>
                                            </div>
                                        )}
                                    </div>

                                    {canPay && (
                                        <div className="payment-actions">
                                            <button
                                                onClick={() => handlePayRent(payment)}
                                                className="btn-primary btn-pay"
                                                disabled={paying === payment.id}
                                            >
                                                {paying === payment.id ? 'Processing...' : 'Pay Rent via MetaMask'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;
