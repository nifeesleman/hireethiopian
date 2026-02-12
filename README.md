# HireEthiopian

**Connecting Ethiopian Talent with Global Opportunity**

HireEthiopian is a trusted international recruitment platform that connects skilled Ethiopian workers with verified overseas employment opportunities. Legal, transparent, and designed to make international hiring safe and efficient.

🔗 **Live Demo:** [https://hireethiopian.lovable.app/](https://hireethiopian.lovable.app/)

## Features

- **Verified Employers** – Every agency goes through a strict verification process to ensure safe and legal employment.
- **Document Management** – Secure storage and management of CVs, certificates, and visa documents all in one place.
- **Real-time Updates** – Track application status from selection to visa processing to final placement.
- **24/7 Support** – Dedicated support team available around the clock to assist workers and agencies.
- **Global Reach** – Access opportunities in 45+ countries across the Middle East, Europe, and beyond.
- **Community** – Join a community of workers sharing experiences and supporting each other abroad.

## Tech Stack

- [React](https://react.dev/) – UI library
- [TypeScript](https://www.typescriptlang.org/) – Type-safe JavaScript
- [Vite](https://vitejs.dev/) – Build tool
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) – Component library
- [Supabase](https://supabase.com/) – Backend & authentication
- [React Router](https://reactrouter.com/) – Client-side routing
- [TanStack React Query](https://tanstack.com/query) – Data fetching

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```sh
# Clone the repository
git clone https://github.com/nifeesleman/hireethiopian.git

# Navigate to the project directory
cd hireethiopian

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── admin/        # Admin dashboard components
│   ├── auth/         # Authentication components
│   ├── home/         # Landing page sections
│   ├── layout/       # Layout components (header, footer)
│   ├── ui/           # shadcn/ui primitives
│   └── worker/       # Worker-specific components
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations (Supabase)
├── lib/              # Utility functions
├── pages/            # Page-level components
│   ├── auth/         # Login & registration pages
│   └── dashboard/    # Role-based dashboards
└── test/             # Test utilities
```

## License

This project is private.
