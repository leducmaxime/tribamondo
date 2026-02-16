# Interface Admin TriBa MonDo - Documentation Setup

## État du Projet

### ✅ Infrastructure Backend Complète (Prête à l'emploi)

1. **Configuration D1**
   - `wrangler.jsonc` configuré avec bindings D1
   - Base de données configurée pour production
   - Database ID configuré dans `wrangler.jsonc`

2. **Migration SQL**
   - Fichier: `migrations/0001_initial.sql`
   - Tables créées: `admin_users`, `concerts`, `youtube_videos`
   - Seed data inclus: concerts existants + vidéos YouTube
   - Mot de passe admin par défaut: `admin123` (à changer!)

3. **Types TypeScript**
   - `src/types/database.ts`: Concert, YouTubeVideo, AdminUser, Env
   - `worker-configuration.d.ts`: Env avec DB: D1Database

4. **API Handlers (Créés mais non intégrés)**
   - `src/app/api/auth.ts`: Login, logout, vérification
   - `src/app/api/concerts.ts`: CRUD complet concerts
   - `src/app/api/videos.ts`: CRUD complet vidéos YouTube
   - `src/app/api/middleware.ts`: Authentification, helpers JSON
   - `src/app/api/auth-utils.ts`: Hash password, JWT generation

### ⚠️ Problème Technique Identifié

**rwsdk ne permet pas d'accéder à `env` dans les routes API de manière standard.**

Les routes définies avec `route()` reçoivent un `RequestInfo` qui ne contient pas `env`. Cela bloque l'intégration des API handlers qui nécessitent accès à D1.

### 🔧 Solutions Possibles

#### Option 1: Middleware Global (Workaround)
```typescript
// Stocker env dans globalThis au démarrage
globalThis.__TRIBAMONDO_ENV__ = env;

// Handlers appellent getEnv()
const env = getEnv();
await env.DB.prepare('SELECT ...').all();
```

**Avantages**: Fonctionne, simple  
**Inconvénients**: Global state, pas idéal mais acceptable pour Workers

#### Option 2: Admin Externe (Recommandé)
Créer un worker séparé pour l'API admin avec Hono ou itty-router.

**Avantages**: Stack éprouvée, documentation claire  
**Inconvénients**: 2 workers à déployer

#### Option 3: Server Components Uniquement
Pas d'API routes. Les pages admin sont des Server Components React qui font les requêtes D1 directement via `props.env.DB`.

**Avantages**: Simple avec rwsdk, pas de routing API  
**Inconvénients**: Auth plus complexe, moins standard

## Installation & Déploiement

### 1. Créer la Base de Données D1

```bash
# La DB tribamondo est déjà créée sur Cloudflare
# database_id configuré dans wrangler.jsonc
```

### 2. Exécuter les Migrations

```bash
# Local
wrangler d1 execute tribamondo --local --file=migrations/0001_initial.sql

# Production
wrangler d1 execute tribamondo --remote --file=migrations/0001_initial.sql
```

### 3. Vérifier les Données

```bash
# Lister les concerts
wrangler d1 execute tribamondo --local --command="SELECT * FROM concerts"

# Lister les vidéos
wrangler d1 execute tribamondo --local --command="SELECT * FROM youtube_videos"

# Vérifier admin (password hashé)
wrangler d1 execute tribamondo --local --command="SELECT username, created_at FROM admin_users"
```

### 4. Changer le Mot de Passe Admin

```bash
# Générer un nouveau hash SHA-256 pour un nouveau mot de passe
# Utiliser un script Node.js:
node -e "
const crypto = require('crypto');
const password = 'votre_nouveau_mdp_securise';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
"

# Mettre à jour dans D1
wrangler d1 execute tribamondo --command="UPDATE admin_users SET password_hash = 'NOUVEAU_HASH' WHERE username = 'admin'"
```

### 5. Build & Deploy

```bash
# Build local
npm run build

# Test local
npm run dev

# Deploy production
npm run release
```

## Structure des Fichiers Créés

```
tribamondo/
├── migrations/
│   └── 0001_initial.sql          # Migration initiale
├── src/
│   ├── types/
│   │   └── database.ts            # Interfaces TypeScript
│   └── app/
│       └── api/
│           ├── auth.ts            # Handlers authentification
│           ├── concerts.ts        # Handlers CRUD concerts
│           ├── videos.ts          # Handlers CRUD vidéos
│           ├── middleware.ts      # Helpers auth + JSON
│           ├── auth-utils.ts      # Crypto utils
│           └── env-middleware.ts  # Workaround env global
├── wrangler.jsonc                 # Config D1 ajoutée
├── worker-configuration.d.ts      # Types Env avec DB
├── RWSDK_D1_ISSUE.md             # Documentation du problème technique
└── ADMIN_SETUP.md                # Ce fichier

```

## Prochaines Étapes (Choix Utilisateur)

### Choix A: Continuer avec rwsdk + Workaround
1. Activer middleware global pour env
2. Créer pages admin React (client-side)
3. Intégrer routes API dans worker.tsx avec wrappers
4. Tester et déployer

**Effort**: ~4-6h supplémentaires

### Choix B: Admin Externe Séparé
1. Créer nouveau projet avec Hono
2. Copier les handlers API existants
3. Déployer sur Cloudflare Workers séparé
4. Configurer CORS si nécessaire

**Effort**: ~2-3h

### Choix C: Garder Données Hardcodées
1. Ne pas utiliser D1 pour l'instant
2. Modifier concerts/vidéos en éditant directement le code
3. Admin D1 à implémenter plus tard séparément

**Effort**: 0h (état actuel)

## API Routes Disponibles (Non Intégrées)

Une fois le problème rwsdk+env résolu, ces endpoints seront disponibles:

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Vérifier session

### Concerts
- `GET /api/concerts` - Liste tous les concerts
- `POST /api/concerts` - Créer concert (auth requise)
- `GET /api/concerts/:id` - Détails concert
- `PUT /api/concerts/:id` - Modifier concert (auth requise)
- `DELETE /api/concerts/:id` - Supprimer concert (auth requise)

### Vidéos YouTube
- `GET /api/videos` - Liste toutes les vidéos
- `POST /api/videos` - Créer vidéo (auth requise)
- `GET /api/videos/:id` - Détails vidéo
- `PUT /api/videos/:id` - Modifier vidéo (auth requise)
- `DELETE /api/videos/:id` - Supprimer vidéo (auth requise)

## Sécurité

- ✅ Passwords hashés avec SHA-256
- ✅ Tokens JWT avec expiration 24h
- ✅ Cookies HttpOnly, Secure, SameSite=Strict
- ✅ Prepared statements (protection SQL injection)
- ⚠️ Mot de passe par défaut: `admin123` - **CHANGER IMMÉDIATEMENT**
- ⚠️ HTTPS obligatoire en production

## Support

Pour toute question ou problème:
1. Consulter `RWSDK_D1_ISSUE.md` pour le problème technique rwsdk
2. Vérifier les logs Wrangler: `wrangler tail`
3. Tester requêtes D1: `wrangler d1 execute tribamondo --local --command="..."`
4. Consulter la documentation Cloudflare D1: https://developers.cloudflare.com/d1/
