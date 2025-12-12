# CAHIER DES CHARGES

## Système de Gestion Locative Basé sur la Blockchain

---

**Projet** : Plateforme de Gestion Locative Décentralisée  
**Type** : Projet de Fin d'Année (PFA)  
**Date** : Année Académique 2024-2025  
**Version** : 1.0  
**Statut** : Validé

---

## SOMMAIRE

1. [PRÉSENTATION GÉNÉRALE](#1-présentation-générale)
2. [EXPRESSION DU BESOIN](#2-expression-du-besoin)
3. [OBJECTIFS](#3-objectifs)
4. [PÉRIMÈTRE DU PROJET](#4-périmètre-du-projet)
5. [EXIGENCES FONCTIONNELLES](#5-exigences-fonctionnelles)
6. [EXIGENCES NON-FONCTIONNELLES](#6-exigences-non-fonctionnelles)
7. [ACTEURS ET UTILISATEURS](#7-acteurs-et-utilisateurs)
8. [CONTRAINTES](#8-contraintes)
9. [LIVRABLES ATTENDUS](#9-livrables-attendus)

---

## 1. PRÉSENTATION GÉNÉRALE

### 1.1 Contexte du Projet

Le marché immobilier locatif souffre actuellement de plusieurs problématiques majeures :
- Manque de transparence dans les transactions
- Processus administratifs longs et complexes
- Litiges fréquents entre propriétaires et locataires
- Difficultés de traçabilité des paiements
- Risques de falsification de documents

La technologie blockchain offre une solution innovante pour garantir **transparence**, **sécurité** et **traçabilité** dans la gestion des locations immobilières.

### 1.2 Description du Projet

Le projet consiste à développer **une plateforme web décentralisée** permettant de gérer l'intégralité du cycle de vie d'une location immobilière, depuis la publication d'un bien jusqu'à la fin du contrat, en s'appuyant sur la blockchain Ethereum pour :

- ✅ Enregistrer les contrats de manière immuable
- ✅ Automatiser les paiements de loyers
- ✅ Tracer toutes les transactions
- ✅ Gérer les litiges de manière transparente
- ✅ Garantir la sécurité des données

### 1.3 Bénéfices Attendus

**Pour les propriétaires** :
- Réception automatique des loyers
- Traçabilité complète des paiements
- Réduction des impayés grâce aux pénalités automatiques
- Sécurisation des contrats

**Pour les locataires** :
- Transparence totale sur les termes du contrat
- Preuve immédiate de paiement
- Protection contre les abus
- Processus simplifié

**Pour le système** :
- Immuabilité des données
- Décentralisation
- Automatisation des processus
- Réduction des coûts administratifs

---

## 2. EXPRESSION DU BESOIN

### 2.1 Besoin Global

**Développer une solution web sécurisée et décentralisée permettant la gestion complète des locations immobilières avec enregistrement immuable sur la blockchain Ethereum.**

### 2.2 Problématiques à Résoudre

| Problématique | Solution Apportée |
|---------------|-------------------|
| **Manque de confiance entre parties** | Contrats enregistrés sur blockchain (immuables) |
| **Litiges sur les paiements** | Traçabilité complète via blockchain |
| **Processus administratifs lourds** | Automatisation via smart contracts |
| **Pénalités de retard contestées** | Calcul automatique et transparent |
| **Falsification de documents** | Hash des documents sur blockchain |
| **Manque de transparence** | Toutes les transactions publiques et vérifiables |

### 2.3 Besoins Fonctionnels Principaux

1. **Gestion des utilisateurs** : Inscription, authentification, profils (propriétaire/locataire)
2. **Gestion des propriétés** : Publication, modification, consultation des biens immobiliers
3. **Gestion des contrats** : Création, signature électronique, déploiement sur blockchain
4. **Gestion des paiements** : Paiement en cryptomonnaie, calcul automatique des pénalités
5. **Gestion des litiges** : Dépôt, suivi, résolution par médiation
6. **Tableau de bord** : Vue d'ensemble et statistiques

---

## 3. OBJECTIFS

### 3.1 Objectif Principal

**Créer une plateforme fiable, transparente et automatisée pour la gestion locative en s'appuyant sur la technologie blockchain.**

### 3.2 Objectifs Spécifiques

| ID | Objectif | Mesure de Succès |
|----|----------|------------------|
| O1 | Permettre la création et la signature de contrats numériques | 100% des contrats signés déployés sur blockchain |
| O2 | Automatiser les paiements de loyers via blockchain | Paiements enregistrés avec hash de transaction |
| O3 | Calculer automatiquement les pénalités de retard | Calcul vérifié dans le smart contract |
| O4 | Enregistrer toutes les transactions de manière immuable | 0 modification a posteriori possible |
| O5 | Faciliter la résolution des litiges | Litige enregistré sur blockchain |
| O6 | Garantir la sécurité des données utilisateurs | Authentification JWT + mots de passe hashés |

### 3.3 Indicateurs de Performance (KPI)

- Temps de création d'un contrat : **< 5 minutes**
- Temps de confirmation d'un paiement : **< 2 minutes**
- Taux de disponibilité du système : **> 99%**
- Satisfaction utilisateur : **> 4/5**

---

## 4. PÉRIMÈTRE DU PROJET

### 4.1 Fonctionnalités Incluses (IN SCOPE)

#### Module 1 : Authentification et Profils
- [x] Inscription avec rôle (propriétaire/locataire)
- [x] Connexion sécurisée (email + mot de passe)
- [x] Gestion du profil utilisateur
- [x] Association d'une adresse blockchain Ethereum
- [x] Déconnexion

#### Module 2 : Gestion des Propriétés
- [x] Création d'une propriété (adresse, type, surface, loyer)
- [x] Modification des informations
- [x] Suppression de propriété non louée
- [x] Upload de photos
- [x] Consultation et recherche de propriétés

#### Module 3 : Gestion des Contrats
- [x] Création d'un contrat de location
- [x] Signature électronique par les deux parties
- [x] Déploiement automatique sur blockchain (3 smart contracts)
- [x] Consultation des contrats actifs
- [x] Résiliation de contrat
- [x] Visualisation des détails

#### Module 4 : Gestion des Paiements
- [x] Consultation des paiements dus
- [x] Paiement de loyer en ETH (via MetaMask)
- [x] Calcul automatique des pénalités de retard
- [x] Historique complet des paiements
- [x] Retrait des fonds par le propriétaire

#### Module 5 : Gestion des Litiges
- [x] Dépôt d'un litige par une partie
- [x] Enregistrement du litige sur blockchain
- [x] Suivi de l'état du litige
- [x] Résolution par un administrateur
- [x] Notifications

#### Module 6 : Dashboard
- [x] Statistiques (contrats actifs, paiements, litiges)
- [x] Activité récente
- [x] Notifications

### 4.2 Fonctionnalités Exclues (OUT OF SCOPE)

- ❌ Paiement par carte bancaire
- ❌ Messagerie instantanée entre parties
- ❌ Système de notation/avis
- ❌ Gestion des visites immobilières
- ❌ Application mobile native
- ❌ Support de plusieurs cryptomonnaies (uniquement ETH)
- ❌ Intégration avec cadastre ou services gouvernementaux

---

## 5. EXIGENCES FONCTIONNELLES

### 5.1 Authentification (RF1)

| ID | Exigence | Priorité | Critères d'Acceptation |
|----|----------|----------|------------------------|
| RF1.1 | Inscription avec email, mot de passe, nom, prénom, rôle | **Haute** | Compte créé et enregistré en base |
| RF1.2 | Email unique par utilisateur | **Haute** | Impossible de créer 2 comptes avec même email |
| RF1.3 | Mot de passe sécurisé (min 8 caractères) | **Haute** | Validation côté client et serveur |
| RF1.4 | Connexion avec email et mot de passe | **Haute** | Token JWT généré et retourné |
| RF1.5 | Modification du profil | Moyenne | Informations mises à jour en base |
| RF1.6 | Association adresse blockchain Ethereum | Moyenne | Adresse valide et enregistrée |

### 5.2 Gestion des Propriétés (RF2)

| ID | Exigence | Priorité | Critères d'Acceptation |
|----|----------|----------|------------------------|
| RF2.1 | Création propriété (adresse, type, surface, loyer) | **Haute** | Propriété enregistrée avec statut "disponible" |
| RF2.2 | Upload jusqu'à 10 photos | Moyenne | Photos stockées et affichées |
| RF2.3 | Modification d'une propriété | **Haute** | Données mises à jour |
| RF2.4 | Suppression propriété si non louée | **Haute** | Impossible si contrat actif |
| RF2.5 | Consultation de toutes les propriétés | **Haute** | Liste affichée avec filtres |
| RF2.6 | Recherche par critères (type, prix, surface) | Moyenne | Résultats filtrés correctement |

### 5.3 Gestion des Contrats (RF3)

| ID | Exigence | Priorité | Critères d'Acceptation |
|----|----------|----------|------------------------|
| RF3.1 | Création contrat par propriétaire | **Haute** | Contrat créé en statut "draft" |
| RF3.2 | Saisie : locataire, montant, durée, dépôt, termes | **Haute** | Toutes les données obligatoires |
| RF3.3 | Signature électronique du propriétaire | **Haute** | Champ landlordSigned = true |
| RF3.4 | Signature électronique du locataire | **Haute** | Champ tenantSigned = true |
| RF3.5 | Déploiement automatique de 3 smart contracts | **Haute** | RentalContract, PaymentManager, DisputeManager déployés |
| RF3.6 | Stockage des adresses blockchain | **Haute** | Adresses enregistrées en base |
| RF3.7 | Statut "active" après double signature | **Haute** | Contrat actif et fonctionnel |
| RF3.8 | Consultation des contrats | **Haute** | Liste affichée par utilisateur |
| RF3.9 | Résiliation par propriétaire | Moyenne | Contrat en statut "terminated" |

### 5.4 Gestion des Paiements (RF4)

| ID | Exigence | Priorité | Critères d'Acceptation |
|----|----------|----------|------------------------|
| RF4.1 | Génération automatique calendrier paiements | **Haute** | Paiements créés selon durée contrat |
| RF4.2 | Paiement en ETH via MetaMask | **Haute** | Transaction blockchain confirmée |
| RF4.3 | Enregistrement hash de transaction | **Haute** | Hash stocké en base de données |
| RF4.4 | Calcul automatique pénalités retard | **Haute** | Formule : (jours retard - grace) × taux × montant / 100 |
| RF4.5 | Statut paiement mis à jour | **Haute** | "pending" → "paid" |
| RF4.6 | Historique complet paiements | Moyenne | Liste affichée avec détails |
| RF4.7 | Retrait fonds par propriétaire | **Haute** | Transaction blockchain vers wallet propriétaire |

### 5.5 Gestion des Litiges (RF5)

| ID | Exigence | Priorité | Critères d'Acceptation |
|----|----------|----------|------------------------|
| RF5.1 | Dépôt litige par propriétaire ou locataire | **Haute** | Litige créé avec description |
| RF5.2 | Enregistrement sur blockchain | **Haute** | Transaction avec hash |
| RF5.3 | Statut initial "open" | **Haute** | État visible pour les deux parties |
| RF5.4 | Consultation litiges par utilisateur | **Haute** | Liste filtrée par contrat |
| RF5.5 | Résolution par administrateur | **Haute** | Choix : LANDLORD_WINS / TENANT_WINS |
| RF5.6 | Mise à jour blockchain | **Haute** | Résolution enregistrée de manière immuable |
| RF5.7 | Statut "resolved" | **Haute** | État final du litige |

### 5.6 Dashboard (RF6)

| ID | Exigence | Priorité | Critères d'Acceptation |
|----|----------|----------|------------------------|
| RF6.1 | Affichage nombre contrats actifs | Moyenne | Compteur exact |
| RF6.2 | Affichage paiements en attente | Moyenne | Liste des paiements "pending" |
| RF6.3 | Affichage nombre litiges ouverts | Moyenne | Compteur "open" |
| RF6.4 | Activité récente | Basse | Dernières actions affichées |

---

## 6. EXIGENCES NON-FONCTIONNELLES

### 6.1 Performance (ENF1)

| ID | Exigence | Critère | Mesure |
|----|----------|---------|--------|
| ENF1.1 | Temps de chargement page | < 2 secondes | Chrome DevTools |
| ENF1.2 | Temps déploiement smart contract | < 30 secondes | Ganache local |
| ENF1.3 | Temps réponse API | < 500 ms | Tests de charge |
| ENF1.4 | Utilisateurs simultanés supportés | 100 users | Stress testing |

### 6.2 Sécurité (ENF2)

| ID | Exigence | Implémentation | Vérification |
|----|----------|----------------|--------------|
| ENF2.1 | Mots de passe hashés | bcrypt (salt rounds ≥ 10) | Audit code |
| ENF2.2 | Tokens d'authentification | JWT avec expiration 7 jours | Test expiration |
| ENF2.3 | Protection routes API | Middleware de vérification token | Test non-authentifié |
| ENF2.4 | Validation entrées utilisateur | Sanitization côté serveur | Tests injection |
| ENF2.5 | Transactions signées | MetaMask signing | Vérification blockchain |
| ENF2.6 | Smart contracts sécurisés | require() sur les appels | Audit Solidity |

### 6.3 Disponibilité (ENF3)

| ID | Exigence | Objectif |
|----|----------|----------|
| ENF3.1 | Disponibilité système | 99% uptime |
| ENF3.2 | Temps de récupération | < 1 heure |
| ENF3.3 | Sauvegarde base de données | Quotidienne |

### 6.4 Compatibilité (ENF4)

| ID | Exigence | Support |
|----|----------|---------|
| ENF4.1 | Navigateurs | Chrome, Firefox, Edge (dernières versions) |
| ENF4.2 | Résolution minimale | 1024×768 |
| ENF4.3 | MetaMask | Extension obligatoire pour paiements |
| ENF4.4 | Responsive design | Desktop uniquement (mobile hors périmètre) |

### 6.5 Utilisabilité (ENF5)

| ID | Exigence | Mesure |
|----|----------|--------|
| ENF5.1 | Interface intuitive | Utilisateur peut effectuer tâche sans formation |
| ENF5.2 | Messages d'erreur clairs | Description du problème + solution |
| ENF5.3 | Feedback visuel | Confirmations pour toutes les actions |
| ENF5.4 | Accessibilité | Contraste, taille police, navigation clavier |

### 6.6 Maintenabilité (ENF6)

| ID | Exigence | Standard |
|----|----------|----------|
| ENF6.1 | Code documenté | Commentaires pour fonctions complexes |
| ENF6.2 | Architecture modulaire | Séparation des responsabilités (MVC) |
| ENF6.3 | Variables d'environnement | Configuration via .env |
| ENF6.4 | Logging | Journalisation des erreurs et transactions |

---

## 7. ACTEURS ET UTILISATEURS

### 7.1 Acteurs Principaux

#### Propriétaire (Landlord)
**Rôle** : Bailleur immobilier  
**Responsabilités** :
- Publier des propriétés
- Créer des contrats de location
- Signer les contrats
- Recevoir les paiements de loyer
- Retirer les fonds
- Déposer des litiges

**Droits d'accès** :
- Ses propriétés (CRUD)
- Ses contrats (création, consultation, résiliation)
- Paiements reçus (consultation, retrait)
- Litiges (dépôt, consultation)

---

#### Locataire (Tenant)
**Rôle** : Preneur de location  
**Responsabilités** :
- Rechercher des propriétés
- Signer les contrats
- Payer les loyers
- Déposer des litiges

**Droits d'accès** :
- Toutes les propriétés (consultation)
- Ses contrats (consultation, signature)
- Ses paiements (paiement, historique)
- Ses litiges (dépôt, consultation)

---

#### Administrateur (Admin)
**Rôle** : Médiateur et modérateur  
**Responsabilités** :
- Résoudre les litiges
- Modérer la plateforme
- Gérer les utilisateurs (si nécessaire)

**Droits d'accès** :
- Tous les litiges (consultation, résolution)
- Statistiques globales
- Gestion utilisateurs

---

#### Blockchain Ethereum
**Rôle** : Infrastructure décentralisée  
**Responsabilités** :
- Stocker les smart contracts
- Exécuter les transactions
- Garantir l'immuabilité des données

---

### 7.2 Cas d'Utilisation Principaux

| Acteur | Cas d'Utilisation |
|--------|-------------------|
| **Propriétaire** | Créer propriété, Créer contrat, Signer contrat, Retirer fonds, Résilier contrat |
| **Locataire** | Rechercher propriété, Signer contrat, Payer loyer, Consulter historique |
| **Les deux** | S'inscrire, Se connecter, Déposer litige, Consulter litiges |
| **Administrateur** | Résoudre litiges, Modérer plateforme |
| **Système** | Déployer smart contracts, Calculer pénalités, Notifier utilisateurs |

---

## 8. CONTRAINTES

### 8.1 Contraintes Techniques

| Type | Description | Impact |
|------|-------------|--------|
| **Blockchain locale** | Utilisation de Ganache (pas de mainnet Ethereum) | Pas de coûts de gas réels |
| **MetaMask obligatoire** | Extension navigateur requise pour paiements | Utilisateurs doivent installer MetaMask |
| **ETH uniquement** | Pas de support d'autres cryptomonnaies | Limitation aux utilisateurs Ethereum |
| **Web uniquement** | Pas d'application mobile native | Accès via navigateur desktop |
| **PostgreSQL** | Base de données relationnelle | Serveur PostgreSQL requis |

### 8.2 Contraintes Temporelles

| Contrainte | Valeur |
|------------|--------|
| **Durée totale projet** | 13 semaines |
| **Date début** | Semaine 1 semestre |
| **Date fin** | Fin semestre |
| **Date soutenance** | À définir (semaine 13-14) |

### 8.3 Contraintes Budgétaires

| Élément | Budget |
|---------|--------|
| **Technologies** | 0€ (open-source uniquement) |
| **Infrastructure** | 0€ (développement local) |
| **Hébergement** | 0€ (hors périmètre) |
| **Total** | **0€** |

### 8.4 Contraintes Réglementaires

| Contrainte | Description |
|------------|-------------|
| **RGPD** | Protection données personnelles (emails, noms) |
| **Sécurité** | Hashage mots de passe, sécurisation tokens |
| **Traçabilité** | Logs des actions sensibles |

---

## 9. LIVRABLES ATTENDUS

### 9.1 Livrables Techniques

| Livrable | Description | Format |
|----------|-------------|--------|
| **Code source complet** | Frontend + Backend + Smart Contracts | Dépôt Git |
| **Base de données** | Schéma SQL + Script d'initialisation | .sql |
| **Smart contracts** | Fichiers .sol compilés | ABI + Bytecode |
| **Configuration** | Fichiers .env.example | Texte |

### 9.2 Livrables Documentaires

| Livrable | Description | Format |
|----------|-------------|--------|
| **Cahier des charges** | Ce document | PDF ou Markdown |
| **Dossier de conception** | Diagrammes UML, architecture | PDF |
| **Manuel d'installation** | Guide technique de déploiement | PDF ou Markdown |
| **Manuel utilisateur** | Guide d'utilisation de la plateforme | PDF |
| **Rapport final PFA** | Document complet du projet | PDF |

### 9.3 Livrables de Présentation

| Livrable | Description | Format |
|----------|-------------|--------|
| **Présentation PowerPoint** | Slides pour soutenance | .pptx |
| **Vidéo de démonstration** | Walkthrough de l'application | .mp4 (5-10 min) |
| **Poster** | Affiche résumé du projet (optionnel) | PDF A1 |

### 9.4 Critères de Qualité

**Le projet sera considéré comme réussi si** :
- ✅ Toutes les exigences fonctionnelles **Haute priorité** sont implémentées
- ✅ Les smart contracts se déploient correctement sur Ganache
- ✅ Les paiements via MetaMask fonctionnent
- ✅ Les litiges sont enregistrés sur la blockchain
- ✅ Aucun bug critique
- ✅ Documentation complète et claire
- ✅ Démonstration fonctionnelle lors de la soutenance

---

## 📋 VALIDATION

### Historique des Versions

| Version | Date | Auteur | Modifications |
|---------|------|--------|---------------|
| 0.1 | 01/12/2025 | Équipe projet | Ébauche initiale |
| 1.0 | 03/12/2025 | Équipe projet | Version finale validée |

### Approbation

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Chef de projet | | | |
| Encadrant académique | | | |
| Client (si applicable) | | | |

---

**Document rédigé par** : Équipe Projet  
**Dernière modification** : 03 Décembre 2025  
**Statut** : ✅ Validé

---

**FIN DU CAHIER DES CHARGES**
