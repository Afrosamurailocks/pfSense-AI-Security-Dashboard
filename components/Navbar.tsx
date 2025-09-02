
import React from 'react';
import { View } from '../App';

interface NavbarProps {
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView }) => {
  const menuItems = [
    {
      title: 'System',
      subItems: [
        { title: 'User Manager', view: 'user_manager' },
        { title: 'System Logs', view: 'system_logs' },
      ],
    },
    {
      title: 'Firewall',
      subItems: [
        { title: 'Rules', view: 'firewall_rules' },
        { title: 'Logs', view: 'firewall_logs' },
        { title: 'Aliases', view: 'aliases' },
      ],
    },
    {
        title: 'VPN',
        subItems: [
          { title: 'Connections', view: 'vpn_connections' },
        ],
    },
    {
      title: 'Status',
      subItems: [
        { title: 'Dashboard', view: 'dashboard' },
      ],
    },
    {
      title: 'Diagnostics',
      subItems: [
        { title: 'Network Tools', view: 'diagnostics' },
      ],
    },
  ];

  return (
    <header className="bg-gray-800 shadow-md">
        <div className="p-4 flex justify-between items-center">
            {/* Left Side: Title */}
            <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h1 className="text-xl sm:text-2xl font-bold text-white hidden md:block">
                pfSense AI Security Dashboard
                </h1>
            </div>

            {/* Right Side: Status */}
            <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
                </span>
                <span className="text-sm font-medium text-accent-green hidden sm:block">Online</span>
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
              <ul className="absolute left-0 mt-1 p-1 w-48 bg-gray-700 rounded-md shadow-lg hidden group-hover:block z-20">
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
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
