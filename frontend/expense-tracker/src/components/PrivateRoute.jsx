import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any route that requires login
// Usage: <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();

    // Still checking existing session — render nothing (avoids flash redirect)
    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Poppins, sans-serif",
                color: "#575cb5",
                fontSize: "15px",
            }}>
                Loading...
            </div>
        );
    }

    return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
