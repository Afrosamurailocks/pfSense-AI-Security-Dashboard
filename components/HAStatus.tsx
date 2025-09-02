import React from 'react';
import { HAStatus } from '../types';

interface HAStatusProps {
    status: HAStatus;
}

const getRoleClass = (role: 'MASTER' | 'BACKUP') => {
    return role === 'MASTER' ? 'bg-accent-green text-green-100' : 'bg-accent-blue text-blue-100';
}

const getVipStatusClass = (status: 'MASTER' | 'BACKUP' | 'INIT') => {
    switch (status) {
        case 'MASTER': return 'bg-accent-green text-green-100';
        case 'BACKUP': return 'bg-accent-blue text-blue-100';
        case 'INIT': return 'bg-accent-yellow text-yellow-100';
    }
}

const getSyncStatusClass = (status: 'In Sync' | 'Out of Sync') => {
    const baseClass = status === 'In Sync' ? 'bg-accent-green text-green-100' : 'bg-accent-red text-red-100';
    const pulseClass = status === 'Out of Sync' ? 'animate-pulse' : '';
    return `${baseClass} ${pulseClass}`;
}

const HAStatus: React.FC<HAStatusProps> = ({ status }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-bold text-white">High Availability Status</h2>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <span className="text-sm text-gray-400">Sync Status:</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${getSyncStatusClass(status.syncStatus)}`}>
                    {status.syncStatus}
                </span>
            </div>
        </div>

        {/* Node Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-300 mb-2">Local Node (This Appliance)</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-mono text-sm">{status.localNode.name}</p>
                        <p className="font-mono text-xs text-gray-400">{status.localNode.ip}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRoleClass(status.localNode.role)}`}>
                        {status.localNode.role}
                    </span>
                </div>
            </div>
             <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-300 mb-2">Remote Node (Peer)</h3>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-mono text-sm">{status.remoteNode.name}</p>
                        <p className="font-mono text-xs text-gray-400">{status.remoteNode.ip}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRoleClass(status.remoteNode.role)}`}>
                        {status.remoteNode.role}
                    </span>
                </div>
            </div>
        </div>

        {/* CARP VIPs */}
        <div>
            <h3 className="font-semibold text-gray-300 mb-2 text-sm">CARP Virtual IPs</h3>
            <div className="overflow-x-auto max-h-48">
                 <table className="min-w-full text-xs text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-2">VHID</th>
                            <th scope="col" className="px-4 py-2">Virtual IP</th>
                            <th scope="col" className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {status.carpVips.map(vip => (
                            <tr key={vip.vhid} className="hover:bg-gray-600/50">
                                <td className="px-4 py-2">{vip.vhid}</td>
                                <td className="px-4 py-2 font-mono">{vip.ip}</td>
                                <td className="px-4 py-2">
                                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getVipStatusClass(vip.status)}`}>
                                        {vip.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default HAStatus;