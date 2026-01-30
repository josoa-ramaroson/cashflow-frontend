import { Transaction } from '../services/TransactionService';
import '../styles/TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
  type: 'income' | 'expense';
}

export default function TransactionList({
  transactions,
  title,
  type,
}: TransactionListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h3>{title}</h3>
        <p className="empty-message">No {type}s yet</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h3>{title}</h3>
      <div className="transactions">
        {transactions.map((transaction) => (
          <div key={transaction._id} className={`transaction-item ${type}`}>
            <div className="transaction-info">
              <div className="transaction-header">
                <span className="category">{transaction.category}</span>
                <span className="date">{formatDate(transaction.date)}</span>
              </div>
              {transaction.description && (
                <p className="description">{transaction.description}</p>
              )}
            </div>
            <div className={`amount ${type}`}>
              {type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
