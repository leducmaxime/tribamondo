# Problème d'intégration rwsdk + D1

## Problème

rwsdk ne semble pas exposer `env` dans les routes API via `RequestInfo`. Les routes définies avec `route()` reçoivent un `RequestInfo` qui contient:
- `request: Request`
- `params: Record<string, string>`

Mais PAS de `env` directement accessible.

## Solutions possibles

### Option 1: Utiliser un middleware global (RECOMMANDÉ)

Créer un middleware qui injecte env dans globalThis au début de chaque requête.

**Avantages**: Simple, fonctionne avec rwsdk  
**Inconvénients**: Global state (mais acceptable pour Workers)

### Option 2: Passer env via React Server Components

Puisque les pages React peuvent recevoir env via props, on peut:
1. Garder toutes les données hardcodées dans les pages
2. Les pages appellent directement D1 via `props.env.DB`
3. L'admin utilise des Server Actions ou des API routes externes

**Avantages**: Pas de conflit avec rwsdk  
**Inconvénients**: Admin doit être en client-side uniquement

### Option 3: Utiliser un autre framework pour l'API

Créer un worker séparé pour l'API admin avec Hono/itty-router qui gère bien D1.

**Avantages**: Stack éprouvé pour API + D1  
**Inconvénients**: 2 workers à déployer

## Recommandation

Je recommande **Option 1** avec quelques ajustements:

1. Créer un middleware qui capture `env` au démarrage
2. Stocker dans `globalThis.__WORKER_ENV__`
3. Les handlers API y accèdent via `getEnv()`

**OU**

**Option 2 simplifiée**: Pas d'API routes du tout. Les pages admin sont des Server Components qui:
- Lisent D1 directement (SELECT)
- Utilisent des formulaires HTML avec `action` POST vers des Server Actions

Ceci évite complètement le problème de routing API.

## Prochaines étapes

Quelle approche préférez-vous?

1. Je continue avec globalThis middleware (Option 1)
2. Je retire les API routes et utilise Server Components + Server Actions (Option 2)
3. Je documente tout et vous laissez choisir comment intégrer

