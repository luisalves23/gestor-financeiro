// ==========================================
// 1. ESTADO INICIAL DA APLICAÇÃO (AGORA COM PERSISTÊNCIA)
// ==========================================

// Dados de demonstração (fallback) caso seja a primeira vez abrindo o app
const defaultTransactions = [
  { id: 1, type: "expense", amount: 20.0, status: "pendente", description: "Combustível" },
  { id: 2, type: "revenue", amount: 120.0, status: "recebido", description: "Diária Uber" },
];

const defaultBills = [
  { id: 1, amount: 1080.0, status: "pendente", description: "Aluguel" },
  { id: 2, amount: 800.0, status: "pago", description: "Alimentação" },
];

// O sistema tenta puxar do disco do navegador. Se vier vazio (null), ele usa o default.
let transactions = JSON.parse(localStorage.getItem('gf_transactions')) || defaultTransactions;
let bills = JSON.parse(localStorage.getItem('gf_bills')) || defaultBills;

// Dicionários de Categorias Catalogadas
const categoriesData = {
  revenue: [
    "Corrida Uber", "Viagem InDrive", "Entrega Frete", "Particular",
    "Freelance Dev", "Design Freelance", "Gorjeta", "Bónus Plataforma",
    "Reembolso", "Outra...",
  ],
  expense: [
    "Combustível", "Alimentação Rua", "Mecânica / Revisão", "Lava Jato",
    "Pedágio", "Internet / Celular", "Seguro Auto", "Estacionamento",
    "Equipamento", "Outra...",
  ],
};

let currentFormType = "";
let tempAmount = 0;

// ==========================================
// 2. MAPEAMENTO DE ELEMENTOS DO DOM
// ==========================================
const overviewCard = document.querySelector(".overview-card"); // NOVO: Mapeamento do Card de Saldo
const transactionsList = document.getElementById("transactions-list");
const billsList = document.getElementById("bills-list");

const transactionFormContainer = document.getElementById("transaction-form-container");
const formTitleText = document.getElementById("form-title-text");
const selectCategory = document.getElementById("select-category");
const customCategoryWrapper = document.getElementById("custom-category-wrapper");

const btnAddRevenue = document.getElementById("btn-add-revenue");
const btnAddExpense = document.getElementById("btn-add-expense");
const btnNextToCategory = document.getElementById("btn-next-to-category");
const btnFinalizeTransaction = document.getElementById("btn-finalize-transaction");
const inputAmount = document.getElementById("input-amount");
const inputCustomCategory = document.getElementById("input-custom-category");
const formStep1 = document.getElementById("form-step-1");
const formStep2 = document.getElementById("form-step-2");

// ==========================================
// 3. FUNÇÕES UTILITÁRIAS E MOTORES DE CÁLCULO
// ==========================================

// Salva o estado atual no disco (Local Storage)
const saveData = () => {
  localStorage.setItem('gf_transactions', JSON.stringify(transactions));
  localStorage.setItem('gf_bills', JSON.stringify(bills));
};

// Formata valores numéricos
const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// Processa o saldo vivo, projeta a meta e ativa o Semáforo Visual
const calculateDailyTarget = () => {
  const totalPendingBills = bills
    .filter((bill) => bill.status === "pendente")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const currentBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === "revenue"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  const daysRemaining = 15; // Fixo para o MVP

  // 1. Meta Base Ideal (Régua fixa para servir de comparação progressiva)
  const baseTarget = daysRemaining > 0 ? totalPendingBills / daysRemaining : 0;

  // 2. Meta Dinâmica (O que realmente falta de esforço financeiro abatendo o que já tem em caixa)
  const targetValue = daysRemaining > 0
      ? Math.ceil((totalPendingBills - currentBalance) / daysRemaining)
      : 0;

  // Atualização dos Textos de Interface
  document.getElementById("current-balance").innerText = formatCurrency(currentBalance);
  // Se a meta for negativa (já cobriu tudo com sobra), trava a exibição em zero
  const displayTarget = targetValue > 0 ? targetValue : 0;
  document.getElementById("daily-target").innerText = `Meta: ${formatCurrency(displayTarget)} por dia`;

  // 3. Motor de Semáforo Cromático do Painel
  overviewCard.classList.remove('status-danger', 'status-warning', 'status-success', 'status-premium');

  if (baseTarget === 0) {
      // Cenário onde não há passivos pendentes
      if (currentBalance < 0) overviewCard.classList.add('status-danger');
      else if (currentBalance > 0) overviewCard.classList.add('status-premium');
      else overviewCard.classList.add('status-success');
  } else {
      // Cenário com metas ativas
      if (currentBalance < 0 || currentBalance < (baseTarget * 0.5)) {
          // Saldo negativo OU faturamento abaixo da metade da meta base = Perigo
          overviewCard.classList.add('status-danger');
      } else if (currentBalance >= (baseTarget * 0.5) && currentBalance < baseTarget) {
          // Atingiu metade, mas não fechou a meta completa = Aviso
          overviewCard.classList.add('status-warning');
      } else if (currentBalance >= baseTarget && currentBalance < (baseTarget * 1.15)) {
          // Bateu a meta no limite (até 15% de margem extra) = Sucesso
          overviewCard.classList.add('status-success');
      } else if (currentBalance >= (baseTarget * 1.15)) {
          // Superou com folga (mais de 15% acima da meta diária) = Premium
          overviewCard.classList.add('status-premium');
      }
  }
};

// ==========================================
// 4. FUNÇÕES DE RENDERIZAÇÃO GRÁFICA
// ==========================================

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
            <div><button class="btn-delete" data-id="${transaction.id}">✖</button></div>
        `;
    transactionsList.appendChild(row);
  });
};

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
            <div><button class="btn-delete" data-id="${bill.id}">✖</button></div>
        `;
    billsList.appendChild(row);
  });
};

// ==========================================
// 5. MÁQUINA DE ESTADOS DO FORMULÁRIO DINÂMICO E LÓGICA DE DADOS
// ==========================================

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

const openTransactionForm = (type) => {
  currentFormType = type;
  transactionFormContainer.style.display = "flex";
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

const closeTransactionForm = () => {
  transactionFormContainer.style.display = "none";
  currentFormType = "";
  tempAmount = 0;
};

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
    id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
    type: currentFormType,
    amount: tempAmount,
    status: currentFormType === "revenue" ? "recebido" : "pendente",
    description: selectedCategory,
  });

  saveData();
  closeTransactionForm();
  renderTransactions();
  calculateDailyTarget();
};

const handleDelete = (e, listType) => {
  const deleteBtn = e.target.closest('.btn-delete');
  if (!deleteBtn) return; 

  const id = parseInt(deleteBtn.getAttribute('data-id'));

  if (confirm("Tem certeza que deseja excluir este registro?")) {
    if (listType === 'transaction') {
      transactions = transactions.filter(t => t.id !== id);
    } else if (listType === 'bill') {
      bills = bills.filter(b => b.id !== id);
    }

    saveData();
    renderTransactions();
    renderBills();
    calculateDailyTarget();
  }
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

transactionFormContainer.addEventListener("click", (e) => {
  if (e.target === transactionFormContainer) {
    closeTransactionForm();
  }
});

transactionsList.addEventListener("click", (e) => handleDelete(e, 'transaction'));
billsList.addEventListener("click", (e) => handleDelete(e, 'bill'));

// Inicialização global
const init = () => {
  renderTransactions();
  renderBills();
  calculateDailyTarget();
};

init();