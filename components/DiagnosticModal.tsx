
import React, { useState, useEffect } from 'react';
import { DiagnosticToolType } from '../App';
import { runPing, runTraceroute, runDnsLookup } from '../services/diagnosticsService';

interface DiagnosticModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: DiagnosticToolType;
    target: string;
}

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, tool, target }) => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const runCommand = async () => {
                setLoading(true);
                const toolName = tool.charAt(0).toUpperCase() + tool.slice(1);
                setResult(`Running ${toolName} on ${target}...`);
                
                let output = '';
                try {
                    switch (tool) {
                        case 'ping':
                            output = await runPing(target);
                            break;
                        case 'traceroute':
                            output = await runTraceroute(target);
                            break;
                        case 'dnslookup':
                            output = await runDnsLookup(target);
                            break;
                    }
                } catch (e) {
                    output = `Error running ${tool}: ${e instanceof Error ? e.message : 'Unknown error'}`;
                }
                
                setResult(output);
                setLoading(false);
            };
            runCommand();
        }
    }, [isOpen, tool, target]);

    if (!isOpen) return null;

    const toolName = tool.charAt(0).toUpperCase() + tool.slice(1);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-white">
                        {loading ? `Running ${toolName}...` : `${toolName} Results for ${target}`}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    <pre className="bg-gray-900 p-4 rounded-md font-mono text-xs text-gray-300 h-full whitespace-pre-wrap">
                        {result}
                    </pre>
                </div>
                <div className="p-4 border-t border-gray-700 text-right">
                    <button 
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticModal;
