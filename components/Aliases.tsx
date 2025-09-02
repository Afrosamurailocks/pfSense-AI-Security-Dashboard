
import React from 'react';
import { Alias } from '../types';

interface AliasesProps {
  aliases: Alias[];
}

const Aliases: React.FC<AliasesProps> = ({ aliases }) => {
  return (
    <div className="overflow-x-auto h-[32rem]">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Values</th>
            <th scope="col" className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {aliases.map((alias) => (
            <tr key={alias.name} className="border-b border-gray-700 hover:bg-gray-600">
              <td className="px-4 py-2 font-medium text-accent-blue">{alias.name}</td>
              <td className="px-4 py-2">{alias.type}</td>
              <td className="px-4 py-2 font-mono text-xs">
                {alias.values.map(val => (
                  <span key={val} className="inline-block bg-gray-900 rounded px-2 py-1 mr-1 mb-1">{val}</span>
                ))}
              </td>
              <td className="px-4 py-2">{alias.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Aliases;
