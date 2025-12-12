# 📊 Comment Visualiser les Diagrammes UML

Ce guide explique toutes les méthodes pour visualiser les diagrammes Mermaid créés dans ce projet.

---

## ✅ Méthode 1 : VS Code (Recommandé)

### Option A : Aperçu Markdown Natif
1. Ouvrez un fichier de diagramme (ex: `class_diagram.md`)
2. Appuyez sur **`Ctrl+Shift+V`** (ou `Cmd+Shift+V` sur Mac)
3. Les diagrammes s'afficheront dans le panneau de prévisualisation

### Option B : Extension Mermaid (Meilleure qualité)
✅ **Déjà installée pour vous !**

**Pour l'utiliser :**
1. Ouvrez un fichier `.md` contenant des diagrammes
2. Clic droit → **"Open Preview"** ou `Ctrl+Shift+V`
3. Les diagrammes Mermaid seront rendus en haute qualité

**Avantages :**
- Zoom et pan interactifs
- Export en SVG/PNG
- Rendu professionnel

---

## 🌐 Méthode 2 : GitHub (Idéal pour Documentation)

Si vous publiez votre projet sur GitHub :

1. Poussez vos fichiers sur GitHub
2. Naviguez vers `docs/diagrams/`
3. Cliquez sur n'importe quel fichier `.md`
4. **GitHub rend automatiquement les diagrammes Mermaid !**

**Exemple :** `https://github.com/VOTRE_USERNAME/pfa/blob/main/docs/diagrams/class_diagram.md`

---

## 🖥️ Méthode 3 : Éditeur en Ligne Mermaid Live

Pour une édition interactive immédiate :

1. Visitez : **https://mermaid.live/**
2. Copiez le code Mermaid (entre les balises ````mermaid` et ````)
3. Collez dans l'éditeur
4. Le diagramme s'affiche en temps réel
5. **Export possible** : PNG, SVG, PDF

**Exemple d'utilisation :**
```
1. Ouvrez class_diagram.md
2. Copiez tout le code entre ```mermaid et ```
3. Collez sur mermaid.live
4. Téléchargez comme image
```

---

## 📄 Méthode 4 : Convertir en Images (Pour Rapports)

### Option A : Via Mermaid CLI

Installez Mermaid CLI :
```bash
npm install -g @mermaid-js/mermaid-cli
```

Convertir un fichier :
```bash
cd docs/diagrams
mmdc -i class_diagram.md -o class_diagram.png
mmdc -i use_case_diagram.md -o use_case_diagram.png
mmdc -i sequence_diagrams.md -o sequence_diagrams.png
```

### Option B : Via VS Code Extension

1. Installez l'extension **"Markdown PDF"**
2. Ouvrez un fichier `.md`
3. `Ctrl+Shift+P` → **"Markdown PDF: Export (png)"**
4. L'image sera sauvegardée dans le même dossier

### Option C : Capture d'écran depuis Mermaid Live
1. Ouvrez le diagramme sur https://mermaid.live
2. Cliquez sur **"Actions"** → **"Download PNG"** ou **"Download SVG"**
3. Utilisez l'image dans vos présentations/rapports

---

## 📱 Méthode 5 : Intégration dans une Documentation Web

Si vous créez une documentation web (ex: avec Docusaurus, VuePress, GitBook) :

### Exemple avec un site statique simple

Créez un fichier HTML :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Diagrammes UML - Système de Location</title>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: true });
    </script>
</head>
<body>
    <h1>Diagramme de Classes</h1>
    <div class="mermaid">
        <!-- Collez votre code Mermaid ici -->
        classDiagram
            class User {
                +int id
                +string email
            }
    </div>
</body>
</html>
```

---

## 🎯 Méthode 6 : Export pour Présentation PowerPoint/Word

### Étapes :
1. Ouvrez le diagramme sur **mermaid.live**
2. Téléchargez en **SVG** (meilleure qualité) ou **PNG**
3. Insérez l'image dans PowerPoint, Word, ou LaTeX

**Avantage SVG :** Zoom sans perte de qualité

---

## 📋 Quick Start - Test Maintenant !

**Essayez immédiatement :**

1. **Dans VS Code** :
   ```
   Ouvrir : docs/diagrams/class_diagram.md
   Presser : Ctrl+Shift+V
   ✅ Voir le diagramme !
   ```

2. **En ligne** :
   ```
   Aller sur : https://mermaid.live/
   Copier le code depuis class_diagram.md
   Coller dans l'éditeur
   ✅ Voir le diagramme interactif !
   ```

---

## 🛠️ Édition des Diagrammes

Pour modifier un diagramme :

1. **Ouvrez le fichier** `.md` dans VS Code
2. **Modifiez le code Mermaid** entre les balises ````mermaid` et ````
3. **Aperçu en direct** : Gardez `Ctrl+Shift+V` ouvert
4. **Sauvegardez** : Les changements apparaissent immédiatement

### Exemple de modification rapide :

**Avant :**
```mermaid
class User {
    +string email
}
```

**Après (ajouter un attribut) :**
```mermaid
class User {
    +string email
    +string phone
}
```

---

## 📚 Ressources Supplémentaires

- **Documentation Mermaid** : https://mermaid.js.org/
- **Syntaxe Diagrammes de Classes** : https://mermaid.js.org/syntax/classDiagram.html
- **Syntaxe Diagrammes de Séquence** : https://mermaid.js.org/syntax/sequenceDiagram.html
- **Éditeur en ligne** : https://mermaid.live/
- **Exemples** : https://mermaid.js.org/ecosystem/integrations.html

---

## ❓ FAQ

**Q : Les diagrammes ne s'affichent pas dans VS Code ?**
- A : Assurez-vous que l'extension Markdown Mermaid est installée
- Vérifiez que le fichier a l'extension `.md`
- Réessayez avec `Ctrl+Shift+V`

**Q : Comment exporter en haute résolution ?**
- A : Utilisez mermaid.live et téléchargez en SVG (vectoriel)

**Q : Puis-je utiliser ces diagrammes dans mon rapport PFA/PFE ?**
- A : Oui ! Exportez-les en PNG/SVG et intégrez-les dans Word/LaTeX

**Q : Les diagrammes sont-ils modifiables ?**
- A : Oui, éditez directement le code Mermaid dans les fichiers .md

---

## 🎓 Pour Votre Rapport Académique

**Méthode recommandée :**

1. **Visualisez** dans VS Code pour vérifier
2. **Exportez** via mermaid.live en PNG (300 DPI minimum)
3. **Insérez** dans Word/LaTeX avec légende :
   ```
   Figure X : Diagramme de classes du système de gestion locative blockchain
   ```

**Formats conseillés par type de document :**
- **Word** : PNG (haute résolution)
- **LaTeX** : SVG ou PDF
- **PowerPoint** : SVG (zooming sans perte)
- **Site web** : Code Mermaid directement

---

## ✨ Astuce Pro

Créez un script pour générer toutes les images automatiquement :

```bash
# generate_diagrams.sh
mmdc -i docs/diagrams/class_diagram.md -o docs/images/class_diagram.png -w 2000
mmdc -i docs/diagrams/use_case_diagram.md -o docs/images/use_case_diagram.png -w 2000
mmdc -i docs/diagrams/sequence_diagrams.md -o docs/images/sequence_diagrams.png -w 2000
```

Exécutez : `bash generate_diagrams.sh`

---

**Bon travail avec vos diagrammes ! 🚀**
