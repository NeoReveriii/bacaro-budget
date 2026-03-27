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

### Frontend
- **Interface**: Semantic HTML5 and Vanilla CSS for a performance-optimized, responsive UI.
- **Logic**: Vanilla JavaScript (ES6+) for high-performance state management and DOM manipulation.
- **Visualization**: Chart.js for interactive financial modeling and data representation.
- **Components**: Lucide for iconography, Flatpickr for date management, and DiceBear for identity avatars.

### Backend
- **Platform**: Node.js executing within a Vercel Serverless environment.
- **Database**: PostgreSQL hosted on Neon, utilized via the `@neondatabase/serverless` driver for resilient, scalable data persistence.
- **AI Integration**: Custom implementation utilizing generative AI models for natural language financial consultation.

### Deployment & Infrastructure
- **Hosting**: Vercel Production Environment.
- **Schema Management**: Automated database migrations and schema synchronization via custom migration utilities.

## Directory Structure

- `/api`: Serverless function endpoints for authentication, transactions, accounts, and AI integration.
- `/assets/css`: Modular CSS architecture including a comprehensive design system and theme variables.
- `/assets/js`: Core application logic, AI interface management, and utility functions.
- `/views`: Application view templates and component partials.

## Installation and Deployment

### Development Environment Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/bacaro-budget.git
   cd bacaro-budget
   ```

2. **Dependency Installation**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `JWT_SECRET`: Secret key for authentication tokens.
   - `GEMINI_API_KEY`: API key for the AI engine integration.

4. **Local Execution**:
   ```bash
   npx vercel dev
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.