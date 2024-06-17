import { Route, Routes } from "react-router-dom";
import { Auth, Home, Payments, VerifyEmail } from "./pages";

export default function CustomRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/authenticate" element={<Auth />} />
            <Route path="/authenticate/verifyEmail/:token" element={<VerifyEmail />} />

            <Route path="/payments" element={<Payments />} />
        </Routes>
    );
}
