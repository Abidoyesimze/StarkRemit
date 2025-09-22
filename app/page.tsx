'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Play,
  TrendingUp,
  Smartphone,
  CreditCard,
} from 'lucide-react';

import AppLayout from './components/layout/AppLayout';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [sendAmount, setSendAmount] = useState('100');

  // Demo exchange rates
  const exchangeRates = {
    Nigeria: { rate: 755.5, currency: 'NGN', flag: '🇳🇬' },
    Kenya: { rate: 150.25, currency: 'KES', flag: '🇰🇪' },
    Ghana: { rate: 12.45, currency: 'GHS', flag: '🇬🇭' },
    Philippines: { rate: 56.75, currency: 'PHP', flag: '🇵🇭' },
    India: { rate: 83.25, currency: 'INR', flag: '🇮🇳' },
  };

  const currentRate = exchangeRates[selectedCountry as keyof typeof exchangeRates];
  const receiveAmount = (parseFloat(sendAmount) * currentRate.rate).toLocaleString();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <AppLayout showHeader={true} showSidebar={false} showFooter={true}>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'>
        {/* Hero Section */}
        <section className='relative px-4 sm:px-6 lg:px-8 pt-20 pb-32'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              {/* Left Column - Content */}
              <div className={`fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className='flex items-center gap-2 mb-6'>
                  <div className='bg-success-green/20 text-success px-3 py-1 rounded-full text-sm font-medium'>
                    Built on Starknet L2
                  </div>
                  <div className='bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium'>
                    Ultra-Low Fees
                  </div>
                </div>

                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-space-grotesk leading-tight'>
                  Send Money
                  <span className='block text-gradient-primary'>Across Borders</span>
                  <span className='block'>Instantly</span>
                </h1>

                <p className='text-xl text-gray-300 mb-8 leading-relaxed font-inter'>
                  Skip expensive banks and slow transfers. Send money to your family with{' '}
                  <strong className='text-white'>ultra-low fees</strong> and
                  <strong className='text-white'> lightning speed</strong> using blockchain
                  technology.
                </p>

                {/* Key Benefits */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-success-green/20 rounded-lg flex items-center justify-center'>
                      <Zap className='w-5 h-5 text-success' />
                    </div>
                    <div>
                      <p className='text-white font-medium text-sm'>Under 1 min</p>
                      <p className='text-gray-400 text-xs'>Transfer time</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-primary-blue/20 rounded-lg flex items-center justify-center'>
                      <DollarSign className='w-5 h-5 text-blue-400' />
                    </div>
                    <div>
                      <p className='text-white font-medium text-sm'>Under $0.01</p>
                      <p className='text-gray-400 text-xs'>Network fees</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center'>
                      <Globe className='w-5 h-5 text-purple-400' />
                    </div>
                    <div>
                      <p className='text-white font-medium text-sm'>150+ Countries</p>
                      <p className='text-gray-400 text-xs'>Worldwide reach</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                  <button className='btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3'>
                    <Send className='w-5 h-5' />
                    Send Money Now
                    <ArrowRight className='w-5 h-5' />
                  </button>

                  <button className='flex items-center justify-center gap-3 px-8 py-4 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200'>
                    <Play className='w-5 h-5' />
                    Watch Demo
                  </button>
                </div>

                {/* Social Proof */}
                <div className='flex items-center gap-6 text-sm text-gray-400'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4' />
                    <span>10,000+ users</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='w-4 h-4' />
                    <span>$2M+ transferred</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                    <span>4.9/5 rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Transfer Calculator */}
              <div className={`slide-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className='bg-glass rounded-2xl p-8 backdrop-blur-xl border border-white/10'>
                  <h3 className='text-2xl font-bold text-white mb-6 font-space-grotesk text-center'>
                    Try Our Calculator
                  </h3>

                  {/* Send Amount */}
                  <div className='mb-6'>
                    <label className='block text-white text-sm font-medium mb-2'>You Send</label>
                    <div className='relative'>
                      <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white font-bold text-lg'>
                        $
                      </div>
                      <input
                        type='number'
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className='w-full pl-8 pr-16 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors'
                        placeholder='100'
                      />
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 text-sm'>
                        USD
                      </div>
                    </div>
                  </div>

                  {/* Country Selector */}
                  <div className='mb-6'>
                    <label className='block text-white text-sm font-medium mb-2'>Send To</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className='w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg focus:border-blue-400 focus:outline-none transition-colors'
                    >
                      {Object.entries(exchangeRates).map(([country, data]) => (
                        <option key={country} value={country} className='bg-slate-800'>
                          {data.flag} {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Receive Amount */}
                  <div className='mb-6'>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Recipient Gets
                    </label>
                    <div className='bg-success-green/10 border border-success-green/30 rounded-xl p-4'>
                      <div className='text-success text-3xl font-bold font-space-grotesk'>
                        {currentRate.currency} {receiveAmount}
                      </div>
                      <div className='text-success/70 text-sm mt-1'>
                        Rate: 1 USD = {currentRate.rate} {currentRate.currency}
                      </div>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className='mb-6 p-4 bg-white/5 rounded-xl'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-white/70 text-sm'>Transfer fee</span>
                      <span className='text-success text-sm font-medium'>$0.00</span>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-white/70 text-sm'>Network fee</span>
                      <span className='text-success text-sm font-medium'>{'< $0.01'}</span>
                    </div>
                    <div className='border-t border-white/10 pt-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-white font-medium'>Total cost</span>
                        <span className='text-white font-bold'>${sendAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button className='btn-success w-full text-lg py-4 rounded-xl font-semibold'>
                    Send ${sendAmount} Now
                  </button>

                  <p className='text-center text-white/60 text-xs mt-4'>
                    🔒 Secure • No hidden fees • Instant transfer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className='absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse'></div>
        </section>

        {/* How It Works Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-black/20'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk'>
                How StarkRemit Works
              </h2>
              <p className='text-xl text-gray-300 font-inter'>
                Send money in 3 simple steps. No wallet needed for recipients.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Step 1 */}
              <div className='text-center group'>
                <div className='w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200'>
                  <Smartphone className='w-8 h-8 text-white' />
                </div>
                <div className='bg-number-1 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 bg-blue-500'>
                  1
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Connect Your Wallet
                </h3>
                <p className='text-gray-300 font-inter'>
                  Connect ArgentX or Braavos wallet. Enter recipient's phone number and amount to
                  send.
                </p>
              </div>

              {/* Step 2 */}
              <div className='text-center group'>
                <div className='w-16 h-16 bg-success-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200'>
                  <Send className='w-8 h-8 text-white' />
                </div>
                <div className='w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 bg-green-500'>
                  2
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Instant Transfer
                </h3>
                <p className='text-gray-300 font-inter'>
                  Your money is locked in our smart contract and instantly transferred on Starknet
                  L2.
                </p>
              </div>

              {/* Step 3 */}
              <div className='text-center group'>
                <div className='w-16 h-16 bg-stark-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200'>
                  <CreditCard className='w-8 h-8 text-white' />
                </div>
                <div className='w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 bg-purple-500'>
                  3
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Cash Out via SMS
                </h3>
                <p className='text-gray-300 font-inter'>
                  Recipient gets SMS with claim link. They cash out to mobile money or bank account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk'>
                Why Choose StarkRemit?
              </h2>
              <p className='text-xl text-gray-300 font-inter'>
                Built for the future of cross-border payments
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Feature 1 */}
              <div className='transfer-card p-8 text-center'>
                <div className='w-16 h-16 bg-success-gradient rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Zap className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Lightning Fast
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Transfers complete in under 60 seconds. No more waiting days for your family to
                  receive money.
                </p>
                <div className='bg-success-green/10 rounded-lg p-3'>
                  <p className='text-success text-sm font-medium'>⚡ Average time: 45 seconds</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className='transfer-card p-8 text-center'>
                <div className='w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <DollarSign className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Ultra-Low Fees
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Pay almost nothing in fees. Traditional remittances cost 6-12%. We cost less than
                  0.1%.
                </p>
                <div className='bg-blue-500/10 rounded-lg p-3'>
                  <p className='text-blue-400 text-sm font-medium'>💰 Save 95% on fees</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className='transfer-card p-8 text-center'>
                <div className='w-16 h-16 bg-stark-gradient rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Shield className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Bank-Level Security
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Built on Starknet L2 with cryptographic proofs. Your money is always protected.
                </p>
                <div className='bg-purple-500/10 rounded-lg p-3'>
                  <p className='text-purple-400 text-sm font-medium'>🛡️ Zero-knowledge proofs</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className='transfer-card p-8 text-center'>
                <div className='w-16 h-16 bg-warning-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-warning-yellow/30'>
                  <Smartphone className='w-8 h-8 text-warning' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  No Wallet Required
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Recipients don't need crypto wallets. They get SMS notifications and cash out
                  easily.
                </p>
                <div className='bg-warning-yellow/10 rounded-lg p-3'>
                  <p className='text-warning text-sm font-medium'>📱 Just a phone number needed</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className='transfer-card p-8 text-center'>
                <div className='w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30'>
                  <Globe className='w-8 h-8 text-green-400' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  Global Reach
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Send to 150+ countries. Integration with local payment methods and mobile money.
                </p>
                <div className='bg-green-500/10 rounded-lg p-3'>
                  <p className='text-green-400 text-sm font-medium'>🌍 150+ countries supported</p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className='transfer-card p-8 text-center'>
                <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30'>
                  <Clock className='w-8 h-8 text-red-400' />
                </div>
                <h3 className='text-xl font-bold text-white mb-4 font-space-grotesk'>
                  24/7 Support
                </h3>
                <p className='text-gray-300 font-inter mb-4'>
                  Get help anytime. Our support team is available round the clock for urgent
                  transfers.
                </p>
                <div className='bg-red-500/10 rounded-lg p-3'>
                  <p className='text-red-400 text-sm font-medium'>🆘 Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-primary-gradient'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 font-space-grotesk'>
              Ready to Send Money the Smart Way?
            </h2>
            <p className='text-xl text-white/90 mb-8 font-inter'>
              Join thousands of users who trust StarkRemit for their cross-border transfers
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-3'>
                <Send className='w-5 h-5' />
                Start Sending Now
              </button>
              <button className='border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-colors duration-200'>
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
