const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name'
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
    },
    role: {
        type: DataTypes.ENUM('landlord', 'tenant'),
        allowNull: false,
        defaultValue: 'tenant'
    },
    blockchainAddress: {
        type: DataTypes.STRING(42),
        allowNull: true,
        field: 'blockchain_address',
        validate: {
            is: /^0x[a-fA-F0-9]{40}$/i
        }
    },
    kycDocument: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'kyc_document'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hash password before creating user
User.beforeCreate(async (user) => {
    if (user.passwordHash) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Instance method to get safe user object (without password)
User.prototype.toSafeObject = function () {
    const { passwordHash, ...safeUser } = this.toJSON();
    return safeUser;
};

module.exports = User;
