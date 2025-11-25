import React from 'react';
import './JobCard.css';

type JobCardProps = {
  title: string;
  companyName: string;
  location: string;
  salary: string;
  jobType: string;
  onSelect: () => void;
  isActive: boolean;
};

export const JobCard = ({ 
  title, 
  companyName, 
  onSelect,
  isActive
}: JobCardProps) => {

  const cardClassName = `job-card ${isActive ? 'job-card--active' : ''}`;

  return (
    <div 
      className={cardClassName}
      role="button" 
      tabIndex={0} 
      onClick={onSelect}
    >
      <h3 className="job-title">{title}</h3>
      <p className="company-name">{companyName}</p>
    </div>
  );
};