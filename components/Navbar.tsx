import React, { useMemo } from 'react';
import { View } from '../App';
import { User } from '../types';

interface NavbarProps {
  setView: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView, currentUser, onLogout }) => {
  const menuItems = useMemo(() => {
    const allItems = [
      {
        title: 'System',
        role: 'admin',
        subItems: [
          { title: 'User Manager', view: 'user_manager' },
          { title: 'System Logs', view: 'system_logs' },
        ],
      },
      {
        title: 'Firewall',
        role: 'admin',
        subItems: [
          { title: 'Rules', view: 'firewall_rules' },
          { title: 'Logs', view: 'firewall_logs' },
          { title: 'Aliases', view: 'aliases' },
        ],
      },
      {
          title: 'VPN',
          role: 'user', // Accessible by all logged-in users
          subItems: [
            { title: 'Connections', view: 'vpn_connections' },
          ],
      },
      {
        title: 'Status',
        role: 'user',
        subItems: [
          { title: 'Dashboard', view: 'dashboard' },
          // A user might only see their own logs, but for simplicity, we use the same view
          { title: 'Logs', view: 'system_logs' }, 
        ],
      },
      {
        title: 'Diagnostics',
        role: 'admin',
        subItems: [
          { title: 'Network Utilities', view: 'diagnostics' },
          { title: 'NDP Table', view: 'ndp_table' },
          { title: 'Sockets', view: 'sockets' },
          { title: 'S.M.A.R.T. Status', view: 'smart_status' },
        ],
      },
    ];

    if (currentUser?.role === 'admin') {
      return allItems;
    }
    
    // For standard users, filter menu items to only show what their role allows.
    return allItems.filter(item => item.role === 'user');

  }, [currentUser]);


  return (
    <header className="bg-gray-800 shadow-md">
        <div className="p-4 flex justify-between items-center">
            {/* Left Side: Title */}
            <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h1 className="text-xl sm:text-2xl font-bold text-white hidden md:block">
                pfSense AI Security Dashboard
                </h1>
            </div>

            {/* Right Side: User & Logout */}
            <div className="flex items-center space-x-4">
               <div className="text-right">
                    <p className="text-sm font-medium text-white">{currentUser?.fullName}</p>
                    <p className="text-xs text-gray-400 capitalize">{currentUser?.role} Access</p>
               </div>
                <button onClick={onLogout} title="Logout" className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
      {/* Menu Bar */}
      <nav className="bg-gray-700">
        <ul className="flex space-x-2 px-4">
          {menuItems.map((item) => (
            <li key={item.title} className="group relative">
              <span className="cursor-pointer text-gray-300 hover:bg-gray-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-block">
                {item.title}
              </span>
              <div className="absolute left-0 mt-1 p-1 w-56 bg-gray-700 rounded-md shadow-lg hidden group-hover:block z-20">
                <ul className="space-y-1">
                {item.subItems.map((subItem) => (
                  <li key={subItem.view}>
                    <button
                      onClick={() => setView(subItem.view as View)}
                      className="w-full text-left text-gray-300 hover:bg-accent-blue hover:text-white block px-3 py-2 rounded-md text-sm"
                    >
                      {subItem.title}
                    </button>
                  </li>
                ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;