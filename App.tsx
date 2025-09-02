import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Diagnostics from './components/Diagnostics';
import SystemLogs from './components/SystemLogs';
import FirewallRulesTable from './components/FirewallRulesTable';
import FirewallLogs from './components/FirewallLogs';
import VPNConnections from './components/VPNConnections';
import Aliases from './components/Aliases';
import UserManager from './components/UserManager';
import DiagnosticModal from './components/DiagnosticModal';
import Login from './components/Login';
import NdpTable from './components/NdpTable';
import Sockets from './components/Sockets';
import SmartStatus from './components/SmartStatus';

import { pfSenseService } from './services/pfsenseService';
import { authService } from './services/authService';
import { PfSenseData, User } from './types';

export type View = 
  | 'dashboard' 
  | 'system_logs'
  | 'user_manager'
  | 'firewall_rules' 
  | 'firewall_logs'
  | 'aliases'
  | 'vpn_connections'
  | 'diagnostics'
  | 'ndp_table'
  | 'sockets'
  | 'smart_status';

export type DiagnosticToolType = 'ping' | 'traceroute' | 'dnslookup';
  
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [data, setData] = useState<PfSenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTool, setModalTool] = useState<DiagnosticToolType | null>(null);
  const [modalTarget, setModalTarget] = useState<string>('');

  const runDiagnostic = (tool: DiagnosticToolType, target: string) => {
    const cleanTarget = target.split(':')[0]; // Remove port if present
    setModalTool(tool);
    setModalTarget(cleanTarget);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTool(null);
    setModalTarget('');
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dashboardData = await pfSenseService.fetchDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Effect for polling HA status
  useEffect(() => {
    if (!currentUser || !data?.haStatus.enabled) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const newHAStatus = await pfSenseService.fetchHAStatus();
        setData(prevData => {
          if (!prevData) return null;
          return { ...prevData, haStatus: newHAStatus };
        });
      } catch (error) {
        console.error("Failed to fetch HA status update", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount or when dependencies change
  }, [currentUser, data?.haStatus.enabled]);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard'); // Default to dashboard on login
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-blue"></div>
        </div>
      );
    }
    if (!data) {
      return <div className="text-center text-accent-red">Failed to load data.</div>;
    }

    const PageContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        {children}
      </div>
    );

    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={data} runDiagnostic={runDiagnostic} />;
      case 'system_logs':
        return <PageContainer title="System Logs"><SystemLogs logs={data.systemLogs} runDiagnostic={runDiagnostic} /></PageContainer>;
      case 'user_manager':
        return <PageContainer title="User Manager"><UserManager users={data.users} currentUser={currentUser} /></PageContainer>;
      case 'firewall_rules':
        return <PageContainer title="Firewall Rules"><FirewallRulesTable rules={data.firewallRules} /></PageContainer>;
      case 'firewall_logs':
        return <PageContainer title="Firewall Logs"><FirewallLogs logs={data.firewallLogs} runDiagnostic={runDiagnostic} /></PageContainer>;
      case 'aliases':
          return <PageContainer title="Firewall Aliases"><Aliases aliases={data.aliases} /></PageContainer>;
      case 'vpn_connections':
        return <VPNConnections connections={data.vpnConnections} siteToSiteVPNs={data.siteToSiteVPNs} runDiagnostic={runDiagnostic} />;
      case 'diagnostics':
        return <Diagnostics 
          arpTable={data.arpTable} 
          firewallStates={data.firewallStates}
          systemActivity={data.systemActivity}
          routingTable={data.routingTable}
        />;
      case 'ndp_table':
        return <PageContainer title="NDP Table"><NdpTable ndpTable={data.ndpTable} /></PageContainer>;
      case 'sockets':
        return <PageContainer title="Sockets"><Sockets sockets={data.sockets} /></PageContainer>;
      case 'smart_status':
        return <PageContainer title="S.M.A.R.T. Status"><SmartStatus smartStatus={data.smartStatus} /></PageContainer>;
      default:
        return <Dashboard data={data} runDiagnostic={runDiagnostic} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Navbar setView={setCurrentView} currentUser={currentUser} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-xs">
        <p>pfSense AI Security Dashboard &copy; 2024. For illustrative purposes only.</p>
      </footer>
      {isModalOpen && modalTool && (
        <DiagnosticModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          tool={modalTool}
          target={modalTarget}
        />
      )}
    </div>
  );
};

export default App;