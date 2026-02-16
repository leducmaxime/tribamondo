# Interface Admin TriBa MonDo - Suite de l'implémentation

## État actuel

✅ **Backend complet**: DB config, migrations, types, API handlers  
⏳ **Frontend à créer**: Pages admin React, intégration routes, adaptation pages existantes

## Fichiers à créer manuellement

En raison de la complexité, voici les fichiers restants à créer. Je recommande de me demander de continuer ou de les créer un par un.

### 1. Intégrer routes API dans worker.tsx

Ajouter au début de worker.tsx (après les imports):

```typescript
import { handleLogin, handleLogout, handleAuthCheck } from '@/app/api/auth';
import { handleConcerts, handleConcert } from '@/app/api/concerts';
import { handleVideos, handleVideo } from '@/app/api/videos';
```

Dans `defineApp([...])`, ajouter AVANT les routes `route("/sitemap.xml", ...)`:

```typescript
export default defineApp([
  setCommonHeaders(),
  
  route("/api/auth/login", handleLogin),
  route("/api/auth/logout", handleLogout),
  route("/api/auth/check", handleAuthCheck),
  
  route("/api/concerts", handleConcerts),
  route("/api/concerts/:id", ({ request, env, params }) => handleConcert(request, env, params.id)),
  
  route("/api/videos", handleVideos),
  route("/api/videos/:id", ({ request, env, params }) => handleVideo(request, env, params.id)),
  
  // ... routes existantes
]);
```

### 2. Page Admin Login (client component)

Fichier: `src/app/pages/admin/Login.tsx`

```typescript
"use client";
import { useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin/concerts";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-black/50 p-8 backdrop-blur-sm">
        <h1 className="font-display text-4xl font-bold text-center mb-8">
          Admin <span className="text-primary">Login</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-950/30 px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 3. Page Admin Concerts

Fichier: `src/app/pages/admin/ConcertsAdmin.tsx` (TRÈS LONG - environ 200 lignes)

Contient:
- Liste des concerts avec boutons Edit/Delete
- Formulaire add/edit avec tous les champs
- Vérification auth au mount
- CRUD complet

### 4. Page Admin Videos

Fichier: `src/app/pages/admin/VideosAdmin.tsx` (similaire à ConcertsAdmin)

### 5. Adapter Concerts.tsx

Remplacer l'array hardcodé par une requête D1.

### 6. Adapter Musique.tsx

Remplacer l'array tracks par une requête D1.

## Déploiement

Une fois tout créé:

```bash
# 1. Créer la DB D1
wrangler d1 create tribamondo
# Copier le database_id et mettre à jour wrangler.jsonc

# 2. Exécuter migration
wrangler d1 execute tribamondo --file=migrations/0001_initial.sql --local

# 3. Build
npm run build

# 4. Tester local
npm run dev

# 5. Deploy production
npm run release
```

## Prochaines étapes

Voulez-vous que je:
1. Continue à créer tous les fichiers restants?
2. Crée les fichiers un par un (vous demandez, je crée)?
3. Vous donne juste les templates et vous les créez?
