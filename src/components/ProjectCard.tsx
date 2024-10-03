// src/components/ProjectCard.tsx
import Link from 'next/link';

interface Project {
  Name: string;
  Tagline: string;
  Slug: string;
  'Funding Goal': number;
  'Funds Raised': number;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const progress = (project['Funds Raised'] / project['Funding Goal']) * 100;

  return (
    <div className="border p-4 rounded-md shadow-sm bg-white">
      <h2 className="text-xl font-semibold">{project.Name}</h2>
      <p className="text-gray-600">{project.Tagline}</p>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1">
          ${project['Funds Raised'].toLocaleString()} raised of ${project['Funding Goal'].toLocaleString()}
        </p>
      </div>
      <Link href={`/projects/${project.Slug}`}>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
          View Project
        </button>
      </Link>
    </div>
  );
};

export default ProjectCard;
