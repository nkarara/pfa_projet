# Documentation UML - Système de Gestion Locative Blockchain

Ce dossier contient tous les diagrammes UML du système de gestion locative basé sur la blockchain.

## 📋 Table des Matières

1. [Diagramme de Classes](./class_diagram.md)
2. [Diagramme de Cas d'Utilisation](./use_case_diagram.md)
3. [Diagrammes de Séquence](./sequence_diagrams.md)

---

## 🏗️ Architecture du Système

Le système est composé de trois couches principales :

### 1. **Frontend (React)**
- Interface utilisateur moderne et réactive
- Gestion de l'état avec React Context
- Pages principales :
  - Dashboard (statistiques et aperçu)
  - Properties (gestion des propriétés)
  - Contracts (création et suivi des contrats)
  - Payments (paiements et historique)
  - Disputes (litiges et résolutions)

### 2. **Backend (Node.js + Express)**
- API RESTful pour toutes les opérations
- Controllers pour chaque domaine métier
- Services blockchain pour interaction avec Ethereum
- Modèles Sequelize pour la base de données
- Middleware d'authentification JWT

### 3. **Blockchain (Ethereum + Ganache)**
- Smart Contracts en Solidity :
  - **RentalContract.sol** : Contrat de location
  - **PaymentManager.sol** : Gestion automatisée des paiements
  - **DisputeManager.sol** : Résolution des litiges
- Déploiement via Truffle/Web3.js
- Réseau de développement local (Ganache)

---

## 📊 Vue d'Ensemble des Diagrammes

### 1. Diagramme de Classes
**Fichier** : [class_diagram.md](./class_diagram.md)

**Contenu** :
- Modèles de données (User, Property, Contract, Payment, Dispute)
- Smart Contracts (RentalContract, PaymentManager, DisputeManager)
- Services et Controllers
- Composants Frontend
- Relations entre toutes les entités

**Utilité** : Comprendre la structure des données et les relations entre les différentes entités du système.

---

### 2. Diagramme de Cas d'Utilisation
**Fichier** : [use_case_diagram.md](./use_case_diagram.md)

**Contenu** :
- 32 cas d'utilisation répartis en 7 catégories
- 5 acteurs principaux (Locataire, Propriétaire, Admin, Blockchain, Système)
- Flux principaux du système

**Cas d'utilisation principaux** :
- **Authentification** : Inscription, connexion, gestion de profil
- **Propriétés** : Création, modification, recherche
- **Contrats** : Création, signature, déploiement blockchain
- **Paiements** : Paiement de loyer, historique, pénalités
- **Litiges** : Dépôt, suivi, résolution
- **Blockchain** : Déploiement de smart contracts, écoute d'événements
- **Monitoring** : Dashboard, notifications

**Utilité** : Identifier toutes les fonctionnalités du système et les interactions des utilisateurs.

---

### 3. Diagrammes de Séquence
**Fichier** : [sequence_diagrams.md](./sequence_diagrams.md)

**Contenu** : 5 scénarios détaillés couvrant tous les flux critiques du système.

#### Scénario 1 : Inscription et Authentification
- Processus complet d'inscription avec validation d'email
- Hashage sécurisé des mots de passe (bcrypt)
- Génération et stockage de JWT
- Flux de connexion avec vérification des credentials

#### Scénario 2 : Création et Signature de Contrat
- Création du contrat en base de données
- Signature par le propriétaire
- Signature par le locataire
- **Déploiement automatique des 3 smart contracts** :
  1. RentalContract (termes du contrat)
  2. PaymentManager (gestion des paiements)
  3. DisputeManager (gestion des litiges)
- Enregistrement des adresses blockchain

#### Scénario 3 : Paiement de Loyer
- Consultation des paiements dus
- Interaction avec MetaMask pour autorisation
- Envoi de la transaction Ethereum
- Calcul automatique des pénalités de retard
- Enregistrement du `transactionHash`
- Mise à jour du statut on-chain et off-chain

#### Scénario 4 : Dépôt et Résolution de Litige
- Dépôt d'un litige par une partie
- Enregistrement sur la blockchain
- Consultation des litiges
- Résolution par l'administrateur
- Exécution de la décision sur le smart contract
- Notification des parties

#### Scénario 5 : Consultation du Dashboard
- Requêtes parallèles pour optimiser le chargement
- Agrégation de données multi-sources
- Affichage des statistiques en temps réel

**Utilité** : Comprendre le flux exact des données et des interactions pour chaque fonctionnalité.

---

## 🔑 Concepts Clés

### Synchronisation Off-chain / On-chain

Le système utilise une architecture hybride :

| Aspect | Off-chain (PostgreSQL) | On-chain (Blockchain) |
|--------|------------------------|----------------------|
| **Stockage** | Base de données relationnelle | Smart contracts Ethereum |
| **Avantages** | Requêtes rapides et complexes | Immuabilité, transparence |
| **Données** | Métadonnées, historique détaillé | Transactions, preuves cryptographiques |
| **Performance** | Très rapide | Plus lent (confirmations réseau) |
| **Coût** | Faible | Gas fees (gratuit sur Ganache) |

### Flux de Données Typique

```
User Action (Frontend)
    ↓
API Request (Backend)
    ↓
Database Operation (Off-chain)
    ↓
Blockchain Transaction (On-chain)
    ↓
Transaction Hash stored (Off-chain)
    ↓
Event Listener (Background)
    ↓
Update UI (Frontend)
```

### Sécurité

1. **Authentification** : JWT avec expiration
2. **Mots de passe** : Hashage bcrypt (salt rounds : 10)
3. **Blockchain** : Adresses Ethereum validées
4. **Transactions** : Signatures cryptographiques MetaMask
5. **Smart Contracts** : Modifiers et require statements

---

## 🚀 Technologies Utilisées

### Frontend
- **React** : Framework UI
- **React Router** : Navigation
- **Context API** : Gestion d'état
- **Axios** : Requêtes HTTP
- **CSS Modules** : Styling

### Backend
- **Node.js** : Runtime
- **Express** : Framework web
- **Sequelize** : ORM
- **PostgreSQL** : Base de données
- **JWT** : Authentification
- **bcrypt** : Hashage de mots de passe

### Blockchain
- **Solidity** : Langage smart contracts
- **Web3.js** : Interaction blockchain
- **Truffle** : Framework de développement
- **Ganache** : Blockchain locale
- **MetaMask** : Wallet utilisateur

---

## 📖 Comment Utiliser ces Diagrammes

### Pour les Développeurs
1. **Commencer par le diagramme de classes** pour comprendre la structure des données
2. **Examiner les cas d'utilisation** pour identifier les fonctionnalités à implémenter
3. **Suivre les séquences** pour implémenter correctement chaque flux

### Pour les Chefs de Projet
1. **Cas d'utilisation** pour définir les user stories et le backlog
2. **Séquences** pour estimer la complexité des tâches
3. **Classes** pour planifier l'architecture technique

### Pour les Testeurs
1. **Cas d'utilisation** pour créer les scénarios de test
2. **Séquences** pour identifier les points de validation
3. **Classes** pour comprendre les dépendances à tester

---

## 📝 Notes de Mise à Jour

**Date** : Décembre 2025  
**Version** : 1.0

### Dernières Modifications
- ✅ Ajout du diagramme de classes complet avec smart contracts
- ✅ Mise à jour des cas d'utilisation (32 UC)
- ✅ Création de 5 diagrammes de séquence détaillés
- ✅ Documentation de l'architecture hybride off-chain/on-chain

### À Venir
- [ ] Diagramme d'architecture système global
- [ ] Diagramme de déploiement (infrastructure)
- [ ] Diagramme d'état pour le cycle de vie des contrats
- [ ] Documentation API complète (OpenAPI/Swagger)

---

## 🔗 Liens Utiles

- [Code Backend](../../backend/)
- [Code Frontend](../../frontend/)
- [Smart Contracts](../../blockchain/contracts/)
- [README Principal](../../README.md)

---

**Auteur** : Système de Gestion Locative Blockchain  
**Contact** : [Votre email ou GitHub]  
**Licence** : MIT (ou autre)
