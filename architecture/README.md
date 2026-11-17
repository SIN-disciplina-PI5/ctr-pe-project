# Arquitetura — MaqControl

Modelo C4 da arquitetura do MaqControl (sistema de gestão de manutenção de ativos com assistente de IA), escrito em Structurizr DSL e visualizado localmente com Docker.

O modelo é texto (DSL), versionado em Git e revisado em pull request, como qualquer código. Os diagramas são gerados a partir dos arquivos `.dsl`, não desenhados à mão.

## Estrutura

```
architecture/
├── workspace.dsl              modelo raiz (inclui as camadas)
├── docker-compose.yml         visualizador local (Structurizr)
├── c4_layers/
│   ├── c1_context.dsl         C1: contexto (atores + sistema + externos)
│   ├── c2_containers.dsl      C2: containers
│   ├── c3_components/
│   │   ├── c3_frontend.dsl    C3: aplicativo Expo
│   │   ├── c3_backend.dsl     C3: backend (domínio)
│   │   └── c3_ai_agents.dsl   C3: camada de IA (multiagente)
│   ├── c4_deployments/
│   │   ├── local.dsl          deploy local (dev)
│   │   └── producao.dsl       deploy em produção
│   ├── relationships.dsl      relações entre elementos
│   ├── styles.dsl             cores e formas
│   └── views.dsl              as visões (diagramas)
├── docs/                      documentação (visão geral, stack, requisitos...)
│   └── adrs/                  decisões de arquitetura (ADRs)
└── README.md
```

A cor roxa destaca os componentes da camada de IA (chat, orquestrador, agentes de consulta, relatórios e troubleshooting), o restante é o domínio e a infraestrutura.

## Visões disponíveis

- **Contexto** (C1): atores, o MaqControl e os sistemas externos (provedor de LLM e fila de jobs).
- **Containers** (C2): app Expo, serviço de aplicação, banco e armazenamento de arquivos.
- **Componentes — Frontend** (C3): telas, hooks, cliente de API e sessão.
- **Componentes — Backend** (C3): segurança, middlewares, ordens de serviço e demais módulos.
- **Componentes — IA** (C3): chat, orquestrador, agentes (consulta, relatórios, troubleshooting), tools e provedor de LLM.
- **Deploy Local** e **Deploy Produção** (C4).

## Como visualizar

Pré-requisitos: Docker e um navegador.

### 1. Suba o visualizador

Na pasta `architecture/`:

```sh
docker compose up
```

> Rodamos sem `-d` para ver os avisos do Structurizr direto no terminal, o que facilita achar e corrigir erros ao editar o diagrama.

### 2. Abra o diagrama

Abra `http://localhost:8080` no navegador e navegue entre as visões.

### 3. Edite o modelo

Edite os arquivos `.dsl` em um editor, salve e atualize `http://localhost:8080` (não há recarga automática). No VS Code, a extensão `ciarant.vscode-structurizr` reconhece a sintaxe.

### 4. Pare o visualizador

```sh
docker compose down
```

## Validar e exportar sem o visualizador

Com a CLI do Structurizr (requer Java):

```sh
# valida o DSL
structurizr.sh validate -workspace workspace.dsl

# exporta para PlantUML, Mermaid, etc.
structurizr.sh export -workspace workspace.dsl -format plantuml -output ./saida
```

## Referências

- [Structurizr](https://structurizr.com/)
- [Documentação do Structurizr](https://docs.structurizr.com/)
- [Modelo C4](https://c4model.com/)
