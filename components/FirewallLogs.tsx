
import React, { useState, useMemo } from 'react';
import { FirewallLog } from '../types';
import { DiagnosticToolType } from '../App';
import ActionDropdown from './ActionDropdown';

interface FirewallLogsProps {
  logs: FirewallLog[];
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
}

const getActionClass = (action: 'pass' | 'block') => {
    return action === 'pass' ? 'text-accent-green' : 'text-accent-red';
};

const FirewallLogs: React.FC<FirewallLogsProps> = ({ logs, runDiagnostic }) => {
    const [filter, setFilter] = useState('');

    const filteredLogs = useMemo(() => {
        if (!filter) return logs;
        const lowercasedFilter = filter.toLowerCase();
        return logs.filter(log => 
            log.sourceIp.toLowerCase().includes(lowercasedFilter) || 
            log.destinationIp.toLowerCase().includes(lowercasedFilter) ||
            log.sourcePort.includes(lowercasedFilter) ||
            log.destinationPort.includes(lowercasedFilter) ||
            log.protocol.toLowerCase().includes(lowercasedFilter) ||
            log.action.toLowerCase().includes(lowercasedFilter)
        );
    }, [logs, filter]);

    return (
        <div>
            <div className="mb-2">
                <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by IP, port, protocol..."
                className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
            </div>
            <div className="overflow-x-auto h-80">
                <table className="min-w-full text-sm text-left text-gray-300 font-mono">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Time</th>
                            <th scope="col" className="px-4 py-3">IF</th>
                            <th scope="col" className="px-4 py-3">Action</th>
                            <th scope="col" className="px-4 py-3">Source</th>
                            <th scope="col" className="px-4 py-3">Destination</th>
                            <th scope="col" className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredLogs.map((log, index) => (
                            <tr key={index} className="hover:bg-gray-600/50">
                                <td className="px-4 py-2 text-gray-500">{log.timestamp}</td>
                                <td className="px-4 py-2">{log.interface}</td>
                                <td className={`px-4 py-2 font-bold ${getActionClass(log.action)}`}>
                                    {log.action.toUpperCase()}
                                </td>
                                <td className="px-4 py-2">{log.sourceIp}:{log.sourcePort}</td>
                                <td className="px-4 py-2">{log.destinationIp}:{log.destinationPort}</td>
                                <td className="px-4 py-2">
                                    <div className="flex space-x-2">
                                        <ActionDropdown targetIp={log.sourceIp} runDiagnostic={runDiagnostic} title="Src" />
                                        <ActionDropdown targetIp={log.destinationIp} runDiagnostic={runDiagnostic} title="Dst" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FirewallLogs;
