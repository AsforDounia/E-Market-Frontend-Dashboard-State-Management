import redis from '../config/redis.js';
import redisCacheService from "../services/redisCacheService.js";

const cache = (keyPrefix, ttlSeconds = 300) => {
    return async (req, res, next) => {
        next();
    };
};

export default cache;
