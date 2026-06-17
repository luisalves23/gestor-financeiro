# Gestor Financeiro

Aplicativo de planejamento financeiro pessoal desenvolvido para organizar receitas flutuantes e projetar metas diárias de ganho.

## Diário de Bordo

### 16/06/2026 | 22:00
* **Etapa:** Configuração da documentação inicial do projeto.
* **O que foi feito:** Colei a estrutura inicial da documentação e preparei o repositório para receber os arquivos de código.
* **Commit Realizado:** docs: formaliza estrutura inicial do diário de bordo no readme
* **Raciocínio:** Estou estruturando o diário de bordo para registrar cada passo da minha aplicação, garantindo total portabilidade entre o computador e o tablet. Dessa forma, mantenho um histórico organizado do que estou fazendo aqui antes de avançar para a integração com a Vercel.

### 16/06/2026 | 22:05
* **Etapa:** Vinculação com o ambiente de produção na Vercel.
* **O que foi feito:** Realizei a importação do repositório do GitHub dentro da Vercel e ativei o pipeline de deploy contínuo.
* **Commit Realizado:** ci: conecta repositório à esteira de deploy da vercel
* **Raciocínio:** Essa integração garante que o projeto fique online imediatamente. A partir de agora, cada nova alteração salva no GitHub será publicada de forma automática pela Vercel, permitindo validar as atualizações em tempo real diretamente pelo navegador ou tablet.

### 16/06/2026 | 22:25
* **Etapa:** Migração para IDE profissional e separação de responsabilidades via CLI.
* **O que foi feito:** Inicializei o GitHub Codespaces, utilizei o terminal para criar a estrutura modular (HTML, CSS e JS) e preparei a base semântica da aplicação.
* **Commit Realizado:** build: configura codespaces e estrutura modular de arquivos
* **Raciocínio:** O uso do terminal eleva o controle sobre o projeto. Separei as responsabilidades do código logo no início para evitar dívida técnica. O HTML agora serve apenas de esqueleto, conectando-se a um arquivo de estilo e a um de lógica isolados, seguindo as melhores práticas do mercado.