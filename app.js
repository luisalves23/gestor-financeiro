// ==========================================
// 1. ESTADO INICIAL DA APLICAÇÃO
// ==========================================
let transactions = [
  {
    id: 1,
    type: "expense",
    amount: 20.0,
    status: "pendente",
    description: "Combustível",
  },
  {
    id: 2,
    type: "revenue",
    amount: 120.0,
    status: "recebido",
    description: "Diária Uber",
  },
];

let bills = [
  { id: 1, amount: 1080.0, status: "pendente", description: "Aluguel" },
  { id: 2, amount: 800.0, status: "pago", description: "Alimentação" },
];

// Dicionários de Categorias Catalogadas (10 para entrada / 10 para saída)
const categoriesData = {
  revenue: [
    "Corrida Uber",
    "Viagem InDrive",
    "Entrega Frete",
    "Particular",
    "Freelance Dev",
    "Design Freelance",
    "Gorjeta",
    "Bónus Plataforma",
    "Reembolso",
    "Outra...",
  ],
  expense: [
    "Combustível",
    "Alimentação Rua",
    "Mecânica / Revisão",
    "Lava Jato",
    "Pedágio",
    "Internet / Celular",
    "Seguro Auto",
    "Estacionamento",
    "Equipamento",
    "Outra...",
  ],
};

// Variáveis de controle de fluxo do formulário interno
let currentFormType = "";
let tempAmount = 0;

// ==========================================
// 2. MAPEAMENTO DE ELEMENTOS DO DOM
// ==========================================
const transactionsList = document.getElementById("transactions-list");
const billsList = document.getElementById("bills-list");

const transactionFormContainer = document.getElementById(
  "transaction-form-container",
);
const formTitleText = document.getElementById("form-title-text");
const selectCategory = document.getElementById("select-category");
const customCategoryWrapper = document.getElementById(
  "custom-category-wrapper",
);

const btnAddRevenue = document.getElementById("btn-add-revenue");
const btnAddExpense = document.getElementById("btn-add-expense");
const btnNextToCategory = document.getElementById("btn-next-to-category");
const btnFinalizeTransaction = document.getElementById(
  "btn-finalize-transaction",
);
const inputAmount = document.getElementById("input-amount");
const inputCustomCategory = document.getElementById("input-custom-category");
const formStep1 = document.getElementById("form-step-1");
const formStep2 = document.getElementById("form-step-2");

// ==========================================
// 3. FUNÇÕES UTILITÁRIAS E MOTORES DE CÁLCULO
// ==========================================

// Formata valores numéricos para a moeda padrão Real (BRL)
const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// Processa o saldo vivo e projeta a meta diária necessária
const calculateDailyTarget = () => {
  const totalPendingBills = bills
    .filter((bill) => bill.status === "pendente")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const currentBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === "revenue"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  const daysRemaining = 15; // Fixado para estruturação do MVP linear

  const targetValue =
    daysRemaining > 0
      ? Math.ceil((totalPendingBills - currentBalance) / daysRemaining)
      : 0;

  document.getElementById("current-balance").innerText =
    formatCurrency(currentBalance);
  document.getElementById("daily-target").innerText =
    `Meta: ${formatCurrency(targetValue)} por dia`;
};

// ==========================================
// 4. FUNÇÕES DE RENDERIZAÇÃO GRÁFICA
// ==========================================

// Renderiza dinamicamente a tabela de movimentações diárias
const renderTransactions = () => {
  transactionsList.innerHTML = `
        <div class="table-row header">
            <div>Valor</div>
            <div>Status</div>
            <div>Descrição</div>
            <div></div>
        </div>
    `;

  transactions.forEach((transaction) => {
    const isExpense = transaction.type === "expense";
    const sign = isExpense ? "-" : "+";
    const statusText =
      transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);

    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
            <div>${sign} ${formatCurrency(transaction.amount)}</div>
            <div><span class="badge ${transaction.status}">${statusText}</span></div>
            <div>${transaction.description}</div>
            <div class="arrow">▼</div>
        `;
    transactionsList.appendChild(row);
  });
};

// Renderiza dinamicamente a tabela de passivos fixos (Contas)
const renderBills = () => {
  billsList.innerHTML = `
        <div class="table-row header">
            <div>Valor</div>
            <div>Status</div>
            <div>Descrição</div>
            <div></div>
        </div>
    `;

  bills.forEach((bill) => {
    const statusText =
      bill.status.charAt(0).toUpperCase() + bill.status.slice(1);

    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
            <div>${formatCurrency(bill.amount)}</div>
            <div><span class="badge ${bill.status}">${statusText}</span></div>
            <div>${bill.description}</div>
            <div class="arrow">▼</div>
        `;
    billsList.appendChild(row);
  });
};

// ==========================================
// 5. MÁQUINA DE ESTADOS DO FORMULÁRIO DINÂMICO
// ==========================================

// Injeta as opções do select dinamicamente com base no tipo de operação
const populateCategories = (type) => {
  const list = categoriesData[type];
  selectCategory.innerHTML = "";

  list.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectCategory.appendChild(option);
  });
};

// Configura a exibição inicial do formulário inline
const openTransactionForm = (type) => {
  currentFormType = type;
  transactionFormContainer.style.display = "block";
  formStep1.style.display = "block";
  formStep2.style.display = "none";
  customCategoryWrapper.style.display = "none";

  inputAmount.value = "";
  inputCustomCategory.value = "";

  transactionFormContainer.className = `transaction-form-card state-${type}`;
  formTitleText.textContent =
    type === "revenue" ? "Inserir Ganho" : "Inserir Despesa";

  populateCategories(type);
};

// Valida a primeira etapa (valor) e avança para a próxima tela
const handleNextStep = () => {
  const amount = parseFloat(inputAmount.value);
  if (!isNaN(amount) && amount > 0) {
    tempAmount = amount;
    formStep1.style.display = "none";
    formStep2.style.display = "block";
  } else {
    alert("Por favor, introduza um valor válido maior que zero.");
  }
};

// Processa o fechamento e salva a informação no estado
const handleFinalizeTransaction = () => {
  let selectedCategory = selectCategory.value;

  if (selectedCategory === "Outra...") {
    selectedCategory = inputCustomCategory.value.trim();
  }

  if (!selectedCategory) {
    alert("Por favor, defina a categoria do lançamento.");
    return;
  }

  transactions.push({
    id: transactions.length + 1,
    type: currentFormType,
    amount: tempAmount,
    status: currentFormType === "revenue" ? "recebido" : "pendente",
    description: selectedCategory,
  });

  transactionFormContainer.style.display = "none";
  renderTransactions();
  calculateDailyTarget();
};

// ==========================================
// 6. ADICIONA OS ESCUTADORES DE EVENTOS (LISTENERS)
// ==========================================
selectCategory.addEventListener("change", (e) => {
  if (e.target.value === "Outra...") {
    customCategoryWrapper.style.display = "block";
  } else {
    customCategoryWrapper.style.display = "none";
  }
});

btnAddRevenue.addEventListener("click", () => openTransactionForm("revenue"));
btnAddExpense.addEventListener("click", () => openTransactionForm("expense"));
btnNextToCategory.addEventListener("click", handleNextStep);
btnFinalizeTransaction.addEventListener("click", handleFinalizeTransaction);

// Inicialização global do sistema ao carregar o script
const init = () => {
  renderTransactions();
  renderBills();
  calculateDailyTarget();
};

init();
