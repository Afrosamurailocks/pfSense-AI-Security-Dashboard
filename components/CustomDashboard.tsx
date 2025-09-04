import React, { useState, useEffect } from 'react';
import { PfSenseData, WidgetConfig, WidgetType, User } from '../types';
import { DiagnosticToolType } from '../App';
import Widget from './Widget';
import AddWidgetModal from './AddWidgetModal';

interface CustomDashboardProps {
  data: PfSenseData;
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
  currentUser: User;
}

const WIDGET_STORAGE_KEY_PREFIX = 'pfsense_custom_dashboard_widgets';

const CustomDashboard: React.FC<CustomDashboardProps> = ({ data, runDiagnostic, currentUser }) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const storageKey = `${WIDGET_STORAGE_KEY_PREFIX}_${currentUser.username}`;

  useEffect(() => {
    try {
      const savedWidgets = localStorage.getItem(storageKey);
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      }
    } catch (error) {
      console.error("Failed to load custom dashboard layout from localStorage", error);
    }
  }, [storageKey]);

  const saveLayout = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    localStorage.setItem(storageKey, JSON.stringify(newWidgets));
  };

  const handleAddWidgets = (types: WidgetType[]) => {
    const newWidgets = types.map(type => ({ id: crypto.randomUUID(), type }));
    saveLayout([...widgets, ...newWidgets]);
  };

  const handleRemoveWidget = (id: string) => {
    const newWidgets = widgets.filter(widget => widget.id !== id);
    saveLayout(newWidgets);
  };

  const getWidgetSpan = (type: WidgetType): string => {
    switch (type) {
        case 'traffic_chart':
        case 'ha_status':
            return 'md:col-span-2 lg:col-span-4';
        case 'threat_log':
        case 'system_logs':
        case 'firewall_logs':
        case 'firewall_rules':
            return 'md:col-span-2';
        default: // KPIs
            return 'col-span-1';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">My Dashboard</h2>
          <p className="text-gray-400">Your personalized view of the firewall status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mt-3 sm:mt-0"
        >
          Add Widgets
        </button>
      </div>

      {widgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map(widget => (
            <div key={widget.id} className={getWidgetSpan(widget.type)}>
              <Widget 
                widget={widget}
                data={data}
                onRemove={handleRemoveWidget}
                runDiagnostic={runDiagnostic}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">Your dashboard is empty</h3>
            <p className="mt-1 text-sm text-gray-400">Get started by adding your first widget.</p>
            <div className="mt-6">
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
                Add Widgets
            </button>
            </div>
        </div>
      )}

      <AddWidgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWidgets={handleAddWidgets}
      />
    </div>
  );
};

export default CustomDashboard;
