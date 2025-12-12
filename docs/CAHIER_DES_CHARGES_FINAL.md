# 📘 CAHIER DES CHARGES

## Système de Gestion des Contrats de Location Immobilière via Blockchain

---

**Étudiant** : [Votre Nom]  
**Encadrant** : [Nom de l'encadrant]  
**Année universitaire** : 2024-2025  
**Date** : Décembre 2025  
**Version** : 1.0  

---

## 1. INTRODUCTION

Ce projet vise à concevoir une **plateforme web décentralisée** permettant de gérer l'ensemble du processus de location immobilière (création, signature, paiement, litiges) grâce à la technologie **Blockchain Ethereum**.

### 1.1 Problématique

Le marché locatif immobilier souffre actuellement de :
- **Manque de transparence** dans les transactions
- **Litiges fréquents** entre propriétaires et locataires
- **Processus administratifs** longs et complexes
- **Difficultés de traçabilité** des paiements
- **Risques de falsification** de documents

### 1.2 Solution Proposée

La blockchain Ethereum permet d'assurer :

✅ **Transparence** : Toutes les transactions sont publiques et vérifiables  
✅ **Automatisation** : Smart contracts pour l'exécution automatique  
✅ **Sécurité** : Cryptographie et signatures numériques  
✅ **Immuabilité** : Les contrats ne peuvent pas être modifiés a posteriori  
✅ **Traçabilité** : Historique complet et infalsifiable

La blockchain garantit la **fiabilité des données** et réduit les **conflits** entre propriétaires et locataires.

---

## 2. OBJECTIFS DU PROJET

### 2.1 Objectifs Principaux

| ID | Objectif | Mesure de Succès |
|----|----------|------------------|
| O1 | Dématérialiser et automatiser la gestion des contrats de location | 100% des contrats créés via la plateforme |
| O2 | Sécuriser la signature et l'exécution des contrats via smart contracts Ethereum | Tous les contrats signés déployés sur blockchain |
| O3 | Assurer un suivi automatique et infalsifiable des paiements de loyer | Hash de transaction pour chaque paiement |
| O4 | Offrir un mécanisme de traçabilité complète des litiges | Litiges enregistrés sur blockchain |

### 2.2 Objectifs Secondaires

- Proposer une **interface intuitive** pour propriétaires et locataires
- Réduire les **procédures administratives** manuelles
- Améliorer la **confiance** via la transparence blockchain
- Garantir la **sécurité des données** personnelles et financières

### 2.3 Indicateurs de Performance (KPI)

| KPI | Cible |
|-----|-------|
| Temps de création d'un contrat | < 5 minutes |
| Temps de confirmation d'un paiement | < 2 minutes |
| Disponibilité du système | > 99% |
| Taux de litiges résolus | > 90% |

---

## 3. PÉRIMÈTRE FONCTIONNEL

### 3.1 Gestion des Utilisateurs

**Fonctionnalités** :
- Inscription et authentification (email + mot de passe + JWT)
- Vérification d'identité (KYC via upload de document)
- Deux rôles : **propriétaire** et **locataire**
- Association d'une adresse blockchain Ethereum (via MetaMask)
- Gestion du profil utilisateur

**Détails techniques** :
- Hashage du mot de passe avec **bcrypt** (salt rounds ≥ 10)
- Token JWT avec expiration de **7 jours**
- Validation de l'adresse Ethereum (format `0x[40 caractères hex]`)

---

### 3.2 Gestion des Biens Immobiliers

**Fonctionnalités réservées au propriétaire** :

| Fonction | Description |
|----------|-------------|
| **Ajout** | Créer un bien avec adresse, type, superficie, prix mensuel, photos |
| **Modification** | Modifier les informations d'un bien |
| **Suppression** | Supprimer un bien (uniquement si non loué) |
| **Consultation** | Voir le statut : disponible / loué |

**Stockage** :
- Données stockées dans **PostgreSQL** (hors blockchain)
- Photos stockées en tant que **JSON array** (URLs ou base64)
- Statut automatiquement mis à jour lors de la signature d'un contrat

---

### 3.3 Création des Contrats Intelligents (Smart Contracts)

#### 3.3.1 Processus de Création

Le propriétaire crée un contrat avec les paramètres suivants :
- **Locataire** : Email ou adresse blockchain
- **Durée** : Nombre de mois
- **Montant du loyer** : En ETH
- **Fréquence de paiement** : Mensuelle (par défaut)
- **Dépôt de garantie** : En ETH
- **Clauses** : Termes textuels du contrat

#### 3.3.2 Déploiement Automatique

Le système déploie **3 smart contracts distincts** sur la blockchain :

**1. RentalContract.sol**
```solidity
Rôle : Contrat principal de location
Fonctions :
  - signContract() : Signature par les parties
  - terminateContract() : Résiliation
  - getContractDetails() : Consultation des termes
  
Events :
  - ContractSigned(address signer)
  - ContractActivated(uint256 startDate)
  - ContractTerminated(address terminator)
```

**2. PaymentManager.sol**
```solidity
Rôle : Gestion automatisée des paiements
Fonctions :
  - makePayment() : Effectuer un paiement
  - calculatePenalty(paymentId) : Calculer pénalités
  - withdrawFunds(amount) : Retirer les fonds (propriétaire)
  - getAllPayments() : Historique complet
  
Logique des pénalités :
  penalty = (jours_retard - grace_period) × taux × montant / 100
  grace_period = 3 jours (par défaut)
  taux = 5% (par défaut)
  
Events :
  - PaymentMade(uint256 paymentId, uint256 amount, uint256 penalty)
  - FundsWithdrawn(address recipient, uint256 amount)
```

**3. DisputeManager.sol**
```solidity
Rôle : Gestion des litiges
Fonctions :
  - fileDispute(description) : Déposer un litige
  - resolveDispute(disputeId, resolution) : Résoudre (admin)
  - getDisputeDetails(disputeId) : Détails du litige
  
Résolutions possibles :
  - LANDLORD_WINS (0)
  - TENANT_WINS (1)
  
Events :
  - DisputeFiled(uint256 disputeId, address filedBy)
  - DisputeResolved(uint256 disputeId, uint8 resolution)
```

#### 3.3.3 Enregistrement

Après déploiement, le système :
1. Récupère les **3 adresses blockchain** des contrats
2. Les enregistre dans la table `contracts` de PostgreSQL :
   - `smart_contract_address`
   - `payment_manager_address`
   - `dispute_manager_address`
3. Change le statut du contrat en `"active"`

---

### 3.4 Signature Numérique

**Processus** :

1. **Signature Propriétaire** :
   - Clic sur "Signer le contrat"
   - Authentification via MetaMask
   - Transaction blockchain signée
   - Champ `landlord_signed` = `true`
   - Event `ContractSigned(landlord_address)` émis

2. **Signature Locataire** :
   - Notification envoyée au locataire
   - Même processus de signature
   - Champ `tenant_signed` = `true`
   - Event `ContractSigned(tenant_address)` émis

3. **Activation** :
   - Lorsque `landlord_signed` ET `tenant_signed` = `true`
   - Déploiement automatique des 3 smart contracts
   - Event `ContractActivated(block.timestamp)` émis
   - Backend écoute l'événement et met à jour PostgreSQL

**Technologie** :
- Signature via **MetaMask**
- Transaction enregistrée sur **Ganache** (développement)
- Hash de transaction stocké en base de données

---

### 3.5 Paiement Automatisé des Loyers

#### 3.5.1 Calendrier de Paiements

Lors de l'activation du contrat :
- Le `PaymentManager.sol` génère automatiquement un **calendrier**
- Nombre de paiements = `duration_months`
- Chaque paiement a :
  - `paymentIndex` : Position dans le calendrier
  - `dueDate` : Date d'échéance
  - `amount` : Montant du loyer
  - `isPaid` : false (initialement)

#### 3.5.2 Processus de Paiement

**Étapes** :

1. **Consultation** :
   - Le locataire voit la liste des paiements dus
   - Indication des paiements en retard (rouge)

2. **Paiement** :
   - Clic sur "Payer"
   - Connexion MetaMask
   - Calcul automatique : `montant_total = loyer + pénalité`
   - Transaction Ethereum envoyée
   - Confirmation blockchain

3. **Enregistrement** :
   - Smart contract met à jour `payments[paymentIndex].isPaid = true`
   - Event `PaymentMade(paymentIndex, amount, penalty)` émis
   - Backend écoute et met à jour PostgreSQL :
     ```sql
     UPDATE payments 
     SET status = 'paid', 
         paid_date = NOW(), 
         transaction_hash = 'hash',
         penalty = calculated_penalty
     WHERE id = payment_id
     ```

#### 3.5.3 Calcul Automatique des Pénalités

**Formule implémentée dans le smart contract** :

```solidity
function calculatePenalty(uint256 paymentIndex) public view returns (uint256) {
    Payment memory payment = payments[paymentIndex];
    
    if (block.timestamp <= payment.dueDate) {
        return 0; // Pas de retard
    }
    
    uint256 daysLate = (block.timestamp - payment.dueDate) / 86400;
    
    if (daysLate <= gracePeriodDays) {
        return 0; // Dans la période de grâce
    }
    
    uint256 effectiveDaysLate = daysLate - gracePeriodDays;
    return (effectiveDaysLate * penaltyRate * payment.amount) / 100;
}
```

**Exemple** :
- Loyer : 1 ETH
- Retard : 10 jours
- Grace period : 3 jours
- Taux pénalité : 5%
- **Pénalité** = (10-3) × 5 × 1 / 100 = **0.35 ETH**

#### 3.5.4 Historique et Traçabilité

- **Immuabilité** : Tous les paiements enregistrés sur blockchain
- **Preuve** : Hash de transaction consultable sur Ganache
- **Transparence** : Les deux parties voient l'historique complet
- **Auditabilité** : Consultation possible à tout moment

#### 3.5.5 Retrait des Fonds (Propriétaire)

Le propriétaire peut retirer les fonds via :
```solidity
function withdrawFunds(uint256 amount) public onlyLandlord {
    require(address(this).balance >= amount, "Insufficient balance");
    payable(landlord).transfer(amount);
    emit FundsWithdrawn(landlord, amount);
}
```

---

### 3.6 Gestion des Litiges

#### 3.6.1 Dépôt d'un Litige

**Qui peut déposer** :
- Propriétaire OU Locataire

**Processus** :
1. Formulaire avec :
   - Contrat concerné
   - Description du problème
   - Preuves (optionnel)

2. Enregistrement :
   - Insertion dans PostgreSQL (table `disputes`)
   - Transaction blockchain (DisputeManager.sol)
   - Event `DisputeFiled(disputeId, msg.sender)` émis

3. Notification :
   - L'autre partie est notifiée
   - Statut initial : `"open"`

#### 3.6.2 Suivi

Les deux parties peuvent :
- Consulter l'état du litige
- Voir l'historique complet
- Recevoir des notifications

**Statuts possibles** :
- `open` : En attente
- `in_review` : En cours de traitement
- `resolved` : Résolu
- `rejected` : Rejeté

#### 3.6.3 Résolution

**Par un administrateur** :

1. Consultation du litige
2. Analyse des preuves
3. Décision : `LANDLORD_WINS` ou `TENANT_WINS`
4. Transaction blockchain :
   ```solidity
   function resolveDispute(uint256 disputeId, Resolution resolution) 
       public onlyArbitrator {
       disputes[disputeId].status = DisputeStatus.RESOLVED;
       disputes[disputeId].resolution = resolution;
       emit DisputeResolved(disputeId, resolution);
   }
   ```
5. Mise à jour PostgreSQL
6. Notification des deux parties

#### 3.6.4 Traçabilité

- **Historique complet** horodaté
- **Résolution immuable** sur blockchain
- **Transparence** pour les deux parties
- **Preuves cryptographiques** via hash de transaction

---

### 3.7 Tableau de Bord

#### Pour le Propriétaire

**Sections** :
- **Mes Biens** : Liste avec statut (disponible/loué)
- **Contrats Actifs** : Nombre et détails
- **Paiements Reçus** : Montant total ce mois
- **Paiements en Retard** : Alertes en rouge
- **Litiges Ouverts** : Nombre et accès rapide
- **Activité Récente** : Dernières actions

**Indicateurs Clés** :
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 5 Biens         │  │ 3 Contrats      │  │ 12.5 ETH        │
│ (3 loués)       │  │ Actifs          │  │ Ce mois         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Pour le Locataire

**Sections** :
- **Contrat en Cours** : Détails complets
- **Paiements Dus** : Liste avec dates d'échéance
- **Paiements Effectués** : Historique avec hash
- **Dépôt de Garantie** : Montant et statut
- **Litiges Associés** : Mes litiges actifs
- **Notifications** : Alertes et rappels

**Indicateurs Clés** :
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Contrat         │  │ Prochain        │  │ 2.0 ETH         │
│ Actif           │  │ Paiement        │  │ Dépôt           │
│ 10 mois restants│  │ Dans 5 jours    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 4. PÉRIMÈTRE NON-FONCTIONNEL

### 4.1 Sécurité

| Exigence | Implémentation | Vérification |
|----------|----------------|--------------|
| **Mots de passe** | Chiffrement avec **bcrypt** (salt rounds = 10) | Audit de code |
| **Authentification** | Tokens **JWT** avec expiration (7 jours) | Tests de session |
| **Validation KYC** | Upload de document d'identité | Processus manuel |
| **Transactions blockchain** | Signées via **MetaMask** | Vérification cryptographique |
| **Protection API** | Middleware de vérification JWT | Tests de pénétration |
| **Validation entrées** | Sanitization côté serveur | Tests d'injection |

### 4.2 Performance

| Critère | Objectif | Mesure |
|---------|----------|--------|
| Temps de chargement page | < 2 secondes | Chrome DevTools |
| Temps de réponse API | < 500 ms | Tests de charge |
| Confirmation transaction (Ganache) | < 5 secondes | Monitoring blockchain |
| Déploiement smart contracts | < 30 secondes | Mesure automatique |

**Optimisations** :
- Indexation base de données (clés étrangères)
- Pagination des résultats (20 items par page)
- Caching des données fréquentes
- Minification code JavaScript

### 4.3 Fiabilité

| Aspect | Stratégie |
|--------|-----------|
| **Disponibilité** | 99% uptime cible |
| **Sauvegardes** | PostgreSQL sauvegardé quotidiennement |
| **Tolérance aux pannes** | Gestion d'erreurs complète |
| **Logs** | Journalisation de toutes les actions critiques |

### 4.4 Scalabilité

**Architecture modulaire** permettant :
- Migration vers réseau Ethereum public (Sepolia, Mainnet)
- Migration vers **Polygon** pour réduire les frais de gas
- Ajout de nouvelles fonctionnalités sans refonte
- Séparation frontend/backend pour déploiement distribué

**Extension possible** :
- Support de plusieurs blockchains
- Paiement en stablecoins (USDC, DAI)
- Application mobile (React Native)
- Intégration avec services tiers (cadastre, assurances)

---

## 5. ARCHITECTURE TECHNIQUE

### 5.1 Frontend

**Technologies** :
- **React.js** (v18.x) : Framework UI
- **React Router** (v6.x) : Navigation SPA
- **Web3.js** (v4.x) : Interaction avec blockchain via backend
- **MetaMask** : Wallet et signature de transactions
- **Axios** : Communication API REST
- **CSS3** : Styling responsive

**Structure** :
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Composants réutilisables
│   ├── pages/             # Pages principales
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Properties.jsx
│   │   ├── Contracts.jsx
│   │   ├── Payments.jsx
│   │   └── Disputes.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx  # Gestion état global
│   ├── styles/            # CSS par page
│   ├── App.jsx            # Routes
│   └── index.jsx          # Point d'entrée
```

---

### 5.2 Backend

**Technologies** :
- **Node.js** (v18.x) : Runtime JavaScript
- **Express.js** (v4.x) : Framework web
- **Sequelize** (v6.x) : ORM pour PostgreSQL
- **Web3.js** (v4.x) : Communication avec Ethereum
- **bcrypt** : Hashage de mots de passe
- **jsonwebtoken** : Génération de JWT

**Architecture MVC** :
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Config Sequelize + PostgreSQL
│   ├── models/                   # Modèles (M)
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Contract.js
│   │   ├── Payment.js
│   │   ├── Dispute.js
│   │   └── index.js
│   ├── controllers/              # Logique métier (C)
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── contractController.js
│   │   ├── paymentController.js
│   │   └── disputeController.js
│   ├── routes/                   # Routes API
│   │   └── *.js
│   ├── middleware/
│   │   └── auth.js               # Vérification JWT
│   ├── services/
│   │   └── blockchainService.js  # Interaction Web3
│   └── server.js                 # Serveur Express
```

**API REST** :
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/properties
POST   /api/properties
GET    /api/contracts
POST   /api/contracts
POST   /api/contracts/:id/sign
POST   /api/payments/:id/pay
POST   /api/disputes
PUT    /api/disputes/:id/resolve
```

**Listener d'événements blockchain** :
```javascript
// Écoute de l'événement PaymentMade
blockchainService.listenToContractEvents(
  paymentManagerAddress,
  PaymentManagerABI,
  'PaymentMade',
  async (event) => {
    // Mise à jour PostgreSQL
    await Payment.update({
      status: 'paid',
      paidDate: new Date(),
      penalty: event.returnValues.penalty
    }, {
      where: { paymentIndex: event.returnValues.paymentId }
    });
  }
);
```

---

### 5.3 Blockchain

**Environnement** :
- **Ganache** (v7.x) : Blockchain Ethereum locale
- **Réseau** : HTTP (127.0.0.1:7545)
- **Comptes** : 10 comptes pré-financés avec 100 ETH chacun
- **Gas Price** : Automatique (pas de frais réels)

**Smart Contracts** :
- **Langage** : Solidity 0.8.x
- **Framework** : Truffle ou Hardhat
- **Compilation** : ABI + Bytecode générés
- **Déploiement** : Via Web3.js depuis le backend

**Structure** :
```
blockchain/
├── contracts/
│   ├── RentalContract.sol
│   ├── PaymentManager.sol
│   └── DisputeManager.sol
├── migrations/
│   └── 2_deploy_contracts.js
├── build/contracts/              # ABIs générés
└── truffle-config.js
```

**Intégration** :
```javascript
// Déploiement depuis le backend
const RentalContract = new web3.eth.Contract(RentalContractABI);

const deployTx = RentalContract.deploy({
  data: bytecode,
  arguments: [tenant, rentAmount, depositAmount, ...]
});

const contract = await deployTx.send({
  from: landlordAddress,
  gas: estimatedGas
});

const contractAddress = contract.options.address;
// Sauvegarder dans PostgreSQL
```

---

### 5.4 Base de Données (PostgreSQL)

**Version** : PostgreSQL 14.x

**Schéma relationnel** :

```
┌─────────┐
│  User   │
│ (users) │
└────┬────┘
     │
     ├─── possède (1:N) ──→ ┌──────────┐
     │                      │ Property │
     │                      └────┬─────┘
     │                           │
     ├─── landlord (1:N) ─────→ ├─── a (1:1) ──→ ┌──────────┐
     │                           │                │ Contract │
     └─── tenant (1:N) ─────────┘                └────┬─────┘
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                           génère (1:N)           a (1:N)              │
                                    │                 │                 │
                                    ▼                 ▼                 │
                            ┌──────────┐      ┌──────────┐             │
                            │ Payment  │      │ Dispute  │             │
                            └──────────┘      └──────────┘             │
                                                                        │
                                    filed_by (N:1) ─────────────────────┘
```

---

## 6. MODÈLE DE DONNÉES POSTGRESQL

### 6.1 Table : users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('landlord', 'tenant')),
    blockchain_address VARCHAR(42),
    kyc_document VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Index** :
- `email` (unique)
- `blockchain_address`

---

### 6.2 Table : properties

```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    photos JSON,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented')),
    description TEXT,
    monthly_rent DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Index** :
- `owner_id` (FK)
- `status`

---

### 6.3 Table : contracts

```sql
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    landlord_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    tenant_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    smart_contract_address VARCHAR(42),
    payment_manager_address VARCHAR(42),
    dispute_manager_address VARCHAR(42),
    rent_amount DECIMAL(18,8) NOT NULL,
    duration_months INTEGER NOT NULL,
    payment_frequency VARCHAR(20) DEFAULT 'monthly',
    deposit_amount DECIMAL(18,8) NOT NULL,
    terms TEXT,
    status VARCHAR(30) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_signature', 'active', 'terminated')),
    landlord_signed BOOLEAN DEFAULT FALSE,
    tenant_signed BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Index** :
- `property_id` (FK)
- `landlord_id` (FK)
- `tenant_id` (FK)
- `status`
- `smart_contract_address` (unique)

---

### 6.4 Table : payments

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    paid_date DATE,
    amount DECIMAL(18,8) NOT NULL,
    penalty DECIMAL(18,8) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'paid', 'overdue')),
    transaction_hash VARCHAR(66),
    payment_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Index** :
- `contract_id` (FK)
- `status`
- `due_date`

---

### 6.5 Table : disputes

```sql
CREATE TABLE disputes (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    filed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' 
        CHECK (status IN ('open', 'in_review', 'resolved', 'rejected')),
    resolution TEXT,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id),
    dispute_index INTEGER,
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Index** :
- `contract_id` (FK)
- `filed_by` (FK)
- `status`

---

## 7. DIAGRAMMES UML

### 7.1 Diagrammes à Produire

Les diagrammes suivants doivent être créés pour documenter le projet :

| Diagramme | Outil | Fichier | Contenu |
|-----------|-------|---------|---------|
| **Cas d'usage** | PlantUML | `use_case_diagram.puml` | Acteurs et fonctionnalités |
| **Séquence : Création contrat** | PlantUML | `sequence_contract.puml` | Processus complet avec déploiement |
| **Séquence : Paiement** | PlantUML | `sequence_payment.puml` | Paiement via MetaMask + pénalités |
| **Séquence : Litige** | PlantUML | `sequence_dispute.puml` | Dépôt et résolution |
| **Classes** | PlantUML | `class_diagram.puml` | Modèles + Smart Contracts |
| **Architecture** | Draw.io | `architecture.png` | Vue d'ensemble du système |

### 7.2 Disponibilité

✅ **Tous les diagrammes sont déjà créés** dans `docs/diagrams/`

**Versions disponibles** :
- **Simple** : `docs/diagrams/simple/` (pour présentations)
- **Détaillée** : `docs/diagrams/detailed/` (pour rapport)

---

## 8. PLANNING PRÉVISIONNEL

### 8.1 Calendrier (13 semaines)

| Semaine | Phase | Tâches | Livrables |
|---------|-------|--------|-----------|
| **1–2** | Analyse & Conception | • Rédaction cahier des charges<br>• Création diagrammes UML<br>• Modélisation base de données | • CDC validé<br>• Dossier de conception |
| **3–4** | Backend | • Configuration Node.js + PostgreSQL<br>• Modèles Sequelize<br>• API REST<br>• Middleware JWT | • API fonctionnelle<br>• Documentation Postman |
| **5–6** | Smart Contracts | • Développement Solidity<br>• Tests Truffle<br>• Déploiement Ganache<br>• Intégration Web3.js | • Contrats testés<br>• Scripts de déploiement |
| **7–8** | Frontend | • Composants React<br>• Pages principales<br>• Intégration API<br>• Intégration MetaMask | • Application web complète |
| **9–10** | Intégration | • Tests end-to-end<br>• Debugging<br>• Optimisations | • Système intégré fonctionnel |
| **11–12** | Tests & Validation | • Tests fonctionnels<br>• Tests de sécurité<br>• Corrections bugs | • Rapport de tests |
| **13** | Documentation | • Rapport final<br>• Présentation<br>• Vidéo démo | • Livrables finaux |

### 8.2 Diagramme de Gantt

```
Semaine   1  2  3  4  5  6  7  8  9 10 11 12 13
───────────────────────────────────────────────
Analyse   ██ ██
Backend         ██ ██
Blockchain            ██ ██
Frontend                    ██ ██
Intégration                          ██ ██
Tests                                      ██ ██
Doc                                            ██
```

---

## 9. LIVRABLES

### 9.1 Livrables Techniques

| # | Livrable | Format | Description |
|---|----------|--------|-------------|
| 1 | **Code source complet** | Git Repository | Frontend + Backend + Blockchain |
| 2 | **Base de données** | SQL Script | Schéma + données de test |
| 3 | **Smart contracts** | Solidity + ABI | 3 contrats compilés |
| 4 | **Configuration** | .env.example | Variables d'environnement |

### 9.2 Livrables Documentaires

| # | Livrable | Format | Pages |
|---|----------|--------|-------|
| 1 | **Cahier des charges** | PDF | 15-20 |
| 2 | **Dossier de conception** | PDF | 20-30 |
| 3 | **Diagrammes UML** | PlantUML + PNG | 5 diagrammes |
| 4 | **Manuel d'installation** | Markdown | 5-10 |
| 5 | **Manuel utilisateur** | PDF | 10-15 |
| 6 | **Documentation API** | Postman/Swagger | - |
| 7 | **Rapport final PFA** | PDF | 50-80 |

### 9.3 Livrables de Présentation

| # | Livrable | Format | Durée |
|---|----------|--------|-------|
| 1 | **Présentation PowerPoint** | .pptx | 20-30 slides |
| 2 | **Vidéo de démonstration** | MP4 | 5-10 min |
| 3 | **Poster (optionnel)** | PDF A1 | - |

### 9.4 Critères de Validation

**Le projet sera validé si** :

✅ Toutes les fonctionnalités **Haute priorité** sont implémentées  
✅ Les 3 smart contracts se déploient correctement sur Ganache  
✅ Les paiements via MetaMask fonctionnent  
✅ Les litiges sont enregistrés sur la blockchain  
✅ L'authentification JWT fonctionne  
✅ Aucun bug critique  
✅ Documentation complète et claire  
✅ Démonstration fonctionnelle réussie  
✅ Rapport PFA de qualité  

---

## 10. CONTRAINTES

### 10.1 Contraintes Temporelles

| Contrainte | Valeur |
|------------|--------|
| Durée totale | 13 semaines |
| Date de début | Semaine 1 du semestre |
| Date de fin | Fin du semestre |
| Soutenance | À définir (semaine 13-14) |

### 10.2 Contraintes Techniques

| Type | Description |
|------|-------------|
| **Blockchain** | Ganache local (pas de déploiement mainnet) |
| **MetaMask** | Extension obligatoire pour les transactions |
| **Cryptomonnaie** | ETH uniquement (pas de multi-devises) |
| **Plateforme** | Web desktop (pas d'application mobile) |
| **Base de données** | PostgreSQL requis |

### 10.3 Contraintes Budgétaires

| Élément | Coût |
|---------|------|
| Technologies | **0€** (open-source) |
| Infrastructure | **0€** (développement local) |
| Hébergement | **0€** (hors périmètre) |
| **Total** | **0€** |

### 10.4 Contraintes Réglementaires

| Réglementation | Application |
|----------------|-------------|
| **RGPD** | Protection des données personnelles |
| **Sécurité** | Hashage mots de passe, tokens sécurisés |
| **Traçabilité** | Logs des actions sensibles |
| **Transparence** | Données blockchain publiques |

---

## 11. RISQUES

### 11.1 Risques Techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Complexité Web3 | Moyenne | Élevé | Formation, tutoriels, PoC |
| Bugs smart contracts | Moyenne | Critique | Tests rigoureux, audit |
| Performance blockchain | Faible | Moyen | Optimisation gas, Ganache |
| Sécurité JWT | Faible | Élevé | Best practices, expiration |

### 11.2 Risques Projet

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Retard planning | Moyenne | Moyen | Buffer time, priorisation |
| Compétences manquantes | Faible | Élevé | Formation continue |
| Changement périmètre | Faible | Moyen | CDC validé et figé |

---

## 12. CONCLUSION

Ce cahier des charges définit **tous les aspects fonctionnels, techniques et organisationnels** du projet de gestion des contrats de location immobilière basé sur la blockchain Ethereum.

### 12.1 Récapitulatif

**Périmètre** :
- ✅ 6 modules fonctionnels
- ✅ 3 smart contracts Solidity
- ✅ Architecture full-stack (React + Node.js + Ethereum)
- ✅ Base de données PostgreSQL
- ✅ Authentification et sécurité robustes

**Technologies** :
- Frontend : React.js, MetaMask, Web3.js
- Backend : Node.js, Express, Sequelize, PostgreSQL
- Blockchain : Solidity, Ganache, Web3.js

**Objectifs** :
- Transparence via blockchain
- Automatisation via smart contracts
- Sécurité cryptographique
- Traçabilité complète

### 12.2 Prochaines Étapes

1. **Validation** du cahier des charges par l'encadrant
2. **Création** des diagrammes UML
3. **Développement** selon le planning
4. **Tests** et validation
5. **Documentation** et soutenance

---

## 📋 VALIDATION

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| **Étudiant** | | | |
| **Encadrant académique** | | | |
| **Jury** | | | |

---

**Document rédigé par** : [Votre Nom]  
**Dernière mise à jour** : 03 Décembre 2025  
**Version** : 1.0  
**Statut** : ✅ Validé  

---

**FIN DU CAHIER DES CHARGES**
