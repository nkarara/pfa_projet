import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaWallet, FaSave } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        blockchainAddress: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                blockchainAddress: user.blockchainAddress || '',
                phone: user.phone || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                blockchainAddress: formData.blockchainAddress,
                phone: formData.phone
            };

            const response = await axios.put('http://localhost:5000/api/auth/profile', updateData);

            if (response.data.success) {
                updateUser(response.data.data);
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await axios.put('http://localhost:5000/api/auth/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            toast.success('Password updated successfully!');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Password update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1><FaUser /> My Profile</h1>
                <p>Manage your account information and blockchain address</p>
            </div>

            <div className="profile-content">
                {/* Profile Information */}
                <div className="profile-section">
                    <h2>Profile Information</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label><FaUser /> First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><FaUser /> Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><FaEnvelope /> Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label><FaWallet /> Blockchain Address (MetaMask)</label>
                            <input
                                type="text"
                                name="blockchainAddress"
                                value={formData.blockchainAddress}
                                onChange={handleChange}
                                placeholder="0x... (Paste your MetaMask address here)"
                            />
                            <small className="form-hint">
                                💡 Required for blockchain features. Copy from MetaMask.
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            <FaSave /> {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="profile-section">
                    <h2>Change Password</h2>
                    <form onSubmit={handleUpdatePassword}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-secondary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Account Information */}
                <div className="profile-section info-section">
                    <h2>Account Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Role</label>
                            <p className="role-badge">{user?.role || 'User'}</p>
                        </div>
                        <div className="info-item">
                            <label>User ID</label>
                            <p className="id-badge">#{user?.id}</p>
                        </div>
                        <div className="info-item">
                            <label>Member Since</label>
                            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="info-item">
                            <label>Account Status</label>
                            <p className="status-active">✓ Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
