
import { 
    PfSenseData, 
    HAStatus,
    FirewallRule,
    SystemLog,
    TrafficPoint,
    VPNConnection,
    SiteToSiteVPN,
    SystemMetrics,
    FirewallLog,
    ThreatLogEntry,
    Alias,
    User,
    ArpEntry,
    FirewallState,
    SystemProcess,
    RouteEntry,
    AuthenticationLog,
    NdpEntry,
    SmartStatus,
    SocketInfo,
    StatesSummary,
    TableEntry
} from '../types';

const extractIp = (message: string): string | undefined => {
  const ipRegex = /(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/;
  const match = message.match(ipRegex);
  return match ? match[0] : undefined;
};

// This is a mock service. In a real application, this would make API calls to a backend.
const generateMockData = (): PfSenseData => {
  const firewallRules: FirewallRule[] = [
    { id: 1, action: 'block', interface: 'WAN', protocol: 'ANY', source: 'any', destination: 'any', description: 'Block all incoming traffic by default' },
    { id: 2, action: 'pass', interface: 'LAN', protocol: 'ANY', source: 'LAN net', destination: 'any', description: 'Allow LAN to access anything' },
    { id: 3, action: 'pass', interface: 'WAN', protocol: 'TCP', source: 'any', destination: 'WebServers', description: 'Allow HTTPS to Web Servers' },
    { id: 4, action: 'pass', interface: 'WAN', protocol: 'TCP', source: 'any', destination: 'ManagementHosts:22', description: 'Allow SSH to internal server' },
    { id: 5, action: 'pass', interface: 'WAN', protocol: 'ANY', source: 'any', destination: 'any', description: 'DANGEROUS: Allow all traffic for testing' },
  ];

  const rawLogs = [
    { timestamp: '10:35:12', process: 'sshd', message: 'Failed password for root from 192.168.1.100 port 12345' },
    { timestamp: '10:35:05', process: 'nginx', message: 'Starting nginx server' },
    { timestamp: '10:34:50', process: 'kernel', message: 'arp: 10.0.0.1 is at 00:11:22:33:44:55' },
    { timestamp: '10:33:01', process: 'openvpn', message: 'user \'john.doe\' connected from 123.45.67.89' },
    { timestamp: '10:32:15', process: 'sshd', message: 'Failed password for admin from 203.0.113.50 port 54321' },
    { timestamp: '10:32:10', process: 'sshd', message: 'Failed password for admin from 203.0.113.50 port 54321' },
    { timestamp: '10:32:05', process: 'sshd', message: 'Failed password for admin from 203.0.113.50 port 54321' },
  ];

  const systemLogs: SystemLog[] = rawLogs.map(log => ({
      ...log,
      sourceIp: log.message.toLowerCase().includes('failed') ? extractIp(log.message) : undefined
  }));
  
  const trafficData: TrafficPoint[] = Array.from({ length: 20 }, (_, i) => ({
    time: `${10 + i}:00`,
    in: Math.floor(Math.random() * 800) + 100,
    out: Math.floor(Math.random() * 400) + 50,
  }));

  const vpnConnections: VPNConnection[] = [
    { user: 'john.doe', server: 'Main Office VPN', remoteIp: '123.45.67.89', virtualIp: '10.8.0.2', connectedSince: '2024-07-30 08:15:22', duration: '2h 20m', idleTime: '5m', protocol: 'OpenVPN' },
    { user: 'jane.smith', server: 'Development VPN', remoteIp: '98.76.54.32', virtualIp: '10.9.0.2', connectedSince: '2024-07-30 09:01:10', duration: '1h 34m', idleTime: '0m', protocol: 'WireGuard' },
    { user: 'contractor.a', server: 'Contractor Access', remoteIp: '12.13.14.15', virtualIp: '10.10.0.2', connectedSince: '2024-07-30 10:10:10', duration: '25m', idleTime: '1m', protocol: 'IPsec' },
    { user: 'bob.marley', server: 'Main Office VPN', remoteIp: '192.168.1.50', virtualIp: '10.8.0.4', connectedSince: '2024-07-30 09:45:00', duration: '50m', idleTime: '20m', protocol: 'OpenVPN' },
  ];

  const siteToSiteVPNs: SiteToSiteVPN[] = [
    { 
      id: 1, name: 'AWS VPC East', protocol: 'IPsec', status: 'Up', localEndpoint: '203.0.113.1', remoteEndpoint: '54.1.2.3', uptime: '12d 4h', latency: '22ms', dataIn: '5.8 GB', dataOut: '2.1 GB',
      phase1: { status: 'Established', algorithm: 'AES-256-GCM / SHA256 / DH14', lifetime: '86400s' },
      phase2: { status: 'Established', localSubnet: '10.0.0.0/24', remoteSubnet: '10.100.0.0/16', protocol: 'ESP', algorithm: 'AES-256-GCM', lifetime: '3600s' }
    },
    { 
      id: 2, name: 'Azure West Region', protocol: 'IPsec', status: 'Up', localEndpoint: '203.0.113.1', remoteEndpoint: '40.1.2.3', uptime: '3d 1h', latency: '35ms', dataIn: '1.2 GB', dataOut: '950 MB',
      phase1: { status: 'Established', algorithm: 'AES-256 / SHA384 / DH19', lifetime: '86400s' },
      phase2: { status: 'Established', localSubnet: '10.0.1.0/24', remoteSubnet: '10.200.0.0/16', protocol: 'ESP', algorithm: 'AES-256', lifetime: '3600s' }
    },
    { 
      id: 3, name: 'Branch Office', protocol: 'OpenVPN', status: 'Down', localEndpoint: '203.0.113.1', remoteEndpoint: '198.51.100.10', uptime: '0s', latency: 'N/A', dataIn: '0 B', dataOut: '0 B' 
    },
    { 
        id: 4, name: 'Partner Network', protocol: 'IPsec', status: 'Down', localEndpoint: '203.0.113.1', remoteEndpoint: '209.1.2.3', uptime: '0s', latency: 'N/A', dataIn: '0 B', dataOut: '0 B',
        phase1: { status: 'Disconnected', algorithm: 'AES-128 / SHA1 / DH2', lifetime: '28800s' },
        phase2: { status: 'Disconnected', localSubnet: '10.0.2.0/24', remoteSubnet: '172.16.0.0/16', protocol: 'ESP', algorithm: 'AES-128', lifetime: '1800s' }
      },
  ];

  const systemMetrics: SystemMetrics = {
    cpuUsage: Math.floor(Math.random() * 30) + 10,
    memoryUsage: Math.floor(Math.random() * 40) + 20,
    diskUsage: 35,
    temperature: 55,
  };

  const firewallLogs: FirewallLog[] = [
    { timestamp: '10:36:02', interface: 'WAN', action: 'block', protocol: 'TCP', sourceIp: '185.191.226.33', sourcePort: '58231', destinationIp: '10.0.0.6', destinationPort: '22' },
    { timestamp: '10:35:55', interface: 'WAN', action: 'pass', protocol: 'TCP', sourceIp: '203.0.113.80', sourcePort: '44321', destinationIp: '10.0.0.5', destinationPort: '443' },
    { timestamp: '10:35:41', interface: 'LAN', action: 'pass', protocol: 'TCP', sourceIp: '192.168.1.100', sourcePort: '51234', destinationIp: '8.8.8.8', destinationPort: '53' },
    { timestamp: '10:35:30', interface: 'WAN', action: 'block', protocol: 'UDP', sourceIp: '103.27.108.142', sourcePort: '1900', destinationIp: '10.0.0.1', destinationPort: '1900' },
    { timestamp: '10:35:25', interface: 'WAN', action: 'block', protocol: 'TCP', sourceIp: '45.137.21.103', sourcePort: '45982', destinationIp: '10.0.0.6', destinationPort: '23' },
    { timestamp: '10:35:18', interface: 'WAN', action: 'block', protocol: 'TCP', sourceIp: '185.191.226.33', sourcePort: '58230', destinationIp: '10.0.0.6', destinationPort: '22' },
    { timestamp: '10:35:15', interface: 'LAN', action: 'pass', protocol: 'ICMP', sourceIp: '192.168.1.1', sourcePort: '', destinationIp: '192.168.1.100', destinationPort: '' },
  ];

  // Generate Threat Logs
  const systemThreats: ThreatLogEntry[] = systemLogs
    .filter(log => log.message.toLowerCase().includes('failed') && log.sourceIp)
    .map(log => ({
      timestamp: log.timestamp,
      type: 'System Alert',
      sourceIp: log.sourceIp!,
      destination: 'pfSense Host',
      reason: log.message,
    }));
    
  const firewallThreats: ThreatLogEntry[] = firewallLogs
    .filter(log => log.action === 'block')
    .map(log => ({
        timestamp: log.timestamp,
        type: 'Firewall Block',
        sourceIp: `${log.sourceIp}:${log.sourcePort}`,
        destination: `${log.destinationIp}:${log.destinationPort}`,
        protocol: log.protocol,
        reason: `Blocked by ${log.interface} firewall rule`,
    }));
    
  const threatLogs = [...systemThreats, ...firewallThreats].sort((a, b) => {
    return b.timestamp.localeCompare(a.timestamp); // Sort descending
  });

  const aliases: Alias[] = [
      { name: 'WebServers', type: 'Hosts', values: ['10.0.0.5', '10.0.0.15'], description: 'Internal Production Web Servers' },
      { name: 'ManagementHosts', type: 'Hosts', values: ['10.0.0.6'], description: 'SSH Management Host' },
      { name: 'BlockedCountries', type: 'Networks', values: ['1.0.0.0/8', '5.0.0.0/8'], description: 'GeoIP blocks for specific regions' },
      { name: 'AllowedPorts', type: 'Ports', values: ['80', '443', '8080'], description: 'Standard web ports' },
  ];

  const users: User[] = [
      { username: 'admin', fullName: 'System Administrator', groups: ['admins'], disabled: false },
      { username: 'john.doe', fullName: 'John Doe', groups: ['vpn_users'], disabled: false },
      { username: 'jane.smith', fullName: 'Jane Smith', groups: ['vpn_users'], disabled: false },
      { username: 'guest', fullName: 'Guest User', groups: [], disabled: true },
  ];
  
  const arpTable: ArpEntry[] = [
    { ip: '192.168.1.1', mac: '00:11:22:33:44:55', interface: 'LAN', hostname: 'gateway.local' },
    { ip: '192.168.1.100', mac: 'AA:BB:CC:DD:EE:FF', interface: 'LAN', hostname: 'desktop-pc' },
    { ip: '192.168.1.102', mac: '11:22:33:44:55:66', interface: 'LAN', hostname: '?' },
    { ip: '123.45.67.1', mac: 'FF:EE:DD:CC:BB:AA', interface: 'WAN', hostname: 'isp-gateway' },
  ];

  const firewallStates: FirewallState[] = [
    { id: 'a1', interface: 'WAN', protocol: 'TCP', source: '123.45.67.89:12345', destination: '10.8.0.2:443', state: 'ESTABLISHED:ESTABLISHED', packets: '123:456', bytes: '1.2M:500K' },
    { id: 'b2', interface: 'LAN', protocol: 'UDP', source: '192.168.1.100:5353', destination: '224.0.0.251:5353', state: 'MULTIPLE:MULTIPLE', packets: '10:10', bytes: '1K:1K' },
    { id: 'c3', interface: 'LAN', protocol: 'TCP', source: '192.168.1.100:61234', destination: '8.8.8.8:53', state: 'FIN_WAIT_2:FIN_WAIT_2', packets: '5:4', bytes: '500:450' },
    { id: 'd4', interface: 'WAN', protocol: 'TCP', source: '185.191.226.33:58231', destination: '10.0.0.6:22', state: 'SYN_SENT:CLOSED', packets: '1:0', bytes: '60:0' },
    { id: 'e5', interface: 'WAN', protocol: 'TCP', source: '98.76.54.32:55555', destination: '10.9.0.2:8443', state: 'ESTABLISHED:ESTABLISHED', packets: '500:600', bytes: '2.5M:1.1M' },
    { id: 'f6', interface: 'LAN', protocol: 'ICMP', source: '192.168.1.50:1', destination: '192.168.1.1:1', state: 'ESTABLISHED:ESTABLISHED', packets: '20:20', bytes: '1680:1680' },
  ];

  const systemActivity: SystemProcess[] = [
    { pid: '11', user: 'root', cpu: '5.5', mem: '0.1', time: '150:30.1', command: 'kernel' },
    { pid: '85123', user: 'root', cpu: '2.0', mem: '1.2', time: '10:05.3', command: '/usr/local/sbin/nginx' },
    { pid: '54321', user: 'root', cpu: '0.5', mem: '2.5', time: '0:45.7', command: '/usr/local/sbin/openvpn --config server1.conf' },
    { pid: '12345', user: 'unbound', cpu: '0.1', mem: '3.1', time: '5:12.9', command: '/usr/local/sbin/unbound -c /var/unbound/unbound.conf' },
    { pid: '98765', user: 'root', cpu: '0.0', mem: '0.5', time: '0:01.2', command: '/usr/sbin/sshd' },
    { pid: '55555', user: 'root', cpu: '0.0', mem: '0.2', time: '1:11.5', command: '/usr/local/sbin/ntpd' },
  ];
  
  const routingTable: RouteEntry[] = [
      { destination: 'default', gateway: '123.45.67.1', flags: 'UGS', netif: 'em0' },
      { destination: '10.8.0.0/24', gateway: 'link#5', flags: 'U', netif: 'ovpns1' },
      { destination: '10.9.0.0/24', gateway: 'link#6', flags: 'U', netif: 'wg0' },
      { destination: '123.45.67.0/24', gateway: 'link#1', flags: 'U', netif: 'em0' },
      { destination: '127.0.0.1', gateway: 'link#3', flags: 'UH', netif: 'lo0' },
      { destination: '192.168.1.0/24', gateway: 'link#2', flags: 'U', netif: 'em1' },
  ];

  const authLogs: AuthenticationLog[] = [
      { timestamp: '11:05:30', user: 'admin', ip: '192.168.1.100', status: 'Success' },
      { timestamp: '11:02:15', user: 'root', ip: '203.0.113.50', status: 'Failure' },
      { timestamp: '11:02:12', user: 'root', ip: '203.0.113.50', status: 'Failure' },
  ];

  const ndpTable: NdpEntry[] = [
      { ip: 'fe80::1:1', mac: '00:11:22:33:44:55', interface: 'em1', state: 'STALE' },
      { ip: 'fe80::aabb:ccff:fedd:eeff', mac: 'aa:bb:cc:dd:ee:ff', interface: 'em1', state: 'REACHABLE' },
  ];

  const smartStatus: SmartStatus[] = [
      { device: '/dev/ada0', status: 'OK', temperature: '35C', attributes: [
          { id: '9', name: 'Power_On_Hours', value: '12050', worst: '12050', threshold: '0', status: 'OK' }
      ]}
  ];

  const sockets: SocketInfo[] = [
    { proto: 'tcp', recvQ: '0', sendQ: '0', localAddress: '127.0.0.1:53', foreignAddress: '*:*', state: 'LISTEN', pid: '12345', program: 'unbound' },
    { proto: 'tcp', recvQ: '0', sendQ: '0', localAddress: '10.0.0.1:22', foreignAddress: '*:*', state: 'LISTEN', pid: '98765', program: 'sshd' },
    { proto: 'tcp', recvQ: '0', sendQ: '0', localAddress: '10.0.0.1:22', foreignAddress: '192.168.1.100:12345', state: 'ESTABLISHED', pid: '98777', program: 'sshd' },
    { proto: 'udp', recvQ: '0', sendQ: '0', localAddress: '0.0.0.0:1194', foreignAddress: '*:*', state: '', pid: '54321', program: 'openvpn' },
  ];

  const statesSummary: StatesSummary = {
      total: firewallStates.length,
      tcp: firewallStates.filter(s => s.protocol === 'TCP').length,
      udp: firewallStates.filter(s => s.protocol === 'UDP').length,
      icmp: firewallStates.filter(s => s.protocol === 'ICMP').length,
      other: 0,
  };

  const pfTables: TableEntry[] = [
      { name: 'WebServers', entries: 2, ips: ['10.0.0.5', '10.0.0.15'] },
      { name: 'sshlockout', entries: 1, ips: ['203.0.113.50'] },
      { name: 'BlockedCountries', entries: 2, ips: ['1.0.0.0/8', '5.0.0.0/8'] },
  ];

  const haStatus: HAStatus = {
    enabled: true,
    syncStatus: 'In Sync',
    lastSync: '2024-08-01 11:35:02',
    localNode: { name: 'pfsense-1.local', role: 'MASTER', ip: '192.168.1.1' },
    remoteNode: { name: 'pfsense-2.local', role: 'BACKUP', ip: '192.168.1.2' },
    carpVips: [
        { vhid: 1, ip: '203.0.113.1', status: 'MASTER' },
        { vhid: 2, ip: '192.168.1.254', status: 'MASTER' },
        { vhid: 3, ip: '10.10.0.1', status: 'BACKUP' },
    ]
  };

  return { firewallRules, systemLogs, trafficData, vpnConnections, siteToSiteVPNs, systemMetrics, firewallLogs, threatLogs, aliases, users, arpTable, firewallStates, systemActivity, routingTable, authLogs, ndpTable, smartStatus, sockets, statesSummary, pfTables, haStatus };
};


export const pfSenseService = {
  fetchDashboardData: (): Promise<PfSenseData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockData());
      }, 500);
    });
  },
};
