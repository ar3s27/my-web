import { createClient } from 'redis';

// Redis is an optional cache/store here: every caller has a fallback (the JSON
// files under src/data) or returns an error response. Redis access must
// therefore fail fast instead of hanging. node-redis would otherwise queue
// commands forever while it keeps trying to reconnect to an unreachable
// server, and the callers' fallbacks would never run.

const CONNECT_TIMEOUT_MS = 3000; // max wait for a usable connection
const COMMAND_TIMEOUT_MS = 2000; // max wait for a single GET/SET
const RETRY_COOLDOWN_MS = 15000; // skip Redis for this long after a failed connect
const MAX_RECONNECT_RETRIES = 2; // then give up; the next request starts a fresh connect

type RedisClient = ReturnType<typeof createClient>;

interface RedisState {
  client?: RedisClient;
  connecting?: Promise<void>;
  retryAfter: number;
}

const globalForRedis = global as unknown as { redisState?: RedisState };
const state: RedisState = globalForRedis.redisState ?? { retryAfter: 0 };
globalForRedis.redisState = state;

function getOrCreateClient(): RedisClient {
  if (!state.client) {
    const client = createClient({
      url: process.env.REDIS_URL,
      // Reject commands right away while disconnected instead of queueing them.
      disableOfflineQueue: true,
      socket: {
        connectTimeout: CONNECT_TIMEOUT_MS,
        reconnectStrategy: (retries) =>
          retries >= MAX_RECONNECT_RETRIES
            ? new Error(`Redis unreachable after ${retries + 1} attempts`)
            : Math.min(100 * 2 ** retries, 1000),
      },
    });
    client.on('error', (err) => console.warn('Redis Client Error:', err?.message ?? err));
    state.client = client;
  }
  return state.client;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function getReadyClient(): Promise<RedisClient> {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not set');
  }

  const client = getOrCreateClient();
  if (client.isReady) return client;

  if (Date.now() < state.retryAfter) {
    throw new Error('Redis unavailable (recent connection attempt failed)');
  }

  if (!client.isOpen) {
    const connecting = client.connect().then(() => undefined);
    // Avoid an unhandled rejection if nobody is awaiting it any more.
    connecting.catch(() => undefined);
    state.connecting = connecting;
  }

  try {
    await withTimeout(state.connecting ?? Promise.resolve(), CONNECT_TIMEOUT_MS, 'Redis connect');
  } catch (err) {
    state.retryAfter = Date.now() + RETRY_COOLDOWN_MS;
    throw err;
  }

  if (!client.isReady) {
    // e.g. the connection dropped and node-redis is reconnecting in the background
    throw new Error('Redis connection is not ready');
  }
  return client;
}

async function get(key: string): Promise<string | null> {
  const client = await getReadyClient();
  const value = await withTimeout(client.get(key), COMMAND_TIMEOUT_MS, `Redis GET ${key}`);
  return value === null ? null : String(value);
}

async function set(key: string, value: string): Promise<void> {
  const client = await getReadyClient();
  await withTimeout(client.set(key, value), COMMAND_TIMEOUT_MS, `Redis SET ${key}`);
}

// Only GET and SET are used in this app. Both throw (quickly) when Redis is
// unreachable, so callers' try/catch fallbacks keep working.
const redis = { get, set };

export default redis;
