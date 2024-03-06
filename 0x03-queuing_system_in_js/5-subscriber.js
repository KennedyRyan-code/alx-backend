import redis from 'redis';

const subscriber = redis.createClient();

// Listen for the connection and error
subscriber.on('connect', () => {
    console.log('Redis client connected to the server');
});

subscriber.on('error', (error) => {
    console.error('Redis client not connected to the server:', error);
});

// Subscribe to the 'holberton school channel'
subscriber.subscribe('holberton school channel');

// Listen for messages on the 'holberton school channel'
subscriber.on('message', (channel, message) => {
    console.log(message);
    if (message === 'KILL_SERVER') {
        subscriber.unsubscribe('holberton school channel');
        subscriber.quit();
    }
});