# VCM Explorer

A modern web application for exploring the voluntary carbon market with comprehensive data from major offset registries.

## Features

- 🌍 **Comprehensive Project Database**: Browse 10,000+ carbon offset projects from major registries (VCS, ACR, ART, CAR, GLD)
- 📊 **Advanced Analytics**: Interactive charts and visualizations of market trends
- 🔍 **Smart Filtering**: Filter by registry, category, project type, country, and more
- 💳 **Transaction Tracking**: View detailed issuance, retirement, and cancellation records
- 🔐 **Secure Authentication**: Google OAuth integration for personalized access
- 📱 **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js
- **Data Fetching**: SWR
- **Charts**: Recharts
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MMobir/vcm-explorer-web.git
cd vcm-explorer-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your environment variables:
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://vcm-fyi-api-staging.fly.dev
API_KEY=your_api_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vcm-explorer-web/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── projects/          # Project pages
│   ├── transactions/      # Transaction pages
│   └── analytics/         # Analytics page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and API client
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The app integrates with the VCM API to fetch:
- Project listings with pagination
- Project details
- Transaction records
- Analytics data

All API calls are proxied through `/api/query` to add authentication headers.

## Deployment

The app is ready to be deployed on Vercel:

1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License