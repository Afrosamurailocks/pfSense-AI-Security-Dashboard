import React from 'react';
import { SmartStatus as SmartStatusType } from '../types';

interface SmartStatusProps {
  smartStatus: SmartStatusType[];
}

const getStatusClass = (status: string) => {
    if (status.toUpperCase() === 'OK') return 'text-accent-green';
    if (status.toUpperCase().includes('FAIL')) return 'text-accent-yellow';
    return 'text-accent-red';
};

const SmartStatus: React.FC<SmartStatusProps> = ({ smartStatus }) => {
  return (
    <div className="space-y-6 h-[32rem] overflow-y-auto pr-2">
      {smartStatus.length > 0 ? smartStatus.map((device, index) => (
        <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
            <div>
                <h3 className="font-bold text-lg font-mono text-white">{device.device}</h3>
                <p className="text-xs text-gray-400">Temperature: {device.temperature}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400 mr-2">Overall Status:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-sm ${getStatusClass(device.status)}`}>
                {device.status}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left text-gray-300 font-mono">
                <thead className="text-gray-400">
                <tr>
                    <th scope="col" className="px-3 py-2">ID</th>
                    <th scope="col" className="px-3 py-2">Attribute Name</th>
                    <th scope="col" className="px-3 py-2 text-right">Value</th>
                    <th scope="col" className="px-3 py-2 text-right">Worst</th>
                    <th scope="col" className="px-3 py-2 text-right">Threshold</th>
                    <th scope="col" className="px-3 py-2 text-center">Status</th>
                </tr>
                </thead>
                <tbody>
                {device.attributes.map(attr => (
                    <tr key={attr.id} className="border-t border-gray-600/50">
                    <td className="px-3 py-2 font-semibold">{attr.id}</td>
                    <td className="px-3 py-2 text-gray-400">{attr.name}</td>
                    <td className="px-3 py-2 text-right">{attr.value}</td>
                    <td className="px-3 py-2 text-right">{attr.worst}</td>
                    <td className="px-3 py-2 text-right">{attr.threshold}</td>
                    <td className={`px-3 py-2 font-semibold text-center ${getStatusClass(attr.status)}`}>{attr.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )) : (
         <div className="text-center py-10 text-gray-500">No S.M.A.R.T. status data available.</div>
      )}
    </div>
  );
};

export default SmartStatus;
