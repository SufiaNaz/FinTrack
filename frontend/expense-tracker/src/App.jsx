import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from './pages/auth/ResetPassword';
const App = () => {
  return (
    <div>
      <Router>
         <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/forgot-password" exact element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
         </Routes>
      </Router>
    </div>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ?
  (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
