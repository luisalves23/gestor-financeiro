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
