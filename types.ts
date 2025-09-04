export interface FirewallRule {
  id: number;
  action: 'pass' | 'block' | 'reject';
  interface: 'WAN' | 'LAN' | 'OPT1';
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  source: string;
  destination: string;
  description: string;
}

export interface SystemLog {
  timestamp: string;
  process: string;
  message: string;
  sourceIp?: string;
}

export interface TrafficPoint {
  time: string;
  in: number; // in KB/s
  out: number; // in KB/s
}

export interface VPNConnection {
  user: string;
  server: string; // e.g., 'Main Office VPN', 'Development VPN'
  remoteIp: string;
  virtualIp: string;
  connectedSince: string;
  duration: string;
  idleTime: string;
  protocol: 'OpenVPN' | 'WireGuard' | 'IPsec';
}

export interface Phase1Status {
  status: 'Established' | 'Connecting' | 'Disconnected';
  algorithm: string; 
  lifetime: string;
}

export interface Phase2Status {
  status: 'Established' | 'Connecting' | 'Disconnected';
  localSubnet: string;
  remoteSubnet: string;
  protocol: 'ESP' | 'AH';
  algorithm: string;
  lifetime: string;
}

export interface SiteToSiteVPN {
  id: number;
  name: string;
  protocol: 'IPsec' | 'OpenVPN';
  status: 'Up' | 'Down';
  localEndpoint: string;
  remoteEndpoint: string;
  uptime: string;
  latency: string;
  dataIn: string;
  dataOut: string;
  phase1?: Phase1Status;
  phase2?: Phase2Status;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temperature: number;
  internetLatency: {
    average: number; // in ms
    std_dev: number; // jitter in ms
  };
}

export interface FirewallLog {
  timestamp: string;
  interface: 'WAN' | 'LAN';
  action: 'pass' | 'block';
  protocol: 'TCP' | 'UDP' | 'ICMP';
  sourceIp: string;
  sourcePort: string;
  destinationIp: string;
  destinationPort: string;
}

export interface ThreatLogEntry {
  timestamp: string;
  type: 'System Alert' | 'Firewall Block';
  sourceIp: string;
  destination: string;
  protocol?: string;
  reason: string;
}

export interface Alias {
  name: string;
  type: 'Hosts' | 'Networks' | 'Ports';
  values: string[];
  description: string;
}

export interface User {
  username: string;
  fullName: string;
  groups: string[];
  disabled: boolean;
  role: 'admin' | 'user';
  password?: string;
}

export interface ArpEntry {
  ip: string;
  mac: string;
  interface: 'LAN' | 'WAN';
  hostname?: string;
}

export interface FirewallState {
  id: string;
  interface: 'LAN' | 'WAN';
  protocol: string;
  source: string;
  destination: string;
  state: string;
  packets: string;
  bytes: string;
}

export interface SystemProcess {
    pid: string;
    user: string;
    cpu: string;
    mem: string;
    time: string;
    command: string;
}

export interface RouteEntry {
    destination: string;
    gateway: string;
    flags: string;
    netif: string;
}

export interface AuthenticationLog {
  timestamp: string;
  user: string;
  ip: string;
  status: 'Success' | 'Failure';
}

export interface NdpEntry {
  ip: string;
  mac: string;
  interface: string;
  state: string;
}

export interface SmartStatus {
  device: string;
  status: 'OK' | 'Failing' | 'Error';
  temperature: string;
  attributes: { id: string; name: string; value: string; worst: string; threshold: string; status: 'OK' | 'FAILING' }[];
}

export interface SocketInfo {
  proto: 'tcp' | 'udp' | 'tcp6' | 'udp6';
  recvQ: string;
  sendQ: string;
  localAddress: string;
  foreignAddress: string;
  state: string;
  pid: string;
  program: string;
}

export interface StatesSummary {
    total: number;
    tcp: number;
    udp: number;
    icmp: number;
    other: number;
}

export interface TableEntry {
    name: string;
    entries: number;
    ips: string[];
}

// High Availability Status
export interface CarpVip {
  vhid: number;
  ip: string;
  status: 'MASTER' | 'BACKUP' | 'INIT';
}

export interface HANodeStatus {
  name: string;
  role: 'MASTER' | 'BACKUP';
  ip: string;
}

export interface HAStatus {
  enabled: boolean;
  syncStatus: 'In Sync' | 'Out of Sync';
  lastSync: string;
  localNode: HANodeStatus;
  remoteNode: HANodeStatus;
  carpVips: CarpVip[];
}

export interface IntegrationSettings {
    status: 'Connected' | 'Not Configured' | 'Error';
    hostname: string;
    clientId: string;
    clientToken: string;
}

// Report Generation
export interface ReportSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface GeneratedReport {
  title: string;
  generatedAt: string;
  sections: ReportSection[];
}


export interface PfSenseData {
    firewallRules: FirewallRule[];
    systemLogs: SystemLog[];
    trafficData: TrafficPoint[];
    vpnConnections: VPNConnection[];
    siteToSiteVPNs: SiteToSiteVPN[];
    systemMetrics: SystemMetrics;
    firewallLogs: FirewallLog[];
    threatLogs: ThreatLogEntry[];
    aliases: Alias[];
    users: User[];
    arpTable: ArpEntry[];
    firewallStates: FirewallState[];
    systemActivity: SystemProcess[];
    routingTable: RouteEntry[];
    authLogs: AuthenticationLog[];
    ndpTable: NdpEntry[];
    smartStatus: SmartStatus[];
    sockets: SocketInfo[];
    statesSummary: StatesSummary;
    pfTables: TableEntry[];
    haStatus: HAStatus;
    integrationSettings: IntegrationSettings;
}

// Custom Dashboard
export type WidgetType = 
  | 'cpu_usage_kpi' 
  | 'memory_usage_kpi' 
  | 'vpn_users_kpi' 
  | 'firewall_temp_kpi'
  | 'traffic_chart'
  | 'ha_status'
  | 'threat_log'
  | 'system_logs'
  | 'firewall_logs'
  | 'firewall_rules';

export interface WidgetConfig {
  id: string; // Unique ID for the widget instance
  type: WidgetType;
}

// AI Monitoring Agent
export interface BaselineMetrics {
  dataPoints: number;
  avgCpu: number;
  maxCpu: number;
  avgMem: number;
  maxMem: number;
  avgVpnUsers: number;
  maxVpnUsers: number;
  peakTrafficIn: number;
  peakTrafficOut: number;
  commonBlockedPorts: Record<string, number>;
  avgLatency: number;
  maxLatency: number;
  avgJitter: number;
}

export interface AIInsight {
  id: string;
  timestamp: string;
  type: 'anomaly' | 'pattern' | 'suggestion';
  severity: 'low' | 'medium' | 'high';
  description: string;
}