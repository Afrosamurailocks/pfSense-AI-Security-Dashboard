import React, { useState, useEffect } from 'react';
import { IntegrationSettings as IntegrationSettingsType } from '../types';

interface IntegrationSettingsProps {
    settings: IntegrationSettingsType;
    onSave: (settings: IntegrationSettingsType) => void;
}

const getStatusIndicator = (status: IntegrationSettingsType['status']) => {
    switch(status) {
        case 'Connected':
            return <div className="flex items-center space-x-2"><span className="h-3 w-3 rounded-full bg-accent-green"></span><span className="text-accent-green">Conectado</span></div>;
        case 'Error':
             return <div className="flex items-center space-x-2"><span className="h-3 w-3 rounded-full bg-accent-red"></span><span className="text-accent-red">Falha na Conexão</span></div>;
        case 'Not Configured':
        default:
             return <div className="flex items-center space-x-2"><span className="h-3 w-3 rounded-full bg-gray-500"></span><span className="text-gray-400">Não Configurado</span></div>;
    }
}

const ConnectionSettings: React.FC<IntegrationSettingsProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState(settings);
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTest = async () => {
        setTestStatus('testing');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        if (formData.hostname.includes('pfsense') && formData.clientId && formData.clientToken === 'secret-token') {
            setTestStatus('success');
        } else {
            setTestStatus('error');
        }
    };

    const handleSave = () => {
        const newStatus = testStatus === 'success' ? 'Connected' : 'Error';
        onSave({ ...formData, status: newStatus });
        setTestStatus('idle'); // Reset test status after save
    };
    
    return (
        <div className="space-y-6">
             <div>
                <h3 className="text-lg font-bold text-white">Conexão com o pfSense</h3>
                <p className="text-sm text-gray-400 mt-1">Configure as definições da API para conectar este dashboard à sua instância do pfSense.</p>
             </div>
             <div className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                 <span className="font-medium text-gray-300">Status da Conexão</span>
                 {getStatusIndicator(formData.status)}
             </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Hostname ou IP do pfSense</label>
                    <input type="text" name="hostname" value={formData.hostname} onChange={handleChange} placeholder="ex: pfsense.local.lan ou 192.168.1.1" className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
                 <div>
                    <label className="block text-gray-400 mb-1 text-sm">Client ID da API</label>
                    <input type="text" name="clientId" value={formData.clientId} onChange={handleChange} placeholder="Gerado no pacote de API do pfSense" className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
                 <div>
                    <label className="block text-gray-400 mb-1 text-sm">Client Token da API</label>
                    <input type="password" name="clientToken" value={formData.clientToken} onChange={handleChange} placeholder="Gerado no pacote de API do pfSense" className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                </div>
            </div>
            
            {testStatus === 'success' && <div className="text-sm text-accent-green p-3 bg-green-900/50 rounded-md">Teste de conexão bem-sucedido! Por favor, salve suas configurações.</div>}
            {testStatus === 'error' && <div className="text-sm text-accent-red p-3 bg-red-900/50 rounded-md">Teste de conexão falhou. Por favor, verifique suas configurações e regras de firewall.</div>}

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                <button
                    onClick={handleTest}
                    disabled={testStatus === 'testing'}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50"
                >
                    {testStatus === 'testing' ? 'Testando...' : 'Testar Conexão'}
                </button>
                <button
                    onClick={handleSave}
                    className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm"
                >
                    Salvar Configurações
                </button>
            </div>
        </div>
    );
};

const IntegrationGuide: React.FC = () => {
    const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <pre className="bg-gray-900 rounded-md p-3 text-xs text-gray-300 font-mono my-2 overflow-x-auto">
            <code>{children}</code>
        </pre>
    );

    return (
        <div className="prose prose-sm prose-invert max-w-none text-gray-300 space-y-4">
            <h3 className="text-lg font-bold text-white">Guia de Integração</h3>
            <p>Este documento descreve a arquitetura e os passos necessários para conectar este dashboard a um firewall pfSense ativo. Como um navegador web não pode se conectar de forma direta e segura a um firewall, uma camada de API backend é necessária para atuar como um intermediário seguro.</p>
            
            <h4 className="font-bold text-md text-gray-200">1. Visão Geral da Arquitetura</h4>
            <p>A integração se baseia em uma arquitetura de três camadas:</p>
            <ul>
                <li><strong>Frontend:</strong> Esta aplicação React, que fornece a interface de usuário.</li>
                <li><strong>Backend API (Fornecido por Você):</strong> Uma aplicação de servidor (ex: Node.js, Python, Go) que você irá criar. Este backend é o único componente que se comunica diretamente com o pfSense.</li>
                <li><strong>Firewall pfSense:</strong> Sua instância ativa do pfSense.</li>
            </ul>
            <p>O fluxo de trabalho é o seguinte: O frontend solicita dados da sua API backend. Seu backend então se conecta de forma segura ao pfSense usando sua API, busca os dados brutos, formata-os em JSON e os retorna para o frontend.</p>

            <h4 className="font-bold text-md text-gray-200">2. Configuração do pfSense: API</h4>
            <p>A maneira mais robusta de extrair dados do pfSense é usando o pacote oficial `pfSense-pkg-API`. Isso fornece uma API RESTful para a maioria das funções do firewall.</p>
            <ol>
                <li>Navegue até <strong>System &gt; Package Manager &gt; Available Packages</strong> na sua interface web do pfSense.</li>
                <li>Procure por `API` e instale o pacote `pfSense-pkg-API`.</li>
                <li>Após a instalação, navegue até <strong>System &gt; API</strong>.</li>
                <li>Habilite a API e crie um novo conjunto de credenciais de API.</li>
                <li>
                    Guarde de forma segura o <strong>Client ID</strong> e o <strong>Client Token</strong> gerados. Estas são as credenciais que você irá inserir na aba 'Configurações' nesta página.
                </li>
                 <li>
                    <strong>Importante:</strong> Você deve criar uma regra de firewall na sua LAN (ou na interface onde seu servidor backend está) para permitir o acesso à porta da API do pfSense (geralmente HTTPS/443) a partir do endereço IP do seu servidor backend.
                </li>
            </ol>

            <h4 className="font-bold text-md text-gray-200">3. Configuração do pfSense: Encaminhamento de Logs</h4>
            <p>Para dados de log em tempo real, o melhor método é encaminhar os logs do pfSense para o seu backend via Syslog.</p>
            <ol>
                <li>Navegue até <strong>Status &gt; System Logs &gt; Settings</strong>.</li>
                <li>Na seção "Remote Logging Options", marque "Enable Remote Logging".</li>
                <li>Insira o endereço IP do seu servidor backend no campo "Remote log servers".</li>
                <li>Certifique-se de que "Everything" está marcado em "Remote Syslog Contents" para encaminhar todos os logs necessários.</li>
                <li>Seu backend precisará executar um servidor Syslog (existem muitas bibliotecas disponíveis para isso) para escutar e processar esses logs recebidos.</li>
            </ol>
            
            <h4 className="font-bold text-md text-gray-200">4. Implementação da API Backend</h4>
            <p>Seu servidor backend tem duas responsabilidades principais: fornecer endpoints de API para o frontend e buscar dados do pfSense.</p>
            <p>Você deve criar uma API que retorne um objeto JSON correspondente à estrutura definida no tipo `PfSenseData` da aplicação. Abaixo estão exemplos de chamadas de API que você faria ao pfSense para coletar os dados necessários.</p>
            <CodeBlock>
{`# Exemplos de chamadas de API usando curl (seu backend usaria um cliente HTTP)
# Substitua <pfsense_ip>, <client_id> e <client_token> com seus valores.

# Obter Regras do Firewall
curl -X GET https://<pfsense_ip>/api/v1/firewall/rule \\
     -H "Authorization: Bearer <client_id> <client_token>"

# Obter Informações do Sistema (para CPU, memória, etc.)
curl -X GET https://<pfsense_ip>/api/v1/status/system \\
     -H "Authorization: Bearer <client_id> <client_token>"

# Obter Estatísticas da Interface (para dados de tráfego)
curl -X GET https://<pfsense_ip>/api/v1/status/interface \\
     -H "Authorization: Bearer <client_id> <client_token>"
`}
            </CodeBlock>
            <p>Seu backend deve analisar as respostas desses endpoints e agregá-las em uma única resposta JSON para este frontend.</p>
        </div>
    );
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'settings' | 'guide'>('settings');

    const getTabClass = (tabName: 'settings' | 'guide') => {
        return `px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === tabName
            ? 'border-accent-blue text-white'
            : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
        }`;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Configurações de Integração</h2>
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('settings')} className={getTabClass('settings')}>Configurações</button>
                    <button onClick={() => setActiveTab('guide')} className={getTabClass('guide')}>Guia de Integração</button>
                </nav>
            </div>
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                {activeTab === 'settings' ? <ConnectionSettings {...props} /> : <IntegrationGuide />}
            </div>
        </div>
    );
};

export default IntegrationSettings;
