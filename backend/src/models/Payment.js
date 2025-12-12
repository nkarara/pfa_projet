const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
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
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'due_date'
    },
    paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'paid_date'
    },
    amount: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        comment: 'Payment amount in ETH'
    },
    penalty: {
        type: DataTypes.DECIMAL(18, 8),
        defaultValue: 0,
        comment: 'Penalty amount for late payment in ETH'
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'
    },
    transactionHash: {
        type: DataTypes.STRING(66),
        allowNull: true,
        field: 'transaction_hash',
        validate: {
            is: /^0x[a-fA-F0-9]{64}$/i
        }
    },
    paymentIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'payment_index',
        comment: 'Index in smart contract payment array'
    }
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Payment;
