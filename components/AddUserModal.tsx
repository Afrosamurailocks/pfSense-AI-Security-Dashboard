import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit: User | null;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
  const initialFormState = {
    username: '',
    fullName: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    disabled: false,
    groups: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const isEditing = !!userToEdit;

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({
          ...userToEdit,
          password: '', // For security, don't display the password
          groups: userToEdit.groups.join(', '),
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, userToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !formData.password) {
        alert("Password is required for new users.");
        return;
    }

    const userToSave: User = {
      username: formData.username,
      fullName: formData.fullName,
      groups: formData.groups.split(',').map(g => g.trim()).filter(Boolean),
      disabled: formData.disabled,
      role: formData.role,
      password: formData.password || userToEdit?.password, // Keep old password if field is blank on edit
    };
    onSave(userToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit User' : 'Add New User'}</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={isEditing} required className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue" />
              </div>
               <div>
                <label className="block text-gray-400 mb-1 text-sm">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditing ? 'Leave blank to keep current password' : ''} required={!isEditing} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue" />
              </div>
               <div>
                <label className="block text-gray-400 mb-1 text-sm">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Groups</label>
                <input type="text" name="groups" value={formData.groups} onChange={handleChange} placeholder="e.g., vpn_users, readonly" className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue" />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list of groups.</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="disabled" name="disabled" checked={formData.disabled} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue" />
                <label htmlFor="disabled" className="ml-2 text-sm text-gray-300">Account Disabled</label>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 px-6 py-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm">Cancel</button>
            <button type="submit" className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm">{isEditing ? 'Save Changes' : 'Create User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
