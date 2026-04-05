// ─── Mock Data ─────────────────────────────────────────────────────────────

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  emoji: string;
  merchant: string;
  category: string;
  categoryType: "income" | "expense";
  date: string;
  dateDisplay: string;
  amount: number;
  type: TransactionType;
}

export interface Category {
  id: string;
  emoji: string;
  name: string;
  spent: number;
  budget: number;
}

export const transactions: Transaction[] = [
  {
    id: "#SP-88219",
    emoji: "☕",
    merchant: "Blue Bottle Coffee",
    category: "Dining",
    categoryType: "expense",
    date: "2023-10-24",
    dateDisplay: "OCT 24, 2023",
    amount: -6.5,
    type: "expense",
  },
  {
    id: "#SP-88220",
    emoji: "💻",
    merchant: "Stripe Payout",
    category: "Salary",
    categoryType: "income",
    date: "2023-10-24",
    dateDisplay: "OCT 24, 2023",
    amount: 4250.0,
    type: "income",
  },
  {
    id: "#SP-88221",
    emoji: "🛒",
    merchant: "Whole Foods Market",
    category: "Groceries",
    categoryType: "expense",
    date: "2023-10-23",
    dateDisplay: "OCT 23, 2023",
    amount: -142.18,
    type: "expense",
  },
  {
    id: "#SP-88222",
    emoji: "🎬",
    merchant: "Netflix Subscription",
    category: "Entertainment",
    categoryType: "expense",
    date: "2023-10-22",
    dateDisplay: "OCT 22, 2023",
    amount: -19.99,
    type: "expense",
  },
  {
    id: "#SP-88223",
    emoji: "🚗",
    merchant: "Uber Trip",
    category: "Transport",
    categoryType: "expense",
    date: "2023-10-22",
    dateDisplay: "OCT 22, 2023",
    amount: -24.5,
    type: "expense",
  },
  {
    id: "#SP-88224",
    emoji: "📈",
    merchant: "Dividend Payment",
    category: "Investments",
    categoryType: "income",
    date: "2023-10-21",
    dateDisplay: "OCT 21, 2023",
    amount: 85.4,
    type: "income",
  },
  {
    id: "#SP-88225",
    emoji: "☁️",
    merchant: "Amazon AWS Cloud",
    category: "Software",
    categoryType: "expense",
    date: "2023-10-22",
    dateDisplay: "OCT 22, 2023",
    amount: -45.0,
    type: "expense",
  },
  {
    id: "#SP-88226",
    emoji: "💸",
    merchant: "Dividends Received",
    category: "Investments",
    categoryType: "income",
    date: "2023-10-21",
    dateDisplay: "OCT 21, 2023",
    amount: 124.5,
    type: "income",
  },
  {
    id: "#SP-88227",
    emoji: "🏋️",
    merchant: "Equinox Gym",
    category: "Health",
    categoryType: "expense",
    date: "2023-10-20",
    dateDisplay: "OCT 20, 2023",
    amount: -120.0,
    type: "expense",
  },
  {
    id: "#SP-88228",
    emoji: "✈️",
    merchant: "Delta Airlines",
    category: "Travel",
    categoryType: "expense",
    date: "2023-10-19",
    dateDisplay: "OCT 19, 2023",
    amount: -480.0,
    type: "expense",
  },
];

export const recentTransactions = transactions.slice(0, 5).map((t) => ({
  ...t,
  dateDisplay:
    t.id === "#SP-88219"
      ? "Today, 08:42 AM"
      : t.id === "#SP-88220"
      ? "Yesterday, 04:15 PM"
      : t.dateDisplay,
}));

export const categories: Category[] = [
  { id: "CAT-001", emoji: "🍔", name: "Food & Dining", spent: 1240, budget: 1500 },
  { id: "CAT-002", emoji: "🚕", name: "Transport", spent: 450, budget: 600 },
  { id: "CAT-003", emoji: "🛍️", name: "Shopping", spent: 2100, budget: 1800 },
  { id: "CAT-004", emoji: "💊", name: "Health", spent: 320, budget: 500 },
  { id: "CAT-005", emoji: "✈️", name: "Travel", spent: 3400, budget: 8000 },
  { id: "CAT-006", emoji: "🏠", name: "Home", spent: 1850, budget: 2000 },
];

export const weeklySpend = [
  { day: "MON", amount: 240 },
  { day: "TUE", amount: 410 },
  { day: "WED", amount: 310 },
  { day: "THU", amount: 580 },
  { day: "FRI", amount: 390 },
  { day: "SAT", amount: 180 },
  { day: "SUN", amount: 290 },
];

export const monthlyVelocity = [
  { month: "Apr", amount: 4200 },
  { month: "May", amount: 5800 },
  { month: "Jun", amount: 3900 },
  { month: "Jul", amount: 7200 },
  { month: "Aug", amount: 5100 },
  { month: "Sep", amount: 8900 },
  { month: "Oct", amount: 6800 },
];

export const categoryDistribution = [
  { name: "Travel", value: 3400, color: "#c0c1ff" },
  { name: "Shopping", value: 2100, color: "#ffb2b7" },
  { name: "Home", value: 1850, color: "#4edea3" },
  { name: "Food & Dining", value: 1240, color: "#8083ff" },
  { name: "Transport", value: 450, color: "#c7c4d7" },
  { name: "Health", value: 320, color: "#464554" },
];

export const stats = {
  balance: 42950.4,
  totalInflow: 12400.0,
  totalOutflow: 8122.9,
  netCashFlow: 22480.0,
  monthlyAllocation: 12450.0,
  monthlySpent: 8122.45,
  monthlyRemaining: 4327.55,
};
