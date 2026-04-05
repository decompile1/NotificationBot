import { Redis } from "ioredis";

import config from "../config";

const redis = new Redis(config.redisString as string);

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("close", () => {
    console.log("Redis connection closed");
});

export default redis;