import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true); // true while checking existing session

    // ── On mount: if token exists, fetch fresh user data ──────────────────
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem("token");
            if (!savedToken) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axiosInstance.get("/user/getUser");
                setUser(data);
                setToken(savedToken);
            } catch {
                // Token invalid or expired — clear everything
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────
    const login = async (email, password) => {
        const { data } = await axiosInstance.post("/user/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    // ── Register ───────────────────────────────────────────────────────────
    const register = async (fullName, phone, email, password) => {
        const { data } = await axiosInstance.post("/user/register", {
            fullName,
            phone,
            email,
            password,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    // ── Logout ─────────────────────────────────────────────────────────────
    const logout = async () => {
        try {
            await axiosInstance.post("/user/logout");
        } catch {
            // Even if the API call fails, clear local state
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
        }
    };

    // ── Forgot password ────────────────────────────────────────────────────
    const forgotPassword = async (email) => {
        const { data } = await axiosInstance.post("/user/forgot-password", { email });
        return data;
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, register, logout, forgotPassword }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ── Custom hook ────────────────────────────────────────────────────────────
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return context;
};

export default AuthContext;
