import { RedisMemoryServer } from 'redis-memory-server';

async function bootstrap() {
  const redisServer = new RedisMemoryServer();
  await redisServer.getHost();
  const redisPort = await redisServer.getPort();

  process.env.REDIS_HOST = '127.0.0.1';
  process.env.REDIS_PORT = redisPort.toString();

  const dotenv = await import("dotenv");
  dotenv.config();
  const { app } = await import('./app.js');

  const port = Number(process.env.PORT) || 3333;

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.headersTimeout = 5000;
  server.requestTimeout = 10000;
  server.keepAliveTimeout = 5000;
  server.maxConnections = 500;

  await import('./modules/ai/queue/reportQueue.js');
  await import('./modules/ai/queue/reportWorker.js');
}

bootstrap().catch(console.error);