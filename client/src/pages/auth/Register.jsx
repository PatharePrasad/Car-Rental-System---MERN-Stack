import { useEffect, useState } from "react";
import { Button, Card, FloatingLabel, Form } from "react-bootstrap";
import { LogoSVG } from "../../assets";
import { useApiPublic } from "../../hooks";

export default function Register({ setEmailParent, setActiveIndex }) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const { register } = useApiPublic();
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
    const validateName = () => {
        if (name === "") {
            setNameError("Name is required!");
            return;
        }
        if (!/^[a-zA-Z\s'.]+$/.test(name)) {
            setNameError("Name is invalid!");
            return;
        }
        setNameError("");
    };
    const cleanNavigate = (dest) => {
        setEmail("");
        setEmailError(null);
        setName("");
        setNameError(null);
        setSubmitDisabled(true);
        setActiveIndex(dest);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(name, email);
        alert(res.message);
        if (res.next === "register") cleanNavigate(1);
        console.log("R", res);
    };
    useEffect(() => {
        setSubmitDisabled(nameError !== "" || emailError !== "");
    }, [emailError, nameError]);
    return (
        <Card data-bs-theme="dark">
            <Card.Body className="card">
                <LogoSVG style={{ width: "50%" }} />
                <h3>Register</h3>
                <Form className="w-100" onSubmit={handleSubmit}>
                    <FloatingLabel controlId="regName" label="Name" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={validateName}
                        />
                        {nameError && <span className="errMsg">{nameError}</span>}
                    </FloatingLabel>
                    <FloatingLabel controlId="regEmail" label="Email address" className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={validateEmail}
                        />
                        {emailError && <span className="errMsg">{emailError}</span>}
                    </FloatingLabel>
                    <Button variant={submitDisabled ? "disabled" : "primary"} type="submit" className="w-100" disabled={submitDisabled}>
                        Submit
                    </Button>
                </Form>
                <span style={{ display: "flex", alignItems: "center" }}>
                    Already an existing user?{" "}
                    <Button variant="link" style={{ padding: 0, marginLeft: "4px" }} onClick={() => cleanNavigate(0)}>
                        Login
                    </Button>
                </span>
            </Card.Body>
        </Card>
    );
}
