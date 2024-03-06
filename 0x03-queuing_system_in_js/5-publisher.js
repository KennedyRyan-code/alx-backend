import redis from 'redis';

// Create a Redis client
const publisher = redis.createClient();

// Listen for the 'connect' event
publisher.on('connect', () => {
    console.log('Redis client connected to the server');
});

// Listen for the 'error' event
publisher.on('error', (error) => {
    console.error('Redis client not connected to the server:', error);
});

// Function to publish a message after a certain time
const publishMessage = (message, time) => {
    setTimeout(() => {
        console.log(`About to send ${message}`);
        publisher.publish('holberton school channel', message);
    }, time);
};

// Publish messages with different delays
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);