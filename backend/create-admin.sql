-- Script SQL pour créer un compte administrateur
-- Email: nabil@gmail.com
-- Password: 123456

USE rental_blockchain;

-- Insérer l'utilisateur admin
-- Le mot de passe '123456' est hashé avec bcrypt (salt rounds = 10)
INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role,
    blockchain_address,
    kyc_document,
    created_at,
    updated_at
) VALUES (
    'Nabil',
    'Admin',
    'nabil@gmail.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye2J0SZwkLxE9gR2qRzH1XJL7ztEd4ej6',  -- Hash de '123456'
    'landlord',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Afficher le résultat
SELECT 
    id,
    first_name,
    last_name,
    email,
    role,
    created_at
FROM users
WHERE email = 'nabil@gmail.com';
