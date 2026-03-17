/**
 * Pusher stub — realtime not active.
 */
export const pusherClient = {
  subscribe: () => ({ bind: () => {}, unbind: () => {} }),
  unsubscribe: () => {},
};
