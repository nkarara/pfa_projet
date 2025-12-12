const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'owner_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'apartment, house, studio, etc.'
    },
    area: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Area in square meters'
    },
    photos: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    status: {
        type: DataTypes.ENUM('available', 'rented'),
        allowNull: false,
        defaultValue: 'available'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    monthlyRent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'monthly_rent',
        comment: 'Suggested monthly rent'
    }
}, {
    tableName: 'properties',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Property;
