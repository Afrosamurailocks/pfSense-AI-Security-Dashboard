
import React from 'react';
import { User } from '../types';

interface UserManagerProps {
  users: User[];
}

const UserManager: React.FC<UserManagerProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto h-[32rem]">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Username</th>
            <th scope="col" className="px-4 py-3">Full Name</th>
            <th scope="col" className="px-4 py-3">Groups</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username} className={`border-b border-gray-700 hover:bg-gray-600 ${user.disabled ? 'opacity-50' : ''}`}>
              <td className="px-4 py-2">
                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${user.disabled ? 'bg-gray-500' : 'bg-accent-green'}`}>
                  {user.disabled ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  )}
                </span>
              </td>
              <td className="px-4 py-2 font-medium">{user.username}</td>
              <td className="px-4 py-2">{user.fullName}</td>
              <td className="px-4 py-2">
                {user.groups.length > 0 ? user.groups.join(', ') : <span className="text-gray-500">None</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
