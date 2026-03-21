export const eventBus = new EventTarget();

export function pushSwarmEvent(module: string, message: string, level: 'info' | 'warn' | 'success' = 'info') {
  const detail = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    module,
    message,
    level,
    timestamp: new Date().toISOString()
  };
  eventBus.dispatchEvent(new CustomEvent('swarm-event', { detail }));
}
