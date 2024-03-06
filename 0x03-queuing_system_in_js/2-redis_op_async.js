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

// Convert client.get to a Promise-based function
const getAsync = promisify(client.get).bind(client);

const displaySchoolValue = async (schoolName) => {
    try {
        const value = await getAsync(schoolName);
        console.log(value);
    } catch (error) {
        console.error('Error', error);
    }
};

// Display thr value for 'Holberton'
displaySchoolValue('Holberton');

// Set a new school
setNewSchool('HolbertonSanFrancisco', '100');

// Display the value for HolbertonSanFrancisco
displaySchoolValue('HolbertonSanFrancisco');