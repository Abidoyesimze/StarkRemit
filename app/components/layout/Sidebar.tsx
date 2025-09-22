'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home,
  Send,
  Download,
  History,
  TrendingUp,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Wallet,
  CreditCard,
  BarChart3,
  Shield,
  Bell
} from 'lucide-react';
import { useLayout } from './LayoutProvider';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useLayout();

  // Main menu items for remittance functionality
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', badge: null },
    { icon: Send, label: 'Send Money', path: '/send', badge: null },
    { icon: Download, label: 'Receive', path: '/receive', badge: null },
    { icon: History, label: 'Transactions', path: '/transactions', badge: 3 },
    { icon: TrendingUp, label: 'Exchange Rates', path: '/rates', badge: null },
    { icon: CreditCard, label: 'Cards & Banks', path: '/payment-methods', badge: null },
    { icon: Users, label: 'Recipients', path: '/recipients', badge: null },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
  ];

  // Settings and support items
  const bottomItems = [
    { icon: Shield, label: 'Security', path: '/security', badge: null },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: 2 },
    { icon: Settings, label: 'Settings', path: '/settings', badge: null },
    { icon: HelpCircle, label: 'Help & Support', path: '/support', badge: null },
  ];

  // Update active item when pathname changes
  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    router.push(path);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleLogout = () => {
    // Add logout logic here - disconnect wallet, clear session, etc.
    console.log('Logging out...');
    
    // In production, you would:
    // 1. Disconnect wallet
    // 2. Clear user session/tokens
    // 3. Redirect to login/home page
    
    router.push('/');
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}>
        <div className="h-full sidebar-gradient custom-scrollbar overflow-y-auto">
          {/* Mobile Close Button */}
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Header */}
          <div className="px-6 pb-6 lg:pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg font-space-grotesk">
                  StarkRemit
                </h2>
                <p className="text-blue-200 text-xs font-medium">
                  Cross-Border Payments
                </p>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-glass rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Total Sent</span>
                <Wallet className="w-4 h-4 text-success" />
              </div>
              <div className="text-success text-xl font-bold font-space-grotesk">
                $2,450.00
              </div>
              <div className="text-white/60 text-xs mt-1">
                This month: +12.5%
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="px-4 pb-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left
                      transition-all duration-200 font-medium group focus-ring
                      ${isActive 
                        ? 'nav-active text-white shadow-lg' 
                        : 'text-white/80 nav-hover'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-300' : 'group-hover:text-white'
                      }`} />
                      <span className="text-sm font-inter">{item.label}</span>
                    </div>
                    
                    {item.badge && (
                      <span className="bg-error-red text-white text-xs rounded-full px-2 py-0.5 font-medium min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10" />

            {/* Bottom Items */}
            <div className="space-y-2">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left
                      transition-all duration-200 font-medium group focus-ring
                      ${isActive
                        ? 'nav-active text-white shadow-lg' 
                        : 'text-white/60 nav-hover'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-300' : 'group-hover:text-white/80'
                      }`} />
                      <span className="text-sm font-inter">{item.label}</span>
                    </div>
                    
                    {item.badge && (
                      <span className="bg-warning-yellow text-black text-xs rounded-full px-2 py-0.5 font-medium min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 font-medium group focus-ring
                  text-white/60 hover:text-red-400 hover:bg-red-400/10
                "
              >
                <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                <span className="text-sm font-inter">Log Out</span>
              </button>
            </div>

            {/* App Version Info */}
            <div className="mt-8 px-4 py-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">StarkRemit v1.0</span>
                <span className="wallet-connected px-2 py-1 rounded text-xs">
                  Beta
                </span>
              </div>
              <div className="mt-2 text-white/40 text-xs">
                Built on Starknet L2
              </div>
            </div>

            {/* Emergency Support */}
            <div className="mt-4 p-4 bg-error-red/10 border border-error-red/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-error-red" />
                <span className="text-error-red text-sm font-medium">
                  Need Help?
                </span>
              </div>
              <p className="text-white/70 text-xs mb-3">
                24/7 support for urgent transfers
              </p>
              <button className="w-full bg-error-red text-white text-xs font-medium py-2 rounded-lg hover:bg-error-light transition-colors">
                Contact Support
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;