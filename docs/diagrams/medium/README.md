# 📊 Diagramme de Cas d'Utilisation - Version Équilibrée

## Niveau Intermédiaire (Ni Simple, Ni Détaillé)

---

## 🎯 Caractéristiques

| Aspect | Simple | **Medium** ⭐ | Détaillé |
|--------|--------|---------------|----------|
| **Nombre de UC** | 6 | **20** | 31 |
| **Acteurs** | 2 | **4** | 4 |
| **Packages** | Non | **6 packages** | 6 packages |
| **Dépendances** | Aucune | **7 principales** | Toutes |
| **Notes** | Non | **3 notes clés** | Nombreuses |
| **Utilisation** | Pitch rapide | **Rapport PFA** | Documentation complète |

---

## 📋 Contenu du Diagramme

### 🎭 Acteurs (4)

1. **👤 Locataire** (Tenant)
2. **🏠 Propriétaire** (Landlord)
3. **👨‍💼 Administrateur** (Admin)
4. **⛓️ Blockchain Ethereum**

---

### 📦 Packages (6) et Cas d'Utilisation (20)

#### 1. Authentification (3 UC)
- UC1 : S'inscrire
- UC2 : Se connecter
- UC3 : Gérer profil

#### 2. Gestion des Propriétés (4 UC)
- UC4 : Créer propriété
- UC5 : Modifier propriété
- UC6 : Consulter propriétés
- UC7 : Rechercher propriété

#### 3. Gestion des Contrats (5 UC)
- UC8 : Créer contrat
- UC9 : Signer contrat
- UC10 : Déployer sur blockchain
- UC11 : Consulter contrats
- UC12 : Résilier contrat

#### 4. Gestion des Paiements (4 UC)
- UC13 : Effectuer paiement
- UC14 : Consulter paiements
- UC15 : Calculer pénalités
- UC16 : Retirer fonds

#### 5. Gestion des Litiges (3 UC)
- UC17 : Déposer litige
- UC18 : Consulter litiges
- UC19 : Résoudre litige

#### 6. Dashboard (1 UC)
- UC20 : Voir tableau de bord

---

## 🔗 Dépendances Principales

### Include (automatique)

```
UC9 (Signer contrat) 
  └─ include → UC10 (Déployer blockchain)
      └─ include → UC15 (Calculer pénalités)

UC13 (Effectuer paiement)
  └─ include → UC15 (Calculer pénalités)
```

### Require (prérequis)

```
UC8 (Créer contrat)
  └─ require → UC4 (Créer propriété)

UC13 (Effectuer paiement)
  └─ require → UC9 (Contrat signé)

UC17 (Déposer litige)
  └─ require → UC9 (Contrat actif)
```

---

## 📝 Notes Explicatives (3)

### Note 1 : Déploiement Blockchain
```
UC10 déploie automatiquement:
• RentalContract.sol
• PaymentManager.sol
• DisputeManager.sol
```

### Note 2 : Paiement
```
Paiement via MetaMask
Enregistrement sur blockchain
avec hash de transaction
```

### Note 3 : Calcul Pénalités
```
Formule automatique:
(jours - grace) × taux × montant / 100
```

---

## 🎨 Visualisation

Pour voir le diagramme :

### Méthode 1 : VS Code
```
1. Ouvrir use_case_diagram.puml
2. Appuyer sur Alt+D
3. ✅ Voir le diagramme
```

### Méthode 2 : En ligne
```
1. Aller sur http://www.plantuml.com/plantuml/uml/
2. Copier le code du fichier
3. Coller
4. ✅ Télécharger PNG/SVG
```

---

## 📊 Matrice Acteurs × Cas d'Utilisation

| UC | Locataire | Propriétaire | Admin | Blockchain |
|----|-----------|--------------|-------|------------|
| **UC1** S'inscrire | ✓ | ✓ | | |
| **UC2** Se connecter | ✓ | ✓ | ✓ | |
| **UC3** Gérer profil | ✓ | ✓ | | |
| **UC4** Créer propriété | | ✓ | | |
| **UC5** Modifier propriété | | ✓ | | |
| **UC6** Consulter propriétés | ✓ | ✓ | | |
| **UC7** Rechercher propriété | ✓ | ✓ | | |
| **UC8** Créer contrat | | ✓ | | |
| **UC9** Signer contrat | ✓ | ✓ | | |
| **UC10** Déployer blockchain | | | | ✓ |
| **UC11** Consulter contrats | ✓ | ✓ | | |
| **UC12** Résilier contrat | | ✓ | | |
| **UC13** Effectuer paiement | ✓ | | | ✓ |
| **UC14** Consulter paiements | ✓ | ✓ | | |
| **UC15** Calculer pénalités | | | | (Auto) |
| **UC16** Retirer fonds | | ✓ | | |
| **UC17** Déposer litige | ✓ | ✓ | | ✓ |
| **UC18** Consulter litiges | ✓ | ✓ | ✓ | |
| **UC19** Résoudre litige | | | ✓ | |
| **UC20** Voir dashboard | ✓ | ✓ | | |

---

## 🎯 Pourquoi Cette Version ?

### ✅ Avantages

| Aspect | Bénéfice |
|--------|----------|
| **Complétude** | Couvre toutes les fonctionnalités principales |
| **Lisibilité** | Packages colorés pour organisation |
| **Pertinence** | Dépendances clés sans surcharge |
| **Académique** | Niveau approprié pour rapport PFA |
| **Professionnel** | Notes explicatives pour compréhension |

### ❌ Ce qu'elle évite

- ❌ Trop simple (manque de détails)
- ❌ Trop complexe (illisible)
- ❌ Redondance (UC inutiles)
- ❌ Ambiguïté (relations claires)

---

## 🎓 Pour Votre Rapport

### Légende Recommandée

```
Figure X : Diagramme de cas d'utilisation du système

Ce diagramme présente les 20 cas d'utilisation principaux 
du système de gestion locative blockchain, organisés en 
6 packages fonctionnels. Les acteurs (Locataire, Propriétaire, 
Administrateur, Blockchain) interagissent avec le système 
selon leurs rôles respectifs. Les dépendances <<include>> 
et <<require>> montrent les relations entre les cas d'utilisation.
```

### Description Textuelle

Ajoutez après le diagramme :

```
Le système comprend 6 modules principaux :

1. **Authentification** : Gestion des utilisateurs et sessions
2. **Propriétés** : Publication et recherche de biens immobiliers
3. **Contrats** : Création, signature et déploiement blockchain
4. **Paiements** : Paiements automatisés avec calcul de pénalités
5. **Litiges** : Dépôt et résolution de conflits
6. **Dashboard** : Vue d'ensemble et statistiques

Les interactions avec la blockchain sont automatisées pour 
garantir l'immuabilité et la transparence des transactions.
```

---

## 📏 Taille et Format

| Mesure | Valeur |
|--------|--------|
| Lignes de code | ~100 lignes |
| Acteurs | 4 |
| Cas d'utilisation | 20 |
| Packages | 6 |
| Relations | ~50 |
| Notes | 3 |
| Temps de lecture | 2-3 minutes |

---

## ✨ Résumé

```
✅ Version équilibrée (Medium)
✅ 20 cas d'utilisation (ni 6, ni 31)
✅ 4 acteurs avec couleurs
✅ 6 packages organisés
✅ 7 dépendances principales
✅ 3 notes explicatives
✅ Parfait pour rapport PFA
✅ Professionnel et lisible
```

**Fichier** : `docs/diagrams/medium/use_case_diagram.puml`

---

**Bon travail avec ce diagramme équilibré ! 🎯**
