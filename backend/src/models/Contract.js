const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'property_id',
        references: {
            model: 'properties',
            key: 'id'
        }
    },
    landlordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'landlord_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    tenantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'tenant_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    smartContractAddress: {
        type: DataTypes.STRING(42),
        allowNull: true,
        field: 'smart_contract_address',
        validate: {
            is: /^0x[a-fA-F0-9]{40}$/i
        }
    },
    paymentManagerAddress: {
        type: DataTypes.STRING(42),
        allowNull: true,
        field: 'payment_manager_address',
        validate: {
            is: /^0x[a-fA-F0-9]{40}$/i
        }
    },
    disputeManagerAddress: {
        type: DataTypes.STRING(42),
        allowNull: true,
        field: 'dispute_manager_address',
        validate: {
            is: /^0x[a-fA-F0-9]{40}$/i
        }
    },
    rentAmount: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        field: 'rent_amount',
        comment: 'Monthly rent in ETH'
    },
    durationMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'duration_months'
    },
    paymentFrequency: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'monthly',
        field: 'payment_frequency'
    },
    depositAmount: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        field: 'deposit_amount',
        comment: 'Security deposit in ETH'
    },
    terms: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Contract terms and conditions'
    },
    status: {
        type: DataTypes.ENUM('draft', 'pending_signature', 'active', 'terminated'),
        allowNull: false,
        defaultValue: 'draft'
    },
    landlordSigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'landlord_signed'
    },
    tenantSigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'tenant_signed'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'start_date'
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_date'
    }
}, {
    tableName: 'contracts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Contract;
