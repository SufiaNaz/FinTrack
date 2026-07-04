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

LANDING PAGE
<img width="1366" height="768" alt="Screenshot (705)" src="https://github.com/user-attachments/assets/63eeedb4-1e02-41c9-9a25-9a9b118f716d" />

SIGNUP PAGE
<img width="1366" height="768" alt="Screenshot (710)" src="https://github.com/user-attachments/assets/4574da90-71cf-4504-b135-d77a87c1e4e2" />

LOGIN PAGE
<img width="1366" height="768" alt="Screenshot (711)" src="https://github.com/user-attachments/assets/bf3a3861-cbe0-4241-82fa-841de1cf14a3" />

USER DASHBOARD
<img width="1366" height="768" alt="Screenshot (713)" src="https://github.com/user-attachments/assets/b0c939be-0c3b-47bb-b828-98726609be22" />

USER TRANSACTION PAGE
<img width="1366" height="768" alt="Screenshot (715)" src="https://github.com/user-attachments/assets/bb12b822-c8a7-426c-a419-b637a5eba862" />

USER BUDGET PAGE
<img width="1366" height="768" alt="Screenshot (719)" src="https://github.com/user-attachments/assets/953b497a-171c-428c-adeb-267c754cc435" />

USER REPORTS PAGE
<img width="1366" height="768" alt="Screenshot (720)" src="https://github.com/user-attachments/assets/3480157b-9527-4566-b003-efbfeeb5e5ee" />

USER NOTIFICATION PAGE
<img width="1366" height="768" alt="Screenshot (723)" src="https://github.com/user-attachments/assets/b1018605-b059-49b1-a749-9cf52373a07f" />

ADMIN DASHBOARD PAGE
<img width="1366" height="768" alt="Screenshot (724)" src="https://github.com/user-attachments/assets/7d5997ab-0a68-41d1-81a6-de247c15080c" />

ADMIN USERS PAGE
<img width="1366" height="768" alt="Screenshot (725)" src="https://github.com/user-attachments/assets/b54a7a50-6586-424f-8c98-4a403fd635ae" />

ADMIN TRANSACTIONS PAGE
<img width="1366" height="768" alt="Screenshot (726)" src="https://github.com/user-attachments/assets/a4dbd7b3-a09e-4e59-a350-5acee9f1559a" />


Built by Sufia Naz

