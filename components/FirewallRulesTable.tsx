import React from 'react';
import { FirewallRule } from '../types';

interface FirewallRulesTableProps {
  rules: FirewallRule[];
}

const getActionClass = (action: 'pass' | 'block' | 'reject') => {
  switch (action) {
    case 'pass': return 'text-accent-green';
    case 'block': return 'text-accent-red';
    case 'reject': return 'text-accent-yellow';
    default: return 'text-gray-400';
  }
};

const isRuleDangerous = (rule: FirewallRule): boolean => {
    return rule.source === 'any' && rule.destination === 'any' && rule.action === 'pass';
}

const FirewallRulesTable: React.FC<FirewallRulesTableProps> = ({ rules }) => {
  return (
    <div className="overflow-x-auto h-80">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Action</th>
            <th scope="col" className="px-4 py-3">Interface</th>
            <th scope="col" className="px-4 py-3">Protocol</th>
            <th scope="col" className="px-4 py-3">Source</th>
            <th scope="col" className="px-4 py-3">Destination</th>
            <th scope="col" className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className={`border-b border-gray-700 hover:bg-gray-600 ${isRuleDangerous(rule) ? 'bg-red-900/50' : ''}`}>
              <td className={`px-4 py-2 font-medium ${getActionClass(rule.action)}`}>
                {rule.action.toUpperCase()}
              </td>
              <td className="px-4 py-2">{rule.interface}</td>
              <td className="px-4 py-2">{rule.protocol}</td>
              <td className="px-4 py-2">{rule.source}</td>
              <td className="px-4 py-2">{rule.destination}</td>
              <td className="px-4 py-2">
                <div className="flex items-center space-x-2">
                    <span>{rule.description}</span>
                    {isRuleDangerous(rule) && (
                        <span className="text-xs font-bold text-gray-900 bg-accent-yellow px-2 py-0.5 rounded-full">
                           ⚠️ Insecure
                        </span>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FirewallRulesTable;