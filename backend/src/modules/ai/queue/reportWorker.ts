import { Worker, Job } from 'bullmq';
import { reportQueueName } from './reportQueue.js';

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const reportWorker = new Worker(
  reportQueueName,
  async (job: Job) => {
    console.log(`[Worker] A processar o pedido de relatório ID: ${job.id}`);
    
   
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    return { success: true, status: 'done', fileUrl: 'https://simulacao.com/relatorio.pdf' };
  },
  { connection: redisOptions }
);

reportWorker.on('completed', (job) => {
  console.log(`[Worker] Relatório ${job.id} gerado com sucesso!`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`[Worker] Falha ao processar relatório ${job?.id}: ${err.message}`);
});