import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

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

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

    return children;
};

export default AdminRoute;