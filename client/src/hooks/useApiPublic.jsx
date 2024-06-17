import axios from "axios";
import { useLoader } from ".";

export default function useApiPublic() {
    if (!process.env.REACT_APP_SERVER_BASE_URL) throw new Error("Expected an error object to be thrown.");

    const { showLoader, hideLoader } = useLoader();
    const apiManager = axios.create({
        baseURL: `${process.env.REACT_APP_SERVER_BASE_URL}api`,
        withCredentials: true
    });

    apiManager.interceptors.request.use((config) => {
        showLoader();
        return config;
    });

    apiManager.interceptors.response.use(
        (response) => {
            hideLoader();
            return response;
        },
        (error) => {
            hideLoader();
            return Promise.reject(error);
        }
    );

    const healthCheck = async () => {
        try {
            const res = await apiManager.get("/");
            return res.status === 200;
        } catch (err) {
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await apiManager.post("/auth/login", { email, password });
            const data = res.data;
            return data;
        } catch (err) {
            return { message: "Something went wrong!", next: "login" };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const res = await apiManager.post("/auth/forgotPassword", { email });
            const data = res.data;
            return data;
        } catch (err) {
            return { message: "Something went wrong!", next: "login" };
        }
    };

    const verifyEmail = async (token) => {
        try {
            const res = await apiManager.patch("/auth/verifyEmail", { token });
            const data = res.data;
            return data;
        } catch (err) {
            return { message: "Something went wrong!", next: "login" };
        }
    };

    const resetPassword = async (email, password) => {
        try {
            const res = await apiManager.patch("/auth/resetPassword", { email, password });
            const data = res.data;
            return data;
        } catch (err) {
            return { message: "Something went wrong!", next: "login" };
        }
    };

    const register = async (name, email) => {
        try {
            const res = await apiManager.post("/auth/register", { name, email });
            const data = res.data;
            return data;
        } catch (err) {
            return { message: "Something went wrong!", next: "register" };
        }
    };

    return { healthCheck, login, forgotPassword, verifyEmail, resetPassword, register };
}
