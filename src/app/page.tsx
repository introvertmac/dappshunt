// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaHandHoldingUsd, FaLock } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-20 sm:py-32">
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-4">
              <span className="block text-coinbase-blue">Discover and Support</span>
              <span className="block">Innovative Solana Projects</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto lg:mx-0 text-base sm:text-lg text-gray-500 sm:mt-5 md:mt-5 md:text-xl">
              Dappshunt is the premier platform for discovering, supporting, and launching
              cutting-edge projects on the Solana blockchain.
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/explore-projects"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-coinbase-blue hover:bg-coinbase-darkBlue md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              >
                Explore Projects
              </Link>
              <Link
                href="/submit-project"
                className="inline-flex items-center justify-center px-8 py-3 border border-coinbase-blue text-base font-medium rounded-md text-coinbase-blue bg-white hover:bg-coinbase-lightBlue md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              >
                Submit Project
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
              alt="Innovative Solana Projects"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        <div className="mt-20 sm:mt-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">Why Choose Dappshunt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Curated Projects', description: 'Discover high-quality, vetted Solana projects.', icon: FaSearch },
              { title: 'Easy Support', description: 'Contribute to projects with just a few clicks.', icon: FaHandHoldingUsd },
              { title: 'Blockchain Powered', description: 'Secure and transparent transactions on Solana.', icon: FaLock },
            ].map((feature, index) => (
              <div key={index} className="bg-coinbase-lightBlue rounded-lg p-6 flex flex-col items-center text-center">
                <feature.icon className="w-12 h-12 text-coinbase-blue mb-4" />
                <h3 className="text-xl font-semibold text-coinbase-darkBlue mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 sm:mt-32 text-center pb-20 sm:pb-32 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Image src="/solana-logo-bg.svg" alt="Solana Logo" width={800} height={800} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to Explore?</h2>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg text-gray-500 sm:mt-5 sm:max-w-xl sm:mx-auto">
              Discover innovative projects and be part of the Solana ecosystem's growth.
            </p>
            <div className="mt-8">
              <Link
                href="/explore-projects"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-coinbase-green hover:bg-green-600 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}