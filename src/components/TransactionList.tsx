import { Transaction } from '../services/TransactionService';
import '../styles/TransactionList.css';
import { Edit2, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
  type: 'income' | 'expense';
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}


export default function TransactionList({
  transactions,
  title,
  type,
  onEdit,
  onDelete
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
    <h3 className="transaction-list-title">{title}</h3>
    <div className="transactions">
      {transactions.map((transaction) => (
        <div key={transaction._id} className={`transaction-item ${type}`}>
          <div className="transaction-left">
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
              {type === 'income' ? '+' : '-'}{" "}
              {transaction.amount.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              Ar
            </div>
          </div>

          <div className="transaction-actions">
            <button
              onClick={() => onEdit(transaction)}
              className="icon-button edit"
              title="Edit transaction"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(transaction)}
              className="icon-button delete"
              title="Delete transaction"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  );
}
