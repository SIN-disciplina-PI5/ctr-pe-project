import { Queue } from 'bullmq';

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const reportQueueName = 'ai-report-generation';

export const reportQueue = new Queue(reportQueueName, {
  connection: redisOptions,
});