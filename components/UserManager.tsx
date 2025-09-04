import React, { useState } from 'react';
import { User } from '../types';
import AddUserModal from './AddUserModal';
import ConfirmModal from './ConfirmModal';

interface UserManagerProps {
  users: User[];
  currentUser: User | null;
  onUpdateUsers: (updatedUsers: User[]) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, currentUser, onUpdateUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  const isAdmin = currentUser?.role === 'admin';

  const handleAdd = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const handleSaveUser = (userToSave: User) => {
    let updatedUsers;
    if (userToEdit) {
      updatedUsers = users.map(u => u.username === userToEdit.username ? userToSave : u);
    } else {
      if (users.some(u => u.username === userToSave.username)) {
        alert("A user with that username already exists.");
        return;
      }
      updatedUsers = [...users, userToSave];
    }
    onUpdateUsers(updatedUsers);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(u => u.username !== userToDelete.username);
      onUpdateUsers(updatedUsers);
      setUserToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div>
      {isAdmin && (
        <div className="mb-4 flex justify-end space-x-2">
           <button onClick={handleAdd} className="bg-accent-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300">
            Add User
          </button>
        </div>
      )}
      <div className="overflow-x-auto h-[32rem]">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Username</th>
              <th scope="col" className="px-4 py-3">Full Name</th>
              <th scope="col" className="px-4 py-3">Groups</th>
              {isAdmin && <th scope="col" className="px-4 py-3">Actions</th>}
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
                {isAdmin && (
                    <td className="px-4 py-2 space-x-2">
                        <button onClick={() => handleEdit(user)} className="text-accent-blue hover:underline text-xs">Edit</button>
                        <button onClick={() => handleDelete(user)} className="text-accent-red hover:underline text-xs">Delete</button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <AddUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete User"
        message={`Are you sure you want to delete the user "${userToDelete?.username}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default UserManager;