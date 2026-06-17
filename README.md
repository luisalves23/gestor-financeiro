# Gestor Financeiro

Aplicativo de planejamento financeiro pessoal desenvolvido para organizar receitas flutuantes e projetar metas diárias de ganho.

## Diário de Bordo

### 16/06/2026 | 22:00

- **Etapa:** Configuração da documentação inicial do projeto.
- **O que foi feito:** Colei a estrutura inicial da documentação e preparei o repositório para receber os arquivos de código.
- **Commit Realizado:** docs: formaliza estrutura inicial do diário de bordo no readme
- **Raciocínio:** Estou estruturando o diário de bordo para registrar cada passo da minha aplicação, garantindo total portabilidade entre o computador e o tablet. Dessa forma, mantenho um histórico organizado do que estou fazendo aqui antes de avançar para a integração com a Vercel.

### 16/06/2026 | 22:05

- **Etapa:** Vinculação com o ambiente de produção na Vercel.
- **O que foi feito:** Realizei a importação do repositório do GitHub dentro da Vercel e ativei o pipeline de deploy contínuo.
- **Commit Realizado:** ci: conecta repositório à esteira de deploy da vercel
- **Raciocínio:** Essa integração garante que o projeto fique online imediatamente. A partir de agora, cada nova alteração salva no GitHub será publicada de forma automática pela Vercel, permitindo validar as atualizações em tempo real diretamente pelo navegador ou tablet.

### 16/06/2026 | 22:25

- **Etapa:** Migração para IDE profissional e separação de responsabilidades via CLI.
- **O que foi feito:** Inicializei o GitHub Codespaces, utilizei o terminal para criar a estrutura modular (HTML, CSS e JS) e preparei a base semântica da aplicação.
- **Commit Realizado:** build: configura codespaces e estrutura modular de arquivos
- **Raciocínio:** O uso do terminal eleva o controle sobre o projeto. Separei as responsabilidades do código logo no início para evitar dívida técnica. O HTML agora serve apenas de esqueleto, conectando-se a um arquivo de estilo e a um de lógica isolados, seguindo as melhores práticas do mercado.

### 16/06/2026 | 22:35

- **Etapa:** Construção dos tokens de design globais e do card de saldo principal.
- **O que foi feito:** Estabeleci as variáveis de CSS para padronizar cores e bordas, e construí a estrutura semântica do cartão de Visão Geral no HTML com identificadores para futura injeção de dados.
- **Commit Realizado:** feat: cria variaveis globais de css e estrutura o componente de saldo
- **Raciocínio:** Começar o estilo por variáveis globais garante que a identidade visual se mantenha consistente ao longo do desenvolvimento. Os identificadores (IDs) colocados no HTML já preparam o arquivo para receber os cálculos dinâmicos da lógica que controlará a flutuação do meu ganho diário.

### 16/06/2026 | 22:50

- **Etapa:** Refatoração de Design System e implementação de Responsividade.
- **O que foi feito:** Pausei a rota anterior para substituir a paleta de cores por tons baseados no dashboard de referência (azul vibrante e cinza suave). Introduzi a regra de `@media query` para transformar o layout fluido.
- **Commit Realizado:** style: aplica novo design system e adapta layout para desktop e tablet
- **Raciocínio:** Percebi que a aplicação estava travada com larguras fixas de celular, o que prejudicaria a usabilidade no meu tablet e PC. Refatorei o CSS implementando o conceito de Mobile First com CSS Grid. Ao ultrapassar 800px de largura de tela, o sistema reorganiza a visão geral e as tabelas lado a lado de forma automática.

### 16/06/2026 | 23:05
* **Etapa:** Desestruturação de estado (Parte 1 de 3) - Limpeza e Fundação.
* **O que foi feito:** Removi os dados fixos das tabelas no arquivo HTML, deixando os contêineres vazios e prontos para injeção. No JavaScript, criei as variáveis de estado (`transactions` e `bills`) e referenciei os elementos do DOM.
* **Commit Realizado:** refactor: limpa dados estaticos do html e estabelece estado inicial no js
* **Raciocínio:** Optei por dividir a implementação dinâmica da tela em commits atômicos de no máximo 30 linhas. Este primeiro passo cria a ponte entre a interface e os dados puros (estado), sem misturar a lógica de montagem visual, o que facilita manutenções futuras e revisões de código.