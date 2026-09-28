const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL;

const redis = new Redis(redisUrl, {
  // Upstash requires explicit TLS configuration
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 2) {
      console.warn('⚠️ Redis unreachable, bypassing cache...');
      return null;
    }
    return 500;
  }
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis Cache');
});

redis.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
});

module.exports = redis;