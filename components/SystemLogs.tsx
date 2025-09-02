
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SystemLog } from '../types';
import { DiagnosticToolType } from '../App';
import ActionDropdown from './ActionDropdown';

interface SystemLogsProps {
  logs: SystemLog[];
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
}

const getLogColor = (message: string): string => {
    if (message.toLowerCase().includes('failed')) return 'text-accent-red';
    if (message.toLowerCase().includes('connected')) return 'text-accent-green';
    if (message.toLowerCase().includes('starting')) return 'text-accent-blue';
    return 'text-gray-300';
}

const SystemLogs: React.FC<SystemLogsProps> = ({ logs, runDiagnostic }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('');

  const filteredLogs = useMemo(() => {
    if (!filter) return logs;
    const lowercasedFilter = filter.toLowerCase();
    return logs.filter(log => 
      log.process.toLowerCase().includes(lowercasedFilter) || 
      log.message.toLowerCase().includes(lowercasedFilter)
    );
  }, [logs, filter]);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredLogs]);

  return (
    <div>
      <div className="mb-2">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter logs by process or keyword..."
          className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>
      <div className="h-72 overflow-y-auto bg-gray-900 p-2 rounded-md font-mono text-xs">
        {filteredLogs.map((log, index) => (
          <div key={index} className="flex justify-between items-center space-x-2 hover:bg-gray-700 rounded p-1">
            <div className="flex-grow">
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
              <span className="text-accent-yellow font-bold mr-1">{log.process}:</span>
              <span className={getLogColor(log.message)}>{log.message}</span>
            </div>
            {log.sourceIp && (
              <div className="flex-shrink-0">
                <ActionDropdown targetIp={log.sourceIp} runDiagnostic={runDiagnostic} />
              </div>
            )}
          </div>
        ))}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};

export default SystemLogs;
