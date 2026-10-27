import "dotenv/config";
import { EMPRESAS, ESPERA_CONFIRMACAO_MS, SEMENTE, SENHA_PADRAO } from "./config";
import { Banco } from "./database";
import { AmbienteGuard } from "./guards";
import { ResetBanco } from "./reset";
import { AtivosSeeder } from "./seeders/ativos";
import { EmpresasSeeder } from "./seeders/empresas";
import { LocalizacoesSeeder } from "./seeders/localizacoes";
import { MateriaisSeeder } from "./seeders/materiais";
import { UsuariosSeeder } from "./seeders/usuarios";
import type { Contexto } from "./types";
import { Aleatorio } from "./utils/aleatorio";
import { GeradorId } from "./utils/gerador-id";
import { Senha } from "./utils/senha";

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

    console.log("Populando o banco...");
    const empresas = await new EmpresasSeeder(ctx).executar();
    const usuarios = await new UsuariosSeeder(ctx).executar(empresas);
    const localizacoes = await new LocalizacoesSeeder(ctx).executar(empresas);
    const ativos = await new AtivosSeeder(ctx).executar(empresas, localizacoes);
    const materiais = await new MateriaisSeeder(ctx).executar(empresas);

    console.log(
      `Criados: ${empresas.length} empresas, ${usuarios.length + empresas.length} usuários, ` +
        `${localizacoes.length} localizações, ${ativos.length} ativos, ${materiais.length} materiais.`,
    );
    console.log("\nLogins:");
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
