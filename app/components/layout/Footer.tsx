import React from 'react';
import { Send, Shield, Zap, Globe, Twitter, Github, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
  id: number;
  title: string;
  href: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Footer link sections
  const platformLinks: FooterLink[] = [
    { id: 1, title: 'Send Money', href: '/send' },
    { id: 2, title: 'Receive Money', href: '/receive' },
    { id: 3, title: 'Exchange Rates', href: '/rates' },
    { id: 4, title: 'Transaction History', href: '/transactions' },
    { id: 5, title: 'Recipients', href: '/recipients' },
  ];

  const supportLinks: FooterLink[] = [
    { id: 6, title: 'Help Center', href: '/help' },
    { id: 7, title: 'Contact Support', href: '/support' },
    { id: 8, title: 'Live Chat', href: '/chat' },
    { id: 9, title: 'Report Issue', href: '/report' },
    { id: 10, title: 'Status Page', href: '/status' },
  ];

  const legalLinks: FooterLink[] = [
    { id: 11, title: 'Privacy Policy', href: '/privacy' },
    { id: 12, title: 'Terms of Service', href: '/terms' },
    { id: 13, title: 'Compliance', href: '/compliance' },
    { id: 14, title: 'Security', href: '/security' },
    { id: 15, title: 'Licenses', href: '/licenses' },
  ];

  const developerLinks: FooterLink[] = [
    { id: 16, title: 'API Documentation', href: '/docs' },
    { id: 17, title: 'SDK & Tools', href: '/developers' },
    { id: 18, title: 'GitHub', href: 'https://github.com/starkremit' },
    { id: 19, title: 'Smart Contracts', href: '/contracts' },
    { id: 20, title: 'Bug Bounty', href: '/bounty' },
  ];

  return (
    <footer className='footer-gradient text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center'>
                <Send className='w-7 h-7 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white font-space-grotesk'>StarkRemit</h3>
                <p className='text-blue-200 text-sm font-medium'>Cross-Border Made Simple</p>
              </div>
            </div>

            <p className='text-gray-300 mb-6 leading-relaxed font-inter'>
              Send money across borders instantly with ultra-low fees. Built on Starknet for maximum
              security and minimal costs. Your family deserves better than traditional remittances.
            </p>

            {/* Key Features */}
            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-success-green/20 rounded-lg flex items-center justify-center'>
                  <Zap className='w-4 h-4 text-success' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Instant</p>
                  <p className='text-gray-400 text-xs'>&lt; 1 minute</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-primary-blue/20 rounded-lg flex items-center justify-center'>
                  <Shield className='w-4 h-4 text-blue-400' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Secure</p>
                  <p className='text-gray-400 text-xs'>L2 Protected</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-warning-yellow/20 rounded-lg flex items-center justify-center'>
                  <Globe className='w-4 h-4 text-warning' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Global</p>
                  <p className='text-gray-400 text-xs'>150+ Countries</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-success-green/20 rounded-lg flex items-center justify-center'>
                  <span className='text-success text-xs font-bold'>$</span>
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>Low Cost</p>
                  <p className='text-gray-400 text-xs'>{'< $0.01 fees'}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex items-center gap-3'>
              <a
                href='https://twitter.com/starkremit'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white/10 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <Twitter className='w-5 h-5 text-blue-400' />
              </a>
              <a
                href='https://github.com/starkremit'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white/10 hover:bg-gray-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <Github className='w-5 h-5 text-gray-300' />
              </a>
              <a
                href='https://discord.gg/starkremit'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <MessageCircle className='w-5 h-5 text-purple-400' />
              </a>
              <a
                href='mailto:support@starkremit.com'
                className='w-10 h-10 bg-white/10 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors duration-200'
              >
                <Mail className='w-5 h-5 text-green-400' />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Platform</h4>
            <ul className='space-y-3'>
              {platformLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-blue-400 transition-colors duration-200 text-sm'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Support</h4>
            <ul className='space-y-3'>
              {supportLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-blue-400 transition-colors duration-200 text-sm'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Emergency Support Banner */}
            <div className='mt-6 p-3 bg-error-red/10 border border-error-red/20 rounded-lg'>
              <p className='text-error-red text-xs font-medium mb-1'>Emergency Support</p>
              <p className='text-gray-300 text-xs mb-2'>24/7 assistance for urgent transfers</p>
              <a
                href='/emergency'
                className='inline-block bg-error-red text-white text-xs font-medium px-3 py-1 rounded hover:bg-error-light transition-colors'
              >
                Get Help Now
              </a>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>
              Legal & Compliance
            </h4>
            <ul className='space-y-3'>
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-blue-400 transition-colors duration-200 text-sm'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Regulatory Badges */}
            <div className='mt-6 space-y-2'>
              <div className='flex items-center gap-2 text-xs'>
                <Shield className='w-4 h-4 text-success' />
                <span className='text-success'>Licensed MSB</span>
              </div>
              <div className='flex items-center gap-2 text-xs'>
                <Shield className='w-4 h-4 text-blue-400' />
                <span className='text-blue-400'>SOC 2 Compliant</span>
              </div>
              <div className='flex items-center gap-2 text-xs'>
                <Shield className='w-4 h-4 text-purple-400' />
                <span className='text-purple-400'>GDPR Ready</span>
              </div>
            </div>
          </div>

          {/* Developers */}
          <div>
            <h4 className='font-semibold font-space-grotesk text-white mb-4 text-lg'>Developers</h4>
            <ul className='space-y-3'>
              {developerLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className='text-gray-300 font-inter hover:text-blue-400 transition-colors duration-200 text-sm'
                    {...(link.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Dev Community CTA */}
            <div className='mt-6 p-3 bg-stark-gradient/20 border border-purple-500/30 rounded-lg'>
              <p className='text-purple-300 text-xs font-medium mb-1'>Build with StarkRemit</p>
              <p className='text-gray-300 text-xs mb-2'>Join our developer community</p>
              <a
                href='/developers'
                className='inline-block bg-stark-gradient text-white text-xs font-medium px-3 py-1 rounded hover:opacity-90 transition-opacity'
              >
                Start Building
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-white/10'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
            {/* Copyright */}
            <div className='text-center lg:text-left'>
              <p className='text-gray-400 text-sm font-inter'>
                © {currentYear} StarkRemit • All Rights Reserved • Built on Starknet L2
              </p>
              <p className='text-gray-500 text-xs mt-1 font-inter'>
                Making cross-border payments accessible to everyone
              </p>
            </div>

            {/* Compliance & Security Badges */}
            <div className='flex flex-wrap items-center gap-3 justify-center lg:justify-end'>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-success-green/10 border border-success-green/30 rounded-lg'>
                <Shield className='w-4 h-4 text-success' />
                <span className='text-success text-xs font-medium font-roboto-mono'>
                  Starknet Secured
                </span>
              </div>

              <div className='flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                <Globe className='w-4 h-4 text-blue-400' />
                <span className='text-blue-400 text-xs font-medium font-roboto-mono'>
                  Global Compliance
                </span>
              </div>

              <div className='flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg'>
                <Zap className='w-4 h-4 text-purple-400' />
                <span className='text-purple-400 text-xs font-medium font-roboto-mono'>
                  L2 Speed
                </span>
              </div>
            </div>
          </div>

          {/* Additional Legal Notice */}
          <div className='mt-6 p-4 bg-white/5 rounded-lg'>
            <p className='text-gray-400 text-xs leading-relaxed font-inter'>
              <strong>Important:</strong> StarkRemit is a financial technology company, not a bank.
              Banking services provided by licensed bank partners. Your funds are protected by
              bank-level security and regulatory compliance. Cross-border transfers are subject to
              regulatory requirements and may require identity verification.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
