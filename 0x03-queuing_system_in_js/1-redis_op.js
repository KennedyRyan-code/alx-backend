import redis from 'redis';

const client = redis.createClient();

client.on("connect", () => {
    console.log('Redis client connected to the server');
});

client.on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
});

// Function to set new school, display value & the value for 'Holberton'
const setNewSchool = (schoolName, value) => {
    client.set(schoolName, value, redis.print);
};

const displaySchoolValue = (schoolName) => {
    client.get(schoolName, (error, value) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log(value);
        }
    });
};

// Display thr value for 'Holberton'
displaySchoolValue('Holberton');

// Set a new school
setNewSchool('HolbertonSanFrancisco', '100');

// Display the value for HolbertonSanFrancisco
displaySchoolValue('HolbertonSanFrancisco');