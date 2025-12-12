# 📊 Diagramme de Cas d'Utilisation - Format Mermaid

## Pour StarUML, GitHub, GitLab, Notion, etc.

---

## 🎯 Comment Utiliser

### **Option 1 : GitHub / GitLab / Markdown**

Copiez le code complet et collez-le dans un fichier `.md` :

````markdown
```mermaid
graph TB
    %% [Collez le code ici]
```
````

GitHub/GitLab rendent automatiquement le diagramme !

---

### **Option 2 : StarUML**

1. Ouvrir StarUML
2. **Tools** → **Mermaid** → **Import from Mermaid**
3. Coller le code
4. ✅ Diagramme importé

---

### **Option 3 : Mermaid Live Editor**

1. Aller sur : https://mermaid.live/
2. Coller le code
3. ✅ Voir le rendu en direct
4. **Actions** → **Download PNG/SVG**

---

### **Option 4 : VS Code**

1. Installer extension "Markdown Preview Mermaid Support"
2. Créer un fichier `.md`
3. Coller le code entre ````mermaid` et ````
4. Ouvrir preview : `Ctrl+Shift+V`

---

### **Option 5 : Notion**

1. Taper `/code`
2. Choisir langage "Mermaid"
3. Coller le code
4. ✅ Diagramme rendu automatiquement

---

## 📋 Code Complet à Copier

Le code est disponible dans le fichier :
**`use_case_diagram_mermaid.md`**

---

## 🎨 Personnalisation

### Changer les Couleurs

Modifiez les styles à la fin du code :

```mermaid
style Tenant fill:#VOTRE_COULEUR,stroke:#BORDURE
```

**Couleurs disponibles** :
- Bleu : `#e3f2fd` / `#1976d2`
- Vert : `#e8f5e9` / `#388e3c`
- Orange : `#fff3e0` / `#f57c00`
- Violet : `#f3e5f5` / `#7b1fa2`
- Rouge : `#ffebee` / `#c62828`

### Ajouter un Cas d'Utilisation

```mermaid
UC21[Nouveau cas d'utilisation]
Tenant --> UC21
```

---

## 🔄 Conversion PlantUML ↔ Mermaid

| Aspect | PlantUML | Mermaid |
|--------|----------|---------|
| **Syntaxe** | `usecase "Nom" as UC1` | `UC1[Nom]` |
| **Acteur** | `actor "Nom" as Actor` | `Actor[Nom]` |
| **Package** | `package "Nom" {}` | `subgraph Nom[]` |
| **Relation** | `Actor --> UC1` | `Actor --> UC1` |
| **Include** | `UC1 .> UC2 : <<include>>` | `UC1 -.->|include| UC2` |
| **Require** | `UC1 .> UC2 : <<require>>` | `UC1 -.->|require| UC2` |

---

## 📊 Avantages Mermaid

✅ **Markdown natif** : Fonctionne dans GitHub, GitLab  
✅ **Notion compatible** : Rendu automatique  
✅ **Pas de compilation** : Pas besoin de Java  
✅ **Web friendly** : Nombreux outils en ligne  
✅ **Open source** : Gratuit et communautaire  
✅ **Documentation** : Parfait pour README.md  

---

## 📦 Fichiers Disponibles

```
docs/diagrams/medium/
├── use_case_diagram.puml           ← PlantUML (original)
├── use_case_diagram_mermaid.md     ← Mermaid (nouveau)
└── README.md
```

---

## 🎯 Utilisation Recommandée

| Outil | Format | Utilisation |
|-------|--------|-------------|
| **Rapport PFA** | PlantUML → PNG | Export haute qualité |
| **GitHub README** | Mermaid | Documentation en ligne |
| **StarUML** | Mermaid import | Modélisation UML |
| **Notion** | Mermaid | Collaboration équipe |
| **Présentation** | PlantUML → SVG | Vectoriel zoomable |

---

## 🔗 Ressources

- **Mermaid Documentation** : https://mermaid.js.org/
- **Mermaid Live** : https://mermaid.live/
- **GitHub Mermaid** : https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/
- **StarUML Mermaid Plugin** : http://staruml.io/

---

## ✨ Résumé

```
✅ Code Mermaid créé
✅ Compatible StarUML
✅ Compatible GitHub/GitLab
✅ Compatible Notion
✅ 20 cas d'utilisation
✅ 6 packages colorés
✅ Styles personnalisables
✅ Prêt à utiliser
```

**Copiez le code depuis `use_case_diagram_mermaid.md` ! 🚀**
