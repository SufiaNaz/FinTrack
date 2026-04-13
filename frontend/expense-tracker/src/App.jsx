import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import LandingPage from "./pages/auth/LandingPage";

import Home from "./pages/Dashboard/Home";
import Transactions from "./pages/Dashboard/Transactions";
import Budget from "./pages/Dashboard/Budget";
import Notifications from "./pages/Dashboard/Notifications";
import Reports from "./pages/Dashboard/Reports";
import Insights from "./pages/Dashboard/Insights";

import AdminRoute from "./components/AdminRoute";

import AdminLogin from "./pages/Admin/AdminLogin";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Root redirect */}
                    
                    <Route path="/" element={<LandingPage />} />  

                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Protected routes — must be logged in */}
                    <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                    <Route path="/budget" element={<PrivateRoute><Budget /></PrivateRoute>} />
                    <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                    <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
                    {/* More routes added as screens are built */}

                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* 404 fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
