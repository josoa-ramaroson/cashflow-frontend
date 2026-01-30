'use client';

import React from "react"

import { useState } from 'react';
import { TransactionInput } from '../services/TransactionService';
import '../styles/TransactionForm.css';

interface TransactionFormProps {
  onSubmit: (transaction: TransactionInput) => Promise<void>;
  onClose: () => void;
}

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

export default function TransactionForm({
  onSubmit,
  onClose,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        category,
        description: description || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-button ${type === 'income' ? 'active income' : ''}`}
                onClick={() => {
                  setType('income');
                  setCategory('');
                }}
              >
                Income
              </button>
              <button
                type="button"
                className={`type-button ${type === 'expense' ? 'active expense' : ''}`}
                onClick={() => {
                  setType('expense');
                  setCategory('');
                }}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
