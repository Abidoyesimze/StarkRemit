'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Eye,
  Download,
  Bell,
  Star,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  recipient: string;
  amount: number;
  currency: string;
  receivedAmount: string;
  receivedCurrency: string;
  country: string;
  flag: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
}

interface Recipient {
  id: string;
  name: string;
  country: string;
  flag: string;
  phone: string;
  lastSent: string;
  totalSent: number;
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock user stats
  const userStats = {
    totalSent: 4650.75,
    totalTransactions: 23,
    savedOnFees: 278.45,
    avgTransferTime: '42 seconds',
    successRate: 99.8,
    countries: 8,
  };

  // Mock recent transactions
  const recentTransactions: Transaction[] = [
    {
      id: 'TXN-12345678',
      type: 'sent',
      recipient: 'Adaora Okafor',
      amount: 250,
      currency: 'USD',
      receivedAmount: '188,875',
      receivedCurrency: 'NGN',
      country: 'Nigeria',
      flag: '🇳🇬',
      status: 'completed',
      date: '2 hours ago',
      method: 'Mobile Money',
    },
    {
      id: 'TXN-12345677',
      type: 'sent',
      recipient: 'Grace Wanjiku',
      amount: 100,
      currency: 'USD',
      receivedAmount: '15,025',
      receivedCurrency: 'KES',
      country: 'Kenya',
      flag: '🇰🇪',
      status: 'pending',
      date: '5 hours ago',
      method: 'M-Pesa',
    },
    {
      id: 'TXN-12345676',
      type: 'sent',
      recipient: 'Maria Santos',
      amount: 75,
      currency: 'USD',
      receivedAmount: '4,256',
      receivedCurrency: 'PHP',
      country: 'Philippines',
      flag: '🇵🇭',
      status: 'completed',
      date: '1 day ago',
      method: 'GCash',
    },
    {
      id: 'TXN-12345675',
      type: 'sent',
      recipient: 'Kwame Asante',
      amount: 180,
      currency: 'USD',
      receivedAmount: '2,241',
      receivedCurrency: 'GHS',
      country: 'Ghana',
      flag: '🇬🇭',
      status: 'failed',
      date: '2 days ago',
      method: 'Bank Transfer',
    },
  ];

  // Mock favorite recipients
  const favoriteRecipients: Recipient[] = [
    {
      id: '1',
      name: 'Adaora Okafor',
      country: 'Nigeria',
      flag: '🇳🇬',
      phone: '+234 803 123 4567',
      lastSent: '2 hours ago',
      totalSent: 1250,
    },
    {
      id: '2',
      name: 'Grace Wanjiku',
      country: 'Kenya',
      flag: '🇰🇪',
      phone: '+254 712 345 678',
      lastSent: '5 hours ago',
      totalSent: 850,
    },
    {
      id: '3',
      name: 'Maria Santos',
      country: 'Philippines',
      flag: '🇵🇭',
      phone: '+63 917 123 4567',
      lastSent: '1 day ago',
      totalSent: 450,
    },
  ];

  // Mock chart data (monthly transfer amounts)
  const chartData = [
    { month: 'Jan', amount: 850 },
    { month: 'Feb', amount: 1200 },
    { month: 'Mar', amount: 980 },
    { month: 'Apr', amount: 1450 },
    { month: 'May', amount: 1680 },
    { month: 'Jun', amount: 2100 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-success' />;
      case 'pending':
        return <Clock className='w-4 h-4 text-warning' />;
      case 'failed':
        return <XCircle className='w-4 h-4 text-error' />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'completed':
        return `${baseClasses} status-completed`;
      case 'pending':
        return `${baseClasses} status-pending`;
      case 'failed':
        return `${baseClasses} status-failed`;
      default:
        return baseClasses;
    }
  };

  if (isLoading) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={false}>
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 lg:p-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='animate-pulse'>
              <div className='h-8 bg-white/10 rounded mb-4 w-64'></div>
              <div className='dashboard-grid'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='h-32 bg-white/10 rounded-xl loading-shimmer'></div>
                ))}
              </div>
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
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2 font-space-grotesk'>
                Welcome back! 👋
              </h1>
              <p className='text-gray-300 font-inter'>Here's your remittance activity overview</p>
            </div>

            {/* Quick Actions */}
            <div className='flex gap-3'>
              <button className='btn-primary px-6 py-3 flex items-center gap-2'>
                <Send className='w-4 h-4' />
                Send Money
              </button>
              <button className='px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center gap-2'>
                <Download className='w-4 h-4' />
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='dashboard-grid'>
            {/* Total Sent */}
            <div className='transfer-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center'>
                  <DollarSign className='w-6 h-6 text-white' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Total Sent</p>
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  ${userStats.totalSent.toLocaleString()}
                </p>
              </div>
              <div className='flex items-center gap-2 text-success'>
                <ArrowUpRight className='w-4 h-4' />
                <span className='text-sm font-medium'>+12.5% this month</span>
              </div>
            </div>

            {/* Total Transactions */}
            <div className='transfer-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-success-gradient rounded-xl flex items-center justify-center'>
                  <Send className='w-6 h-6 text-white' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Transactions</p>
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  {userStats.totalTransactions}
                </p>
              </div>
              <div className='flex items-center gap-2 text-blue-400'>
                <TrendingUp className='w-4 h-4' />
                <span className='text-sm font-medium'>3 this week</span>
              </div>
            </div>

            {/* Fees Saved */}
            <div className='transfer-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-stark-gradient rounded-xl flex items-center justify-center'>
                  <Zap className='w-6 h-6 text-white' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Fees Saved</p>
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  ${userStats.savedOnFees.toFixed(2)}
                </p>
              </div>
              <div className='flex items-center gap-2 text-purple-400'>
                <Shield className='w-4 h-4' />
                <span className='text-sm font-medium'>vs traditional banks</span>
              </div>
            </div>

            {/* Success Rate */}
            <div className='transfer-card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-warning-yellow/20 border border-warning-yellow/30 rounded-xl flex items-center justify-center'>
                  <Globe className='w-6 h-6 text-warning' />
                </div>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
              <div className='mb-2'>
                <p className='text-white/70 text-sm font-medium'>Success Rate</p>
                <p className='text-white text-2xl font-bold font-space-grotesk'>
                  {userStats.successRate}%
                </p>
              </div>
              <div className='flex items-center gap-2 text-green-400'>
                <CheckCircle className='w-4 h-4' />
                <span className='text-sm font-medium'>{userStats.countries} countries</span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Recent Transactions */}
            <div className='lg:col-span-2'>
              <div className='transfer-card p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-bold text-white font-space-grotesk'>
                    Recent Transactions
                  </h2>
                  <div className='flex items-center gap-2'>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className='px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400'
                    >
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
                    <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                      <Eye className='w-4 h-4 text-white/70' />
                    </button>
                  </div>
                </div>

                <div className='space-y-4'>
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className='transaction-row p-4 rounded-xl bg-white/5 border border-white/10'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          {/* Transaction Type Icon */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'sent'
                                ? 'bg-blue-500/20 border border-blue-500/30'
                                : 'bg-green-500/20 border border-green-500/30'
                            }`}
                          >
                            {transaction.type === 'sent' ? (
                              <ArrowUpRight className='w-5 h-5 text-blue-400' />
                            ) : (
                              <ArrowDownLeft className='w-5 h-5 text-green-400' />
                            )}
                          </div>

                          {/* Transaction Details */}
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <p className='text-white font-semibold'>
                                {transaction.type === 'sent' ? 'Sent to' : 'Received from'}{' '}
                                {transaction.recipient}
                              </p>
                              <span className='text-xl'>{transaction.flag}</span>
                            </div>
                            <div className='flex items-center gap-4 text-sm text-gray-400'>
                              <span>{transaction.date}</span>
                              <span>{transaction.method}</span>
                              <span className='font-mono'>#{transaction.id.slice(-6)}</span>
                            </div>
                          </div>
                        </div>

                        <div className='text-right'>
                          <div className='flex items-center gap-3 mb-1'>
                            <div>
                              <p className='text-white font-bold'>
                                {transaction.type === 'sent' ? '-' : '+'}${transaction.amount}
                              </p>
                              <p className='text-gray-400 text-sm'>
                                {transaction.receivedCurrency} {transaction.receivedAmount}
                              </p>
                            </div>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <span className={getStatusBadge(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 text-center'>
                  <button className='text-primary-light hover:text-primary-blue transition-colors font-medium'>
                    View All Transactions
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='space-y-6'>
              {/* Quick Send */}
              <div className='transfer-card p-6'>
                <h3 className='text-lg font-bold text-white mb-4 font-space-grotesk'>Quick Send</h3>
                <p className='text-gray-300 text-sm mb-4 font-inter'>
                  Send to your favorite recipients
                </p>

                <div className='space-y-3'>
                  {favoriteRecipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      className='w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 text-left'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span className='text-lg'>{recipient.flag}</span>
                          <div>
                            <p className='text-white font-medium text-sm'>{recipient.name}</p>
                            <p className='text-gray-400 text-xs'>{recipient.lastSent}</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-white/70 text-xs'>Total sent</p>
                          <p className='text-white font-semibold text-sm'>${recipient.totalSent}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button className='w-full mt-4 btn-primary py-3 text-sm'>
                  View All Recipients
                </button>
              </div>

              {/* Network Status */}
              <div className='transfer-card p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-bold text-white font-space-grotesk'>
                    Network Status
                  </h3>
                  <div className='w-3 h-3 bg-success rounded-full animate-pulse'></div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Starknet L2</span>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-success rounded-full'></div>
                      <span className='text-success text-sm font-medium'>Operational</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Avg. Transfer Time</span>
                    <span className='text-white text-sm font-medium'>
                      {userStats.avgTransferTime}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Network Fee</span>
                    <span className='text-success text-sm font-medium'>{'< $0.01'}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-white/70 text-sm'>Active Countries</span>
                    <span className='text-white text-sm font-medium'>150+</span>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-success-green/10 border border-success-green/30 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-4 h-4 text-success' />
                    <span className='text-success text-sm font-medium'>
                      All systems operational
                    </span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className='transfer-card p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-bold text-white font-space-grotesk'>Notifications</h3>
                  <Bell className='w-5 h-5 text-white/70' />
                </div>

                <div className='space-y-3'>
                  <div className='p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0'></div>
                      <div>
                        <p className='text-white text-sm font-medium'>Transfer Completed</p>
                        <p className='text-blue-400 text-xs'>$250 sent to Adaora Okafor</p>
                        <p className='text-white/60 text-xs mt-1'>2 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 bg-warning-yellow/10 border border-warning-yellow/30 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0'></div>
                      <div>
                        <p className='text-white text-sm font-medium'>Rate Alert</p>
                        <p className='text-warning text-xs'>USD to KES rate improved by 2.1%</p>
                        <p className='text-white/60 text-xs mt-1'>4 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 bg-success-green/10 border border-success-green/30 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0'></div>
                      <div>
                        <p className='text-white text-sm font-medium'>Money Claimed</p>
                        <p className='text-success text-xs'>Grace received your $100 transfer</p>
                        <p className='text-white/60 text-xs mt-1'>6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-4 text-center'>
                  <button className='text-primary-light hover:text-primary-blue transition-colors text-sm'>
                    View All Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Activity Chart */}
          <div className='transfer-card p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-white font-space-grotesk'>Monthly Activity</h2>
              <div className='flex items-center gap-2'>
                <span className='text-white/70 text-sm'>This year</span>
                <button className='p-2 hover:bg-white/10 rounded-lg transition-colors'>
                  <MoreHorizontal className='w-4 h-4 text-white/70' />
                </button>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className='flex items-end justify-between gap-4 h-48 mb-4'>
              {chartData.map((item, index) => (
                <div key={item.month} className='flex-1 flex flex-col items-center gap-2'>
                  <div
                    className='w-full bg-primary-gradient rounded-t-lg transition-all duration-500 ease-out hover:opacity-80'
                    style={{
                      height: `${(item.amount / Math.max(...chartData.map((d) => d.amount))) * 100}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  ></div>
                  <div className='text-center'>
                    <p className='text-white text-sm font-medium'>{item.month}</p>
                    <p className='text-gray-400 text-xs'>${item.amount}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex items-center justify-center gap-8 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-primary-gradient rounded'></div>
                <span className='text-white/70'>Money Sent</span>
              </div>
              <div className='text-white/60'>
                Total: ${chartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}{' '}
                this year
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Savings Comparison */}
            <div className='transfer-card p-6'>
              <h3 className='text-lg font-bold text-white mb-4 font-space-grotesk'>
                Your Savings vs Traditional Banks
              </h3>

              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg'>
                  <div>
                    <p className='text-white font-medium'>Traditional Banks</p>
                    <p className='text-red-400 text-sm'>Average 6-12% fees</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-red-400 font-bold text-lg'>$558.20</p>
                    <p className='text-red-400/70 text-xs'>Total fees</p>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 bg-success-green/10 border border-success-green/30 rounded-lg'>
                  <div>
                    <p className='text-white font-medium'>StarkRemit</p>
                    <p className='text-success text-sm'>Ultra-low network fees</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-success font-bold text-lg'>$0.23</p>
                    <p className='text-success/70 text-xs'>Total fees</p>
                  </div>
                </div>

                <div className='bg-warning-yellow/10 border border-warning-yellow/30 rounded-lg p-4 text-center'>
                  <p className='text-warning font-bold text-2xl mb-1'>
                    ${userStats.savedOnFees.toFixed(2)}
                  </p>
                  <p className='text-warning/70 text-sm'>You saved this much!</p>
                </div>
              </div>
            </div>

            {/* Speed Comparison */}
            <div className='transfer-card p-6'>
              <h3 className='text-lg font-bold text-white mb-4 font-space-grotesk'>
                Transfer Speed Comparison
              </h3>

              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 text-sm text-white/70'>Banks</div>
                  <div className='flex-1 bg-red-500/20 rounded-full h-6 flex items-center px-3'>
                    <div className='w-full bg-red-500 h-2 rounded-full'></div>
                  </div>
                  <div className='w-20 text-sm text-red-400 text-right'>3-5 days</div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='w-16 text-sm text-white/70'>Western Union</div>
                  <div className='flex-1 bg-orange-500/20 rounded-full h-6 flex items-center px-3'>
                    <div className='w-3/4 bg-orange-500 h-2 rounded-full'></div>
                  </div>
                  <div className='w-20 text-sm text-orange-400 text-right'>1-2 days</div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='w-16 text-sm text-white/70'>Wise</div>
                  <div className='flex-1 bg-yellow-500/20 rounded-full h-6 flex items-center px-3'>
                    <div className='w-1/3 bg-yellow-500 h-2 rounded-full'></div>
                  </div>
                  <div className='w-20 text-sm text-yellow-400 text-right'>Hours</div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='w-16 text-sm text-white font-medium'>StarkRemit</div>
                  <div className='flex-1 bg-success-green/20 rounded-full h-6 flex items-center px-3'>
                    <div className='w-2 bg-success h-2 rounded-full animate-pulse'></div>
                  </div>
                  <div className='w-20 text-sm text-success text-right font-bold'>42 sec</div>
                </div>
              </div>

              <div className='mt-4 p-3 bg-success-green/10 rounded-lg text-center'>
                <p className='text-success text-sm font-medium'>
                  You're sending money <strong>6,000x faster</strong> than traditional banks!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
