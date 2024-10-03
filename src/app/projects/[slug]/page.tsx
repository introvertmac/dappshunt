// src/app/projects/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Airtable from 'airtable';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FaGithub, FaGlobe, FaTwitter, FaWallet, FaSpinner, FaCopy } from 'react-icons/fa';
import ErrorMessage from '@/components/ErrorMessage';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
);

const USDC_DECIMALS = 6;
const USDC_MINT_ADDRESS = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Devnet USDC mint address
const USDC_MINT = new PublicKey(USDC_MINT_ADDRESS);

export default function ProjectPage() {
  const { slug } = useParams();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [project, setProject] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [isDonating, setIsDonating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedWallet, setCopiedWallet] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      base('Projects')
        .select({ filterByFormula: `{Slug} = '${slug}'` })
        .firstPage((err, records) => {
          if (err) {
            console.error(err);
            setError('Failed to load project data. Please try again later.');
            setIsLoading(false);
            return;
          }
          if (records && records.length > 0) {
            setProject(records[0].fields);
          } else {
            setError('Project not found.');
          }
          setIsLoading(false);
        });
    }
  }, [slug]);

  const handleDonate = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Wallet not connected');
      return;
    }
    if (donationAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsDonating(true);

    try {
      const donorPublicKey = wallet.publicKey;
      const recipientPublicKey = new PublicKey(project.Wallet);
      const amount = BigInt(Math.floor(donationAmount * Math.pow(10, USDC_DECIMALS)));

      // Get associated token accounts
      const donorATA = await getAssociatedTokenAddress(USDC_MINT, donorPublicKey);
      const recipientATA = await getAssociatedTokenAddress(USDC_MINT, recipientPublicKey);

      // Check if recipient ATA exists, if not, create it
      const recipientATAInfo = await connection.getAccountInfo(recipientATA);
      let transaction = new Transaction();

      if (!recipientATAInfo) {
        const createATAInstruction = createAssociatedTokenAccountInstruction(
          donorPublicKey,
          recipientATA,
          recipientPublicKey,
          USDC_MINT
        );
        transaction.add(createATAInstruction);
      }

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        donorATA,
        recipientATA,
        donorPublicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(transferInstruction);

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = donorPublicKey;

      // Sign and send transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(txid, 'confirmed');

      alert('Donation successful!');

      // Update Airtable
      const newFundsRaised = Number(project['Funds Raised']) + Number(donationAmount);
      try {
        await base('Projects').update([
          {
            id: project.id,
            fields: {
              'Funds Raised': newFundsRaised,
            },
          },
        ]);
      } catch (error) {
        console.error('Airtable update error:', error);
        throw error; // Re-throw the error to be caught by the outer try-catch
      }

      setProject({ ...project, 'Funds Raised': newFundsRaised });
    } catch (error) {
      console.error('Error processing donation:', error);
      setError('Failed to process donation. Please try again.');
    } finally {
      setIsDonating(false);
    }
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(project.Wallet);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-coinbase-blue" />
      </div>
    );
  }

  if (!project) {
    return <div className="text-center mt-10">Project not found</div>;
  }

  const progress = (project['Funds Raised'] / project['Funding Goal']) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      
      <h1 className="text-3xl font-bold mb-4">{project.Name}</h1>
      <p className="text-xl text-gray-600 mb-6">{project.Tagline}</p>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="w-full md:w-2/3 mb-4 md:mb-0">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="w-full md:w-1/3 text-right">
            <p className="text-lg font-semibold">
              ${project['Funds Raised'].toLocaleString()} / ${project['Funding Goal'].toLocaleString()}
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p className="text-gray-600 mb-4">{project.Description}</p>
        <h2 className="text-2xl font-semibold mb-2">Use of Funds</h2>
        <p className="text-gray-600 mb-4">{project['Use of Funds']}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.Repo && (
            <a href={project.Repo} target="_blank" rel="noopener noreferrer" className="flex items-center text-coinbase-blue hover:underline">
              <FaGithub className="mr-2" /> GitHub Repository
            </a>
          )}
          {project.Demo && (
            <a href={project.Demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-coinbase-blue hover:underline">
              <FaGlobe className="mr-2" /> Demo URL
            </a>
          )}
          {project.Social && (
            <a href={project.Social} target="_blank" rel="noopener noreferrer" className="flex items-center text-coinbase-blue hover:underline">
              <FaTwitter className="mr-2" /> Social Link
            </a>
          )}
          {project.Wallet && (
            <div className="flex items-center cursor-pointer" onClick={copyWalletAddress}>
              <FaWallet className="mr-2" />
              <span className="text-sm">{project.Wallet.substring(0, 4)}...{project.Wallet.substring(project.Wallet.length - 4)}</span>
              <FaCopy className="ml-2" />
              {copiedWallet && <span className="ml-2 text-green-500">Copied!</span>}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Support this Project</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[10, 25, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => setDonationAmount(amount)}
              className={`py-2 px-4 rounded ${
                donationAmount === amount 
                  ? 'bg-coinbase-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition duration-300`}
            >
              ${amount}
            </button>
          ))}
        </div>
        
        <div className="flex mb-6">
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
            className="w-1/2 px-3 py-2 border border-gray-300 focus:outline-none focus:border-coinbase-blue"
            placeholder="$ Amount"
          />
          <button
            onClick={handleDonate}
            disabled={!wallet.connected || isDonating || donationAmount <= 0}
            className="w-1/2 bg-coinbase-blue text-white px-4 py-2 hover:bg-coinbase-darkBlue transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDonating ? 'Processing...' : 'Donate'}
          </button>
        </div>

        {wallet.connected ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Connected: {wallet.publicKey?.toString().slice(0, 4)}...{wallet.publicKey?.toString().slice(-4)}
            </span>
            <button
              onClick={() => wallet.disconnect()}
              className="text-sm text-red-500 hover:text-red-700 transition duration-300"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <WalletMultiButton className="w-full bg-coinbase-blue text-white px-4 py-2 rounded hover:bg-coinbase-darkBlue transition duration-300" />
        )}
      </div>
    </div>
  );
}