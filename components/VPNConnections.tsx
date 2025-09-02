
import React, { useState, useMemo, Fragment } from 'react';
import { VPNConnection, SiteToSiteVPN, Phase1Status, Phase2Status } from '../types';
import { DiagnosticToolType } from '../App';
import ActionDropdown from './ActionDropdown';

interface VPNConnectionsProps {
  connections: VPNConnection[];
  siteToSiteVPNs: SiteToSiteVPN[];
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
}

const getProtocolClass = (protocol: 'OpenVPN' | 'WireGuard' | 'IPsec') => {
    switch(protocol) {
        case 'OpenVPN': return 'bg-green-500';
        case 'WireGuard': return 'bg-blue-500';
        case 'IPsec': return 'bg-purple-500';
        default: return 'bg-gray-500';
    }
}

const RemoteAccessTable: React.FC<{ connections: VPNConnection[], runDiagnostic: VPNConnectionsProps['runDiagnostic'] }> = ({ connections, runDiagnostic }) => {
    const [filter, setFilter] = useState('');

    const filteredConnections = useMemo(() => {
        if (!filter) {
            return connections;
        }
        const lowercasedFilter = filter.toLowerCase();
        return connections.filter(c => 
            c.user.toLowerCase().includes(lowercasedFilter) ||
            c.server.toLowerCase().includes(lowercasedFilter) ||
            c.remoteIp.toLowerCase().includes(lowercasedFilter) ||
            c.virtualIp.toLowerCase().includes(lowercasedFilter)
        );
    }, [connections, filter]);

    return (
        <div>
            <div className="mb-4">
                 <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search by user, server, or IP..."
                    className="w-full sm:w-72 bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
            </div>
            <div className="overflow-x-auto max-h-96">
                <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">User</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Server</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Remote IP</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Virtual IP</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Protocol</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredConnections.length > 0 ? filteredConnections.map((conn, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-600">
                        <td className="px-4 py-2 font-medium">{conn.user}</td>
                        <td className="px-4 py-2 text-gray-400">{conn.server}</td>
                        <td className="px-4 py-2">{conn.remoteIp}</td>
                        <td className="px-4 py-2">{conn.virtualIp}</td>
                        <td className="px-4 py-2">
                        <span className={`text-xs text-white px-2 py-0.5 rounded-full ${getProtocolClass(conn.protocol)}`}>
                            {conn.protocol}
                        </span>
                        </td>
                        <td className="px-4 py-2">
                            <ActionDropdown targetIp={conn.remoteIp} runDiagnostic={runDiagnostic} tools={['ping', 'traceroute']} />
                        </td>
                    </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">No matching connections found.</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
};

const getStatusColor = (status: 'Established' | 'Connecting' | 'Disconnected') => {
    switch (status) {
        case 'Established': return 'text-accent-green';
        case 'Connecting': return 'text-accent-yellow';
        case 'Disconnected': return 'text-accent-red';
    }
}

const PhaseDetails: React.FC<{ phase1?: Phase1Status, phase2?: Phase2Status }> = ({ phase1, phase2 }) => {
    if (!phase1 || !phase2) return <div className="text-gray-400">Phase details not available for this tunnel type.</div>;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Phase 1 Details */}
            <div>
                <h4 className="font-bold text-sm text-gray-300 mb-2 border-b border-gray-600 pb-1">Phase 1 (IKE SA)</h4>
                <div className="space-y-1">
                    <p><span className="text-gray-400 w-24 inline-block">Status:</span> <span className={`font-bold ${getStatusColor(phase1.status)}`}>{phase1.status}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Algorithm:</span> <span className="text-gray-200">{phase1.algorithm}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Lifetime:</span> <span className="text-gray-200">{phase1.lifetime}</span></p>
                </div>
            </div>
            {/* Phase 2 Details */}
            <div>
                <h4 className="font-bold text-sm text-gray-300 mb-2 border-b border-gray-600 pb-1">Phase 2 (IPsec SA)</h4>
                <div className="space-y-1">
                    <p><span className="text-gray-400 w-24 inline-block">Status:</span> <span className={`font-bold ${getStatusColor(phase2.status)}`}>{phase2.status}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Local Net:</span> <span className="text-gray-200">{phase2.localSubnet}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Remote Net:</span> <span className="text-gray-200">{phase2.remoteSubnet}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Protocol:</span> <span className="text-gray-200">{phase2.protocol}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Algorithm:</span> <span className="text-gray-200">{phase2.algorithm}</span></p>
                    <p><span className="text-gray-400 w-24 inline-block">Lifetime:</span> <span className="text-gray-200">{phase2.lifetime}</span></p>
                </div>
            </div>
        </div>
    );
};

const SiteToSiteTable: React.FC<{ tunnels: SiteToSiteVPN[], runDiagnostic: VPNConnectionsProps['runDiagnostic'] }> = ({ tunnels, runDiagnostic }) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [filter, setFilter] = useState('');

    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({...prev, [id]: !prev[id]}));
    }

    const filteredTunnels = useMemo(() => {
        if (!filter) {
            return tunnels;
        }
        const lowercasedFilter = filter.toLowerCase();
        return tunnels.filter(t => 
            t.name.toLowerCase().includes(lowercasedFilter) ||
            t.localEndpoint.toLowerCase().includes(lowercasedFilter) ||
            t.remoteEndpoint.toLowerCase().includes(lowercasedFilter)
        );
    }, [tunnels, filter]);

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search by name or endpoint IP..."
                    className="w-full sm:w-72 bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
            </div>
            <div className="overflow-x-auto max-h-96">
                <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="px-2 py-3 w-12 text-left"></th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Status</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Name</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Endpoints</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Latency</th>
                        <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTunnels.length > 0 ? filteredTunnels.map((tunnel) => (
                    <Fragment key={tunnel.id}>
                        <tr className="border-b border-gray-700 hover:bg-gray-600">
                            <td className="px-2 py-2">
                                {tunnel.protocol === 'IPsec' && (
                                    <button onClick={() => toggleRow(tunnel.id)} className="text-gray-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${expandedRows[tunnel.id] ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex items-center space-x-2">
                                    <span className={`h-3 w-3 rounded-full ${tunnel.status === 'Up' ? 'bg-accent-green' : 'bg-accent-red'}`}></span>
                                    <span className={`${tunnel.status === 'Up' ? 'text-accent-green' : 'text-accent-red'}`}>{tunnel.status}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2 font-medium">{tunnel.name}</td>
                            <td className="px-4 py-2 font-mono text-xs">{tunnel.localEndpoint} &harr; {tunnel.remoteEndpoint}</td>
                            <td className="px-4 py-2">{tunnel.latency}</td>
                            <td className="px-4 py-2">
                                {tunnel.status === 'Up' && <ActionDropdown targetIp={tunnel.remoteEndpoint} runDiagnostic={runDiagnostic} tools={['ping', 'traceroute']} />}
                            </td>
                        </tr>
                        {expandedRows[tunnel.id] && (
                            <tr className="bg-gray-900/50">
                                <td colSpan={6} className="p-4 border-b border-gray-700">
                                    <PhaseDetails phase1={tunnel.phase1} phase2={tunnel.phase2} />
                                </td>
                            </tr>
                        )}
                    </Fragment>
                    )) : (
                        <tr>
                             <td colSpan={6} className="text-center py-4 text-gray-500">No matching tunnels found.</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
};


const VPNConnections: React.FC<VPNConnectionsProps> = ({ connections, siteToSiteVPNs, runDiagnostic }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'sitetosite'>('users');

  const getTabClass = (tabName: 'users' | 'sitetosite') => {
    return `px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent-blue/80 ${
        activeTab === tabName
        ? 'bg-gray-700 text-white shadow-sm'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`;
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">VPN Status</h2>
        
        <div className="flex space-x-1 mb-6">
            <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>
                Remote Access (Users)
            </button>
            <button onClick={() => setActiveTab('sitetosite')} className={getTabClass('sitetosite')}>
                Site-to-Site Tunnels
            </button>
        </div>

        <div>
            {activeTab === 'users' && <RemoteAccessTable connections={connections} runDiagnostic={runDiagnostic} />}
            {activeTab === 'sitetosite' && <SiteToSiteTable tunnels={siteToSiteVPNs} runDiagnostic={runDiagnostic} />}
        </div>
    </div>
  );
};

export default VPNConnections;
