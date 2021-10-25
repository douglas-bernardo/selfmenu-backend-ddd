import { RedisOptions } from 'ioredis';

interface ICacheConfig {
    driver: 'redis';

    config: {
        redis: RedisOptions;
    };
}

export default {
    driver: 'redis',

    config: {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASS || undefined,
            db: 0,
            keyPrefix: '',
            tls: {
                host: process.env.REDIS_HOST,
                rejectUnauthorized: false,
            },
            reconnectOnError: () => 1,
        },
    },
} as ICacheConfig;
