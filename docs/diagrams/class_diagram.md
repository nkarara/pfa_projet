# Diagramme de Classes - Système de Gestion Locative Blockchain

Ce diagramme représente l'architecture complète du système avec les modèles de données, les smart contracts, et les services.

```mermaid
classDiagram
    %% ==================== Modèles de Données (Backend) ====================
    class User {
        +int id
        +string firstName
        +string lastName
        +string email
        +string passwordHash
        +enum role [landlord, tenant]
        +string blockchainAddress
        +string kycDocument
        +datetime createdAt
        +datetime updatedAt
        +comparePassword(password) bool
        +toSafeObject() Object
    }

    class Property {
        +int id
        +int ownerId
        +string address
        +string type
        +decimal area
        +json photos
        +enum status [available, rented]
        +text description
        +decimal monthlyRent
        +datetime createdAt
        +datetime updatedAt
    }

    class Contract {
        +int id
        +int propertyId
        +int landlordId
        +int tenantId
        +string smartContractAddress
        +string paymentManagerAddress
        +string disputeManagerAddress
        +decimal rentAmount
        +int durationMonths
        +string paymentFrequency
        +decimal depositAmount
        +text terms
        +enum status [draft, pending_signature, active, terminated]
        +bool landlordSigned
        +bool tenantSigned
        +date startDate
        +date endDate
        +datetime createdAt
        +datetime updatedAt
    }

    class Payment {
        +int id
        +int contractId
        +date dueDate
        +date paidDate
        +decimal amount
        +decimal penalty
        +enum status [pending, paid, overdue]
        +string transactionHash
        +int paymentIndex
        +datetime createdAt
        +datetime updatedAt
    }

    class Dispute {
        +int id
        +int contractId
        +int filedBy
        +text description
        +enum status [open, in_review, resolved, rejected]
        +text resolution
        +datetime resolvedAt
        +int resolvedBy
        +int disputeIndex
        +string transactionHash
        +datetime createdAt
        +datetime updatedAt
    }

    %% ==================== Smart Contracts (Blockchain) ====================
    class RentalContract {
        +address landlord
        +address tenant
        +uint256 rentAmount
        +uint256 depositAmount
        +uint256 durationMonths
        +string propertyAddress
        +string terms
        +bool landlordSigned
        +bool tenantSigned
        +bool isActive
        +uint256 startDate
        +uint256 endDate
        +signContract()
        +terminateContract()
        +getContractDetails() ContractDetails
        +isContractActive() bool
        ---
        Events:
        +ContractSigned(address signer)
        +ContractActivated(uint256 startDate)
        +ContractTerminated(address terminator)
    }

    class PaymentManager {
        +address landlord
        +address tenant
        +uint256 rentAmount
        +uint256 startDate
        +uint256 durationMonths
        +uint256 penaltyRate
        +uint256 gracePeriodDays
        +mapping payments
        +uint256 paymentCount
        +makePayment()
        +calculatePenalty(paymentId) uint256
        +getPaymentStatus(paymentId) PaymentInfo
        +withdrawFunds(amount)
        +getAllPayments() PaymentInfo[]
        ---
        Events:
        +PaymentMade(uint256 paymentId, uint256 amount, uint256 penalty)
        +FundsWithdrawn(address recipient, uint256 amount)
    }

    class DisputeManager {
        +address landlord
        +address tenant
        +address arbitrator
        +mapping disputes
        +uint256 disputeCount
        +fileDispute(description)
        +resolveDispute(disputeId, resolution)
        +getDisputeDetails(disputeId) DisputeInfo
        +getDisputesByStatus(status) DisputeInfo[]
        +getAllDisputes() DisputeInfo[]
        ---
        Events:
        +DisputeFiled(uint256 disputeId, address filedBy)
        +DisputeResolved(uint256 disputeId, uint8 resolution)
    }

    %% ==================== Services (Backend) ====================
    class BlockchainService {
        +Web3 web3
        +deployRentalContract(landlordAddress, params) string
        +deployPaymentManager(landlordAddress, params) string
        +deployDisputeManager(landlordAddress, tenantAddress) string
        +getContractInstance(abi, address) Contract
        +listenToContractEvents(address, abi, eventName, callback)
        +getTransactionReceipt(txHash) Receipt
        +weiToEth(wei) string
        +ethToWei(eth) string
    }

    class AuthController {
        +register(req, res)
        +login(req, res)
        +getCurrentUser(req, res)
        +logout(req, res)
    }

    class PropertyController {
        +getProperties(req, res)
        +getPropertyById(req, res)
        +createProperty(req, res)
        +updateProperty(req, res)
        +deleteProperty(req, res)
    }

    class ContractController {
        +getContracts(req, res)
        +getContractById(req, res)
        +createContract(req, res)
        +signContract(req, res)
        +terminateContract(req, res)
        +getContractDetails(req, res)
    }

    class PaymentController {
        +getPayments(req, res)
        +getPaymentById(req, res)
        +makePayment(req, res)
        +getPaymentHistory(req, res)
    }

    class DisputeController {
        +getDisputes(req, res)
        +getDisputeById(req, res)
        +createDispute(req, res)
        +resolveDispute(req, res)
        +getDisputesByContract(req, res)
    }

    %% ==================== Frontend Components ====================
    class AuthContext {
        +user Object
        +token string
        +login(email, password)
        +register(userData)
        +logout()
        +isAuthenticated() bool
    }

    class Dashboard {
        +renderStatistics()
        +renderRecentContracts()
        +renderRecentPayments()
        +renderRecentDisputes()
    }

    class PropertiesPage {
        +properties Array
        +loadProperties()
        +createProperty(data)
        +updateProperty(id, data)
        +deleteProperty(id)
    }

    class ContractsPage {
        +contracts Array
        +loadContracts()
        +createContract(data)
        +signContract(id)
        +viewContractDetails(id)
    }

    class PaymentsPage {
        +payments Array
        +loadPayments()
        +makePayment(paymentId)
        +viewPaymentHistory()
    }

    class DisputesPage {
        +disputes Array
        +loadDisputes()
        +fileDispute(data)
        +resolveDispute(id, resolution)
    }

    %% ==================== Relations ====================
    
    %% Relations Base de Données
    User "1" --> "0..*" Property : owns
    User "1" --> "0..*" Contract : landlord
    User "1" --> "0..*" Contract : tenant
    User "1" --> "0..*" Dispute : files
    Property "1" --> "0..*" Contract : has
    Contract "1" --> "0..*" Payment : generates
    Contract "1" --> "0..*" Dispute : has
    
    %% Relations Smart Contracts
    Contract --> RentalContract : deployed as
    Contract --> PaymentManager : deployed as
    Contract --> DisputeManager : deployed as
    
    %% Relations Services
    BlockchainService --> RentalContract : deploys/interacts
    BlockchainService --> PaymentManager : deploys/interacts
    BlockchainService --> DisputeManager : deploys/interacts
    
    %% Relations Controllers
    AuthController --> User : manages
    PropertyController --> Property : manages
    ContractController --> Contract : manages
    ContractController --> BlockchainService : uses
    PaymentController --> Payment : manages
    PaymentController --> BlockchainService : uses
    DisputeController --> Dispute : manages
    DisputeController --> BlockchainService : uses
    
    %% Relations Frontend
    AuthContext --> AuthController : calls
    Dashboard --> ContractController : calls
    Dashboard --> PaymentController : calls
    Dashboard --> DisputeController : calls
    PropertiesPage --> PropertyController : calls
    ContractsPage --> ContractController : calls
    PaymentsPage --> PaymentController : calls
    DisputesPage --> DisputeController : calls
```

## Légende

### Modèles de Données (Backend)
- **User** : Gestion des utilisateurs (propriétaires et locataires)
- **Property** : Gestion des propriétés immobilières
- **Contract** : Contrats de location (off-chain)
- **Payment** : Historique des paiements
- **Dispute** : Gestion des litiges

### Smart Contracts (Blockchain)
- **RentalContract** : Contrat de location intelligent sur la blockchain
- **PaymentManager** : Gestion automatisée des paiements
- **DisputeManager** : Système de résolution des litiges

### Services
- **BlockchainService** : Pont entre le backend et la blockchain
- **Controllers** : Couche de logique métier pour chaque domaine

### Frontend
- **Context** : Gestion de l'état d'authentification
- **Pages** : Composants React pour l'interface utilisateur
