
import React from 'react';
import './JobDetail.css'; 

type CompanyType = { 
  id: number;
  name: string;
}

export type JobType = { 
  id: number;
  title: string;
  location: string;
  salary: number; 
  jobType: string;
  description: string;
  company: CompanyType; 
};

type JobDetailProps = {
  job: JobType; 
};

export const JobDetail = ({ job }: JobDetailProps) => {
  return (
    <div className="job-detail-container">
      <header className="job-detail-header">
        <h2 className="job-detail-title">{job.title}</h2>
        <p className="job-detail-company">{job.company.name}</p> 
        <p className="job-detail-location">{job.location}</p>
        <p className="job-detail-salary">${job.salary} MXN</p> 
        
      </header>

      <div className="job-detail-body">
        <h3>Descripción del puesto</h3>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </div>
    </div>
  );
};