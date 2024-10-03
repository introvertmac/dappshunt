// src/components/Footer.tsx
import Link from 'next/link';

const Footer = () => {
    return (
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <Link href="/">
                <span className="text-2xl font-bold text-coinbase-blue">Dappshunt</span>
              </Link>
              <p className="text-gray-500 text-base">
                Discover and support innovative Solana projects.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Projects
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href="/explore-projects" className="text-base text-gray-500 hover:text-gray-900">
                        Explore
                      </Link>
                    </li>
                    <li>
                      <Link href="/submit-project" className="text-base text-gray-500 hover:text-gray-900">
                        Submit
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a 
                        href="https://x.com/dappshuntxyz" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2024 Dappshunt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
};

export default Footer;
