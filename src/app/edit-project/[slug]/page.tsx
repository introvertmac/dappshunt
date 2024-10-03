// src/app/edit-project/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Airtable from 'airtable';
import { useRouter, useParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';
import ErrorMessage from '@/components/ErrorMessage';
import { FaGithub, FaGlobe, FaTwitter, FaSpinner } from 'react-icons/fa';

// Define a type that includes all expected properties
type ProjectData = {
    id: string;
    Name: string;
    Tagline?: string;
    Description?: string;
    Repo?: string;
    Demo?: string;
    Social?: string;
    'Funding Goal'?: number;
    'Use of Funds'?: string;
    Wallet?: string;
};

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
);

export default function EditProject() {
    const wallet = useWallet();
    const router = useRouter();
    const { slug } = useParams();

    const [project, setProject] = useState<ProjectData | null>(null);
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (wallet.publicKey && slug) {
            base('Projects')
                .select({ filterByFormula: `{Slug} = '${slug}'` })
                .firstPage()
                .then((records) => {
                    if (records.length > 0) {
                        const projectData: ProjectData = { id: records[0].id, ...records[0].fields } as ProjectData;
                        if (projectData.Wallet === wallet.publicKey!.toString()) {
                            setProject(projectData);
                            setFormData({
                                Name: projectData.Name ?? '',
                                Tagline: projectData.Tagline ?? '',
                                Description: projectData.Description ?? '',
                                Repo: projectData.Repo ?? '',
                                Demo: projectData.Demo ?? '',
                                Social: projectData.Social ?? '',
                                'Funding Goal': projectData['Funding Goal']?.toString() ?? '',
                                'Use of Funds': projectData['Use of Funds'] ?? '',
                            });
                        } else {
                            setError('You do not have permission to edit this project.');
                            router.push('/my-projects');
                        }
                    } else {
                        setError('Project not found.');
                        router.push('/my-projects');
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching project:', error);
                    setError('Failed to load project. Please try again.');
                    setIsLoading(false);
                });
        }
    }, [wallet.publicKey, slug, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!wallet.publicKey) {
            setError('Please connect your wallet.');
            return;
        }

        if (
            !formData.Name ||
            !formData.Tagline ||
            !formData.Description ||
            !formData['Funding Goal'] ||
            !formData['Use of Funds']
        ) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await base('Projects').update([
                {
                    id: project!.id,
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
                    },
                },
            ]);

            router.push('/my-projects');
        } catch (error) {
            console.error(error);
            setError('Failed to update project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!wallet.connected) {
        return (
            <section className="p-4 sm:p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Edit Your Project</h1>
                <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Connect Your Wallet to Edit Your Project</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Please connect your wallet to access and edit your project details.
                    </p>
                    <div className="text-center">
                        <WalletMultiButton className="!bg-coinbase-blue hover:!bg-coinbase-darkBlue" />
                    </div>
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-coinbase-blue" />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} onClose={() => setError(null)} />;
    }

    if (!project) {
        return <div className="text-center mt-10">Project not found or you do not have permission to edit it.</div>;
    }

    return (
        <section className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="space-y-6">
                    <InputField
                        label="Project Name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Tagline"
                        name="Tagline"
                        value={formData.Tagline}
                        onChange={handleChange}
                    />
                    <TextAreaField
                        label="Description"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
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
                    <InputField
                        label="Funding Goal (USDC)"
                        name="Funding Goal"
                        value={formData['Funding Goal']}
                        onChange={handleChange}
                        type="number"
                    />
                    <TextAreaField
                        label="Use of Funds"
                        name="Use of Funds"
                        value={formData['Use of Funds']}
                        onChange={handleChange}
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-coinbase-blue text-white px-4 py-2 rounded hover:bg-coinbase-darkBlue transition duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Update Project'}
                    </button>
                </div>
            </div>
        </section>
    );
}