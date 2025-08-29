import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';
import Accordion from '../../components/admin/Accordion';
import { UploadCloudIcon } from '../../components/icons';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const LogoUploader: React.FC<{
  label: string;
  logoUrl?: string;
  onLogoChange: (url: string) => void;
  onLogoRemove: () => void;
  id: string;
}> = ({ label, logoUrl, onLogoChange, onLogoRemove, id }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onLogoChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDraggingOver ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'} border-dashed rounded-md transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          {logoUrl ? (
            <div>
                <img src={logoUrl} alt="Logo preview" className="mx-auto h-12 w-auto" />
                <button
                    type="button"
                    onClick={onLogoRemove}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                >
                    Remove
                </button>
            </div>
          ) : (
            <>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 dark:text-slate-400">
                <label htmlFor={id} className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload a file</span>
                  <input ref={inputRef} id={id} name={id} onChange={handleFileChange} type="file" className="sr-only" accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF, SVG up to 1MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


const AdminSettingsPage: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useData();
  const [settings, setSettings] = useState(siteSettings);
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Site Settings</h1>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save All Settings'}
            </button>
        </div>
      
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg max-w-3xl mx-auto overflow-hidden">
          <Accordion title="General Settings" defaultOpen={true}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Site Title</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value={settings.title} 
                    onChange={handleChange} 
                    required 
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                    placeholder="Your awesome blog title"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Site Description</label>
                <textarea 
                    name="description" 
                    id="description" 
                    rows={3} 
                    value={settings.description} 
                    onChange={handleChange} 
                    required 
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                    placeholder="A short and catchy description for your site"
                ></textarea>
                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This appears in the footer and in search engine results.</p>
              </div>
            </div>
          </Accordion>
          
          <Accordion title="Branding">
            <div className="space-y-6">
                <LogoUploader
                    id="logo-light-uploader"
                    label="Logo (Light Mode)"
                    logoUrl={settings.logoLightUrl}
                    onLogoChange={(url) => setSettings(prev => ({ ...prev, logoLightUrl: url }))}
                    onLogoRemove={() => setSettings(prev => ({ ...prev, logoLightUrl: '' }))}
                />
                <LogoUploader
                    id="logo-dark-uploader"
                    label="Logo (Dark Mode)"
                    logoUrl={settings.logoDarkUrl}
                    onLogoChange={(url) => setSettings(prev => ({ ...prev, logoDarkUrl: url }))}
                    onLogoRemove={() => setSettings(prev => ({ ...prev, logoDarkUrl: '' }))}
                />
                 <p className="text-xs text-slate-500 dark:text-slate-400">If dark mode logo is not provided, the light mode logo will be used if available.</p>
            </div>
          </Accordion>

          <Accordion title="Social Links">
             <div className="space-y-6">
                <div>
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Twitter URL</label>
                  <input 
                      type="url" 
                      name="twitterUrl" 
                      id="twitterUrl" 
                      value={settings.twitterUrl} 
                      onChange={handleChange} 
                      className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                      placeholder="https://twitter.com/yourprofile"
                  />
                </div>
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
                  <input 
                      type="url" 
                      name="githubUrl" 
                      id="githubUrl" 
                      value={settings.githubUrl} 
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                      placeholder="https://github.com/yourprofile"
                  />
                </div>
            </div>
          </Accordion>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminSettingsPage;
