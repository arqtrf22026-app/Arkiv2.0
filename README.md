# ARKIV - Sistema de Gestão Arquivística

O ARKIV é um sistema construído em HTML, Tailwind CSS (via CDN) e JavaScript puro para gerenciamento de acervos, controle de caixas e aplicação de tabelas de temporalidade.

O projeto foi migrado de uma arquitetura baseada em React/Next.js para se tornar independente de infraestrutura de terceiros, garantindo o acesso offline contínuo pelo navegador.

## 🚀 Funcionalidades Atuais

* **Dashboard de Estatísticas:** Visão geral dinâmica sobre documentos, empréstimos, e processos aguardando eliminação.
* **Gestão de Acervo:** Listagem interativa com opção de visualizar e editar detalhes do arquivo.
* **Banco de Dados Local:** Todo o salvamento é efetuado com segurança usando a API de `LocalStorage` (rodando 100% no cliente).
* **Modo Escuro (Dark Mode):** Suporte nativo ao tema escuro e claro com persistência nas preferências.

## ⚙️ Como Utilizar e Publicar no Github Pages

1. **Rodando Localmente:** Basta extrair os arquivos e dar dois cliques no `index.html`. Não é necessário iniciar nenhum servidor (Node, NPM, etc). O Javascript manipulará a interface inteira via DOM.
2. **Subindo para a Nuvem:**
   * Crie um repositório no seu GitHub.
   * Envie esses arquivos usando os comandos básicos do Git (`git init`, `git add .`, `git commit`, `git push`).
   * No Github, vá até a aba **Settings > Pages**. Selecione o "Deploy from a branch", aponte para a branch `main` e salve.
   * O sistema estará rodando com HTTPS imediatamente através da plataforma do GitHub.