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

### 16/06/2026 | 22:57

- **Etapa:** Desestruturação de estado (Parte 1 de 3) - Limpeza e Fundação.
- **O que foi feito:** Removi os dados fixos das tabelas no arquivo HTML, deixando os contêineres vazios e prontos para injeção. No JavaScript, criei as variáveis de estado (`transactions` e `bills`) e referenciei os elementos do DOM.
- **Commit Realizado:** refactor: limpa dados estaticos do html e estabelece estado inicial no js
- **Raciocínio:** Optei por dividir a implementação dinâmica da tela em commits atômicos de no máximo 30 linhas. Este primeiro passo cria a ponte entre a interface e os dados puros (estado), sem misturar a lógica de montagem visual, o que facilita manutenções futuras e revisões de código.

### 16/06/2026 | 23:00

- **Etapa:** Desestruturação de estado (Parte 2 de 3) Injeção de Movimentações.
- **O que foi feito:** Criei a função `renderTransactions` no JavaScript para iterar sobre o array de estado e construir as linhas da tabela dinamicamente no HTML.
- **Commit Realizado:** feat: implementa renderizacao dinamica da lista de movimentacoes
- **Raciocínio:** Isolar a renderização desta tabela em um commit único garante que a lógica de formatação de moeda e a aplicação de classes CSS para o status sejam testadas e validadas antes de avançarmos para o próximo bloco de dados.

### 17/06/2026 | 10:17

- **Etapa:** Desestruturação de estado (Parte 3 de 3) Injeção de Contas Registradas.
- **O que foi feito:** Desenvolvi a função `renderBills` no JavaScript para processar o array de contas e atualizar a função de inicialização para desenhar ambas as tabelas simultaneamente ao carregar a página.
- **Commit Realizado:** feat: implementa renderizacao dinamica da lista de contas
- **Raciocínio:** Fechamos o ciclo de renderização dinâmica. Agora as duas tabelas dependem exclusivamente dos arrays de estado no JavaScript. Isso significa que qualquer cálculo futuro do motor financeiro terá os dados puros à disposição na memória, sem precisar raspar informações estruturais do HTML.

### 17/06/2026 | 10:26

- **Etapa:** Desenvolvimento do motor matemático de projeção diária.
- **O que foi feito:** Desenvolvi a função `calculateDailyTarget` utilizando os métodos `filter` e `reduce` para processar o saldo líquido atual e projetar a meta de faturamento diário baseada nos passivos em aberto.
- **Commit Realizado:** feat: implementa motor de calculo e projecao da meta diaria
- **Raciocínio:** O núcleo inteligente da aplicação foi consolidado. O cálculo lê os dados vivos do estado, eliminando a necessidade de atualizar os saldos do topo manualmente. Utilizei a função de arredondamento para cima para garantir que a meta cubra os centavos dos passivos de forma segura.

### 17/06/2026 | 10:29

- **Etapa:** Captura de eventos de clique e mutação de estado dinâmico.
- **O que foi feito:** Desenvolvi a função `handleAddRevenue` associada ao evento `click` do botão de inserção, permitindo injetar novas receitas no array de transações em tempo real.
- **Commit Realizado:** feat: adiciona escutador de eventos para insercao de novas receitas
- **Raciocínio:** Este passo valida a reatividade da aplicação. Ao isolar a lógica de captação de dados numa função que dispara os gatilhos de renderização e cálculo sequencialmente, garanto que o utilizador veja o seu saldo subir e a sua meta diária descer no exato segundo em que finaliza o lançamento.

### 17/06/2026 | 10:37

- **Etapa:** Reestruturação do fluxo de entrada (Parte 1 de 4) - Estrutura do Card Semântico.
- **O que foi feito:** Eliminei o uso de prompts nativos e criei a estrutura HTML do `transaction-form-card`, dividida em duas etapas de captura (valor e categoria) com campos específicos de entrada.
- **Commit Realizado:** feat: estrutura esqueleto do formulario dinâmico em etapas no html
- **Raciocínio:** Substituir caixas de diálogo nativas por componentes inline é essencial para a maturidade do produto. Dividi o formulário em blocos lógicos (`form-step`) para permitir que a interface guie o usuário de forma minimalista, preparando o documento para receber a estilização condicional nas próximas etapas.

### 17/06/2026 | 10:50

- **Etapa:** Reestruturação do fluxo de entrada (Parte 2 de 4) - Estilização Condicional.
- **O que foi feito:** Desenvolvi as classes de estilo para o card de formulário, implementando modificadores visuais (`state-revenue` e `state-expense`) e a estilização do botão circular de avanço.
- **Commit Realizado:** style: implementa classes de estado visual e transições para o formulario
- **Raciocínio:** Isolei a camada de estilo para garantir que o componente se transforme de forma elegante. Ao utilizar herança de classes do CSS (como `.state-revenue .btn-next-step`), permito que a cor da seta e do botão de submissão mude de forma automática na tela apenas alterando a classe pai via JavaScript, mantendo a folha de estilos limpa e modular.

### 17/06/2026 | 10:56

- **Etapa:** Reestruturação do fluxo de entrada (Parte 3 de 4) - Catálogo de Categorias.
- **O que foi feito:** Defini o objeto `categoriesData` com 10 categorias mapeadas para cada tipo de transação e criei a função `populateCategories` junto ao evento de escuta do select.
- **Commit Realizado:** feat: implementa catalogo de categorias e logica de expansao inline
- **Raciocínio:** Isolar os dados das categorias num objeto estruturado permite alternar as opções exibidas de forma dinâmica sem duplicar elementos no HTML. O ouvinte de alteração (`change`) monitoriza a escolha do utilizador e exibe o campo oculto para categorias não catalogadas de forma condicional, mantendo a interface limpa.

### 17/06/2026 | 11:03

- **Etapa:** Reestruturação do fluxo de entrada (Parte 4 de 4) - Controle de Fluxo e Consolidação.
- **O que foi feito:** Desenvolvi as funções `openTransactionForm`, `handleNextStep` e `handleFinalizeTransaction`, acoplando os escutadores de eventos para gerir a máquina de estados do formulário inline.
- **Commit Realizado:** feat: consolida controle de etapas e salvamento do formulario dinamico
- **Raciocínio:** Concluí a substituição dos prompts nativos. O formulário agora opera em duas etapas isoladas dentro da própria interface: valida o valor na primeira tela, carrega as categorias corretas na segunda e injeta o objeto final no array de movimentações. Isso garante uma experiência totalmente integrada e fluida para o uso diário no computador ou tablet.

### 17/06/2026 | 11:20

- **Etapa:** Ajuste lógico de exibição e encerramento para arquitetura Overlay Modal.
- **O que foi feito:** Atualizei a função `openTransactionForm` para utilizar display flexível, criei a função de descarte `closeTransactionForm` e adicionei um escutador de eventos no fundo desfocado para encerramento automático.
- **Commit Realizado:** feat: adapta fluxo javascript para fechar modal e renderizar flexbox
- **Raciocínio:** Integrar o CSS flutuante exigiu repensar o controle da interface no JS. Utilizar `display: flex` assegura que o card flutue no centro geométrico de qualquer tela. O novo evento de escuta verifica a origem do clique (`e.target === transactionFormContainer`); se o usuário clicar no fundo escuro, a aplicação entende que ele desistiu do preenchimento, esvazia as variáveis de fluxo e oculta a tela de forma segura sem lançar dados corrompidos.

### 17/06/2026 | 11:30

- **Etapa:** Implementação de Persistência de Dados (Local Storage).
- **O que foi feito:** Substituí as variáveis estáticas do estado por chamadas ao `localStorage`, criei os arrays de fallback `defaultTransactions` e `defaultBills`, e introduzi a função `saveData()` para registrar mutações no disco do navegador.
- **Commit Realizado:** feat: implementa persistencia de dados no local storage
- **Raciocínio:** Para que o MVP seja utilizável na rua, os dados não podem viver apenas na memória volátil (RAM). Ao transformar os objetos JavaScript em strings JSON e gravá-los no armazenamento local do browser, garantimos que o usuário possa fechar a aba, desligar a tela e, ao retornar, todo o seu caixa e passivos estejam perfeitamente preservados.

### 17/06/2026 | 11:45

- **Etapa:** Funcionalidade de Exclusão (Parte 1 de 2) - Interface de Ação.
- **O que foi feito:** Substituí a seta estática decorativa nas tabelas por botões semânticos de exclusão ('✖'). Utilizei o atributo `data-id` nos botões do JS e implementei o feedback visual no CSS.
- **Commit Realizado:** style: adiciona botoes interativos de exclusao nas listas de dados
- **Raciocínio:** O atributo `data-id` que coloquei em cada botão de exclusão injetado pelo JavaScript será vital no próximo passo. Ele embute a "identidade" daquela transação diretamente no código HTML, permitindo que a função de apagar saiba exatamente qual objeto do array deve ser aniquilado.

### 17/06/2026 | 11:55

- **Etapa:** Funcionalidade de Exclusão (Parte 2 de 2) - Lógica de Deleção e Delegação de Eventos.
- **O que foi feito:** Criei a função `handleDelete` no JavaScript utilizando o método `filter` para varrer os arrays e remover objetos com base no `data-id`. Implementei o padrão de Delegação de Eventos (`Event Delegation`) nas listas de transações e contas.
- **Commit Realizado:** feat: implementa logica de exclusao e sincroniza mutacao com local storage
- **Raciocínio:** Como os botões são gerados e destruídos a todo momento pela renderização, aplicar um ouvinte de clique diretamente em cada botão geraria vazamento de memória. Ao invés disso, coloquei um único ouvinte na div pai da tabela. Quando ocorre um clique, o sistema verifica se o alvo possui a classe `.btn-delete`, realiza a exclusão através de filtro inverso, salva o novo estado no `localStorage` e redesenha a tela instantaneamente.

### 17/06/2026 | 11:21
* **Etapa:** Sincronização Avançada de Animações do Modal.
* **O que foi feito:** Criei a animação `@keyframes backdropFadeIn` e a vinculei à classe `.transaction-form-card` para suavizar a entrada do desfoque e opacidade escura. Ajustei o comportamento do card interno para usar uma curva elástica de surgimento.
* **Commit Realizado:** style: sincroniza animacao do desfoque de fundo com a entrada do modal
* **Raciocínio:** Descobri que a alternância abrupta de estados via JS quebrava a suavidade dos efeitos de desfoque. Ao delegar o fade-in do background e o blur gaussiano diretamente para uma animação em CSS disparada no nascimento do nó, o plano de fundo recua de forma cinematográfica no exato milissegundo em que o card de dados surge na tela, garantindo o visual limpo exigido para o tablet.