import React from 'react';
import { NdpEntry } from '../types';

interface NdpTableProps {
  ndpTable: NdpEntry[];
}

const NdpTable: React.FC<NdpTableProps> = ({ ndpTable }) => {
  return (
    <div className="overflow-x-auto h-[32rem]">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">IPv6 Address</th>
            <th scope="col" className="px-4 py-3">MAC Address</th>
            <th scope="col" className="px-4 py-3">Interface</th>
            <th scope="col" className="px-4 py-3">State</th>
          </tr>
        </thead>
        <tbody>
          {ndpTable.length > 0 ? ndpTable.map((entry, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-600">
              <td className="px-4 py-2 font-mono">{entry.ip}</td>
              <td className="px-4 py-2 font-mono">{entry.mac}</td>
              <td className="px-4 py-2">{entry.interface}</td>
              <td className="px-4 py-2">{entry.state}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">No NDP entries found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NdpTable;
