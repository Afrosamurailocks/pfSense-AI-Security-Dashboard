import React from 'react';
import { SocketInfo } from '../types';

interface SocketsProps {
  sockets: SocketInfo[];
}

const Sockets: React.FC<SocketsProps> = ({ sockets }) => {
  return (
    <div className="overflow-x-auto h-[32rem]">
      <table className="min-w-full text-sm text-left text-gray-300 font-mono">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Proto</th>
            <th scope="col" className="px-4 py-3">Local Address</th>
            <th scope="col" className="px-4 py-3">Foreign Address</th>
            <th scope="col" className="px-4 py-3">State</th>
            <th scope="col" className="px-4 py-3">PID/Program</th>
          </tr>
        </thead>
        <tbody>
          {sockets.length > 0 ? sockets.map((socket, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-600">
              <td className="px-4 py-2">{socket.proto}</td>
              <td className="px-4 py-2">{socket.localAddress}</td>
              <td className="px-4 py-2">{socket.foreignAddress}</td>
              <td className="px-4 py-2">{socket.state || 'N/A'}</td>
              <td className="px-4 py-2">{socket.pid}/{socket.program}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">No active sockets found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Sockets;
