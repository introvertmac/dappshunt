'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const DynamicHeader = () => {
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isExplorePage = pathname === '/explore-projects';
  const isSubmitPage = pathname === '/submit-project';
  const isMyProjectsPage = pathname === '/my-projects';
  const isEditProjectPage = pathname.startsWith('/edit-project/');

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-3xl font-bold text-coinbase-blue">Dappshunt</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {(isHomePage || isExplorePage || isSubmitPage || isMyProjectsPage) && (
              <Link href="/explore-projects" className="text-gray-600 hover:text-coinbase-blue px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out">
                Explore Projects
              </Link>
            )}
            {(isHomePage || isExplorePage || isMyProjectsPage) && (
              <Link href="/submit-project" className="text-gray-600 hover:text-coinbase-blue px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out">
                Submit Project
              </Link>
            )}
            {(isHomePage || isExplorePage) && (
              <Link href="https://x.com/dappshuntxyz" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-coinbase-blue px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out">
                Community
              </Link>
            )}
            {(isSubmitPage || isMyProjectsPage || isEditProjectPage) && (
              <Link href="/my-projects" className="text-gray-600 hover:text-coinbase-blue px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out">
                My Projects
              </Link>
            )}
            {(isSubmitPage || isMyProjectsPage || isEditProjectPage) && (
              <WalletMultiButtonDynamic />
            )}
          </nav>
          <div className="md:hidden">
            {/* Add a mobile menu button here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DynamicHeader;