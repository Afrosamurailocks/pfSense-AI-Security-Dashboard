import React from 'react';
import { PfSenseData, WidgetConfig } from '../types';
import { DiagnosticToolType } from '../App';

import KPI from './KPI';
import TrafficChart from './TrafficChart';
import HAStatus from './HAStatus';
import ThreatLog from './ThreatLog';
import SystemLogs from './SystemLogs';
import FirewallLogs from './FirewallLogs';
import FirewallRulesTable from './FirewallRulesTable';

interface WidgetProps {
    widget: WidgetConfig;
    data: PfSenseData;
    onRemove: (id: string) => void;
    runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
}

const Widget: React.FC<WidgetProps> = ({ widget, data, onRemove, runDiagnostic }) => {

    const getTitle = (): string => {
        switch (widget.type) {
            case 'cpu_usage_kpi': return 'CPU Usage';
            case 'memory_usage_kpi': return 'Memory Usage';
            case 'vpn_users_kpi': return 'Active VPN Users';
            case 'firewall_temp_kpi': return 'Firewall Temp';
            case 'traffic_chart': return 'Network Traffic (KB/s)';
            case 'ha_status': return 'High Availability Status';
            case 'threat_log': return 'Threat Log';
            case 'system_logs': return 'System Logs';
            case 'firewall_logs': return 'Firewall Logs';
            case 'firewall_rules': return 'Firewall Rules';
            default: return 'Widget';
        }
    };

    const renderContent = () => {
        switch (widget.type) {
            case 'cpu_usage_kpi':
                return <KPI title="" value={`${data.systemMetrics.cpuUsage}%`} />;
            case 'memory_usage_kpi':
                return <KPI title="" value={`${data.systemMetrics.memoryUsage}%`} />;
            case 'vpn_users_kpi':
                return <KPI title="" value={data.vpnConnections.length.toString()} />;
            case 'firewall_temp_kpi':
                return <KPI title="" value={`${data.systemMetrics.temperature}°C`} />;
            case 'traffic_chart':
                return <TrafficChart data={data.trafficData} />;
            case 'ha_status':
                return <HAStatus status={data.haStatus} />;
            case 'threat_log':
                return <ThreatLog logs={data.threatLogs} runDiagnostic={runDiagnostic} limit={5} />;
            case 'system_logs':
                return <SystemLogs logs={data.systemLogs} runDiagnostic={runDiagnostic} limit={5} />;
            case 'firewall_logs':
                return <FirewallLogs logs={data.firewallLogs} runDiagnostic={runDiagnostic} limit={5} />;
            case 'firewall_rules':
                return <FirewallRulesTable rules={data.firewallRules} limit={5} />;
            default:
                return <div className="text-gray-400">Unknown widget type.</div>;
        }
    };
    
    // For KPIs, we render a simplified view without the outer container padding.
    if (widget.type.endsWith('_kpi')) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-400">{getTitle()}</h3>
                    <button 
                        onClick={() => onRemove(widget.id)}
                        className="text-gray-500 hover:text-white transition-colors text-lg"
                        aria-label="Remove widget"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex-grow flex items-end">
                    {renderContent()}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white">{getTitle()}</h3>
                <button 
                    onClick={() => onRemove(widget.id)}
                    className="text-gray-500 hover:text-white transition-colors text-lg"
                    aria-label="Remove widget"
                >
                    &times;
                </button>
            </div>
            <div className="p-4 flex-grow">
                 {renderContent()}
            </div>
        </div>
    );
};

export default Widget;
