/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { HidePasswordIcon, LogoSVG, ShowPasswordIcon } from "../../assets";
import { useApiPublic, useSessionStorage } from "../../hooks";

export default function Login({ setActiveIndex }) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const { login, forgotPassword } = useApiPublic();
    const { getItem, setItem } = useSessionStorage();
    const navigate = useNavigate();
    const validateEmail = () => {
        if (email === "") {
            setEmailError("Email is required!");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Email is invalid!");
            return;
        }
        setEmailError("");
    };
    const validatePassword = () => {
        if (password === "") {
            return;
        }
        setPasswordError("");
    };
    const cleanNavigate = (dest) => {
        setEmail("");
        setEmailError(null);
        setPassword("");
        setPasswordVisible(false);
        setPasswordError(null);
        setSubmitDisabled(true);
        setActiveIndex(dest);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        alert(res.message);
        if (res.next === "login") cleanNavigate(0);
        else if (res.next === "register") cleanNavigate(1);
        else if (res.next === "home") {
            setItem("LOGGED_IN", true);
            cleanNavigate(0);
            navigate("/", { replace: true });
        }
    };
    const handlePasswordReset = async () => {
        validateEmail();
        if (emailError !== "") return;
        console.log("E", email);
        const res = await forgotPassword(email);
        alert(res.message);
        if (res.next === "register") cleanNavigate(1);
        else if (res.next) cleanNavigate(0);
    };
    useEffect(() => {
        setSubmitDisabled(emailError !== "" || passwordError !== "");
    }, [emailError, passwordError]);

    useEffect(() => {
        const isLoggedIn = getItem("LOGGED_IN");
        if (isLoggedIn) navigate("/", { replace: true });
    }, []);

    return (
        <Card data-bs-theme="dark">
            <Card.Body className="card">
                <LogoSVG style={{ width: "50%" }} />
                <h3>Login</h3>
                <Form className="w-100" onSubmit={handleSubmit}>
                    <FloatingLabel controlId="loginEmail" label="Email address" className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={validateEmail}
                        />
                        {emailError && <span className="errMsg">{emailError}</span>}
                    </FloatingLabel>
                    <FloatingLabel controlId="loginPassword" label="Password">
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
                    {/* </InputGroup> */}
                    <div className="w-100 mb-3">
                        <Button variant="link" style={{ float: "right" }} onClick={handlePasswordReset}>
                            Forgot Password?
                        </Button>
                    </div>
                    <Button variant={submitDisabled ? "disabled" : "primary"} type="submit" className="w-100" disabled={submitDisabled}>
                        Submit
                    </Button>
                </Form>
                <span style={{ display: "flex", alignItems: "center" }}>
                    New here?{" "}
                    <Button variant="link" style={{ padding: 0, marginLeft: "4px" }} onClick={() => cleanNavigate(1)}>
                        Register
                    </Button>
                </span>
            </Card.Body>
        </Card>
    );
}
