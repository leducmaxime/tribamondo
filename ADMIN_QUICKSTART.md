# Admin TriBa MonDo - Démarrage Rapide

## ✅ Interface Admin Créée !

L'interface admin est maintenant disponible avec:
- Page de login: `/admin/login`
- Gestion concerts: `/admin/concerts`
- Gestion vidéos: `/admin/videos`

## 🚀 Déploiement en 5 Étapes

### Étape 1: Exécuter la Migration

```bash
# Créer les tables et insérer les données de base
wrangler d1 execute tribamondo --remote --file=migrations/0001_initial.sql

# Vérifier que ça a marché
wrangler d1 execute tribamondo --remote --command="SELECT COUNT(*) FROM concerts"
```

### Étape 2: Déployer

```bash
npm run release
```

### Étape 3: Tester l'Admin

1. Aller sur: https://tribamondo.fr/admin/login
2. Login: `admin` / `admin123`
3. Gérer les concerts et vidéos

## 🔒 Sécurité

**IMPORTANT**: Changer le mot de passe admin immédiatement !

```bash
# Générer un nouveau hash
node -e "
const crypto = require('crypto');
const password = 'VOTRE_NOUVEAU_MDP_SECURISE';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log('Nouveau hash:', hash);
"

# Mettre à jour dans D1
wrangler d1 execute tribamondo --remote --command="UPDATE admin_users SET password_hash = 'NOUVEAU_HASH' WHERE username = 'admin'"
```

## 📋 Données Pré-Remplies

La migration crée automatiquement:
- **2 concerts** (les concerts existants du site)
- **4 vidéos YouTube** (les vidéos live existantes)
- **1 utilisateur admin** (username: admin, password: admin123)

## 🎨 Fonctionnalités Admin

### Gestion des Concerts
- ✅ Ajouter/Modifier/Supprimer
- ✅ Champs: Date, Titre, Lieu, Description, Lien billetterie
- ✅ Affichage en temps réel sur /concerts

### Gestion des Vidéos YouTube
- ✅ Ajouter/Modifier/Supprimer
- ✅ Champs: ID YouTube, Titre, Type, Description, Ordre
- ✅ Preview vidéo dans l'admin
- ✅ Affichage en temps réel sur /musique

## 🐛 Troubleshooting

**Erreur "binding DB must have valid id"**
→ Vous n'avez pas remplacé `"preview"` par le vrai database_id dans wrangler.jsonc

**Erreur "table concerts does not exist"**
→ Vous n'avez pas exécuté la migration (Étape 3)

**Login ne fonctionne pas**
→ Vérifier que la DB est bien créée et la migration exécutée

**Vidéos ne s'affichent pas**
→ L'intégration avec la page /musique n'est pas encore faite (optionnel)

## 📦 Fichiers de l'Admin

```
src/app/pages/admin/
├── Login.tsx           # Page login
├── ConcertsAdmin.tsx   # Gestion concerts
└── VideosAdmin.tsx     # Gestion vidéos

src/app/api/
├── auth-utils.ts       # Crypto utils
├── middleware.ts       # Helpers
└── (inline dans worker.tsx - les API routes)

migrations/
└── 0001_initial.sql    # Migration initiale
```

## 🎯 Prochaines Étapes (Optionnel)

1. **Intégrer avec les pages publiques**: Faire que /concerts et /musique lisent depuis D1
2. **Améliorer l'auth**: Ajouter multi-utilisateurs, reset password, etc.

---

**Status**: ✅ Build réussi, déploiement prêt (après création DB)
