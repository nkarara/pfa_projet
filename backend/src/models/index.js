const User = require('./User');
const Property = require('./Property');
const Contract = require('./Contract');
const Payment = require('./Payment');
const Dispute = require('./Dispute');

// Define associations

// User - Property relationship (One-to-Many)
User.hasMany(Property, {
    foreignKey: 'ownerId',
    as: 'properties'
});
Property.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner'
});

// User - Contract relationships
User.hasMany(Contract, {
    foreignKey: 'landlordId',
    as: 'contractsAsLandlord'
});
User.hasMany(Contract, {
    foreignKey: 'tenantId',
    as: 'contractsAsTenant'
});

Contract.belongsTo(User, {
    foreignKey: 'landlordId',
    as: 'landlord'
});
Contract.belongsTo(User, {
    foreignKey: 'tenantId',
    as: 'tenant'
});

// Property - Contract relationship (One-to-One)
Property.hasOne(Contract, {
    foreignKey: 'propertyId',
    as: 'contract'
});
Contract.belongsTo(Property, {
    foreignKey: 'propertyId',
    as: 'property'
});

// Contract - Payment relationship (One-to-Many)
Contract.hasMany(Payment, {
    foreignKey: 'contractId',
    as: 'payments'
});
Payment.belongsTo(Contract, {
    foreignKey: 'contractId',
    as: 'contract'
});

// Contract - Dispute relationship (One-to-Many)
Contract.hasMany(Dispute, {
    foreignKey: 'contractId',
    as: 'disputes'
});
Dispute.belongsTo(Contract, {
    foreignKey: 'contractId',
    as: 'contract'
});

// User - Dispute relationships
User.hasMany(Dispute, {
    foreignKey: 'filedBy',
    as: 'disputesFiled'
});
User.hasMany(Dispute, {
    foreignKey: 'resolvedBy',
    as: 'disputesResolved'
});

Dispute.belongsTo(User, {
    foreignKey: 'filedBy',
    as: 'filer'
});
Dispute.belongsTo(User, {
    foreignKey: 'resolvedBy',
    as: 'resolver'
});

module.exports = {
    User,
    Property,
    Contract,
    Payment,
    Dispute
};
