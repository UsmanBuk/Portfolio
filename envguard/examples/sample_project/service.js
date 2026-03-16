const redisUrl = process.env.REDIS_URL;
const analyticsKey = process.env["ANALYTICS_KEY"];

if (!redisUrl || !analyticsKey) {
  throw new Error("Missing environment configuration");
}

console.log("Service config loaded");

