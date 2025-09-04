import React, { useState, useEffect } from 'react';
import { PfSenseData, AIInsight, BaselineMetrics, User } from '../types';
import { aiMonitoringService } from '../services/aiMonitoringService';

interface AIMonitoringAgentProps {
  data: PfSenseData | null;
  currentUser: User;
}

const getSeverityClasses = (severity: AIInsight['severity']): { bg: string, text: string, border: string } => {
    switch(severity) {
        case 'high': return { bg: 'bg-red-900/50', text: 'text-accent-red', border: 'border-accent-red' };
        case 'medium': return { bg: 'bg-yellow-900/50', text: 'text-accent-yellow', border: 'border-accent-yellow' };
        case 'low': 
        default: return { bg: 'bg-blue-900/50', text: 'text-accent-blue', border: 'border-accent-blue' };
    }
}

const getTypeIcon = (type: AIInsight['type']): React.ReactNode => {
    switch(type) {
        case 'anomaly': 
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
        case 'pattern':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
        case 'suggestion':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
    }
}

const AIMonitoringAgent: React.FC<AIMonitoringAgentProps> = ({ data, currentUser }) => {
    const [status, setStatus] = useState<'initializing' | 'monitoring' | 'analyzing'>('initializing');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [knowledgeBase, setKnowledgeBase] = useState<BaselineMetrics>(() => aiMonitoringService.loadKnowledgeBase(currentUser.username));

    useEffect(() => {
        // Load initial insights from storage on mount
        setInsights(aiMonitoringService.loadInsights(currentUser.username));

        const intervalId = setInterval(() => {
            if (data) {
                setStatus('analyzing');
                
                const { newKB, newInsights } = aiMonitoringService.processDataTick(data, knowledgeBase);
                
                setKnowledgeBase(newKB);
                aiMonitoringService.saveKnowledgeBase(currentUser.username, newKB);

                if (newInsights.length > 0) {
                    setInsights(prev => {
                        const updatedInsights = [...prev, ...newInsights].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                        aiMonitoringService.saveInsights(currentUser.username, updatedInsights);
                        return updatedInsights;
                    });
                }
                
                setLastUpdate(new Date());
                setStatus('monitoring');
            }
        }, 10000); // Analyze every 10 seconds

        return () => clearInterval(intervalId);
    }, [data, knowledgeBase, currentUser.username]);

    const handleReset = () => {
        if(window.confirm("Tem certeza de que deseja redefinir todos os dados aprendidos? O agente começará a aprender do zero.")) {
            aiMonitoringService.saveKnowledgeBase(currentUser.username, aiMonitoringService.loadKnowledgeBase('')); // Reset KB
            aiMonitoringService.saveInsights(currentUser.username, []); // Clear insights
            setKnowledgeBase(aiMonitoringService.loadKnowledgeBase(''));
            setInsights([]);
            setStatus('initializing');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agente de Monitoramento de IA</h2>
                    <p className="text-gray-400">Monitoramento contínuo, aprendizado de linha de base e insights proativos.</p>
                </div>
            </div>

            {/* Status Header */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="relative flex h-3 w-3">
                        {status === 'analyzing' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${status === 'monitoring' ? 'bg-accent-green' : 'bg-accent-blue'}`}></span>
                    </span>
                    <span className="font-semibold text-white capitalize">{status}...</span>
                </div>
                <div className="text-sm text-gray-400">
                    Última Análise: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Pendente'}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Learned Baselines */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Linhas de Base e Padrões Aprendidos</h3>
                    <p className="text-xs text-gray-500">O agente aprende esses valores ao longo do tempo para detectar anomalias. Pontos de dados analisados: {knowledgeBase.dataPoints}</p>
                    
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span>Uso Médio de CPU:</span> <span className="font-mono text-gray-200">{knowledgeBase.avgCpu.toFixed(1)}%</span></li>
                        <li className="flex justify-between"><span>Pico de CPU Registrado:</span> <span className="font-mono text-gray-200">{knowledgeBase.maxCpu.toFixed(1)}%</span></li>
                        <li className="flex justify-between"><span>Uso Médio de Memória:</span> <span className="font-mono text-gray-200">{knowledgeBase.avgMem.toFixed(1)}%</span></li>
                        <li className="flex justify-between"><span>Pico de Memória Registrado:</span> <span className="font-mono text-gray-200">{knowledgeBase.maxMem.toFixed(1)}%</span></li>
                        <li className="flex justify-between"><span>Média de Usuários de VPN:</span> <span className="font-mono text-gray-200">{knowledgeBase.avgVpnUsers.toFixed(1)}</span></li>
                        <li className="flex justify-between"><span>Pico de Usuários de VPN:</span> <span className="font-mono text-gray-200">{knowledgeBase.maxVpnUsers}</span></li>
                        <li className="flex justify-between border-t border-gray-700/50 pt-3 mt-3"><span>Latência Média da Conexão:</span> <span className="font-mono text-gray-200">{knowledgeBase.avgLatency.toFixed(1)} ms</span></li>
                        <li className="flex justify-between"><span>Pico de Latência Registrado:</span> <span className="font-mono text-gray-200">{knowledgeBase.maxLatency.toFixed(1)} ms</span></li>
                        <li className="flex justify-between"><span>Jitter Médio da Conexão:</span> <span className="font-mono text-gray-200">{knowledgeBase.avgJitter.toFixed(1)} ms</span></li>
                    </ul>

                     <button onClick={handleReset} className="w-full text-center bg-red-900/50 hover:bg-red-900 text-accent-red text-xs font-bold py-2 px-4 rounded-lg transition duration-300 mt-4">
                        Redefinir Dados Aprendidos
                    </button>
                </div>

                {/* Right Column: Insights Feed */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2 mb-4">Insights e Sugestões ao Vivo</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {insights.length > 0 ? insights.map(insight => {
                            const sev = getSeverityClasses(insight.severity);
                            return (
                                <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${sev.bg} ${sev.border}`}>
                                    <div className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 ${sev.text}`}>{getTypeIcon(insight.type)}</div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-200">{insight.description}</p>
                                            <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                                                 <span className={`font-bold capitalize ${sev.text}`}>{insight.severity}</span>
                                                 <span>&bull;</span>
                                                 <span>{new Date(insight.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="text-center py-10 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <p className="mt-2 font-semibold">Nenhum insight ainda.</p>
                                <p className="text-sm">O agente está coletando dados de linha de base. Insights aparecerão aqui quando anomalias ou padrões forem detectados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIMonitoringAgent;