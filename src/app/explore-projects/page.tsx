'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Airtable from 'airtable';
import { FaSpinner } from 'react-icons/fa';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
);

interface Project {
  id: string;
  Name: string;
  Tagline: string;
  Status: string;
  Slug: string;
  'Funding Goal': number;
  'Funds Raised': number;
}

export default function ExploreProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    base('Projects')
      .select({ filterByFormula: `{Status} = 'Approved'` })
      .all()
      .then((records) => {
        setProjects(records.map((record) => record.fields as unknown as Project));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-coinbase-blue" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-center">
          <p className="text-xl mb-4">No approved projects found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}