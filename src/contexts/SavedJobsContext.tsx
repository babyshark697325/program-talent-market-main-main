/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockSavedJobs } from '@/data/mockSavedJobs';

interface SavedJobsContextType {
  savedJobIds: number[];
  addSavedJob: (jobId: number) => void;
  removeSavedJob: (jobId: number) => void;
  isSaved: (jobId: number) => boolean;
  toggleSavedJob: (jobId: number) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobIds, setSavedJobIds] = useState<number[]>(() => {
    // Always use mock saved jobs data for demo - ignore localStorage
    return mockSavedJobs.slice(0, 6).map(savedJob => savedJob.jobId);
  });

  useEffect(() => {
    // Disable localStorage for demo - keep state only in memory
    // try {
    //   localStorage.setItem('savedJobIds', JSON.stringify(savedJobIds));
    //   window.dispatchEvent(new Event('savedjobs:updated'));
    // } catch {}
    window.dispatchEvent(new Event('savedjobs:updated'));
  }, [savedJobIds]);

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