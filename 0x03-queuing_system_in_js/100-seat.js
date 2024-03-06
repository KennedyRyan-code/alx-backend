import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Redis client setup
const client = redis.createClient();
const reserveSeatAsync = promisify(client.set).bind(client);
const getCurrentAvilableSeatsAsync = promisify(client.get).bind(client);

// initialize number of avilable seats to 50
reserveSeatAsync('available_seats', 50);

let reservationEnabled = true;

const queue = kue.createQueue();

// Middleware to parse JSON
app.use(express.json());

// Route to get number of available seats
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvilableSeatsAsync('available_seats');
    res.json({ numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
});

// Route to process the queue and decrease available seats
app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        const currentSeats = parseInt(await getCurrentAvailableSeatsAsync('available_seats'));
        if (currentSeats <= 0) {
            reservationEnabled = false;
            done(new Error('Not enough seats available'));
        } else {
            await reserveSeatAsync('available_seats', currentSeats - 1);
            if (currentSeats - 1 <= 0) {
                reservationEnabled = false;
            }
            done();
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});