-- Création du schéma complet de la base de données
-- Base: rental_blockchain

USE rental_blockchain;

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('landlord', 'tenant') NOT NULL,
    blockchain_address VARCHAR(42),
    kyc_document VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table properties
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    photos JSON,
    status ENUM('available', 'rented') DEFAULT 'available',
    description TEXT,
    monthly_rent DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table contracts
CREATE TABLE IF NOT EXISTS contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    landlord_id INT NOT NULL,
    tenant_id INT,
    smart_contract_address VARCHAR(42),
    payment_manager_address VARCHAR(42),
    dispute_manager_address VARCHAR(42),
    rent_amount DECIMAL(18,8) NOT NULL,
    duration_months INT NOT NULL,
    payment_frequency VARCHAR(20) DEFAULT 'monthly',
    deposit_amount DECIMAL(18,8) NOT NULL,
    terms TEXT,
    status ENUM('draft', 'pending_signature', 'active', 'terminated') DEFAULT 'draft',
    landlord_signed BOOLEAN DEFAULT FALSE,
    tenant_signed BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_property (property_id),
    INDEX idx_landlord (landlord_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table payments
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    amount DECIMAL(18,8) NOT NULL,
    penalty DECIMAL(18,8) DEFAULT 0,
    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    transaction_hash VARCHAR(66),
    payment_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    INDEX idx_contract (contract_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table disputes
CREATE TABLE IF NOT EXISTS disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    filed_by INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_review', 'resolved', 'rejected') DEFAULT 'open',
    resolution TEXT,
    resolved_at TIMESTAMP NULL,
    resolved_by INT,
    dispute_index INT,
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (filed_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (resolved_by) REFERENCES users(id),
    INDEX idx_contract (contract_id),
    INDEX idx_filed_by (filed_by),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insérer le compte admin
INSERT INTO users (
    first_name, last_name, email, password_hash, role, 
    created_at, updated_at
) VALUES (
    'Nabil', 'Admin', 'nabil@gmail.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye2J0SZwkLxE9gR2qRzH1XJL7ztEd4ej6',
    'landlord', NOW(), NOW()
);

-- Afficher le résultat
SELECT 
    '✅ COMPTE ADMIN CRÉÉ !' as Message,
    id as ID,
    CONCAT(first_name, ' ', last_name) as Nom,
    email as Email,
    role as Role,
    created_at as 'Date Création'
FROM users 
WHERE email = 'nabil@gmail.com';

SELECT '✅ BASE DE DONNÉES INITIALISÉE !' as Status;
