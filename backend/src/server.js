const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, testConnection } = require('./config/database');
const { User, Property, Contract, Payment, Dispute } = require('./models');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/disputes', require('./routes/disputes'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Blockchain Rental Management API',
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Sync database (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

        // Start blockchain event listeners
        const { startEventListeners } = require('./services/eventListeners');
        setTimeout(() => {
            startEventListeners();
        }, 2000); // Wait 2 seconds for server to fully start

        // Start listening
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Blockchain RPC: ${process.env.BLOCKCHAIN_RPC || 'http://127.0.0.1:7545'}`);
            console.log(`\n✨ API Endpoints:`);
            console.log(`   AUTH:`);
            console.log(`   - POST   /api/auth/register`);
            console.log(`   - POST   /api/auth/login`);
            console.log(`   - GET    /api/auth/profile`);
            console.log(`   - PUT    /api/auth/profile`);
            console.log(`\n   CONTRACTS:`);
            console.log(`   - POST   /api/contracts`);
            console.log(`   - GET    /api/contracts/my-contracts`);
            console.log(`   - GET    /api/contracts/:id`);
            console.log(`   - POST   /api/contracts/:id/sign`);
            console.log(`   - PUT    /api/contracts/:id/terminate`);
            console.log(`\n   PROPERTIES:`);
            console.log(`   - GET    /api/properties`);
            console.log(`   - POST   /api/properties`);
            console.log(`   - GET    /api/properties/my/properties`);
            console.log(`\n   PAYMENTS:`);
            console.log(`   - GET    /api/payments/contract/:contractId`);
            console.log(`   - POST   /api/payments/:id/record`);
            console.log(`   - GET    /api/payments/overdue`);
            console.log(`\n   DISPUTES:`);
            console.log(`   - POST   /api/disputes`);
            console.log(`   - GET    /api/disputes/my-disputes`);
            console.log(`   - PUT    /api/disputes/:id/resolve\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
