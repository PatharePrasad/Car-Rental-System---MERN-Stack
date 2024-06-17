/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApiPrivate } from "../hooks";

export default function Payments() {
    const location = useLocation();
    const navigate = useNavigate();
    const { confirmBooking } = useApiPrivate();

    useEffect(() => {
        const updateBackend = async () => {
            const params = new URLSearchParams(location.search);
            const data = await confirmBooking(params.get("success") ?? false);
            alert(data.message);
            if (data.next === "home") navigate("/", { replace: true });
            console.log(data);
        };
        updateBackend();
    }, []);
}
