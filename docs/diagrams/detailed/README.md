# 📊 Diagrammes PlantUML Détaillés

## Version Complète pour Rapport Académique

Ces diagrammes contiennent **tous les détails techniques** : attributs, méthodes, types de données, et flux complets.

---

## 📁 Fichiers Créés

```
detailed/
├── class_diagram.puml           # Classes avec tous les attributs et méthodes
├── use_case_diagram.puml        # 31 cas d'utilisation + dépendances
├── sequence_auth.puml           # Authentification avec bcrypt + JWT
├── sequence_contract.puml       # Création + déploiement 3 smart contracts
├── sequence_payment.puml        # Paiement avec MetaMask + pénalités
└── README.md                    # Ce fichier
```

---

## 🎯 Niveau de Détail

| Diagramme | Lignes | Détails |
|-----------|--------|---------|
| **class_diagram.puml** | ~150 | Tous les attributs avec types, toutes les méthodes, events |
| **use_case_diagram.puml** | ~130 | 31 UC, 6 packages, include/extend/require |
| **sequence_auth.puml** | ~120 | Inscription + Connexion avec bcrypt, JWT, validation |
| **sequence_contract.puml** | ~180 | 3 phases + déploiement de 3 smart contracts |
| **sequence_payment.puml** | ~200 | MetaMask, calcul pénalités, events, mise à jour DB |

---

## ✨ Nouveautés par Rapport à la Version Simple

### 1. **Diagramme de Classes**
- ✅ Tous les attributs avec types précis (Integer, Decimal(18,8), etc.)
- ✅ Contraintes ({PK}, {FK}, {unique})
- ✅ Toutes les méthodes des modèles
- ✅ Méthodes et events des smart contracts
- ✅ Packages pour organiser (Modèles vs Smart Contracts)
- ✅ Notes explicatives

### 2. **Cas d'Utilisation**
- ✅ 31 cas d'utilisation (vs 6 en version simple)
- ✅ 6 packages thématiques avec couleurs
- ✅ Dépendances: <<include>>, <<require>>, <<extend>>
- ✅ Interaction avec blockchain
- ✅ Notes sur les processus automatiques

### 3. **Séquence Authentification**
- ✅ Numérotation automatique des étapes
- ✅ Inscription ET connexion dans le même diagramme
- ✅ Détails bcrypt (genSalt, hash, compare)
- ✅ Génération JWT avec expiration
- ✅ Hooks Sequelize (beforeCreate)
- ✅ Gestion complète des erreurs (alt/else)
- ✅ Interactions localStorage et Context

### 4. **Séquence Contrat**
- ✅ 3 phases distinctes
- ✅ Chargement initial des propriétés
- ✅ Double signature (propriétaire puis locataire)
- ✅ Déploiement séquentiel des 3 smart contracts
- ✅ Détails de chaque déploiement
- ✅ Initialisation des smart contracts
- ✅ Génération du calendrier de paiements
- ✅ Notifications

### 5. **Séquence Paiement**
- ✅ 3 phases détaillées
- ✅ Intégration MetaMask complète
- ✅ Vérification du wallet
- ✅ Calcul des pénalités dans le smart contract
- ✅ Gestion du trop-perçu (remboursement)
- ✅ Extraction des events blockchain
- ✅ Mise à jour DB avec transaction hash
- ✅ Listener d'événements en background

---

## 🚀 Comment Utiliser

### Méthode 1 : En Ligne

1. **Aller sur** : http://www.plantuml.com/plantuml/uml/
2. **Copier** le code complet d'un fichier `.puml`
3. **Coller** dans l'éditeur
4. **Télécharger** PNG ou SVG haute résolution

### Méthode 2 : VS Code

1. **Ouvrir** un fichier `.puml`
2. **Appuyer** sur `Alt+D`
3. **Voir** le diagramme rendu
4. **Exporter** : Clic droit → "Export Current Diagram"

### Méthode 3 : Générer PNG

```bash
cd docs/diagrams/detailed

# Télécharger PlantUML (si pas déjà fait)
curl -o plantuml.jar https://repo1.maven.org/maven2/net/sourceforge/plantuml/plantuml/1.2023.13/plantuml-1.2023.13.jar

# Générer tous les diagrammes en haute résolution
java -DPLANTUML_LIMIT_SIZE=16384 -jar plantuml.jar -tpng *.puml

# Ou en SVG (vectoriel)
java -jar plantuml.jar -tsvg *.puml
```

---

## 🎓 Pour Votre Rapport Académique

### Structure Recommandée

**Chapitre "Conception"** :

1. **Figure 1 : Diagramme de classes**
   - Fichier : `class_diagram.puml`
   - Légende : "Architecture complète du système avec modèles de données et smart contracts"

2. **Figure 2 : Diagramme de cas d'utilisation**
   - Fichier : `use_case_diagram.puml`
   - Légende : "Fonctionnalités du système et interactions des acteurs"

**Chapitre "Implémentation"** :

3. **Figure 3 : Séquence d'authentification**
   - Fichier : `sequence_auth.puml`
   - Légende : "Processus d'inscription et de connexion avec sécurisation JWT"

4. **Figure 4 : Séquence de création de contrat**
   - Fichier : `sequence_contract.puml`
   - Légende : "Création, signature et déploiement automatique des smart contracts"

5. **Figure 5 : Séquence de paiement**
   - Fichier : `sequence_payment.puml`
   - Légende : "Transaction de paiement via MetaMask avec gestion des pénalités"

---

## 📐 Qualité des Images

### Pour Impression (Rapport Papier)

**Format recommandé** : PNG haute résolution

```bash
java -DPLANTUML_LIMIT_SIZE=16384 -jar plantuml.jar -tpng *.puml
```

**Résolution** : Minimum 300 DPI
**Largeur** : 2000-3000 pixels

### Pour Version Numérique (PDF)

**Format recommandé** : SVG (vectoriel)

```bash
java -jar plantuml.jar -tsvg *.puml
```

**Avantage** : Zoom infini sans perte de qualité

---

## 💡 Personnalisation

### Changer les Couleurs

Dans chaque fichier `.puml`, vous pouvez modifier :

```plantuml
' Couleurs des packages
package "Nom" #E3F2FD {  ' Bleu clair
package "Nom" #E8F5E9 {  ' Vert clair
package "Nom" #FFF3E0 {  ' Orange clair
```

### Changer le Style

Ajoutez en début de fichier :

```plantuml
skinparam monochrome true          ' Noir et blanc
skinparam handwritten true         ' Style dessiné à la main
skinparam backgroundColor #FEFEFE  ' Couleur de fond
```

---

## 📊 Comparaison des Versions

| Aspect | Simple | Détaillée |
|--------|--------|-----------|
| **Lignes de code** | 15-25 | 120-200 |
| **Attributs classes** | Principaux | Tous avec types |
| **Méthodes** | Aucune | Toutes |
| **Cas d'utilisation** | 6 | 31 |
| **Séquences** | Flux basique | Flux complet + erreurs |
| **Smart contracts** | Non | Oui, détaillés |
| **Events blockchain** | Non | Oui |
| **Numérotation** | Non | Oui (auto) |
| **Notes** | Non | Oui |
| **Utilisation** | Présentation rapide | Rapport académique complet |

---

## 🔍 Points Techniques Couverts

### Diagramme de Classes
- Types de données PostgreSQL (Integer, Decimal, Text, JSON, Enum)
- Contraintes de clés (PK, FK, unique)
- Relations cardinalités (1, 0..*, etc.)
- Méthodes d'instance et statiques
- Events Solidity
- Packages organisés

### Séquence Authentification
- Hooks Sequelize (beforeCreate)
- Hashage bcrypt avec salt
- Génération JWT avec expiration
- Gestion des sessions
- LocalStorage
- Context React

### Séquence Contrat
- Include de modèles Sequelize
- Transactions Web3
- Déploiement de smart contracts
- Bytecode et ABI
- Initialisation des contrats
- Adresses blockchain

### Séquence Paiement
- Intégration MetaMask
- eth_requestAccounts
- eth_sendTransaction
- Calcul de pénalités on-chain
- Events et logs
- Transaction receipts
- Decode d'events

---

## 🎯 Quand Utiliser Cette Version

✅ **Utilisez `detailed/` si** :
- Rapport PFA/PFE/Mémoire
- Présentation technique détaillée
- Documentation complète du système
- Besoin d'expliquer chaque étape
- Audience technique (jury, développeurs)

❌ **Utilisez `simple/` si** :
- Présentation commerciale
- Pitch rapide
- Overview général
- Audience non-technique
- Contrainte de temps

---

## 📚 Ressources

- **PlantUML Guide** : https://plantuml.com/guide
- **Séquences** : https://plantuml.com/sequence-diagram
- **Classes** : https://plantuml.com/class-diagram
- **Cas d'utilisation** : https://plantuml.com/use-case-diagram
- **Skinparam** : https://plantuml.com/skinparam

---

## ✅ Checklist Rapport

Avant d'intégrer dans votre rapport :

- [ ] Diagrammes générés en haute résolution (PNG 300 DPI ou SVG)
- [ ] Légendes claires avec numérotation (Figure X)
- [ ] Référence dans le texte ("voir Figure X")
- [ ] Explication des symboles si nécessaire
- [ ] Couleurs adaptées (noir/blanc si impression N&B)
- [ ] Taille lisible (pleine page si complexe)

---

**Diagrammes détaillés prêts pour votre rapport académique ! 🎓📊**
