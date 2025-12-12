import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFileContract, FaHome, FaUser } from 'react-icons/fa';
import '../styles/CreateContract.css';

const CreateContract = () => {
    const { user } = useAuth();
    const { account, isConnected } = useWeb3();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [properties, setProperties] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        propertyId: '',
        tenantId: '',
        rentAmount: '',
        durationMonths: 12,
        depositAmount: '',
        terms: 'Standard rental agreement terms and conditions.'
    });

    useEffect(() => {
        if (user?.role !== 'landlord') {
            toast.error('Only landlords can create contracts');
            navigate('/dashboard');
            return;
        }

        if (!isConnected) {
            toast.warning('Please connect your MetaMask wallet');
        }

        fetchProperties();
        fetchTenants();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/properties/my/properties');
            if (response.data.success) {
                // Filter only available properties
                const available = response.data.data.filter(p => p.status === 'available');
                setProperties(available);
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        }
    };

    const fetchTenants = async () => {
        try {
            // In a real app, you'd have an endpoint to list users with role 'tenant'
            // For now, we'll let landlord enter tenant ID manually or select from dropdown
            // This is a placeholder - you might want to add a backend endpoint
            setTenants([]);
        } catch (error) {
            console.error('Failed to fetch tenants:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        if (step === 1 && !formData.propertyId) {
            toast.error('Please select a property');
            return;
        }
        if (step === 2 && (!formData.rentAmount || !formData.depositAmount)) {
            toast.error('Please fill in all financial details');
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            toast.error('Please connect your MetaMask wallet first');
            return;
        }

        if (!account) {
            toast.error('No wallet address detected');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/contracts', {
                ...formData,
                tenantId: formData.tenantId || null // Optional tenant
            });

            if (response.data.success) {
                toast.success('Contract created and smart contracts deployed!');
                setTimeout(() => {
                    navigate(`/contracts/${response.data.data.id}`);
                }, 2000);
            }
        } catch (error) {
            console.error('Contract creation error:', error);
            toast.error(error.response?.data?.message || 'Failed to create contract');
        } finally {
            setLoading(false);
        }
    };

    const selectedProperty = properties.find(p => p.id === parseInt(formData.propertyId));

    return (
        <div className="create-contract-container">
            <div className="wizard-header">
                <h1><FaFileContract /> Create Rental Contract</h1>
                <div className="wizard-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Property</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Terms</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Review</span>
                    </div>
                </div>
            </div>

            <div className="wizard-content">
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Select Property */}
                    {step === 1 && (
                        <div className="wizard-step">
                            <h2><FaHome /> Select Property</h2>
                            {properties.length === 0 ? (
                                <div className="empty-state">
                                    <p>No available properties found</p>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/properties')}
                                        className="btn-primary"
                                    >
                                        Add a Property First
                                    </button>
                                </div>
                            ) : (
                                <div className="property-selection">
                                    {properties.map(property => (
                                        <div
                                            key={property.id}
                                            className={`property-option ${formData.propertyId === property.id.toString() ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, propertyId: property.id.toString() })}
                                        >
                                            <input
                                                type="radio"
                                                name="propertyId"
                                                value={property.id}
                                                checked={formData.propertyId === property.id.toString()}
                                                onChange={handleChange}
                                            />
                                            <div className="property-info">
                                                <h3>{property.address}</h3>
                                                <p><strong>Type:</strong> {property.type}</p>
                                                <p><strong>Area:</strong> {property.area} m²</p>
                                                {property.monthlyRent && (
                                                    <p><strong>Suggested Rent:</strong> {property.monthlyRent} ETH</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Contract Terms */}
                    {step === 2 && (
                        <div className="wizard-step">
                            <h2>Contract Terms</h2>

                            <div className="form-group">
                                <label htmlFor="tenantId">Tenant User ID (Optional)</label>
                                <input
                                    type="number"
                                    id="tenantId"
                                    name="tenantId"
                                    value={formData.tenantId}
                                    onChange={handleChange}
                                    placeholder="Leave empty to assign later"
                                />
                                <small>Enter the user ID of the tenant (you can assign later)</small>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="rentAmount">Monthly Rent (ETH) *</label>
                                    <input
                                        type="number"
                                        id="rentAmount"
                                        name="rentAmount"
                                        value={formData.rentAmount}
                                        onChange={handleChange}
                                        step="0.001"
                                        required
                                        placeholder="1.5"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="depositAmount">Security Deposit (ETH) *</label>
                                    <input
                                        type="number"
                                        id="depositAmount"
                                        name="depositAmount"
                                        value={formData.depositAmount}
                                        onChange={handleChange}
                                        step="0.001"
                                        required
                                        placeholder="3.0"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="durationMonths">Contract Duration (Months) *</label>
                                <select
                                    id="durationMonths"
                                    name="durationMonths"
                                    value={formData.durationMonths}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="6">6 Months</option>
                                    <option value="12">12 Months (1 Year)</option>
                                    <option value="24">24 Months (2 Years)</option>
                                    <option value="36">36 Months (3 Years)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="terms">Terms and Conditions</label>
                                <textarea
                                    id="terms"
                                    name="terms"
                                    value={formData.terms}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Enter contract terms and conditions..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="wizard-step">
                            <h2>Review Contract</h2>

                            <div className="review-section">
                                <h3>Property Information</h3>
                                {selectedProperty && (
                                    <div className="review-item">
                                        <p><strong>Address:</strong> {selectedProperty.address}</p>
                                        <p><strong>Type:</strong> {selectedProperty.type}</p>
                                        <p><strong>Area:</strong> {selectedProperty.area} m²</p>
                                    </div>
                                )}
                            </div>

                            <div className="review-section">
                                <h3>Financial Terms</h3>
                                <div className="review-item">
                                    <p><strong>Monthly Rent:</strong> {formData.rentAmount} ETH</p>
                                    <p><strong>Security Deposit:</strong> {formData.depositAmount} ETH</p>
                                    <p><strong>Duration:</strong> {formData.durationMonths} months</p>
                                    <p><strong>Total Rent:</strong> {(parseFloat(formData.rentAmount) * parseInt(formData.durationMonths)).toFixed(3)} ETH</p>
                                </div>
                            </div>

                            <div className="review-section">
                                <h3>Terms & Conditions</h3>
                                <div className="review-item">
                                    <p>{formData.terms}</p>
                                </div>
                            </div>

                            {!isConnected && (
                                <div className="warning-box">
                                    ⚠️ Please connect your MetaMask wallet to deploy the smart contracts
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="wizard-actions">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="btn-secondary"
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn-primary"
                                disabled={properties.length === 0}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !isConnected}
                            >
                                {loading ? 'Creating Contract...' : 'Create Contract & Deploy'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateContract;
