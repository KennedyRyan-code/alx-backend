const createPushNotificationsJobs = (jobs, queue) => {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    // Iterate over each job and create a Kue job
    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData)
            .save((err) => {
                if (err) console.error('Error creating job:', err);
                else console.log('Notification job created:', job.id);
            });

        //Log when the job is completed or failed
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        job.on('failed', (err) => {
            console.log(`Notification job ${job.id} failed: ${err}`);
        });

        //Log when the job makes progress
        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });

    });
};