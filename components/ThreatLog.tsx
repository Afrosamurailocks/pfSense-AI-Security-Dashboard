import React, { useState, useMemo } from 'react';
import { ThreatLogEntry } from '../types';
import { DiagnosticToolType } from '../App';
import ActionDropdown from './ActionDropdown';

interface ThreatLogProps {
  logs: ThreatLogEntry[];
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
  limit?: number;
}

const getTypeClass = (type: 'System Alert' | 'Firewall Block') => {
    return type === 'System Alert' ? 'bg-red-600 text-red-100' : 'bg-yellow-600 text-yellow-100';
};

const ThreatLog: React.FC<ThreatLogProps> = ({ logs, runDiagnostic, limit }) => {
    const [filter, setFilter] = useState('');

    const filteredLogs = useMemo(() => {
        if (!filter) return logs;
        const lowercasedFilter = filter.toLowerCase();
        return logs.filter(log =>
            log.sourceIp.toLowerCase().includes(lowercasedFilter) ||
            log.destination.toLowerCase().includes(lowercasedFilter) ||
            log.reason.toLowerCase().includes(lowercasedFilter) ||
            log.type.toLowerCase().includes(lowercasedFilter)
        );
    }, [logs, filter]);

    const limitedLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs;

    return (
        <div>
            <div className="mb-2">
                <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by IP, type, or reason..."
                className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
            </div>
            <div className="overflow-x-auto h-80">
                <table className="min-w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Time</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3">Source</th>
                            <th scope="col" className="px-4 py-3">Reason</th>
                            <th scope="col" className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {limitedLogs.map((log, index) => (
                            <tr key={index} className="hover:bg-gray-600/50">
                                <td className="px-4 py-2 text-gray-500 font-mono">{log.timestamp}</td>
                                <td className="px-4 py-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTypeClass(log.type)}`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2 font-mono">{log.sourceIp}</td>
                                <td className="px-4 py-2 text-gray-400">{log.reason}</td>
                                <td className="px-4 py-2">
                                    <ActionDropdown targetIp={log.sourceIp} runDiagnostic={runDiagnostic} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ThreatLog;