import "dotenv/config";
import { app } from './app.js';

const port = Number(process.env.PORT) || 3333;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// MITIGAÇÃO CONTRA SLOWLORIS:
// 1. Limita o tempo para recebimento completo dos cabeçalhos HTTP (5s)
server.headersTimeout = 5000;

// 2. Limita o tempo total de recebimento da requisição (10s)
server.requestTimeout = 10000;

// 3. Reduz o tempo de inatividade para reutilização de socket (5s)
server.keepAliveTimeout = 5000;

// 4. Limita o total de conexões simultâneas aceitas por instância
server.maxConnections = 500;
