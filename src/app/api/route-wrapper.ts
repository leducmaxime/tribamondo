import type { Env } from '@/types/database';

export const apiRoute = <T extends unknown[]>(
  handler: (request: Request, env: Env, ...args: T) => Promise<Response>
) => {
  return (info: any) => {
    const request = info.request || info;
    const env = (globalThis as any).__ENV__;
    return handler(request, env, ...((info.params ? [info.params] : []) as T));
  };
};
