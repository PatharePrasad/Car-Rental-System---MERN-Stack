import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiPublic } from "../../hooks";

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { verifyEmail } = useApiPublic();

    useEffect(() => {
        const verify = async () => {
            const res = await verifyEmail(token);
            console.log("R", res);
            alert(res.message);
            if (res?.next === "login") navigate("/authenticate", { replace: true });
            if (res?.next === "update_password")
                navigate("/authenticate", { replace: true, state: { routeIndex: 2, routeEmail: res.email } });
        };
        if (!token) return navigate("/authenticate", { replace: true });
        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <></>;
}
