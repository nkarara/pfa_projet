# Plateforme de Gestion des Contrats de Location Immobilière via Blockchain

## 1. Introduction
Ce projet vise à concevoir une plateforme web permettant de gérer l’ensemble du processus de location immobilière (création, signature, paiement, litiges) grâce à la technologie Blockchain.

La solution assure :
- **Transparence**
- **Automatisation**
- **Sécurité**
- **Immuabilité des contrats**

La blockchain garantit la fiabilité des données et réduit les conflits entre propriétaires et locataires.

---

## 2. Objectifs du Projet

### Objectifs principaux
- Dématérialiser et automatiser la gestion des contrats de location.
- Sécuriser la signature et l’exécution des contrats via des smart contracts Ethereum.
- Assurer un suivi automatique et infalsifiable des paiements de loyer.
- Offrir un mécanisme de traçabilité complète des litiges.

### Objectifs secondaires
- Proposer une interface interactive pour propriétaires et locataires.
- Réduire les procédures administratives manuelles.
- Améliorer la confiance via la transparence blockchain.

---

## 3. Périmètre Fonctionnel

### 3.1 Gestion des utilisateurs
- Inscription et authentification (email + mot de passe + JWT)
- Vérification d’identité (KYC)
- Deux rôles : propriétaire, locataire
- Association d’une adresse blockchain (MetaMask)

### 3.2 Gestion des biens immobiliers
- Ajout, modification, suppression des biens (pour propriétaires)
- Consultation du statut du bien (disponible / loué)
- Stockage dans MySQL (hors blockchain)

### 3.3 Création des contrats intelligents
- Génération et déploiement des smart contracts Solidity
- Paramètres : durée, montant du loyer, fréquence, dépôt de garantie, clauses
- Adresse du smart contract enregistrée dans MySQL

### 3.4 Signature numérique
- Signature via MetaMask
- Enregistrement sur le smart contract
- Historique horodaté côté backend

### 3.5 Paiement automatisé des loyers
- Paiement automatique ou manuel via MetaMask
- Historique on-chain et côté MySQL
- Calcul des pénalités et traçabilité immuable

### 3.6 Gestion des litiges
- Création et suivi des litiges
- Résolution manuelle ou automatisée via smart contract
- Notifications aux deux parties
- Trace blockchain

### 3.7 Tableau de bord
**Pour le propriétaire :** liste des biens, contrats actifs, paiements reçus/en retard, litiges ouverts  
**Pour le locataire :** contrats en cours, paiements dus/effecutés, dépôt de garantie, litiges associés

---

## 4. Périmètre Non Fonctionnel

### Sécurité
- Chiffrement des mots de passe (BCrypt)
- Authentification JWT
- Transactions signées via MetaMask

### Performance
- Temps de confirmation limité (Ganache)
- API rapide et optimisée

### Fiabilité
- Haute disponibilité backend
- Sauvegardes MySQL

### Scalabilité
- Extensible à réseau public Ethereum/Polygon
- Architecture modulaire

---

## 5. Architecture Technique

### Frontend
- React.js
- ethers.js (MetaMask)
- Axios (API REST)

### Backend
- Node.js + Express
- ORM : Sequelize / Prisma / TypeORM
- API REST
- Listener blockchain

### Blockchain
- Ganache (local)
- Ethereum Smart Contracts
- MetaMask pour signature
- Solidity pour logique métier

### Base de données (hors chaîne)
- MySQL
- Schéma relationnel : Users — Biens — Contrats — Paiements — Litiges

---

## 6. Modèle de données MySQL
**Utilisateur :** id, nom, prenom, email, password_hash, role, adresse_blockchain, kyc_document  
**Bien immobilier :** id, proprietaire_id, adresse, type, superficie, photos, statut  
**Contrat :** id, bien_id, proprietaire_id, locataire_id, adresse_smart_contract, loyer, duree, frequence_paiement, depot_garantie, clauses, statut  
**Paiement :** id, contrat_id, date_prevue, date_effectuee, montant, statut, penalite  
**Litige :** id, contrat_id, description, date, statut, resolution  

---

## 7. Diagrammes (à produire)
- Diagramme de cas d’usage  
- Diagramme de séquence : création contrat, paiement, litige  
- Diagramme de classes  
- Diagramme d’architecture  

---

## 8. Planning Prévisionnel

| Semaine | Tâche |
|---------|-------|
| 1–2     | Analyse & conception UML |
| 3–4     | Backend (Node.js + MySQL) |
| 5–6     | Frontend React |
| 7       | Intégration blockchain (Smart Contracts + MetaMask) |
| 8       | Tests et validation |
| 9       | Rapport + présentation |

---

## 9. Livrables
- Cahier des charges  
- Diagrammes UML  
- Smart contracts Solidity  
- Backend Node.js + MySQL  
- Frontend React  
- Documentation technique  
- Présentation finale  
- Démo fonctionnelle blockchain

---

## 10. Contraintes
- Délais limités  
- Blockchain privée ou publique selon le déploiement  
- Respect des normes de sécurité  
- Interopérabilité front–back–blockchain  

---

## 11. Conclusion
Ce cahier de charges définit tous les aspects fonctionnels, techniques et organisationnels du projet. Il servira de base solide pour le développement, la validation et la soutenance du système de gestion des contrats de location immobilière basé sur blockchain.
