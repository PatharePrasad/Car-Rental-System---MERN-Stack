import { useEffect, useState } from "react";
import { Button, Card, FloatingLabel, Form } from "react-bootstrap";
import { HidePasswordIcon, LogoSVG, ShowPasswordIcon } from "../../assets";
import { useApiPublic } from "../../hooks";
export default function ResetPassword({ email, setActiveIndex }) {
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const { resetPassword } = useApiPublic();

    const validatePassword = () => {
        if (password === "") {
            setPasswordError("Password is required!");
            return;
        }
        if (password.length < 8 || password.length > 20) {
            setPasswordError("Password is invalid!");
            return;
        }
        setPasswordError("");
    };
    const validateConfirmPassword = () => {
        if (confirmPassword === "") {
            setConfirmPasswordError("Confirm password is required!");
            return;
        }
        if (confirmPassword !== password) {
            setConfirmPasswordError("Password & Confirm Password don't match!");
            return;
        }
        setConfirmPasswordError("");
    };
    const cleanNavigate = (dest) => {
        setPassword("");
        setPasswordVisible(false);
        setPasswordError(null);
        setConfirmPassword("");
        setConfirmPasswordVisible(false);
        setConfirmPasswordError(null);
        setSubmitDisabled(true);
        setActiveIndex(dest);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await resetPassword(email, password);
        alert(res.message);
        if (res.next === "login") cleanNavigate(0);
    };
    useEffect(() => {
        setSubmitDisabled(confirmPasswordError !== "" || passwordError !== "");
    }, [confirmPasswordError, passwordError]);
    return (
        <Card data-bs-theme="dark">
            <Card.Body className="card">
                <LogoSVG style={{ width: "50%" }} />
                <h3>Reset Password</h3>
                <Form className="w-100" onSubmit={handleSubmit}>
                    <FloatingLabel controlId="resPassword" label="Password">
                        <Form.Control
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validatePassword}
                            style={{ position: "relative" }}
                        />
                        {passwordError && <span className="errMsg">{passwordError}</span>}
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "40px",
                                height: "58px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setPasswordVisible((prev) => !prev)}
                        >
                            {passwordVisible ? (
                                <HidePasswordIcon width="70%" height="70%" className="passIcon" />
                            ) : (
                                <ShowPasswordIcon width="70%" height="70%" className="passIcon" />
                            )}
                        </span>
                    </FloatingLabel>
                    <span className="m-1" />
                    <FloatingLabel controlId="resConfirmPassword" label="Confirm Password">
                        <Form.Control
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={validateConfirmPassword}
                            style={{ position: "relative" }}
                        />
                        {confirmPasswordError && <span className="errMsg">{confirmPasswordError}</span>}
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "40px",
                                height: "58px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                        >
                            {confirmPasswordVisible ? (
                                <HidePasswordIcon width="70%" height="70%" className="passIcon" />
                            ) : (
                                <ShowPasswordIcon width="70%" height="70%" className="passIcon" />
                            )}
                        </span>
                    </FloatingLabel>
                    <span className="m-1" />
                    <Button variant={submitDisabled ? "disabled" : "primary"} type="submit" className="w-100" disabled={submitDisabled}>
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
