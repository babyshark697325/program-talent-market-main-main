import React, { createContext, useContext, useState, useCallback } from 'react';

interface SavedJobsContextType {
  savedJobIds: number[];
  addSavedJob: (jobId: number) => void;
  removeSavedJob: (jobId: number) => void;
  isSaved: (jobId: number) => boolean;
  toggleSavedJob: (jobId: number) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with some mock saved jobs
  const [savedJobIds, setSavedJobIds] = useState<number[]>([1, 3]);

  const addSavedJob = useCallback((jobId: number) => {
    setSavedJobIds(prev => {
      if (!prev.includes(jobId)) {
        return [...prev, jobId];
      }
      return prev;
    });
  }, []);

  const removeSavedJob = useCallback((jobId: number) => {
    setSavedJobIds(prev => prev.filter(id => id !== jobId));
  }, []);

  const isSaved = useCallback((jobId: number) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  const toggleSavedJob = useCallback((jobId: number) => {
    if (isSaved(jobId)) {
      removeSavedJob(jobId);
    } else {
      addSavedJob(jobId);
    }
  }, [isSaved, addSavedJob, removeSavedJob]);

  const value = {
    savedJobIds,
    addSavedJob,
    removeSavedJob,
    isSaved,
    toggleSavedJob,
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (context === undefined) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};