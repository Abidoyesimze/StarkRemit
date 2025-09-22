'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Globe,
  ExternalLink,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  recipient: {
    name: string;
    phone: string;
    country: string;
    flag: string;
  };
  amount: {
    sent: number;
    received: string;
    sentCurrency: string;
    receivedCurrency: string;
  };
  exchangeRate: number;
  fees: {
    network: number;
    service: number;
    total: number;
  };
  timestamp: string;
  completedAt?: string;
  method: string;
  reference: string;
  blockchainTx?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-202312250001',
      type: 'sent',
      status: 'completed',
      recipient: {
        name: 'Adaora Okafor',
        phone: '+234 803 123 4567',
        country: 'Nigeria',
        flag: '🇳🇬',
      },
      amount: {
        sent: 250,
        received: '188,875',
        sentCurrency: 'USD',
        receivedCurrency: 'NGN',
      },
      exchangeRate: 755.5,
      fees: {
        network: 0.005,
        service: 0,
        total: 0.005,
      },
      timestamp: '2023-12-25T14:30:00Z',
      completedAt: '2023-12-25T14:30:45Z',
      method: 'Mobile Money',
      reference: 'REF-NGN-12250001',
      blockchainTx: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
    {
      id: 'TXN-202312240002',
      type: 'sent',
      status: 'pending',
      recipient: {
        name: 'Grace Wanjiku',
        phone: '+254 712 345 678',
        country: 'Kenya',
        flag: '🇰🇪',
      },
      amount: {
        sent: 100,
        received: '15,025',
        sentCurrency: 'USD',
        receivedCurrency: 'KES',
      },
      exchangeRate: 150.25,
      fees: {
        network: 0.008,
        service: 0,
        total: 0.008,
      },
      timestamp: '2023-12-24T18:15:00Z',
      method: 'M-Pesa',
      reference: 'REF-KES-12240002',
    },
    {
      id: 'TXN-202312230003',
      type: 'sent',
      status: 'completed',
      recipient: {
        name: 'Maria Santos',
        phone: '+63 917 123 4567',
        country: 'Philippines',
        flag: '🇵🇭',
      },
      amount: {
        sent: 75,
        received: '4,256',
        sentCurrency: 'USD',
        receivedCurrency: 'PHP',
      },
      exchangeRate: 56.75,
      fees: {
        network: 0.006,
        service: 0,
        total: 0.006,
      },
      timestamp: '2023-12-23T10:20:00Z',
      completedAt: '2023-12-23T10:22:15Z',
      method: 'GCash',
      reference: 'REF-PHP-12230003',
      blockchainTx: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    },
    {
      id: 'TXN-202312220004',
      type: 'sent',
      status: 'failed',
      recipient: {
        name: 'Kwame Asante',
        phone: '+233 24 567 8901',
        country: 'Ghana',
        flag: '🇬🇭',
      },
      amount: {
        sent: 180,
        received: '2,241',
        sentCurrency: 'USD',
        receivedCurrency: 'GHS',
      },
      exchangeRate: 12.45,
      fees: {
        network: 0.004,
        service: 0,
        total: 0.004,
      },
      timestamp: '2023-12-22T16:45:00Z',
      method: 'Bank Transfer',
      reference: 'REF-GHS-12220004',
    },
    {
      id: 'TXN-202312210005',
      type: 'sent',
      status: 'completed',
      recipient: {
        name: 'Raj Patel',
        phone: '+91 98765 43210',
        country: 'India',
        flag: '🇮🇳',
      },
      amount: {
        sent: 200,
        received: '16,650',
        sentCurrency: 'USD',
        receivedCurrency: 'INR',
      },
      exchangeRate: 83.25,
      fees: {
        network: 0.007,
        service: 0,
        total: 0.007,
      },
      timestamp: '2023-12-21T12:10:00Z',
      completedAt: '2023-12-21T12:11:30Z',
      method: 'UPI',
      reference: 'REF-INR-12210005',
      blockchainTx: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.recipient.phone.includes(searchQuery) ||
          tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.reference.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.timestamp);
        const daysDiff = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 3600 * 24));

        switch (dateFilter) {
          case '7d':
            return daysDiff <= 7;
          case '30d':
            return daysDiff <= 30;
          case '90d':
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, statusFilter, dateFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-5 h-5 text-success' />;
      case 'pending':
        return <Clock className='w-5 h-5 text-warning' />;
      case 'failed':
        return <XCircle className='w-5 h-5 text-error' />;
      case 'cancelled':
        return <AlertTriangle className='w-5 h-5 text-gray-400' />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'completed':
        return `${baseClasses} status-completed`;
      case 'pending':
        return `${baseClasses} status-pending`;
      case 'failed':
        return `${baseClasses} status-failed`;
      case 'cancelled':
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
      default:
        return baseClasses;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const exportTransactions = () => {
    // Implement CSV export functionality
    console.log('Exporting transactions...');
  };

  if (isLoading) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 lg:p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='animate-pulse space-y-6'>
              <div className='h-8 bg-white/10 rounded mb-4 w-64'></div>
              <div className='h-16 bg-white/10 rounded-xl'></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='h-20 bg-white/10 rounded-xl loading-shimmer'></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 lg:p-6'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Header */}
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2 font-space-grotesk flex items-center gap-3'>
                <History className='w-8 h-8 text-primary-light' />
                Transaction History
              </h1>
              <p className='text-gray-300 font-inter'>
                View and manage all your cross-border transfers
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={exportTransactions}
                className='px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center gap-2'
              >
                <Download className='w-4 h-4' />
                Export
              </button>
              <button className='p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'>
                <RefreshCw className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='transfer-card p-6 text-center'>
              <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center mx-auto mb-3'>
                <DollarSign className='w-6 h-6 text-white' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                ${transactions.reduce((sum, tx) => sum + tx.amount.sent, 0).toLocaleString()}
              </p>
              <p className='text-gray-400 text-sm'>Total Sent</p>
            </div>

            <div className='transfer-card p-6 text-center'>
              <div className='w-12 h-12 bg-success-gradient rounded-xl flex items-center justify-center mx-auto mb-3'>
                <CheckCircle className='w-6 h-6 text-white' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                {transactions.filter((tx) => tx.status === 'completed').length}
              </p>
              <p className='text-gray-400 text-sm'>Completed</p>
            </div>

            <div className='transfer-card p-6 text-center'>
              <div className='w-12 h-12 bg-warning-yellow/20 border border-warning-yellow/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
                <Clock className='w-6 h-6 text-warning' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                {transactions.filter((tx) => tx.status === 'pending').length}
              </p>
              <p className='text-gray-400 text-sm'>Pending</p>
            </div>

            <div className='transfer-card p-6 text-center'>
              <div className='w-12 h-12 bg-error-red/20 border border-error-red/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
                <XCircle className='w-6 h-6 text-error' />
              </div>
              <p className='text-2xl font-bold text-white font-space-grotesk'>
                $
                {transactions
                  .filter((tx) => tx.status === 'failed')
                  .reduce((sum, tx) => sum + tx.fees.total, 0)
                  .toFixed(3)}
              </p>
              <p className='text-gray-400 text-sm'>Total Fees</p>
            </div>
          </div>

          {/* Filters */}
          <div className='transfer-card p-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {/* Search */}
              <div className='md:col-span-2 relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search by name, phone, or transaction ID...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors'
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors'
                >
                  <option value='all' className='bg-slate-800'>
                    All Status
                  </option>
                  <option value='completed' className='bg-slate-800'>
                    Completed
                  </option>
                  <option value='pending' className='bg-slate-800'>
                    Pending
                  </option>
                  <option value='failed' className='bg-slate-800'>
                    Failed
                  </option>
                  <option value='cancelled' className='bg-slate-800'>
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors'
                >
                  <option value='all' className='bg-slate-800'>
                    All Time
                  </option>
                  <option value='7d' className='bg-slate-800'>
                    Last 7 days
                  </option>
                  <option value='30d' className='bg-slate-800'>
                    Last 30 days
                  </option>
                  <option value='90d' className='bg-slate-800'>
                    Last 3 months
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className='transfer-card p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-white font-space-grotesk'>
                Transactions ({filteredTransactions.length})
              </h2>
              <div className='flex items-center gap-2'>
                <Filter className='w-4 h-4 text-white/70' />
                <span className='text-white/70 text-sm'>Filter applied</span>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className='text-center py-12'>
                <History className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-400 text-lg font-inter'>No transactions found</p>
                <p className='text-gray-500 text-sm font-inter'>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className='transaction-row p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer'
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowDetails(true);
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        {/* Transaction Type & Status */}
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.type === 'sent'
                                ? 'bg-blue-500/20 border border-blue-500/30'
                                : 'bg-green-500/20 border border-green-500/30'
                            }`}
                          >
                            {transaction.type === 'sent' ? (
                              <ArrowUpRight className='w-6 h-6 text-blue-400' />
                            ) : (
                              <ArrowDownLeft className='w-6 h-6 text-green-400' />
                            )}
                          </div>
                          {getStatusIcon(transaction.status)}
                        </div>

                        {/* Transaction Details */}
                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <p className='text-white font-semibold'>
                              {transaction.type === 'sent' ? 'Sent to' : 'Received from'}{' '}
                              {transaction.recipient.name}
                            </p>
                            <span className='text-xl'>{transaction.recipient.flag}</span>
                            <span className='text-white/70 text-sm'>
                              {transaction.recipient.country}
                            </span>
                          </div>
                          <div className='flex items-center gap-4 text-sm text-gray-400'>
                            <span>{formatDate(transaction.timestamp)}</span>
                            <span>{transaction.method}</span>
                            <span className='font-mono'>#{transaction.id.slice(-8)}</span>
                            <span className={getStatusBadge(transaction.status)}>
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-6'>
                        {/* Amount */}
                        <div className='text-right'>
                          <p className='text-white font-bold text-lg'>
                            {transaction.type === 'sent' ? '-' : '+'}${transaction.amount.sent}
                          </p>
                          <p className='text-gray-400 text-sm'>
                            {transaction.amount.receivedCurrency} {transaction.amount.received}
                          </p>
                          <p className='text-gray-500 text-xs'>
                            Fee: ${transaction.fees.total.toFixed(3)}
                          </p>
                        </div>

                        {/* More Actions */}
                        <button
                          className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(transaction);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className='w-4 h-4 text-white/70' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/10'>
              <div className='flex items-center gap-3'>
                {getStatusIcon(selectedTransaction.status)}
                <h3 className='text-xl font-bold text-white font-space-grotesk'>
                  Transaction Details
                </h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className='p-2 hover:bg-white/10 rounded-lg transition-colors'
              >
                <div className='w-6 h-6 text-white/70'>✕</div>
              </button>
            </div>

            <div className='p-6 space-y-6'>
              {/* Status Badge */}
              <div className='text-center'>
                <span className={`${getStatusBadge(selectedTransaction.status)} text-lg px-4 py-2`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() +
                    selectedTransaction.status.slice(1)}
                </span>
              </div>

              {/* Amount Section */}
              <div className='bg-white/5 rounded-xl p-6 text-center'>
                <p className='text-gray-400 text-sm mb-2'>
                  {selectedTransaction.type === 'sent' ? 'Amount Sent' : 'Amount Received'}
                </p>
                <p className='text-white text-3xl font-bold font-space-grotesk mb-2'>
                  ${selectedTransaction.amount.sent}
                </p>
                <p className='text-gray-300'>
                  Recipient received: {selectedTransaction.amount.receivedCurrency}{' '}
                  {selectedTransaction.amount.received}
                </p>
                <p className='text-gray-400 text-sm mt-2'>
                  Exchange rate: 1 USD = {selectedTransaction.exchangeRate}{' '}
                  {selectedTransaction.amount.receivedCurrency}
                </p>
              </div>

              {/* Recipient Info */}
              <div>
                <h4 className='text-white font-semibold mb-3'>Recipient Information</h4>
                <div className='bg-white/5 rounded-lg p-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center'>
                      <span className='text-xl'>{selectedTransaction.recipient.flag}</span>
                    </div>
                    <div>
                      <p className='text-white font-semibold'>
                        {selectedTransaction.recipient.name}
                      </p>
                      <p className='text-gray-400'>{selectedTransaction.recipient.phone}</p>
                      <p className='text-gray-400 text-sm'>
                        {selectedTransaction.recipient.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div>
                <h4 className='text-white font-semibold mb-3'>Transaction Information</h4>
                <div className='bg-white/5 rounded-lg p-4 space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Transaction ID</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-white font-mono text-sm'>{selectedTransaction.id}</span>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.id)}
                        className='p-1 hover:bg-white/10 rounded transition-colors'
                      >
                        <Copy className='w-3 h-3 text-white/70' />
                      </button>
                    </div>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Reference</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-white font-mono text-sm'>
                        {selectedTransaction.reference}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.reference)}
                        className='p-1 hover:bg-white/10 rounded transition-colors'
                      >
                        <Copy className='w-3 h-3 text-white/70' />
                      </button>
                    </div>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Payment Method</span>
                    <span className='text-white'>{selectedTransaction.method}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Initiated</span>
                    <span className='text-white'>
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {selectedTransaction.completedAt && (
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Completed</span>
                      <span className='text-white'>
                        {new Date(selectedTransaction.completedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedTransaction.blockchainTx && (
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-400'>Blockchain Tx</span>
                      <div className='flex items-center gap-2'>
                        <span className='text-white font-mono text-sm'>
                          {selectedTransaction.blockchainTx.slice(0, 10)}...
                          {selectedTransaction.blockchainTx.slice(-8)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.blockchainTx!)}
                          className='p-1 hover:bg-white/10 rounded transition-colors'
                        >
                          <Copy className='w-3 h-3 text-white/70' />
                        </button>
                        <a
                          href={`https://starkscan.co/tx/${selectedTransaction.blockchainTx}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-1 hover:bg-white/10 rounded transition-colors'
                        >
                          <ExternalLink className='w-3 h-3 text-white/70' />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div>
                <h4 className='text-white font-semibold mb-3'>Fee Breakdown</h4>
                <div className='bg-white/5 rounded-lg p-4 space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Network Fee</span>
                    <span className='text-white'>
                      ${selectedTransaction.fees.network.toFixed(3)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Service Fee</span>
                    <span className='text-success'>
                      ${selectedTransaction.fees.service.toFixed(3)}
                    </span>
                  </div>
                  <div className='border-t border-white/20 pt-2'>
                    <div className='flex justify-between'>
                      <span className='text-white font-medium'>Total Fees</span>
                      <span className='text-white font-bold'>
                        ${selectedTransaction.fees.total.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-3'>
                {selectedTransaction.status === 'failed' && (
                  <button className='flex-1 btn-primary py-3'>Retry Transfer</button>
                )}

                <button
                  onClick={() => {
                    /* Implement receipt download */
                  }}
                  className='flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center justify-center gap-2'
                >
                  <Download className='w-4 h-4' />
                  Download Receipt
                </button>

                {selectedTransaction.status === 'pending' && (
                  <button className='px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors'>
                    Cancel
                  </button>
                )}
              </div>

              {/* Support */}
              <div className='text-center pt-4 border-t border-white/10'>
                <p className='text-gray-400 text-sm mb-2'>Need help with this transaction?</p>
                <button className='text-primary-light hover:text-primary-blue transition-colors text-sm font-medium'>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
