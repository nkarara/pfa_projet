# 📊 Diagrammes PlantUML - Version Simplifiée

Ces diagrammes sont **simplifiés** et **légers**, parfaits pour votre documentation académique.

## 📁 Fichiers Créés

```
plantuml/
├── class_diagram.puml           # Diagramme de classes
├── use_case_diagram.puml        # Cas d'utilisation
├── sequence_auth.puml           # Séquence authentification
├── sequence_contract.puml       # Séquence création contrat
├── sequence_payment.puml        # Séquence paiement
├── sequence_dispute.puml        # Séquence litige
└── README.md                    # Ce fichier
```

---

## 🎯 Comment Visualiser ces Diagrammes

### Méthode 1 : VS Code (Recommandé)

**Installation de l'extension :**
1. Ouvrir VS Code
2. `Ctrl+Shift+X` → Rechercher "PlantUML"
3. Installer **"PlantUML" by jebbs**

**Visualisation :**
1. Ouvrir un fichier `.puml`
2. Appuyer sur **`Alt+D`** (ou `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram")
3. Le diagramme s'affiche à droite !

---

### Méthode 2 : En Ligne (Sans Installation)

**Site Web :** http://www.plantuml.com/plantuml/uml/

**Utilisation :**
1. Copier le contenu d'un fichier `.puml`
2. Coller sur le site
3. Le diagramme s'affiche automatiquement
4. **Télécharger** : PNG, SVG, ou TXT

**Lien direct :** Vous pouvez aussi utiliser https://plantuml.com/

---

### Méthode 3 : Générer des Images (Pour Rapport)

**Avec PlantUML CLI :**

1. **Installer Java** (requis pour PlantUML)
   ```bash
   # Vérifier si Java est installé
   java -version
   ```

2. **Télécharger PlantUML**
   - Aller sur : https://plantuml.com/download
   - Télécharger `plantuml.jar`
   - Mettre dans un dossier (ex: `C:\Tools\`)

3. **Générer les images**
   ```bash
   # Naviguer vers le dossier des diagrammes
   cd c:\Users\NABIL\Desktop\pfa\docs\diagrams\plantuml

   # Générer PNG pour tous les fichiers
   java -jar C:\Tools\plantuml.jar *.puml

   # OU pour un fichier spécifique
   java -jar C:\Tools\plantuml.jar class_diagram.puml
   ```

**Résultat :** Des fichiers `.png` seront créés dans le même dossier !

---

## 🚀 Quick Start - Test Maintenant

### Option A : VS Code
```
1. Installer extension PlantUML dans VS Code
2. Ouvrir : class_diagram.puml
3. Presser : Alt+D
4. ✅ Voir le diagramme !
```

### Option B : En Ligne
```
1. Aller sur : http://www.plantuml.com/plantuml/uml/
2. Copier le code de class_diagram.puml
3. Coller dans la zone de texte
4. ✅ Voir le diagramme !
5. Télécharger en PNG
```

---

## 📋 Description des Diagrammes

### 1. **class_diagram.puml**
**Contenu :**
- 5 modèles de données (User, Property, Contract, Payment, Dispute)
- 3 smart contracts (RentalContract, PaymentManager, DisputeManager)
- Relations entre entités

**Utilité :** Vue d'ensemble de la structure des données

---

### 2. **use_case_diagram.puml**
**Contenu :**
- 3 acteurs (Locataire, Propriétaire, Administrateur)
- 16 cas d'utilisation principaux
- 5 packages thématiques

**Utilité :** Fonctionnalités du système et interactions utilisateurs

---

### 3. **sequence_auth.puml**
**Flux :**
1. Inscription utilisateur
2. Connexion avec JWT

**Utilité :** Comprendre le processus d'authentification

---

### 4. **sequence_contract.puml**
**Flux :**
1. Création du contrat par le propriétaire
2. Signature des deux parties
3. Déploiement automatique des smart contracts

**Utilité :** Voir comment les contrats sont créés et déployés sur la blockchain

---

### 5. **sequence_payment.puml**
**Flux :**
1. Consultation des paiements dus
2. Paiement via MetaMask
3. Calcul des pénalités
4. Enregistrement sur blockchain

**Utilité :** Comprendre le processus de paiement avec blockchain

---

### 6. **sequence_dispute.puml**
**Flux :**
1. Dépôt d'un litige par une partie
2. Enregistrement blockchain
3. Résolution par l'administrateur

**Utilité :** Voir le système de gestion des litiges

---

## 💡 Avantages PlantUML vs Mermaid

| Aspect | PlantUML | Mermaid |
|--------|----------|---------|
| **Syntaxe** | Plus simple et lisible | Plus moderne |
| **Outils** | Extension VS Code mature | Native GitHub |
| **Export** | PNG, SVG, PDF, LaTeX | PNG, SVG |
| **Qualité** | Excellente pour rapports | Bonne pour web |
| **Utilisation académique** | ⭐⭐⭐⭐⭐ Parfait | ⭐⭐⭐⭐ Très bon |

---

## 🎓 Pour Votre Rapport PFA/PFE

### Étapes Recommandées

1. **Visualiser** : Testez avec VS Code ou en ligne
2. **Exporter** : Générez les PNG avec PlantUML CLI
3. **Intégrer** : Insérez dans Word/LaTeX

### Qualité d'Image Recommandée

Pour un rapport académique :
- **Format** : PNG ou SVG
- **Résolution** : Minimum 300 DPI
- **Taille** : Largeur 1500-2000 pixels

**Commande pour haute résolution :**
```bash
java -DPLANTUML_LIMIT_SIZE=8192 -jar plantuml.jar -tpng *.puml
```

---

## 📖 Ressources PlantUML

- **Site officiel** : https://plantuml.com/
- **Guide de syntaxe** : https://plantuml.com/guide
- **Diagrammes de classes** : https://plantuml.com/class-diagram
- **Diagrammes de séquence** : https://plantuml.com/sequence-diagram
- **Cas d'utilisation** : https://plantuml.com/use-case-diagram

---

## ✏️ Modifier les Diagrammes

Pour personnaliser un diagramme :

1. **Ouvrir le fichier** `.puml` dans VS Code
2. **Modifier le code** PlantUML
3. **Aperçu en direct** : `Alt+D` pour rafraîchir
4. **Sauvegarder**

### Exemple de Modification

**Ajouter un attribut à User :**
```plantuml
class User {
  +id: int
  +email: string
  +phone: string  <-- NOUVEAU
}
```

---

## 🔧 Installation Extension VS Code

Si pas encore installé :

```bash
# Ligne de commande
code --install-extension jebbs.plantuml
```

**OU** manuellement :
1. `Ctrl+Shift+X`
2. Rechercher "PlantUML"
3. Installer "PlantUML by jebbs"

---

## ❓ FAQ

**Q : Les diagrammes ne s'affichent pas dans VS Code ?**
- Vérifiez que Java est installé : `java -version`
- Vérifiez que l'extension PlantUML est installée
- Redémarrez VS Code

**Q : Comment exporter en haute qualité ?**
- Utilisez le CLI PlantUML avec option `-tsvg` pour SVG (vectoriel)
- Ou `-tpng` avec limite de taille augmentée

**Q : Puis-je utiliser ces diagrammes dans LaTeX ?**
- ✅ OUI ! Exportez en PDF : `java -jar plantuml.jar -tpdf *.puml`

**Q : PlantUML vs Mermaid, lequel choisir ?**
- **PlantUML** : Meilleur pour rapports académiques (export PDF/LaTeX)
- **Mermaid** : Meilleur pour documentation web (GitHub, GitLab)

---

## ✨ Script de Génération Automatique

Créez un fichier `generate.bat` :

```batch
@echo off
echo Génération des diagrammes PlantUML...

java -jar C:\Tools\plantuml.jar -tpng *.puml
java -jar C:\Tools\plantuml.jar -tsvg *.puml

echo Terminé ! Vérifiez les fichiers PNG et SVG générés.
pause
```

Double-cliquez pour générer tous les diagrammes !

---

**Bon travail avec PlantUML ! 🚀📊**
