import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EditIcon, Trash2Icon } from '../../components/icons';
import { useData } from '../../hooks/useData';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminPagesPage: React.FC = () => {
  const { pages } = useData();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Site Pages</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Slug</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {page.title}
                  </th>
                  <td className="px-6 py-4">/{page.slug}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end space-x-3">
                    <Link to={`/admin/pages/edit/${page.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        <EditIcon className="w-5 h-5" />
                    </Link>
                    <button disabled={!page.isDeletable} className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed">
                        <Trash2Icon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPagesPage;