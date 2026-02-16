import type { Env } from '@/types/database';

declare global {
  var __WORKER_ENV__: Env | undefined;
}

export function setEnvMiddleware() {
  return (info: any, next: () => Response | Promise<Response>) => {
    if (!globalThis.__WORKER_ENV__ && info.env) {
      globalThis.__WORKER_ENV__ = info.env as Env;
    }
    return next();
  };
}

export function getEnv(): Env {
  if (!globalThis.__WORKER_ENV__) {
    throw new Error('Env not initialized');
  }
  return globalThis.__WORKER_ENV__;
}
