import redis from 'redis';

client = redis.createClient();

// Listen on Connection or error
client.on("connect", () => {
    console.log('Redis client connected to the server');
});

client.on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
});