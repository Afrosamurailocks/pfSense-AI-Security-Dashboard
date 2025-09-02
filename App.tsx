
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

import { pfSenseService } from './services/pfsenseService';
import { PfSenseData } from './types';

export type View = 
  | 'dashboard' 
  | 'system_logs'
  | 'user_manager'
  | 'firewall_rules' 
  | 'firewall_logs'
  | 'aliases'
  | 'vpn_connections'
  | 'diagnostics';

export type DiagnosticToolType = 'ping' | 'traceroute' | 'dnslookup';
  
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [data, setData] = useState<PfSenseData | null>(null);
  const [loading, setLoading] = useState(true);

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
    fetchData();
  }, [fetchData]);

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
        return <PageContainer title="User Manager"><UserManager users={data.users} /></PageContainer>;
      case 'firewall_rules':
        return <PageContainer title="Firewall Rules"><FirewallRulesTable rules={data.firewallRules} /></PageContainer>;
      case 'firewall_logs':
        return <PageContainer title="Firewall Logs"><FirewallLogs logs={data.firewallLogs} runDiagnostic={runDiagnostic} /></PageContainer>;
      case 'aliases':
          return <PageContainer title="Firewall Aliases"><Aliases aliases={data.aliases} /></PageContainer>;
      case 'vpn_connections':
        return <VPNConnections connections={data.vpnConnections} siteToSiteVPNs={data.siteToSiteVPNs} runDiagnostic={runDiagnostic} />;
      case 'diagnostics':
        // FIX: The Diagnostics component expects individual data arrays, not the whole data object.
        // The `activeTool` prop was also removed as it is not part of DiagnosticsProps.
        return <Diagnostics 
          arpTable={data.arpTable} 
          firewallStates={data.firewallStates}
          systemActivity={data.systemActivity}
          routingTable={data.routingTable}
        />;
      default:
        return <Dashboard data={data} runDiagnostic={runDiagnostic} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {/* FIX: Removed the non-existent 'setDiagnosticTool' prop from Navbar. */}
      <Navbar setView={setCurrentView} />
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
