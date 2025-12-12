import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaHome } from 'react-icons/fa';
import '../styles/Properties.css';

const Properties = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        type: 'apartment',
        area: '',
        description: '',
        monthlyRent: ''
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const endpoint = user?.role === 'landlord'
                ? 'http://localhost:5000/api/properties/my/properties'
                : 'http://localhost:5000/api/properties?status=available';

            const response = await axios.get(endpoint);
            if (response.data.success) {
                setProperties(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
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

        try {
            if (editingProperty) {
                // Update existing property
                const response = await axios.put(
                    `http://localhost:5000/api/properties/${editingProperty.id}`,
                    formData
                );
                if (response.data.success) {
                    toast.success('Property updated successfully');
                }
            } else {
                // Create new property
                const response = await axios.post(
                    'http://localhost:5000/api/properties',
                    formData
                );
                if (response.data.success) {
                    toast.success('Property created successfully');
                }
            }

            setShowModal(false);
            setEditingProperty(null);
            setFormData({
                address: '',
                type: 'apartment',
                area: '',
                description: '',
                monthlyRent: ''
            });
            fetchProperties();
        } catch (error) {
            console.error('Property operation error:', error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            address: property.address,
            type: property.type,
            area: property.area,
            description: property.description || '',
            monthlyRent: property.monthlyRent || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/properties/${id}`
            );
            if (response.data.success) {
                toast.success('Property deleted successfully');
                fetchProperties();
            }
        } catch (error) {
            console.error('Delete property error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete property');
        }
    };

    const openModal = () => {
        setEditingProperty(null);
        setFormData({
            address: '',
            type: 'apartment',
            area: '',
            description: '',
            monthlyRent: ''
        });
        setShowModal(true);
    };

    return (
        <div className="properties-container">
            <div className="properties-header">
                <h1>
                    <FaHome /> {user?.role === 'landlord' ? 'My Properties' : 'Available Properties'}
                </h1>
                {user?.role === 'landlord' && (
                    <button onClick={openModal} className="btn-primary">
                        <FaPlus /> Add Property
                    </button>
                )}
            </div>

            {loading ? (
                <p>Loading properties...</p>
            ) : properties.length === 0 ? (
                <div className="empty-state">
                    <FaHome size={64} style={{ opacity: 0.3 }} />
                    <p>No properties found</p>
                    {user?.role === 'landlord' && (
                        <button onClick={openModal} className="btn-primary">
                            Add Your First Property
                        </button>
                    )}
                </div>
            ) : (
                <div className="properties-grid">
                    {properties.map(property => (
                        <div key={property.id} className="property-card">
                            <div className="property-status">
                                <span className={`badge ${property.status}`}>
                                    {property.status}
                                </span>
                            </div>

                            <div className="property-info">
                                <h3>{property.address}</h3>
                                <div className="property-details">
                                    <p><strong>Type:</strong> {property.type}</p>
                                    <p><strong>Area:</strong> {property.area} m²</p>
                                    {property.monthlyRent && (
                                        <p><strong>Monthly Rent:</strong> {property.monthlyRent} ETH</p>
                                    )}
                                </div>

                                {property.description && (
                                    <p className="property-description">{property.description}</p>
                                )}
                            </div>

                            {user?.role === 'landlord' && (
                                <div className="property-actions">
                                    <button
                                        onClick={() => handleEdit(property)}
                                        className="btn-secondary"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="btn-danger"
                                        disabled={property.status === 'rented'}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Property Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="address">Property Address *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main Street, City, Country"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="type">Property Type *</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="studio">Studio</option>
                                        <option value="villa">Villa</option>
                                        <option value="condo">Condo</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="area">Area (m²) *</label>
                                    <input
                                        type="number"
                                        id="area"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        placeholder="50"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="monthlyRent">Suggested Monthly Rent (ETH)</label>
                                <input
                                    type="number"
                                    id="monthlyRent"
                                    name="monthlyRent"
                                    value={formData.monthlyRent}
                                    onChange={handleChange}
                                    placeholder="1.5"
                                    step="0.001"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Additional details about the property..."
                                    rows="4"
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProperty ? 'Update Property' : 'Create Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Properties;
