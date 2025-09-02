
import React from 'react';
import { PfSenseData } from '../types';
import KPI from './KPI';
import TrafficChart from './TrafficChart';
import SecurityInsights from './SecurityInsights';
import ThreatLog from './ThreatLog';
import { DiagnosticToolType } from '../App';
import HAStatus from './HAStatus';

interface DashboardProps {
  data: PfSenseData;
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, runDiagnostic }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <SecurityInsights data={data} />
      </div>
      
      <KPI title="CPU Usage" value={`${data.systemMetrics.cpuUsage}%`} />
      <KPI title="Memory Usage" value={`${data.systemMetrics.memoryUsage}%`} />
      <KPI title="Active VPN Users" value={data.vpnConnections.length.toString()} />
      <KPI title="Firewall Temp" value={`${data.systemMetrics.temperature}°C`} />
      
      {data.haStatus.enabled && (
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <HAStatus status={data.haStatus} />
        </div>
      )}

      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Threat Log - Malicious Attempts</h2>
        <ThreatLog logs={data.threatLogs} runDiagnostic={runDiagnostic} />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Network Traffic (KB/s)</h2>
        <TrafficChart data={data.trafficData} />
      </div>
    </div>
  );
};

export default Dashboard;
