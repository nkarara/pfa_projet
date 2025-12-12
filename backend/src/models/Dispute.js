const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Dispute = sequelize.define('Dispute', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contractId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'contract_id',
        references: {
            model: 'contracts',
            key: 'id'
        }
    },
    filedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'filed_by',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'in_review', 'resolved', 'rejected'),
        allowNull: false,
        defaultValue: 'open'
    },
    resolution: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at'
    },
    resolvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'resolved_by',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    disputeIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'dispute_index',
        comment: 'Index in smart contract dispute array'
    },
    transactionHash: {
        type: DataTypes.STRING(66),
        allowNull: true,
        field: 'transaction_hash',
        validate: {
            is: /^0x[a-fA-F0-9]{64}$/i
        }
    }
}, {
    tableName: 'disputes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Dispute;
