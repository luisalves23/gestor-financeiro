// Estado inicial da aplicação
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

// Dicionários de Categorias Catalogadas
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

// Mapeamento de novos elementos do DOM para o Formulário Dinâmico
const transactionFormContainer = document.getElementById(
  "transaction-form-container",
);
const formTitleText = document.getElementById("form-title-text");
const selectCategory = document.getElementById("select-category");
const customCategoryWrapper = document.getElementById(
  "custom-category-wrapper",
);

// Alimenta o elemento Select com as categorias baseadas no tipo de operação
const populateCategories = (type) => {
  const list = categoriesData[type];
  selectCategory.innerHTML = ""; // Limpa seleções anteriores

  list.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectCategory.appendChild(option);
  });
};

// Monitoriza a seleção para exibir o campo de categoria não catalogada
selectCategory.addEventListener("change", (e) => {
  if (e.target.value === "Outra...") {
    customCategoryWrapper.style.display = "block";
  } else {
    customCategoryWrapper.style.display = "none";
  }
});

// Mapeamento de elementos do DOM
const transactionsList = document.getElementById("transactions-list");
const billsList = document.getElementById("bills-list");

// Utilitário para formatar moeda no padrão brasileiro
const formatCurrency = (value) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// Constrói a lista de movimentações
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

// Motor de cálculo financeiro
const calculateDailyTarget = () => {
  // 1. Somar todas as contas pendentes
  const totalPendingBills = bills
    .filter((bill) => bill.status === "pendente")
    .reduce((sum, bill) => sum + bill.amount, 0);

  // 2. Calcular o saldo líquido atual das movimentações
  const currentBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === "revenue"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  // 3. Simulação de tempo: Definir os dias restantes até o vencimento principal
  // Para o MVP, fixamos em 15 dias para estruturar a lógica matemática base
  const daysRemaining = 15;

  // 4. Aplicação da equação matemática base
  const targetValue =
    daysRemaining > 0
      ? Math.ceil((totalPendingBills - currentBalance) / daysRemaining)
      : 0;

  // 5. Injeção dos valores calculados nos elementos do HTML
  document.getElementById("current-balance").innerText =
    formatCurrency(currentBalance);
  document.getElementById("daily-target").innerText =
    `Meta: ${formatCurrency(targetValue)} por dia`;
};

// Manipulação de Entradas do Usuário via Eventos
const handleAddRevenue = () => {
  const description = prompt("Digite a descrição do ganho (ex: Corrida Uber):");
  const amountInput = prompt(
    "Digite o valor bruto em Reais (use ponto para centavos):",
  );
  const amount = parseFloat(amountInput);

  if (description && !isNaN(amount) && amount > 0) {
    transactions.push({
      id: transactions.length + 1,
      type: "revenue",
      amount: amount,
      status: "recebido",
      description: description,
    });

    // Reflete as mudanças na interface instantaneamente
    renderTransactions();
    calculateDailyTarget();
  } else {
    alert("Dados inválidos. A operação foi cancelada.");
  }
};

// Vinculação dos botões aos escutadores de eventos
document
  .getElementById("btn-add-revenue")
  .addEventListener("click", handleAddRevenue);

// Inicializa a injeção de dados ao carregar a página
const init = () => {
  renderTransactions();
  renderBills();
  calculateDailyTarget();
};

init();
