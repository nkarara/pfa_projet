const bcrypt = require('bcryptjs');
const { User } = require('./src/models');
const { sequelize, testConnection } = require('./src/config/database');

/**
 * Script pour créer un compte administrateur
 * Email: nabil@gmail.com
 * Password: 123456
 */

const createAdmin = async () => {
    try {
        console.log('🔧 Création du compte administrateur...\n');

        // Test de connexion à la base de données
        await testConnection();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            where: { email: 'nabil@gmail.com' }
        });

        if (existingUser) {
            console.log('⚠️  Un utilisateur avec cet email existe déjà !');
            console.log('📧 Email:', existingUser.email);
            console.log('👤 Nom:', existingUser.firstName, existingUser.lastName);
            console.log('🔑 Role:', existingUser.role);

            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('\nVoulez-vous le supprimer et recréer ? (oui/non): ', async (answer) => {
                if (answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o') {
                    await existingUser.destroy();
                    console.log('✅ Utilisateur supprimé');
                    await createNewAdmin();
                } else {
                    console.log('❌ Opération annulée');
                    process.exit(0);
                }
                readline.close();
            });
        } else {
            await createNewAdmin();
        }

    } catch (error) {
        console.error('❌ Erreur lors de la création:', error.message);
        process.exit(1);
    }
};

const createNewAdmin = async () => {
    try {
        // Créer l'utilisateur admin
        const admin = await User.create({
            firstName: 'Nabil',
            lastName: 'Admin',
            email: 'nabil@gmail.com',
            password: '123456', // Le hook beforeCreate va le hasher automatiquement
            role: 'landlord', // Peut être 'landlord' ou 'tenant'
            blockchainAddress: null // À remplir plus tard via l'interface
        });

        console.log('\n✅ Compte administrateur créé avec succès !');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    ', admin.email);
        console.log('🔑 Password: ', '123456');
        console.log('👤 Nom:      ', admin.firstName, admin.lastName);
        console.log('🎭 Role:     ', admin.role);
        console.log('🆔 ID:       ', admin.id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🚀 Vous pouvez maintenant vous connecter !');
        console.log('🌐 URL: http://localhost:3000');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

// Exécuter
createAdmin();
