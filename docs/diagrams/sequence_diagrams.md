# Diagrammes de Séquence - Système de Gestion Locative Blockchain

Ce document contient les diagrammes de séquence pour les principaux flux du système.

## 1. Séquence : Inscription et Authentification

```mermaid
sequenceDiagram
    actor User as 👤 Utilisateur
    participant Frontend as Frontend React
    participant AuthCtrl as AuthController
    participant UserModel as User Model
    participant DB as Base de Données
    participant JWT as JWT Service
    
    %% Inscription
    rect rgb(230, 240, 255)
        Note over User,JWT: Processus d'Inscription
        User->>Frontend: Saisir informations (email, mot de passe, rôle)
        Frontend->>AuthCtrl: POST /api/auth/register
        AuthCtrl->>UserModel: Valider email unique
        UserModel->>DB: SELECT WHERE email = ?
        DB-->>UserModel: Résultat
        alt Email déjà utilisé
            UserModel-->>AuthCtrl: Erreur: Email exists
            AuthCtrl-->>Frontend: 400 Bad Request
            Frontend-->>User: Message d'erreur
        else Email disponible
            AuthCtrl->>UserModel: beforeCreate hook
            UserModel->>UserModel: Hash password (bcrypt)
            UserModel->>DB: INSERT nouveau user
            DB-->>UserModel: User créé
            UserModel-->>AuthCtrl: User object
            AuthCtrl->>JWT: generateToken(user.id)
            JWT-->>AuthCtrl: JWT token
            AuthCtrl-->>Frontend: 201 Created + token
            Frontend->>Frontend: Stocker token (localStorage)
            Frontend-->>User: Redirection vers Dashboard
        end
    end
    
    %% Connexion
    rect rgb(230, 255, 240)
        Note over User,JWT: Processus de Connexion
        User->>Frontend: Saisir email et mot de passe
        Frontend->>AuthCtrl: POST /api/auth/login
        AuthCtrl->>UserModel: findOne({ where: { email } })
        UserModel->>DB: SELECT * FROM users WHERE email = ?
        DB-->>UserModel: User data
        alt User non trouvé
            UserModel-->>AuthCtrl: null
            AuthCtrl-->>Frontend: 401 Unauthorized
            Frontend-->>User: Email ou mot de passe invalide
        else User trouvé
            UserModel-->>AuthCtrl: User object
            AuthCtrl->>UserModel: comparePassword(password)
            UserModel->>UserModel: bcrypt.compare()
            alt Mot de passe incorrect
                UserModel-->>AuthCtrl: false
                AuthCtrl-->>Frontend: 401 Unauthorized
                Frontend-->>User: Email ou mot de passe invalide
            else Mot de passe correct
                UserModel-->>AuthCtrl: true
                AuthCtrl->>JWT: generateToken(user.id)
                JWT-->>AuthCtrl: JWT token
                AuthCtrl-->>Frontend: 200 OK + token + user
                Frontend->>Frontend: Stocker token
                Frontend->>Frontend: UpdateContext(user)
                Frontend-->>User: Redirection vers Dashboard
            end
        end
    end
```

## 2. Séquence : Création et Signature de Contrat

```mermaid
sequenceDiagram
    actor Landlord as 🏠 Propriétaire
    actor Tenant as 👤 Locataire
    participant Frontend as Frontend React
    participant ContractCtrl as ContractController
    participant BlockchainSvc as BlockchainService
    participant ContractModel as Contract Model
    participant DB as Base de Données
    participant Ganache as 🔗 Ganache (Blockchain)
    participant RentalSC as RentalContract.sol
    participant PaymentSC as PaymentManager.sol
    participant DisputeSC as DisputeManager.sol
    
    %% Création du contrat
    rect rgb(255, 245, 230)
        Note over Landlord,DisputeSC: Phase 1: Création du Contrat
        Landlord->>Frontend: Créer nouveau contrat
        Frontend->>Frontend: Formulaire (propriété, locataire, montant, durée)
        Landlord->>Frontend: Soumettre formulaire
        Frontend->>ContractCtrl: POST /api/contracts
        ContractCtrl->>ContractModel: create({ propertyId, landlordId, tenantId, ... })
        ContractModel->>DB: INSERT INTO contracts
        DB-->>ContractModel: Contract créé (status: draft)
        ContractModel-->>ContractCtrl: Contract object
        ContractCtrl-->>Frontend: 201 Created
        Frontend-->>Landlord: Contrat créé (en attente de signature)
    end
    
    %% Signature Propriétaire
    rect rgb(230, 255, 245)
        Note over Landlord,DisputeSC: Phase 2: Signature Propriétaire
        Landlord->>Frontend: Clic "Signer le contrat"
        Frontend->>ContractCtrl: POST /api/contracts/:id/sign
        ContractCtrl->>ContractModel: findByPk(contractId)
        ContractModel->>DB: SELECT * FROM contracts WHERE id = ?
        DB-->>ContractModel: Contract data
        ContractModel-->>ContractCtrl: Contract object
        ContractCtrl->>ContractModel: update({ landlordSigned: true })
        ContractModel->>DB: UPDATE contracts SET landlord_signed = true
        DB-->>ContractModel: Updated
        ContractModel-->>ContractCtrl: Contract updated
        ContractCtrl-->>Frontend: 200 OK
        Frontend-->>Landlord: Signature enregistrée
    end
    
    %% Signature Locataire & Déploiement
    rect rgb(255, 230, 245)
        Note over Landlord,DisputeSC: Phase 3: Signature Locataire & Déploiement Blockchain
        Tenant->>Frontend: Clic "Signer le contrat"
        Frontend->>ContractCtrl: POST /api/contracts/:id/sign
        ContractCtrl->>ContractModel: findByPk(contractId)
        ContractModel-->>ContractCtrl: Contract object
        ContractCtrl->>ContractCtrl: Vérifier landlordSigned == true
        ContractCtrl->>ContractModel: update({ tenantSigned: true, status: 'pending_signature' })
        ContractModel->>DB: UPDATE contracts
        DB-->>ContractModel: Updated
        
        Note over ContractCtrl,DisputeSC: Déploiement des Smart Contracts
        ContractCtrl->>BlockchainSvc: deployRentalContract(landlordAddress, params)
        BlockchainSvc->>Ganache: Deploy transaction
        Ganache->>RentalSC: new RentalContract(...)
        RentalSC->>RentalSC: Initialize contract state
        RentalSC-->>Ganache: Contract deployed
        Ganache-->>BlockchainSvc: Contract address
        BlockchainSvc-->>ContractCtrl: smartContractAddress
        
        ContractCtrl->>BlockchainSvc: deployPaymentManager(landlordAddress, params)
        BlockchainSvc->>Ganache: Deploy transaction
        Ganache->>PaymentSC: new PaymentManager(...)
        PaymentSC->>PaymentSC: Generate payment schedule
        PaymentSC-->>Ganache: Contract deployed
        Ganache-->>BlockchainSvc: Contract address
        BlockchainSvc-->>ContractCtrl: paymentManagerAddress
        
        ContractCtrl->>BlockchainSvc: deployDisputeManager(landlordAddress, tenantAddress)
        BlockchainSvc->>Ganache: Deploy transaction
        Ganache->>DisputeSC: new DisputeManager(...)
        DisputeSC-->>Ganache: Contract deployed
        Ganache-->>BlockchainSvc: Contract address
        BlockchainSvc-->>ContractCtrl: disputeManagerAddress
        
        ContractCtrl->>ContractModel: update({ smartContractAddress, paymentManagerAddress, disputeManagerAddress, status: 'active' })
        ContractModel->>DB: UPDATE contracts
        DB-->>ContractModel: Updated
        ContractModel-->>ContractCtrl: Contract fully deployed
        ContractCtrl-->>Frontend: 200 OK + contract details
        Frontend-->>Tenant: Contrat actif et déployé sur blockchain
        Frontend->>Landlord: Notification: Contrat actif
    end
```

## 3. Séquence : Paiement de Loyer

```mermaid
sequenceDiagram
    actor Tenant as 👤 Locataire
    participant Frontend as Frontend React
    participant PaymentCtrl as PaymentController
    participant BlockchainSvc as BlockchainService
    participant PaymentModel as Payment Model
    participant DB as Base de Données
    participant MetaMask as 🦊 MetaMask
    participant Ganache as 🔗 Ganache
    participant PaymentSC as PaymentManager.sol
    
    rect rgb(230, 245, 255)
        Note over Tenant,PaymentSC: Phase 1: Consultation des Paiements Dus
        Tenant->>Frontend: Accès page Paiements
        Frontend->>PaymentCtrl: GET /api/payments?status=pending
        PaymentCtrl->>PaymentModel: findAll({ where: { status: 'pending' } })
        PaymentModel->>DB: SELECT * FROM payments WHERE status = 'pending'
        DB-->>PaymentModel: Payments list
        PaymentModel-->>PaymentCtrl: Payments data
        PaymentCtrl-->>Frontend: 200 OK + payments
        Frontend-->>Tenant: Affichage des paiements dus
    end
    
    rect rgb(255, 240, 230)
        Note over Tenant,PaymentSC: Phase 2: Effectuer le Paiement
        Tenant->>Frontend: Clic "Payer" sur un paiement
        Frontend->>MetaMask: Demande confirmation transaction
        MetaMask-->>Tenant: Popup de confirmation
        Tenant->>MetaMask: Approuver transaction
        MetaMask->>Frontend: Transaction approuvée
        
        Frontend->>PaymentCtrl: POST /api/payments/:id/pay
        PaymentCtrl->>PaymentModel: findByPk(paymentId, include: Contract)
        PaymentModel->>DB: SELECT payment with contract
        DB-->>PaymentModel: Payment + Contract data
        PaymentModel-->>PaymentCtrl: Payment object
        
        PaymentCtrl->>PaymentCtrl: Récupérer paymentManagerAddress
        PaymentCtrl->>BlockchainSvc: getContractInstance(PaymentManagerABI, address)
        BlockchainSvc-->>PaymentCtrl: PaymentManager instance
        
        PaymentCtrl->>BlockchainSvc: paymentManager.makePayment(paymentIndex)
        BlockchainSvc->>MetaMask: Transaction request
        MetaMask->>Ganache: Send transaction + ETH
        Ganache->>PaymentSC: makePayment(paymentIndex)
        
        PaymentSC->>PaymentSC: Check payment not already paid
        PaymentSC->>PaymentSC: calculatePenalty(paymentIndex)
        alt Paiement en retard
            PaymentSC->>PaymentSC: penalty = (days late * penaltyRate * amount) / 100
        else Paiement à temps
            PaymentSC->>PaymentSC: penalty = 0
        end
        
        PaymentSC->>PaymentSC: totalAmount = amount + penalty
        PaymentSC->>PaymentSC: Require msg.value >= totalAmount
        PaymentSC->>PaymentSC: Update payment.isPaid = true
        PaymentSC->>PaymentSC: Update payment.paidDate = block.timestamp
        PaymentSC->>PaymentSC: Update payment.penalty = penalty
        
        PaymentSC->>PaymentSC: emit PaymentMade(paymentId, amount, penalty)
        PaymentSC-->>Ganache: Transaction success
        Ganache-->>BlockchainSvc: Transaction receipt + hash
        BlockchainSvc-->>PaymentCtrl: { transactionHash, penalty }
        
        PaymentCtrl->>PaymentModel: update({ status: 'paid', paidDate: now, transactionHash, penalty })
        PaymentModel->>DB: UPDATE payments
        DB-->>PaymentModel: Updated
        PaymentModel-->>PaymentCtrl: Payment updated
        
        PaymentCtrl-->>Frontend: 200 OK + payment details
        Frontend-->>Tenant: Paiement confirmé ✓
    end
    
    rect rgb(230, 255, 240)
        Note over Tenant,PaymentSC: Phase 3: Écoute des Événements
        PaymentSC->>BlockchainSvc: Event: PaymentMade
        BlockchainSvc->>PaymentCtrl: Callback event handler
        PaymentCtrl->>PaymentCtrl: Log payment event
        PaymentCtrl->>Frontend: WebSocket notification (optionnel)
        Frontend->>Tenant: Notification en temps réel
    end
```

## 4. Séquence : Dépôt et Résolution de Litige

```mermaid
sequenceDiagram
    actor User as 👤 Partie (Locataire/Propriétaire)
    actor Admin as 👨‍💼 Administrateur
    participant Frontend as Frontend React
    participant DisputeCtrl as DisputeController
    participant BlockchainSvc as BlockchainService
    participant DisputeModel as Dispute Model
    participant DB as Base de Données
    participant Ganache as 🔗 Ganache
    participant DisputeSC as DisputeManager.sol
    
    rect rgb(255, 235, 235)
        Note over User,DisputeSC: Phase 1: Dépôt du Litige
        User->>Frontend: Accès page Litiges
        User->>Frontend: Clic "Nouveau litige"
        Frontend->>Frontend: Formulaire (contrat, description)
        User->>Frontend: Soumettre le litige
        
        Frontend->>DisputeCtrl: POST /api/disputes
        DisputeCtrl->>DisputeModel: findOne to get contract
        DisputeModel->>DB: SELECT contract
        DB-->>DisputeModel: Contract data
        DisputeModel-->>DisputeCtrl: Contract object
        
        DisputeCtrl->>BlockchainSvc: getContractInstance(DisputeManagerABI, address)
        BlockchainSvc-->>DisputeCtrl: DisputeManager instance
        
        DisputeCtrl->>BlockchainSvc: disputeManager.fileDispute(description)
        BlockchainSvc->>Ganache: Send transaction
        Ganache->>DisputeSC: fileDispute(description)
        
        DisputeSC->>DisputeSC: require(msg.sender == landlord || msg.sender == tenant)
        DisputeSC->>DisputeSC: disputeCount++
        DisputeSC->>DisputeSC: disputes[disputeCount] = Dispute{...}
        DisputeSC->>DisputeSC: Initialiser status = PENDING
        DisputeSC->>DisputeSC: filedBy = msg.sender
        DisputeSC->>DisputeSC: filedAt = block.timestamp
        
        DisputeSC->>DisputeSC: emit DisputeFiled(disputeCount, msg.sender, description)
        DisputeSC-->>Ganache: Transaction success
        Ganache-->>BlockchainSvc: Transaction receipt
        BlockchainSvc-->>DisputeCtrl: { disputeIndex, transactionHash }
        
        DisputeCtrl->>DisputeModel: create({ contractId, filedBy, description, disputeIndex, transactionHash })
        DisputeModel->>DB: INSERT INTO disputes
        DB-->>DisputeModel: Dispute created
        DisputeModel-->>DisputeCtrl: Dispute object
        
        DisputeCtrl-->>Frontend: 201 Created
        Frontend-->>User: Litige déposé avec succès
    end
    
    rect rgb(245, 235, 255)
        Note over User,DisputeSC: Phase 2: Consultation des Litiges
        User->>Frontend: Voir mes litiges
        Frontend->>DisputeCtrl: GET /api/disputes
        DisputeCtrl->>DisputeModel: findAll({ where: conditions })
        DisputeModel->>DB: SELECT * FROM disputes
        DB-->>DisputeModel: Disputes list
        DisputeModel-->>DisputeCtrl: Disputes data
        DisputeCtrl-->>Frontend: 200 OK + disputes
        Frontend-->>User: Affichage des litiges
    end
    
    rect rgb(235, 255, 245)
        Note over Admin,DisputeSC: Phase 3: Résolution du Litige
        Admin->>Frontend: Accès page Administration
        Frontend->>DisputeCtrl: GET /api/disputes?status=open
        DisputeCtrl-->>Frontend: Liste des litiges ouverts
        Frontend-->>Admin: Affichage litiges à résoudre
        
        Admin->>Frontend: Sélectionner un litige
        Admin->>Frontend: Soumettre résolution (résolution: LANDLORD_WINS / TENANT_WINS)
        
        Frontend->>DisputeCtrl: PUT /api/disputes/:id/resolve
        DisputeCtrl->>DisputeModel: findByPk(disputeId, include: Contract)
        DisputeModel->>DB: SELECT dispute with contract
        DB-->>DisputeModel: Dispute + Contract
        DisputeModel-->>DisputeCtrl: Dispute object
        
        DisputeCtrl->>BlockchainSvc: getContractInstance(DisputeManagerABI, address)
        BlockchainSvc-->>DisputeCtrl: DisputeManager instance
        
        DisputeCtrl->>BlockchainSvc: disputeManager.resolveDispute(disputeIndex, resolution)
        BlockchainSvc->>Ganache: Send transaction
        Ganache->>DisputeSC: resolveDispute(disputeIndex, resolution)
        
        DisputeSC->>DisputeSC: require(msg.sender == arbitrator || arbitrator == 0x0)
        DisputeSC->>DisputeSC: require(dispute.status == PENDING)
        DisputeSC->>DisputeSC: dispute.status = RESOLVED
        DisputeSC->>DisputeSC: dispute.resolution = resolution
        DisputeSC->>DisputeSC: dispute.resolvedAt = block.timestamp
        
        alt Résolution: LANDLORD_WINS
            DisputeSC->>DisputeSC: Exécuter action en faveur du propriétaire
        else Résolution: TENANT_WINS
            DisputeSC->>DisputeSC: Exécuter action en faveur du locataire
        end
        
        DisputeSC->>DisputeSC: emit DisputeResolved(disputeId, resolution)
        DisputeSC-->>Ganache: Transaction success
        Ganache-->>BlockchainSvc: Transaction receipt
        BlockchainSvc-->>DisputeCtrl: { transactionHash }
        
        DisputeCtrl->>DisputeModel: update({ status: 'resolved', resolution, resolvedAt: now, resolvedBy: adminId, transactionHash })
        DisputeModel->>DB: UPDATE disputes
        DB-->>DisputeModel: Updated
        DisputeModel-->>DisputeCtrl: Dispute updated
        
        DisputeCtrl-->>Frontend: 200 OK
        Frontend-->>Admin: Litige résolu avec succès
        
        Frontend->>User: Notification: Votre litige a été résolu
    end
```

## 5. Séquence : Consultation du Dashboard

```mermaid
sequenceDiagram
    actor User as 👤 Utilisateur
    participant Frontend as Frontend React
    participant ContractCtrl as ContractController
    participant PaymentCtrl as PaymentController
    participant DisputeCtrl as DisputeController
    participant PropertyCtrl as PropertyController
    participant DB as Base de Données
    
    rect rgb(240, 248, 255)
        Note over User,DB: Chargement du Dashboard
        User->>Frontend: Accès au Dashboard
        
        par Requêtes parallèles
            Frontend->>ContractCtrl: GET /api/contracts?userId=X
            ContractCtrl->>DB: SELECT contracts
            DB-->>ContractCtrl: Contracts data
            ContractCtrl-->>Frontend: Contracts (active, total)
            
        and
            Frontend->>PaymentCtrl: GET /api/payments?userId=X&status=pending
            PaymentCtrl->>DB: SELECT payments
            DB-->>PaymentCtrl: Payments data
            PaymentCtrl-->>Frontend: Pending payments
            
        and
            Frontend->>PaymentCtrl: GET /api/payments?userId=X&status=paid&recent=true
            PaymentCtrl->>DB: SELECT recent paid
            DB-->>PaymentCtrl: Recent payments
            PaymentCtrl-->>Frontend: Recent payments
            
        and
            Frontend->>DisputeCtrl: GET /api/disputes?userId=X
            DisputeCtrl->>DB: SELECT disputes
            DB-->>DisputeCtrl: Disputes data
            DisputeCtrl-->>Frontend: Disputes (open, total)
            
        and
            Frontend->>PropertyCtrl: GET /api/properties?ownerId=X
            PropertyCtrl->>DB: SELECT properties
            DB-->>PropertyCtrl: Properties data
            PropertyCtrl-->>Frontend: Properties (available, rented)
        end
        
        Frontend->>Frontend: Calculer statistiques
        Frontend->>Frontend: Formatter données pour graphiques
        Frontend-->>User: Affichage Dashboard complet
        
        Note over Frontend: Dashboard contient:<br/>- Nombre de contrats actifs<br/>- Paiements en attente<br/>- Litiges ouverts<br/>- Statistiques propriétés<br/>- Activité récente
    end
```

## Légende

- 🏠 **Propriétaire** : Utilisateur possédant des propriétés
- 👤 **Locataire** : Utilisateur louant une propriété
- 👨‍💼 **Administrateur** : Gestionnaire système pour résolution de litiges
- 🦊 **MetaMask** : Wallet Ethereum pour les transactions
- 🔗 **Ganache** : Blockchain Ethereum locale pour le développement
- **Smart Contracts** : Contrats intelligents déployés sur la blockchain

## Concepts Clés

### Signatures Numériques
- Les signatures sont effectuées côté backend lors de la signature du contrat
- Une fois les deux parties signées, les smart contracts sont automatiquement déployés

### Transactions Blockchain
- Tous les paiements, litiges et actions importantes sont enregistrés sur la blockchain
- Les transactions sont immuables et traçables via leur `transactionHash`

### Synchronisation Off-chain / On-chain
- Les données sont stockées à la fois en base de données (off-chain) et sur la blockchain (on-chain)
- La base de données permet des requêtes rapides et complexes
- La blockchain garantit l'immuabilité et la transparence
