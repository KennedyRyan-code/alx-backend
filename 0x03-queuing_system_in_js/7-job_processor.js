import kue from 'kue';

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
const sendNotification = (phoneNumber, message, job, done) => {
    // Track progress
    job.progress(0, 100);

    // Check if phoneNumber is blacklisted
    if (blacklistedNumbers.includes(phoneNumber)) {
        // Fail the job if blacklisted
        done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    } else {
        // Track progress to 50%
        job.progress(50, 100);

        // Log message
        console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
        done();
    }
};

// Create a Kue queue
const queue = kue.createQueue();

// Set concurrency to 2
queue.process('push_notification_code_2', 2, (job, done) => {
    // Extract phone number and message from job data
    const { phoneNumber, message } = job.data;

    // Call sendNotification function
    sendNotification(phoneNumber, message, job, done);

    // Log progress
    job.on('progress', (progress) => {
        console.log(`Notification job #${job.id} ${progress}% complete`);
    });

    // Log job completion
    job.on('complete', () => {
        console.log(`Notification job #${job.id} completed`);
    });

    // Log job failure
    job.on('failed', (err) => {
        console.log(`Notification job #${job.id} failed: ${err}`);
    });
});