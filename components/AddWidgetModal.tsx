import React, { useState } from 'react';
import { WidgetType } from '../types';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidgets: (types: WidgetType[]) => void;
}

const availableWidgets: { type: WidgetType; name: string; description: string }[] = [
  { type: 'cpu_usage_kpi', name: 'KPI: CPU Usage', description: 'Real-time CPU load.' },
  { type: 'memory_usage_kpi', name: 'KPI: Memory Usage', description: 'Current memory consumption.' },
  { type: 'vpn_users_kpi', name: 'KPI: Active VPN Users', description: 'Count of connected users.' },
  { type: 'firewall_temp_kpi', name: 'KPI: Firewall Temp', description: 'System temperature.' },
  { type: 'traffic_chart', name: 'Chart: Network Traffic', description: 'Inbound/Outbound traffic graph.' },
  { type: 'ha_status', name: 'Status: High Availability', description: 'HA cluster and CARP VIP status.' },
  { type: 'threat_log', name: 'Table: Threat Logs', description: 'Latest malicious attempts.' },
  { type: 'system_logs', name: 'Table: System Logs', description: 'Latest general system events.' },
  { type: 'firewall_logs', name: 'Table: Firewall Logs', description: 'Latest traffic log entries.' },
  { type: 'firewall_rules', name: 'Table: Firewall Rules', description: 'A view of the firewall ruleset.' },
];

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onAddWidgets }) => {
  const [selected, setSelected] = useState<Set<WidgetType>>(new Set());

  const handleToggle = (type: WidgetType) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const handleAdd = () => {
    onAddWidgets(Array.from(selected));
    setSelected(new Set()); // Reset selection
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Add Widgets to Dashboard</h2>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableWidgets.map(widget => (
                    <div 
                        key={widget.type} 
                        onClick={() => handleToggle(widget.type)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selected.has(widget.type) ? 'bg-accent-blue/20 border-accent-blue' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selected.has(widget.type)}
                                readOnly
                                className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-accent-blue focus:ring-accent-blue"
                            />
                            <div className="ml-3">
                                <p className="font-semibold text-white">{widget.name}</p>
                                <p className="text-sm text-gray-400">{widget.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-gray-700/50 px-6 py-3 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm">Cancel</button>
          <button 
            type="button" 
            onClick={handleAdd}
            disabled={selected.size === 0}
            className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {selected.size > 0 ? `(${selected.size})` : ''} Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;
