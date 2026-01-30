import axios, { AxiosInstance } from 'axios';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface TransactionInput {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
}

interface Summary {
  income: number;
  expense: number;
  balance: number;
}

class TransactionService {
  private api: AxiosInstance;
  private apiUrl: string;

  constructor() {
    let apiUrl = '';

    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiUrl = (import.meta.env.VITE_API_URL as string) || '';
    }

    if (!apiUrl) {
      apiUrl = (process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || '');
    }

    this.apiUrl = apiUrl || 'http://localhost:3000';
    console.log('[TransactionService] Using API URL:', this.apiUrl);

    this.api = axios.create({
      baseURL: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async login(username: string, password: string): Promise<string> {
    try {
      const response = await this.api.post<{ token: string }>('/auth/login', {
        username,
        password,
      });
      return response.data.token;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async getSummary(token: string): Promise<Summary> {
    try {
      const response = await this.api.get<Summary>('/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch summary.');
    }
  }

  async getTransactions(token: string): Promise<Transaction[]> {
    try {
      const response = await this.api.get<Transaction[]>('/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch transactions.');
    }
  }

  async createTransaction(
    token: string,
    transaction: TransactionInput
  ): Promise<Transaction> {
    try {
      const response = await this.api.post<Transaction>('/transactions', transaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create transaction.');
    }
  }

  // ------------------ NEW METHODS ------------------

  async updateTransaction(
    token: string,
    id: string,
    updatedTransaction: Partial<TransactionInput>
  ): Promise<Transaction> {
    try {
      const response = await this.api.put<Transaction>(`/transactions/${id}`, updatedTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update transaction.');
    }
  }

  async deleteTransaction(token: string, id: string): Promise<{ ok: boolean }> {
    try {
      const response = await this.api.delete<{ ok: boolean }>(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete transaction.');
    }
  }
}

export default new TransactionService();
export type { Transaction, TransactionInput, Summary };
