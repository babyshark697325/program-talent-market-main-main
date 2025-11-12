import React from 'react';
import { mockJobs } from '../data/mockJobs';
import { mockStudents } from '../data/mockStudents';
import { mockCompanies } from '../data/mockCompanies';
import { mockApplications } from '../data/mockApplications';
import { mockLearningResources } from '../data/mockLearningResources';

const DataDebug = () => {
  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h2 className="text-xl font-bold mb-4">Mock Data Debug Info</h2>
      <div className="space-y-2">
        <p><strong>Total Jobs:</strong> {mockJobs.length}</p>
        <p><strong>Total Students:</strong> {mockStudents.length}</p>
        <p><strong>Total Companies:</strong> {mockCompanies.length}</p>
        <p><strong>Total Applications:</strong> {mockApplications.length}</p>
        <p><strong>Total Learning Resources:</strong> {mockLearningResources.length}</p>
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">Job Titles (Click to expand)</summary>
          <ul className="mt-2 ml-4 list-disc">
            {mockJobs.map((job) => (
              <li key={job.id}>{job.title} - {job.company}</li>
            ))}
          </ul>
        </details>
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">Student Names (Click to expand)</summary>
          <ul className="mt-2 ml-4 list-disc">
            {mockStudents.map((student) => (
              <li key={student.id}>{student.name} - {student.title}</li>
            ))}
          </ul>
        </details>
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">Companies (Click to expand)</summary>
          <ul className="mt-2 ml-4 list-disc">
            {mockCompanies.map((company) => (
              <li key={company.id}>{company.name} - {company.industry}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default DataDebug;
