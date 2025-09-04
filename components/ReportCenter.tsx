import React, { useState } from 'react';
import { PfSenseData, GeneratedReport, ReportSection } from '../types';
import { generateReportSummary } from '../services/geminiService';
import ReportModal from './ReportModal';

interface ReportCenterProps {
  data: PfSenseData;
}

const ReportCenter: React.FC<ReportCenterProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    system: true,
    firewall: true,
    threats: true,
    vpn: true,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedSections(prev => ({ ...prev, [name]: checked }));
  };

  const generateReport = async () => {
    setLoading(true);
    setReport(null);

    const sections: ReportSection[] = [];

    if (selectedSections.summary) {
      const summaryContent = await generateReportSummary(data);
      sections.push({
        id: 'summary',
        title: 'Resumo Executivo (IA)',
        content: <p className="text-gray-300 whitespace-pre-wrap">{summaryContent}</p>,
      });
    }

    if (selectedSections.system) {
      sections.push({
        id: 'system',
        title: 'Status do Sistema e Alta Disponibilidade',
        content: (
          <ul className="list-disc pl-5">
            <li>Uso de CPU: {data.systemMetrics.cpuUsage}%</li>
            <li>Uso de Memória: {data.systemMetrics.memoryUsage}%</li>
            <li>Status da Sincronização HA: {data.haStatus.syncStatus}</li>
            <li>Nó Local: {data.haStatus.localNode.role}</li>
          </ul>
        ),
      });
    }

    if (selectedSections.firewall) {
        const insecureRules = data.firewallRules.filter(r => r.source === 'any' && r.destination === 'any' && r.action === 'pass');
        sections.push({
          id: 'firewall',
          title: 'Análise de Regras do Firewall',
          content: (
            <ul className="list-disc pl-5">
                <li>Total de Regras: {data.firewallRules.length}</li>
                <li className={insecureRules.length > 0 ? 'text-accent-yellow' : ''}>
                    Regras Inseguras ('Permitir Tudo'): {insecureRules.length}
                </li>
            </ul>
          ),
        });
      }
  
      if (selectedSections.threats) {
        sections.push({
          id: 'threats',
          title: 'Resumo do Log de Ameaças',
          content: (
             <ul className="list-disc pl-5">
                <li>Total de Ameaças Detectadas: {data.threatLogs.length}</li>
                <li>Alertas do Sistema (ex: falha de login): {data.threatLogs.filter(t => t.type === 'System Alert').length}</li>
                <li>Bloqueios do Firewall: {data.threatLogs.filter(t => t.type === 'Firewall Block').length}</li>
            </ul>
          ),
        });
      }
  
      if (selectedSections.vpn) {
        sections.push({
          id: 'vpn',
          title: 'Atividade de VPN',
          content: (
            <ul className="list-disc pl-5">
                <li>Usuários Ativos (Acesso Remoto): {data.vpnConnections.length}</li>
                <li>Túneis Site-to-Site Ativos: {data.siteToSiteVPNs.filter(v => v.status === 'Up').length} de {data.siteToSiteVPNs.length}</li>
            </ul>
          ),
        });
      }

    setReport({
      title: 'Relatório de Segurança do pfSense',
      generatedAt: new Date().toLocaleString('pt-BR'),
      sections,
    });
    
    setLoading(false);
    setIsModalOpen(true);
  };

  const reportOptions = [
    { id: 'summary', label: 'Resumo Executivo (IA)' },
    { id: 'system', label: 'Status do Sistema e HA' },
    { id: 'firewall', label: 'Análise de Regras do Firewall' },
    { id: 'threats', label: 'Log de Ameaças' },
    { id: 'vpn', label: 'Atividade de VPN' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Centro de Relatórios</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-white">Gerar Relatório de Segurança</h3>
        <p className="text-sm text-gray-400 mt-1 mb-6">Selecione as seções a serem incluídas no relatório. O Resumo Executivo é gerado por IA para fornecer uma visão geral de alto nível.</p>
        
        <div className="space-y-3 mb-6">
            {reportOptions.map(option => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name={option.id}
                        checked={selectedSections[option.id as keyof typeof selectedSections]}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">{option.label}</span>
                </label>
            ))}
        </div>

        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando...
            </>
          ) : 'Gerar Relatório'}
        </button>
      </div>

      {report && (
        <ReportModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          report={report}
        />
      )}
    </div>
  );
};

export default ReportCenter;
