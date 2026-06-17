// ==========================================
// 1. ESTADO INICIAL DA APLICAÇÃO (MIGRAÇÃO V2 - SUPORTE A DATAS)
// ==========================================

const defaultTransactions = [
  { id: 1, type: "expense", amount: 20.0, status: "pendente", description: "Combustível" },
  { id: 2, type: "revenue", amount: 120.0, status: "recebido", description: "Diária Uber" },
];

const defaultBills = [
  // NOVO: Adicionado suporte à chave dueDate no formato ISO YYYY-MM-DD
  { id: 1, amount: 1080.0, status: "pendente", description: "Aluguel", dueDate: "2026-06-10" },
  { id: 2, amount: 800.0, status: "pago", description: "Alimentação", dueDate: "2026-06-20" },
];

// Mudança da chave do Local Storage para 'v2' forçando um reset limpo na máquina do usuário
let transactions = JSON.parse(localStorage.getItem('gf_transactions_v2')) || defaultTransactions;
let bills = JSON.parse(localStorage.getItem('gf_bills_v2')) || defaultBills;

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
const overviewCard = document.querySelector(".overview-card");
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

const saveData = () => {
  // Salvando nos novos endereços v2
  localStorage.setItem('gf_transactions_v2', JSON.stringify(transactions));
  localStorage.setItem('gf_bills_v2', JSON.stringify(bills));
};

const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// O cálculo de meta permanece o antigo (Dias Fixos). Será substituído na etapa 16.4.
const calculateDailyTarget = () => {
  const totalPendingBills = bills
    .filter((bill) => bill.status === "pendente")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const currentBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === "revenue"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  const daysRemaining = 15; 
  const baseTarget = daysRemaining > 0 ? totalPendingBills / daysRemaining : 0;
  const targetValue = daysRemaining > 0 ? Math.ceil((totalPendingBills - currentBalance) / daysRemaining) : 0;

  document.getElementById("current-balance").innerText = formatCurrency(currentBalance);
  const displayTarget = targetValue > 0 ? targetValue : 0;
  document.getElementById("daily-target").innerText = `Meta: ${formatCurrency(displayTarget)} por dia`;

  overviewCard.classList.remove('status-danger', 'status-warning', 'status-success', 'status-premium');

  if (baseTarget === 0) {
      if (currentBalance < 0) overviewCard.classList.add('status-danger');
      else if (currentBalance > 0) overviewCard.classList.add('status-premium');
      else overviewCard.classList.add('status-success');
  } else {
      if (currentBalance < 0 || currentBalance < (baseTarget * 0.5)) overviewCard.classList.add('status-danger');
      else if (currentBalance >= (baseTarget * 0.5) && currentBalance < baseTarget) overviewCard.classList.add('status-warning');
      else if (currentBalance >= baseTarget && currentBalance < (baseTarget * 1.15)) overviewCard.classList.add('status-success');
      else if (currentBalance >= (baseTarget * 1.15)) overviewCard.classList.add('status-premium');
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
    const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);

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
    const statusText = bill.status.charAt(0).toUpperCase() + bill.status.slice(1);
    
    // NOVO: Extrai o dia e o mês do formato YYYY-MM-DD se a data existir
    let dateDisplay = "";
    if (bill.dueDate) {
        const [year, month, day] = bill.dueDate.split('-');
        dateDisplay = `${day}/${month} - `;
    }

    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
            <div>${formatCurrency(bill.amount)}</div>
            <div><span class="badge ${bill.status}">${dateDisplay}${statusText}</span></div>
            <div>${bill.description}</div>
            <div><button class="btn-delete" data-id="${bill.id}">✖</button></div>
        `;
    billsList.appendChild(row);
  });
};

// ==========================================
// 5. MÁQUINA DE ESTADOS DO FORMULÁRIO DINÂMICO
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
  formTitleText.textContent = type === "revenue" ? "Inserir Ganho" : "Inserir Despesa";

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
// 6. ADICIONA OS ESCUTADORES DE EVENTOS
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