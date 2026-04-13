FinTrack 💰
A full-stack personal finance platform with role-based access control, AI-powered insights, and comprehensive financial management features.

🔗 Links

Live Demo: https://fin-track-pi-one.vercel.app
Backend API: https://fintrack-89m0.onrender.com


Note: The backend is hosted on Render's free tier and may take ~30 seconds to wake up on the first request after a period of inactivity.


Features

Authentication — JWT-based login, signup, forgot password, reset password
Transactions — Add, edit, delete, and categorize income and expense transactions
Budgeting — Set and track budgets by category with visual progress indicators
Reports — Visual financial reports and analytics using Recharts dashboards
Export — Download reports as Excel or PDF
Notifications — In-app notification system for budget alerts and activity
AI Insights — Claude API-powered financial insights and recommendations
Admin Panel — Role-separated admin access for platform management and audit


Tech Stack
Frontend

React.js (Vite)
Recharts
Axios
Deployed on Vercel

Backend

Node.js + Express.js
MongoDB + Mongoose
JWT Authentication
Role-Based Access Control (RBAC)
22 REST APIs across 8 modules
Deployed on Render

Database

MongoDB Atlas

Integrations

Anthropic Claude API (AI Insights)
ExcelJS (Excel export)
PDFKit (PDF export)


API Modules
ModuleEndpointsAuthenticationRegister, Login, Forgot Password, Reset PasswordTransactionsCRUD, filtering, paginationBudgetsCreate, update, track by categoryReportsSummary, category breakdown, trendsNotificationsFetch, mark as read, deleteAI InsightsClaude-powered financial analysisAdminUser management, audit logsDashboardAggregated financial overview

Architecture Highlights

Centralized JWT verification middleware with layered role-checking — no auth logic duplicated across routes
RBAC separates user and admin scopes cleanly at the middleware level
All protected routes gated via reusable verifyToken + checkRole middleware chain
Environment-based configuration for seamless local and production switching


Local Setup
bash# Clone the repository
git clone https://github.com/SufiaNaz/FinTrack.git

# Backend setup
cd backend
npm install
# Create .env file with MONGO_URI, JWT_SECRET, PORT, ANTHROPIC_API_KEY
npm start

# Frontend setup
cd frontend/expense-tracker
npm install
# Create .env file with VITE_API_BASE_URL=http://localhost:5000/api/v1
npm run dev

Environment Variables
Backend .env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
ANTHROPIC_API_KEY=your_anthropic_api_key
Frontend .env
VITE_API_BASE_URL=http://localhost:5000/api/v1

Built by Sufia Naz

