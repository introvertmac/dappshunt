# Dappshunt Project Submission Platform

## Overview

Dappshunt is a platform that allows users to submit, edit, and explore projects built on the Solana blockchain. Users can connect their wallets, manage their projects, and engage with the community.

## Features

- **Submit Projects**: Users can submit new projects with details such as name, tagline, description, funding goals, and relevant links (GitHub, demo, social media).
- **Edit Projects**: Users can edit their submitted projects, updating any details as needed.
- **Explore Projects**: Users can explore projects submitted by others, viewing details and funding progress.
- **Wallet Integration**: Users can connect their Solana wallets to manage their projects securely.
- **Donation System**: Users can donate to projects directly through the platform.

## Technologies Used

- **Frontend**: React, Next.js
- **State Management**: React Hooks
- **UI Components**: Tailwind CSS for styling, React Icons for icons
- **Database**: Airtable for storing project data
- **Blockchain**: Solana for wallet integration and transactions

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A Solana wallet (e.g., Phantom) for testing.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dappshunt.git
   cd dappshunt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Airtable API key and base ID:
   ```plaintext
   NEXT_PUBLIC_AIRTABLE_API_KEY=your_airtable_api_key
   NEXT_PUBLIC_AIRTABLE_BASE_ID=your_airtable_base_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Submitting a Project

1. Connect your wallet using the "Connect Wallet" button.
2. Fill in the project submission form with the required details.
3. Click "Submit Project" to save your project to the database.

### Editing a Project

1. Navigate to "My Projects" to view your submitted projects.
2. Click on the "Edit Project" button for the project you wish to modify.
3. Update the project details and click "Update Project" to save changes.

### Exploring Projects

1. Navigate to the "Explore Projects" page to view all approved projects.
2. Click on a project to view its details, including funding progress and description.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Thanks to the Superteam India community for their support and resources.

