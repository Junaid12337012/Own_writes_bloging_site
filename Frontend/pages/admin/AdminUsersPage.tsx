import React, { useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { Trash2Icon } from '../../components/icons';
import { useData } from '../../hooks/useData';
import { User } from '../../types';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { useAuth } from '../../hooks/useAuth';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`${
      checked ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed`}
    role="switch"
    aria-checked={checked}
  >
    <span
      aria-hidden="true"
      className={`${
        checked ? 'translate-x-5' : 'translate-x-0'
      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);


const AdminUsersPage: React.FC = () => {
  const { users, updateUser, deleteUser, loading, refreshUsers } = useData();
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Refresh users on component mount
  React.useEffect(() => {
    refreshUsers();
  }, []); // Empty dependency array to run only once
    
  const handleDeleteClick = (id: string, name: string) => {
    if (currentUser && id === currentUser.id) {
        toast.error("You cannot delete your own account.");
        return;
    }
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
        deleteUser(deleteTarget.id);
        toast.success(`User "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
    }
  };

  const handleToggleAdmin = (user: User) => {
    if (currentUser && user.id === currentUser.id) {
        toast.error("You cannot change your own admin status.");
        return;
    }
    updateUser({ ...user, isAdmin: !user.isAdmin });
    toast.success(`Permissions for ${user.name} updated.`);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        {loading.users ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">No users found.</p>
            <button 
              onClick={refreshUsers}
              className="mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3 min-w-[200px]">Name</th>
                  <th scope="col" className="px-6 py-3 min-w-[200px]">Email</th>
                  <th scope="col" className="px-6 py-3">Is Admin</th>
                  <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {user.name}
                    </th>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <ToggleSwitch 
                        checked={user.isAdmin || false} 
                        onChange={() => handleToggleAdmin(user)}
                        disabled={currentUser?.id === user.id}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteClick(user.id, user.name)} 
                        disabled={currentUser?.id === user.id}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline p-1 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete the user "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

export default AdminUsersPage;