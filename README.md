# Bacaro Budget Manager

Bacaro Budget Manager is a comprehensive, AI-driven financial management application designed to provide users with deep insights into their spending habits and financial health. By leveraging modern web technologies and artificial intelligence, Bacaro transforms traditional expense tracking into a proactive financial planning experience.

## Core Features

- **AI-Driven Financial Analysis**: Real-time spending insights and personalized financial recommendations powered by the Kwarta AI engine.
- **Dynamic Financial Dashboard**: A centralized interface providing immediate visibility into account balances, recent transactions, and goal progress.
- **Comprehensive Transaction Management**: Secure tracking and categorization of income and expenses with advanced filtering and historical search capabilities.
- **Visual Analytics and Reporting**: High-fidelity data visualizations and automated financial reports to identify spending patterns and trends.
- **Financial Goal Tracking**: Structured progress monitoring for savings objectives with dynamic reward badges (Starter, Saver, Master Budgeter) based on total target amounts.
- **Secure Authentication and Profile Management**: Robust user security including encrypted password resets and customizable profile identities.

## Technical Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development and optimized production builds.
- **Routing**: React Router v6 for client-side navigation.
- **Styling**: Vanilla CSS with a comprehensive design system and theme variables.
- **Visualization**: Chart.js via `react-chartjs-2` for interactive financial modeling.
- **Components**: `lucide-react` for iconography, Flatpickr for date management, DiceBear for identity avatars, and `marked` for markdown rendering.

### Backend
- **Platform**: Node.js executing within a Vercel Serverless environment.
- **Database**: PostgreSQL hosted on Neon, utilized via the `@neondatabase/serverless` driver for resilient, scalable data persistence.
- **Authentication**: JWT-based auth with `bcrypt` password hashing.
- **Email**: `nodemailer` for transactional emails (password reset).
- **AI Integration**: Custom implementation utilizing the Gemini API for natural language financial consultation.

### Deployment & Infrastructure
- **Hosting**: Vercel Production Environment.
- **Build**: Vite compiles the React frontend to `client/dist/`, served via Vercel's CDN.
- **Schema Management**: Automated database migrations via custom migration utilities.

## Directory Structure

```
bacaro-budget/
├── api/              # Vercel serverless function endpoints (auth, transactions, wallets, etc.)
├── client/           # React + Vite frontend application
│   ├── public/       # Static assets (favicon, images)
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # React context (Auth, App state)
│       ├── hooks/       # Custom data-fetching hooks
│       ├── pages/       # Route-level page components
│       └── styles/      # CSS design system and theme files
├── assets/           # Legacy static assets (CSS, JS, images)
├── views/            # Legacy HTML view templates
├── .env              # Environment variables (not committed)
├── vercel.json       # Vercel routing and build configuration
└── package.json      # Root dependencies
```

---

## Installation & Setup for Collaborators

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)
- **Vercel CLI** (for local development) — installed in step 3

---

### 1. Clone the Repository

```bash
git clone https://github.com/NeoReveriii/bacaro-budget.git
cd bacaro-budget
```

---

### 2. Install Root Dependencies

These are the backend/API dependencies (Neon DB driver, bcrypt, nodemailer):

```bash
npm install
```

---

### 3. Install Vercel CLI (Global)

Required to run the full-stack app locally (serves both the API and frontend):

```bash
npm install -g vercel
```

---

### 4. Install React Frontend Dependencies

Navigate into the `client/` directory and install all React/Vite packages:

```bash
cd client
npm install
```

This installs:
| Package | Purpose |
|---|---|
| `react` + `react-dom` | Core React library |
| `vite` | Fast dev server & build tool |
| `react-router-dom` | Client-side routing |
| `react-chartjs-2` + `chart.js` | Financial charts |
| `lucide-react` | Icon library |
| `flatpickr` | Date picker |
| `marked` | Markdown rendering (Kwarta AI) |

Go back to the project root when done:

```bash
cd ..
```

---

### 5. Configure Environment Variables

Create a `.env` file in the **project root** (never commit this):

```bash
# .env
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

> **Tip:** Ask a team member for the actual values, or check the project's shared secrets manager.

---

### 6. Run the Development Server

From the **project root**, run the Vercel dev server. This simultaneously serves:
- The React Vite dev server (frontend with HMR)
- The `/api/*` serverless functions (backend)

```bash
vercel dev
```

The app will be available at `http://localhost:3000`.

Alternatively, to run **only the React frontend** (without API):

```bash
cd client
npm run dev
```

---

### 7. Build for Production (Optional)

To generate the production-ready static bundle:

```bash
cd client
npm run build
```

Output goes to `client/dist/`. Vercel handles this automatically on deployment.

---

## Deploying to Vercel

### First-time Setup

```bash
vercel
```

Follow the prompts to link the project to your Vercel account and configure the project settings.

### Production Deployment

```bash
vercel --prod
```

Or simply push to the `main` branch if Vercel GitHub integration is enabled.

---

## Environment Variables on Vercel

Make sure to add all required environment variables in the **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key for Kwarta AI |
| `EMAIL_USER` | Email address for sending password resets |
| `EMAIL_PASS` | App password for the email account |

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.