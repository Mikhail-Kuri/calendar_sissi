# 📘 Git Cheat Sheet (Commandes essentielles)

## ⚙️ Configuration (1 seule fois)
```bash
git config --global user.name "TonNom"
git config --global user.email "tonemail@example.com"
```

---

## 📁 Initialisation / Clonage

### Initialiser un repo Git
```bash
git init
```

### Cloner un projet existant
```bash
git clone <url-du-repo>
```

---

## 📌 État du projet
```bash
git status
```

---

## ➕ Ajouter des fichiers (staging)

### Ajouter un fichier
```bash
git add fichier.txt
```

### Ajouter tous les fichiers
```bash
git add .
```

---

## 💾 Commit (sauvegarde)
```bash
git commit -m "message du commit"
```

---

## 🚀 Push (envoyer vers GitHub/GitLab)

### Première fois
```bash
git remote add origin <url>
git branch -M main
git push -u origin main
```

### Ensuite
```bash
git push
```

---

## 📥 Pull (récupérer les changements)
```bash
git pull
```

---

## 🌿 Branches

### Voir les branches
```bash
git branch
```

### Créer une branche
```bash
git branch nom-branche
```

### Changer de branche
```bash
git checkout nom-branche
```

ou
```bash
git switch nom-branche
```

### Créer + switch
```bash
git switch -c nom-branche
```

---

## 🔀 Fusion (merge)
```bash
git merge nom-branche
```

---

## 🧠 Historique
```bash
git log
```

Version courte :
```bash
git log --oneline
```

---

## ❌ Annuler / corriger

### Annuler un fichier modifié
```bash
git checkout -- fichier.txt
```

### Retirer du staging
```bash
git reset fichier.txt
```

---

## ⚡ Bonus utiles
```bash
git diff        # voir les changements
```

```bash
git stash       # mettre de côté temporairement
```

```bash
git stash pop   # récupérer les changements
```

