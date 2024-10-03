// src/app/my-projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Airtable from 'airtable';
import { FaSpinner, FaProjectDiagram, FaEdit, FaChartLine } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
    {icon}
    <h3 className="text-lg font-semibold mt-2 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'text-green-600';
    case 'Pending':
      return 'text-yellow-600';
    case 'Rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default function MyProjects() {
  const wallet = useWallet();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wallet.publicKey) {
      setIsLoading(true);
      base('Projects')
        .select({ filterByFormula: `{Wallet} = '${wallet.publicKey.toString()}'` })
        .all()
        .then((records) => {
          setProjects(records.map((record) => ({ id: record.id, ...record.fields } as Project)));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching projects:', error);
          setIsLoading(false);
        });
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  }, [wallet.publicKey]);

  if (!wallet.connected) {
    return (
      <section className="p-4 sm:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Projects</h1>
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Connect Your Wallet to Access Your Projects</h2>
          <p className="text-gray-600 mb-6 text-center">
            Unlock the full potential of Dappshunt by connecting your Solana wallet. Manage your projects with ease and security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FeatureCard
              icon={<FaProjectDiagram className="text-4xl text-coinbase-blue" />}
              title="View Projects"
              description="Access all your submitted projects in one place"
            />
            <FeatureCard
              icon={<FaEdit className="text-4xl text-coinbase-blue" />}
              title="Edit Projects"
              description="Update and refine your project details anytime"
            />
            <FeatureCard
              icon={<FaChartLine className="text-4xl text-coinbase-blue" />}
              title="Track Progress"
              description="Monitor your project's funding and engagement"
            />
          </div>
          <div className="text-center">
            <WalletMultiButton className="!bg-coinbase-blue hover:!bg-coinbase-darkBlue" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-coinbase-blue" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-center">
          <p className="text-xl mb-4">You haven't submitted any projects yet.</p>
          <Link href="/submit-project">
            <button className="px-4 py-2 bg-coinbase-blue text-white rounded-md hover:bg-coinbase-darkBlue transition duration-300">
              Submit Your First Project
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border p-4 rounded-md bg-white shadow-md">
              <h2 className="text-xl font-semibold mb-2">{project.Name}</h2>
              <p className="text-gray-600 mb-2">{project.Tagline}</p>
              <p className="mb-4">Status: <span className={`font-semibold ${getStatusColor(project.Status)}`}>{project.Status}</span></p>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${(project['Funds Raised'] / project['Funding Goal']) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">
                  ${project['Funds Raised'].toLocaleString()} raised of ${project['Funding Goal'].toLocaleString()}
                </p>
              </div>
              {project.Status === 'Approved' ? (
                <Link href={`/projects/${project.Slug}`}>
                  <button className="w-full px-4 py-2 bg-coinbase-blue text-white rounded-md hover:bg-coinbase-darkBlue transition duration-300">
                    View Project
                  </button>
                </Link>
              ) : (
                <Link href={`/edit-project/${project.Slug}`}>
                  <button className="w-full px-4 py-2 bg-coinbase-blue text-white rounded-md hover:bg-coinbase-darkBlue transition duration-300">
                    {project.Status === 'Rejected' ? 'Edit and Resubmit' : 'Edit Project'}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
