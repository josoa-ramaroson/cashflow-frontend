'use client';

import { useState, useEffect } from 'react';
import TransactionService, {
  Transaction,
  TransactionInput,
  Summary,
} from '../services/TransactionService';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import '../styles/Dashboard.css';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactionsData] = await Promise.all([
        TransactionService.getSummary(token),
        TransactionService.getTransactions(token),
      ]);
      setSummary(summaryData);
      setTransactions(transactionsData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddTransaction = async (transactionInput: TransactionInput) => {
    try {
      const newTransaction = await TransactionService.createTransaction(
        token,
        transactionInput
      );
      setTransactions([newTransaction, ...transactions]);
      
      // Update summary
      const updatedSummary = await TransactionService.getSummary(token);
      setSummary(updatedSummary);
    } catch (err) {
      throw err;
    }
  };

  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Cashflow Manager</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="summary-section">
        <div className="summary-card income">
          <div className="summary-label">Total Income</div>
          <div className="summary-value">{summary.income.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar</div>
        </div>
        <div className="summary-card expense">
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value">{summary.expense.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar</div>
        </div>
        <div className="summary-card balance">
          <div className="summary-label">Balance</div>
          <div className={`summary-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            {summary.balance.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="transactions-header">
          <h2>Transactions</h2>
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Add Transaction
          </button>
        </div>

        <div className="transactions-container">
          <TransactionList
            transactions={incomeTransactions}
            title="Income"
            type="income"
          />
          <TransactionList
            transactions={expenseTransactions}
            title="Expenses"
            type="expense"
          />
        </div>
      </div>

      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
