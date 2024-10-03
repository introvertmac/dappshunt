// src/app/submit-project/page.tsx
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Airtable from 'airtable';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaGithub, FaGlobe, FaTwitter, FaRocket, FaUsers, FaHandHoldingUsd } from 'react-icons/fa';
import InputField from '../../components/InputField';
import TextAreaField from '../../components/TextAreaField';
import ErrorMessage from '@/components/ErrorMessage';

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
);

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function SubmitProject() {
  const wallet = useWallet();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    Name: '',
    Tagline: '',
    Description: '',
    Repo: '',
    Demo: '',
    Social: '',
    'Funding Goal': '',
    'Use of Funds': '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!formData.Name.trim()) newErrors.Name = 'Project name is required';
        if (!formData.Tagline.trim()) newErrors.Tagline = 'Tagline is required';
        break;
      case 2:
        if (!formData.Description.trim()) newErrors.Description = 'Description is required';
        break;
      case 3:
        if (!formData['Funding Goal'] || parseFloat(formData['Funding Goal']) <= 0) {
          newErrors['Funding Goal'] = 'Valid funding goal is required';
        }
        if (!formData['Use of Funds'].trim()) newErrors['Use of Funds'] = 'Use of funds is required';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      const slug = generateSlug(formData.Name);
      await base('Projects').create([
        {
          fields: {
            Name: formData.Name,
            Tagline: formData.Tagline,
            Description: formData.Description,
            Repo: formData.Repo || undefined,
            Demo: formData.Demo || undefined,
            Social: formData.Social || undefined,
            'Funding Goal': parseFloat(formData['Funding Goal']),
            'Use of Funds': formData['Use of Funds'],
            Status: 'Pending',
            Wallet: wallet.publicKey!.toString(),
            'Funds Raised': 0,
            Slug: slug,
          },
        },
      ]);

      router.push('/my-projects');
    } catch (error) {
      console.error(error);
      setError('Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!wallet.connected) {
    return (
      <section className="p-4 sm:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Submit Your Project</h1>
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Connect Your Wallet to Showcase Your Innovation</h2>
          <p className="text-gray-600 mb-6 text-center">
            Join the Dappshunt community and bring your Solana project to life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FeatureCard
              icon={<FaRocket className="text-4xl text-coinbase-blue" />}
              title="Launch Your Project"
              description="Showcase your innovation to the Solana community"
            />
            <FeatureCard
              icon={<FaUsers className="text-4xl text-coinbase-blue" />}
              title="Engage Supporters"
              description="Connect with potential users and investors"
            />
            <FeatureCard
              icon={<FaHandHoldingUsd className="text-4xl text-coinbase-blue" />}
              title="Secure Funding"
              description="Set funding goals and receive contributions"
            />
          </div>
          <div className="text-center">
            <WalletMultiButtonDynamic className="!bg-coinbase-blue hover:!bg-coinbase-darkBlue" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submit Your Project</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-1/3 h-2 ${step <= currentStep ? 'bg-coinbase-blue' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span>Basic Info</span>
            <span>Description</span>
            <span>Funding</span>
          </div>
        </div>
        {currentStep === 1 && (
          <div className="space-y-4">
            <InputField
              label="Project Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              error={errors.Name}
            />
            <InputField
              label="Tagline"
              name="Tagline"
              value={formData.Tagline}
              onChange={handleChange}
              error={errors.Tagline}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-4">
            <TextAreaField
              label="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              error={errors.Description}
            />
            <InputField
              label="GitHub Repo URL"
              name="Repo"
              value={formData.Repo}
              onChange={handleChange}
              icon={FaGithub}
            />
            <InputField
              label="Demo URL"
              name="Demo"
              value={formData.Demo}
              onChange={handleChange}
              icon={FaGlobe}
            />
            <InputField
              label="Social Media URL"
              name="Social"
              value={formData.Social}
              onChange={handleChange}
              icon={FaTwitter}
            />
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-4">
            <InputField
              label="Funding Goal (USDC)"
              name="Funding Goal"
              value={formData['Funding Goal']}
              onChange={handleChange}
              error={errors['Funding Goal']}
              type="number"
            />
            <TextAreaField
              label="Use of Funds"
              name="Use of Funds"
              value={formData['Use of Funds']}
              onChange={handleChange}
              error={errors['Use of Funds']}
            />
          </div>
        )}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-coinbase-blue text-white rounded-md ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-coinbase-green text-white rounded-md ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          )}
        </div>
      </div>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </section>
  );
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