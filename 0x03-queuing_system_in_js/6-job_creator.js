import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Define job data
const jobData = {
    phoneNumber: '+254714567890',
    message: 'Hello, this is a notification message!'
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData);

// Listen for the 'enqueue' event
job.on('enqueue', (id, type) => {
    console.log(`Notification job created: ${id}`);
});

// Listen for the 'complete' event
job.on('complete', () => {
    console.log('Notification job completed');
});

// Listen for the 'failed' event
job.on('failed', () => {
    console.log('Notification job failed');
});

// Save the job to the queue
job.save();
