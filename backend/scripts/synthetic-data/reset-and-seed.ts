import "dotenv/config";
import { EMPRESAS, ESPERA_CONFIRMACAO_MS, SEMENTE, SENHA_PADRAO } from "./config.js";
import { Banco } from "./database.js";
import { AmbienteGuard } from "./guards.js";
import { ResetBanco } from "./reset.js";
import { AtivosSeeder } from "./seeders/ativos.js";
import { EmpresasSeeder } from "./seeders/empresas.js";
import { LocalizacoesSeeder } from "./seeders/localizacoes.js";
import { MateriaisSeeder } from "./seeders/materiais.js";
import { OrdensServicoSeeder } from "./seeders/ordens-servico.js";
import { UsuariosSeeder } from "./seeders/usuarios.js";
import type { Contexto } from "./types.js";
import { Aleatorio } from "./utils/aleatorio.js";
import { GeradorId } from "./utils/gerador-id.js";
import { Senha } from "./utils/senha.js";
import { VerificadorConsistencia } from "./verificacoes.js";

async function main(): Promise<void> {
  const { url, host } = AmbienteGuard.validar();

  console.log(`Banco alvo: ${host}`);
  console.log("Confira se este é o host da branch dev-synthetic.");
  console.log(`Apagando tudo em ${ESPERA_CONFIRMACAO_MS / 1000} segundos (Ctrl+C para cancelar)...`);
  await new Promise((resolve) => setTimeout(resolve, ESPERA_CONFIRMACAO_MS));

  const prisma = Banco.criarCliente(url);
  const ctx: Contexto = {
    prisma,
    aleatorio: new Aleatorio(SEMENTE),
    ids: new GeradorId(),
    senhaHash: await Senha.gerarHash(SENHA_PADRAO),
  };

  try {
    console.log("Limpando tabelas...");
    await new ResetBanco(prisma).executar();

    console.log("Criando empresas, usuários, localizações, ativos e materiais...");
    const empresas = await new EmpresasSeeder(ctx).executar();
    const usuarios = await new UsuariosSeeder(ctx).executar(empresas);
    const localizacoes = await new LocalizacoesSeeder(ctx).executar(empresas);
    const ativos = await new AtivosSeeder(ctx).executar(empresas, localizacoes);
    const materiais = await new MateriaisSeeder(ctx).executar(empresas);

    console.log("Simulando o ciclo de vida das ordens de serviço...");
    await new OrdensServicoSeeder(ctx).executar({ empresas, usuarios, localizacoes, ativos, materiais });

    const verificador = new VerificadorConsistencia(prisma);
    await verificador.resumo();
    await verificador.executar();

    console.log("\nLogins criados:");
    for (const empresa of EMPRESAS) {
      console.log(`  ${empresa.admin.email}  (${empresa.codigo})`);
    }
    console.log(`  Senha: ${SENHA_PADRAO}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
