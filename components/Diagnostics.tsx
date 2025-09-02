import React, { useState, useMemo, useEffect } from 'react';
import { ArpEntry, FirewallState, SystemProcess, RouteEntry } from '../types';
import { runPortTest } from '../services/diagnosticsService';

// --- System Activity Tool (top) ---
const SystemActivityTool: React.FC<{ processes: SystemProcess[] }> = ({ processes }) => {
    const [filter, setFilter] = useState('');

    const filteredProcesses = useMemo(() => {
        if (!filter) return processes;
        const lowercasedFilter = filter.toLowerCase();
        return processes.filter(p =>
            p.pid.toLowerCase().includes(lowercasedFilter) ||
            p.user.toLowerCase().includes(lowercasedFilter) ||
            p.command.toLowerCase().includes(lowercasedFilter)
        );
    }, [processes, filter]);

    return (
        <div>
            <h3 className="text-lg font-bold text-white">System Activity</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">Display system processes, similar to the 'top' command.</p>
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by PID, User, or Command..."
                className="w-full sm:w-72 mb-4 bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <div className="overflow-x-auto h-96">
                <table className="min-w-full text-sm text-left text-gray-300 font-mono">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">PID</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">User</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">%CPU</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">%MEM</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Time</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Command</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcesses.map((p) => (
                            <tr key={p.pid} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-4 py-2">{p.pid}</td>
                                <td className="px-4 py-2">{p.user}</td>
                                <td className="px-4 py-2">{p.cpu}</td>
                                <td className="px-4 py-2">{p.mem}</td>
                                <td className="px-4 py-2">{p.time}</td>
                                <td className="px-4 py-2">{p.command}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Routing Table Tool ---
const RoutingTableTool: React.FC<{ routes: RouteEntry[] }> = ({ routes }) => {
    const [filter, setFilter] = useState('');

    const filteredRoutes = useMemo(() => {
        if (!filter) return routes;
        const lowercasedFilter = filter.toLowerCase();
        return routes.filter(r =>
            r.destination.toLowerCase().includes(lowercasedFilter) ||
            r.gateway.toLowerCase().includes(lowercasedFilter) ||
            r.netif.toLowerCase().includes(lowercasedFilter)
        );
    }, [routes, filter]);

    return (
        <div>
            <h3 className="text-lg font-bold text-white">Routing Table</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">Display the system's IP routing table.</p>
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by Destination, Gateway, or Interface..."
                className="w-full sm:w-72 mb-4 bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <div className="overflow-x-auto h-96">
                <table className="min-w-full text-sm text-left text-gray-300 font-mono">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Destination</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Gateway</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Flags</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Interface</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoutes.map((r, i) => (
                            <tr key={i} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-4 py-2">{r.destination}</td>
                                <td className="px-4 py-2">{r.gateway}</td>
                                <td className="px-4 py-2">{r.flags}</td>
                                <td className="px-4 py-2">{r.netif}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


// --- pfTop Tool ---
const PfTopTool: React.FC<{ initialStates: FirewallState[] }> = ({ initialStates }) => {
    const [states, setStates] = useState(initialStates);

    useEffect(() => {
        const interval = setInterval(() => {
            setStates(prevStates => {
                const newStates = [...prevStates].sort(() => 0.5 - Math.random());
                return newStates.map(s => {
                    const [p1, p2] = s.packets.split(':').map(Number);
                    const newPackets = `${p1 + Math.floor(Math.random()*5)}:${p2 + Math.floor(Math.random()*5)}`;
                    return {...s, packets: newPackets};
                }).sort((a,b) => {
                    const aTotal = a.bytes.split(':').reduce((sum, p) => sum + parseInt(p.replace(/[^\d]/g, '')) , 0);
                    const bTotal = b.bytes.split(':').reduce((sum, p) => sum + parseInt(p.replace(/[^\d]/g, '')) , 0);
                    return bTotal - aTotal;
                });
            });
        }, 2000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">pfTop - Live State View</h3>
                    <p className="text-sm text-gray-400 mt-1">Real-time view of firewall states, sorted by activity.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-blue"></span>
                    </span>
                    <span className="text-sm font-medium text-accent-blue">Live Update</span>
                </div>
            </div>
            <div className="overflow-x-auto h-96">
                <table className="min-w-full text-sm text-left text-gray-300 font-mono">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Proto</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Source &rarr; Destination</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">State</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Packets</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Bytes</th>
                        </tr>
                    </thead>
                    <tbody className="transition-all duration-500">
                        {states.map((entry) => (
                            <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-4 py-2">{entry.protocol}</td>
                                <td className="px-4 py-2">{entry.source} &rarr; {entry.destination}</td>
                                <td className="px-4 py-2">{entry.state}</td>
                                <td className="px-4 py-2">{entry.packets}</td>
                                <td className="px-4 py-2">{entry.bytes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- ARP Table Tool ---
const ArpTableTool: React.FC<{ arpTable: ArpEntry[] }> = ({ arpTable }) => {
    const [filter, setFilter] = useState('');

    const filteredTable = useMemo(() => {
        if (!filter) return arpTable;
        const lowercasedFilter = filter.toLowerCase();
        return arpTable.filter(entry =>
            entry.ip.toLowerCase().includes(lowercasedFilter) ||
            entry.mac.toLowerCase().includes(lowercasedFilter) ||
            entry.hostname?.toLowerCase().includes(lowercasedFilter)
        );
    }, [arpTable, filter]);

    return (
        <div>
            <h3 className="text-lg font-bold text-white">ARP Table</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">View the system's Address Resolution Protocol table, mapping IP to MAC addresses.</p>
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by IP, MAC, or Hostname..."
                className="w-full sm:w-72 mb-4 bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <div className="overflow-x-auto h-96">
                <table className="min-w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">IP Address</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">MAC Address</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Hostname</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Interface</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTable.map((entry) => (
                            <tr key={entry.mac} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-4 py-2 font-mono">{entry.ip}</td>
                                <td className="px-4 py-2 font-mono">{entry.mac}</td>
                                <td className="px-4 py-2 font-mono">{entry.hostname}</td>
                                <td className="px-4 py-2">{entry.interface}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- States Table Tool ---
const StatesTableTool: React.FC<{ states: FirewallState[] }> = ({ states }) => {
    const [filter, setFilter] = useState('');

    const filteredStates = useMemo(() => {
        if (!filter) return states;
        const lowercasedFilter = filter.toLowerCase();
        return states.filter(entry =>
            entry.protocol.toLowerCase().includes(lowercasedFilter) ||
            entry.source.toLowerCase().includes(lowercasedFilter) ||
            entry.destination.toLowerCase().includes(lowercasedFilter) ||
            entry.state.toLowerCase().includes(lowercasedFilter)
        );
    }, [states, filter]);
    
    return (
        <div>
            <h3 className="text-lg font-bold text-white">Firewall States</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">View a snapshot of the firewall's state table, showing all active connections.</p>
             <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by protocol, source, or destination..."
                className="w-full sm:w-72 mb-4 bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <div className="overflow-x-auto h-96">
                <table className="min-w-full text-sm text-left text-gray-300 font-mono">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">IF</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Proto</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Source &rarr; Destination</th>
                            <th scope="col" className="px-4 py-3 font-semibold tracking-wider">State</th>
                        </tr>
                    </thead>
                    <tbody>
                         {filteredStates.map((entry) => (
                            <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-4 py-2">{entry.interface}</td>
                                <td className="px-4 py-2">{entry.protocol}</td>
                                <td className="px-4 py-2">{entry.source} &rarr; {entry.destination}</td>
                                <td className="px-4 py-2">{entry.state}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Port Test Tool ---
const PortTestTool = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState({ host: '', port: '' });

    const handleRun = async () => {
        if (!target.host || !target.port) {
            setResult('Please enter a host and a port.');
            return;
        }
        setLoading(true);
        setResult(`Testing port ${target.port} on ${target.host}...`);
        const output = await runPortTest(target.host, target.port);
        setResult(output);
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTarget({...target, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <h3 className="text-lg font-bold text-white">Test Port</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">Check if a port is open on a remote host.</p>
            <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                 <div className="w-full sm:flex-grow">
                    <label className="block text-gray-400 mb-1 text-sm">Host or IP Address</label>
                    <input type="text" name="host" value={target.host} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
                 <div className="w-full sm:w-32">
                    <label className="block text-gray-400 mb-1 text-sm">Port</label>
                    <input type="number" name="port" value={target.port} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
                <button
                    onClick={handleRun}
                    disabled={loading}
                    className="w-full sm:w-auto bg-accent-blue hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Testing...' : 'Test'}
                </button>
            </div>
            
            {result && (
                <div className="mt-4 p-4 bg-gray-900 rounded-md font-mono text-xs text-gray-300 h-48 overflow-y-auto">
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}

// --- Original Packet Capture Tool ---
const PacketCaptureTool = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        interface: 'WAN',
        protocol: 'ANY',
        host: '',
        port: '',
        count: '100'
    });

    const handleRun = async () => {
        setLoading(true);
        setResult(`Starting packet capture on ${settings.interface} with specified filters...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        let output = `tcpdump -i ${settings.interface.toLowerCase()} -n -c ${settings.count}`;
        if (settings.protocol !== 'ANY') output += ` proto ${settings.protocol.toLowerCase()}`;
        if (settings.host) output += ` host ${settings.host}`;
        if (settings.port) output += ` port ${settings.port}`;
        
        output += `
...listening on ${settings.interface.toLowerCase()}, link-type EN10MB (Ethernet)
11:45:01.123456 IP 185.191.226.33.58231 > 10.0.0.6.22: Flags [S], seq 12345, win 64240, options [mss 1460,sackOK,TS val 10 ecr 0,nop,wscale 7], length 0
11:45:02.456789 IP 203.0.113.80.44321 > 10.0.0.5.443: Flags [.], ack 1, win 256, length 1388
11:45:03.789012 ARP, Request who-has 10.0.0.1 tell 10.0.0.100, length 28
11:45:04.112233 IP 192.168.1.100.51234 > 8.8.8.8.53: 1+ A? google.com. (28)
11:45:05.334455 IP 8.8.8.8.53 > 192.168.1.100.51234: 1 1/0/0 A 172.217.10.14 (44)
...
${settings.count} packets captured
`;
        setResult(output);
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSettings({...settings, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <h3 className="text-lg font-bold text-white">Packet Capture</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">Capture live network traffic on an interface.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 text-sm">
                <div>
                    <label className="block text-gray-400 mb-1">Interface</label>
                    <select name="interface" value={settings.interface} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue">
                        <option>WAN</option>
                        <option>LAN</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-gray-400 mb-1">Protocol</label>
                    <select name="protocol" value={settings.protocol} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue">
                        <option>ANY</option>
                        <option>TCP</option>
                        <option>UDP</option>
                        <option>ICMP</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-gray-400 mb-1">Packet Count</label>
                    <input type="number" name="count" value={settings.count} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-gray-400 mb-1">Host Address</label>
                    <input type="text" name="host" placeholder="Optional" value={settings.host} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
                 <div>
                    <label className="block text-gray-400 mb-1">Port</label>
                    <input type="number" name="port" placeholder="Optional" value={settings.port} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
            </div>

            <button
                onClick={handleRun}
                disabled={loading}
                className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                 {loading ? 'Capturing...' : 'Start Capture'}
            </button>
            
            {result && (
                <div className="mt-4 p-4 bg-gray-900 rounded-md font-mono text-xs text-gray-300 h-64 overflow-y-auto">
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}


// --- Main Diagnostics Component ---
type Tool = 'capture' | 'arp' | 'states' | 'porttest' | 'activity' | 'routing' | 'pftop';

interface DiagnosticsProps {
    arpTable: ArpEntry[];
    firewallStates: FirewallState[];
    systemActivity: SystemProcess[];
    routingTable: RouteEntry[];
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ arpTable, firewallStates, systemActivity, routingTable }) => {
    const [activeTool, setActiveTool] = useState<Tool>('pftop');
    
    const getTabClass = (tool: Tool) => {
        return `px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTool === tool
            ? 'border-accent-blue text-white'
            : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
        }`;
    };

    const renderTool = () => {
        switch(activeTool) {
            case 'pftop': return <PfTopTool initialStates={firewallStates} />;
            case 'states': return <StatesTableTool states={firewallStates} />;
            case 'arp': return <ArpTableTool arpTable={arpTable} />;
            case 'routing': return <RoutingTableTool routes={routingTable} />;
            case 'activity': return <SystemActivityTool processes={systemActivity} />;
            case 'capture': return <PacketCaptureTool />;
            case 'porttest': return <PortTestTool />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Network Utilities</h2>
             <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTool('pftop')} className={getTabClass('pftop')}>pfTop</button>
                    <button onClick={() => setActiveTool('states')} className={getTabClass('states')}>States Table</button>
                    <button onClick={() => setActiveTool('activity')} className={getTabClass('activity')}>System Activity</button>
                    <button onClick={() => setActiveTool('routing')} className={getTabClass('routing')}>Routing</button>
                    <button onClick={() => setActiveTool('arp')} className={getTabClass('arp')}>ARP Table</button>
                    <button onClick={() => setActiveTool('capture')} className={getTabClass('capture')}>Packet Capture</button>
                    <button onClick={() => setActiveTool('porttest')} className={getTabClass('porttest')}>Port Test</button>
                </nav>
            </div>
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                {renderTool()}
            </div>
        </div>
    );
};

export default Diagnostics;