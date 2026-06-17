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

    transactions.forEach(transaction => {
        const isExpense = transaction.type === 'expense';
        const sign = isExpense ? '-' : '+';
        const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);

        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${sign} ${formatCurrency(transaction.amount)}</div>
            <div><span class="badge ${transaction.status}">${statusText}</span></div>
            <div>${transaction.description}</div>
            <div class="arrow">▼</div>
        `;
        transactionsList.appendChild(row);
    });
};

// Inicializa a injeção de dados ao carregar a página
const init = () => {
    renderTransactions();
};

init();