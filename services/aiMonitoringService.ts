import { PfSenseData, BaselineMetrics, AIInsight } from '../types';

const getInitialKnowledgeBase = (): BaselineMetrics => ({
    dataPoints: 0,
    avgCpu: 0,
    maxCpu: 0,
    avgMem: 0,
    maxMem: 0,
    avgVpnUsers: 0,
    maxVpnUsers: 0,
    peakTrafficIn: 0,
    peakTrafficOut: 0,
    commonBlockedPorts: {},
    avgLatency: 0,
    maxLatency: 0,
    avgJitter: 0,
});

const STORAGE_KEYS = {
    KNOWLEDGE_BASE: 'pfsense_ai_knowledge_base',
    INSIGHTS: 'pfsense_ai_insights',
};

// --- Local Storage Management ---
export const aiMonitoringService = {
    loadKnowledgeBase: (username: string): BaselineMetrics => {
        try {
            const key = `${STORAGE_KEYS.KNOWLEDGE_BASE}_${username}`;
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : getInitialKnowledgeBase();
        } catch (e) {
            console.error("Failed to load knowledge base:", e);
            return getInitialKnowledgeBase();
        }
    },

    saveKnowledgeBase: (username: string, kb: BaselineMetrics): void => {
        try {
            const key = `${STORAGE_KEYS.KNOWLEDGE_BASE}_${username}`;
            localStorage.setItem(key, JSON.stringify(kb));
        } catch (e) {
            console.error("Failed to save knowledge base:", e);
        }
    },

    loadInsights: (username: string): AIInsight[] => {
        try {
            const key = `${STORAGE_KEYS.INSIGHTS}_${username}`;
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : [];
        } catch(e) {
            console.error("Failed to load insights:", e);
            return [];
        }
    },
    
    saveInsights: (username: string, insights: AIInsight[]): void => {
        try {
            const key = `${STORAGE_KEYS.INSIGHTS}_${username}`;
            // Limit stored insights to prevent localStorage from filling up
            const limitedInsights = insights.slice(-50); 
            localStorage.setItem(key, JSON.stringify(limitedInsights));
        } catch (e) {
            console.error("Failed to save insights:", e);
        }
    },

    // --- Core Analysis Logic ---
    processDataTick: (
        currentData: PfSenseData,
        currentKB: BaselineMetrics
    ): { newKB: BaselineMetrics; newInsights: AIInsight[] } => {
        
        let newKB = { ...currentKB };
        const newInsights: AIInsight[] = [];
        const now = new Date();

        // --- 1. Update Baselines (Learning) ---
        const n = newKB.dataPoints;
        const currentLatency = currentData.systemMetrics.internetLatency.average;
        const currentJitter = currentData.systemMetrics.internetLatency.std_dev;

        // System metrics
        newKB.avgCpu = (newKB.avgCpu * n + currentData.systemMetrics.cpuUsage) / (n + 1);
        newKB.avgMem = (newKB.avgMem * n + currentData.systemMetrics.memoryUsage) / (n + 1);
        newKB.avgVpnUsers = (newKB.avgVpnUsers * n + currentData.vpnConnections.length) / (n + 1);
        
        // Latency metrics
        newKB.avgLatency = (newKB.avgLatency * n + currentLatency) / (n + 1);
        newKB.avgJitter = (newKB.avgJitter * n + currentJitter) / (n + 1);
        
        newKB.dataPoints++;

        // Max values
        if (currentData.systemMetrics.cpuUsage > newKB.maxCpu) newKB.maxCpu = currentData.systemMetrics.cpuUsage;
        if (currentData.systemMetrics.memoryUsage > newKB.maxMem) newKB.maxMem = currentData.systemMetrics.memoryUsage;
        if (currentLatency > newKB.maxLatency) newKB.maxLatency = currentLatency;

        if (currentData.vpnConnections.length > newKB.maxVpnUsers) {
            newKB.maxVpnUsers = currentData.vpnConnections.length;
            if (newKB.dataPoints > 10) { // Avoid firing on initial learning
                 newInsights.push({
                    id: crypto.randomUUID(),
                    timestamp: now.toISOString(),
                    type: 'pattern',
                    severity: 'low',
                    description: `Um novo pico de ${newKB.maxVpnUsers} usuários de VPN simultâneos foi observado.`
                });
            }
        }
        
        // --- 2. Anomaly & Pattern Detection ---

        // CPU Anomaly
        if (newKB.dataPoints > 20 && currentData.systemMetrics.cpuUsage > newKB.avgCpu * 2 && newKB.avgCpu > 10) {
            newInsights.push({
                id: crypto.randomUUID(),
                timestamp: now.toISOString(),
                type: 'anomaly',
                severity: 'medium',
                description: `Pico de CPU detectado: ${currentData.systemMetrics.cpuUsage}% (a média é ${newKB.avgCpu.toFixed(1)}%).`
            });
        }

        // Latency Anomaly
        if (newKB.dataPoints > 20 && currentLatency > newKB.avgLatency * 2.5 && newKB.avgLatency > 10) {
             newInsights.push({
                id: crypto.randomUUID(),
                timestamp: now.toISOString(),
                type: 'anomaly',
                severity: 'medium',
                description: `Pico de latência detectado: ${currentLatency.toFixed(0)}ms (a média é ${newKB.avgLatency.toFixed(0)}ms).`
            });
        }
         // High Jitter Anomaly
         if (newKB.dataPoints > 20 && currentJitter > newKB.avgJitter * 2.5 && newKB.avgJitter > 5) {
            newInsights.push({
               id: crypto.randomUUID(),
               timestamp: now.toISOString(),
               type: 'anomaly',
               severity: 'low',
               description: `Jitter de conexão elevado detectado: ${currentJitter.toFixed(0)}ms (a média é ${newKB.avgJitter.toFixed(0)}ms).`
           });
       }

        // HA Sync Anomaly
        if (currentData.haStatus.enabled && currentData.haStatus.syncStatus === 'Out of Sync') {
             newInsights.push({
                id: crypto.randomUUID(),
                timestamp: now.toISOString(),
                type: 'anomaly',
                severity: 'high',
                description: `Alerta de Alta Disponibilidade: O cluster está fora de sincronia.`
            });
        }
        
        // --- 3. Suggestions ---

        // Insecure Rule Detection
        const insecureRules = currentData.firewallRules.filter(r => r.source === 'any' && r.destination === 'any' && r.action === 'pass');
        if (insecureRules.length > 0) {
            newInsights.push({
                id: crypto.randomUUID(),
                timestamp: now.toISOString(),
                type: 'suggestion',
                severity: 'high',
                description: `Encontrada(s) ${insecureRules.length} regra(s) de firewall insegura(s) ("Permitir Tudo da Origem Qualquer"). Considere restringir a origem e o destino.`
            });
        }

        // Brute-force attempt detection
        const sshdFailures = currentData.systemLogs.filter(log => log.process === 'sshd' && log.message.toLowerCase().includes('failed'));
        if (sshdFailures.length > 3) {
            const sourceIp = sshdFailures[0].sourceIp || 'um IP desconhecido';
             newInsights.push({
                id: crypto.randomUUID(),
                timestamp: now.toISOString(),
                type: 'suggestion',
                severity: 'medium',
                description: `Múltiplas falhas de login SSH (${sshdFailures.length}) detectadas de ${sourceIp}. Considere bloquear este IP.`
            });
        }

        // Sustained High Latency Suggestion
        if (newKB.dataPoints > 50 && newKB.avgLatency > 80) { // 80ms is a high average
            newInsights.push({
                id: crypto.randomUUID(),
                timestamp: now.toISOString(),
                type: 'suggestion',
                severity: 'medium',
                description: `A latência média da conexão está consistentemente alta em ${newKB.avgLatency.toFixed(0)}ms. Considere verificar a qualidade da sua linha de ISP ou investigar o congestionamento da rede.`
            });
        }


        return { newKB, newInsights };
    }
};