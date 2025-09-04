import React from 'react';
import { GeneratedReport } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: GeneratedReport;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-section, #print-section * {
              visibility: visible;
            }
            #print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
                display: none;
            }
             #print-section h2, #print-section h3 {
                color: black !important;
             }
             #print-section div, #print-section p, #print-section li {
                 color: #333 !important;
             }
          }
        `}
      </style>
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div 
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700 no-print">
            <h2 className="text-lg font-bold text-white">
              {report.title}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          <div className="p-6 flex-grow overflow-y-auto" id="print-section">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{report.title}</h2>
                <p className="text-sm text-gray-400">Gerado em: {report.generatedAt}</p>
            </div>
            <div className="space-y-6">
                {report.sections.map(section => (
                    <div key={section.id} className="bg-gray-900/50 p-4 rounded-md">
                        <h3 className="text-xl font-semibold text-accent-blue mb-3 border-b border-gray-600 pb-2">{section.title}</h3>
                        <div className="text-gray-300 text-sm">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-700 text-right space-x-2 no-print">
            <button 
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Imprimir Relatório
            </button>
            <button 
              onClick={onClose}
              className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportModal;
