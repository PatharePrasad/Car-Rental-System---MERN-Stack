import { useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";
import { CameraSVG, EditSVG, HidePasswordIcon, ShowPasswordIcon, UserPlaceholder } from "../assets";
import { useApiPrivate, useUtils } from "../hooks";

export default function UserProfile({ show, handleClose, user }) {
    const [imageSrc, setImageSrc] = useState(user.imgSrc ?? "");
    const [name, setName] = useState(user.name ?? "");
    const [nameEditable, setNameEditable] = useState(false);
    const [nameError, setNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [updateElem, setUpdateElem] = useState({});
    const [updatePassword, setUpdatePassword] = useState(false);
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        setName(user.name);
        setImageSrc(user.imgSrc);
    }, [user]);

    const { updateUser } = useApiPrivate();
    const { convertToBase64 } = useUtils();
    const imageInputRef = useRef(null);

    const closeModal = () => {
        setNameEditable(false);
        setNameError("");
        setPassword("");
        setConfPassword("");
        setUpdateElem({});
        setUpdatePassword(false);
        setIsModified(false);
        handleClose();
    };

    const handleImageUpload = async (file) => {
        const imgSrc = await convertToBase64(file);
        if (!imgSrc || !imgSrc.startsWith("data:image")) return alert(imgSrc);
        setImageSrc(imgSrc);
        setUpdateElem((prev) => ({ ...prev, image: imgSrc }));
        setIsModified(true);
    };

    const handleNameChange = () => {
        if (name === "") {
            setNameError("Name cannot be empty!");
            return;
        }
        setNameError("");
        setUpdateElem((prev) => ({ ...prev, name }));
        setIsModified(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(updateElem).length === 0) return alert("Nothing to update!");
        if (nameError !== "" || passwordError !== "" || confirmPasswordError !== "")
            return alert("Can't update because one or more fields have errors!");
        const data = await updateUser(updateElem);
        alert(data.message);
        closeModal();
    };

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
        if (confPassword === "") {
            setConfirmPasswordError("Confirm password is required!");
            return;
        }
        if (confPassword !== password) {
            setConfirmPasswordError("Password & Confirm Password don't match!");
            return;
        }
        setConfirmPasswordError("");
        setUpdateElem((prev) => ({ ...prev, password }));
        setIsModified(true);
    };

    return (
        <Modal show={show}>
            <Modal.Header>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", gap: "10px" }}>
                <span
                    style={{
                        width: "100px",
                        height: "100px",
                        display: "block",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        position: "relative",
                    }}
                >
                    {user.imgSrc ? (
                        <Image src={imageSrc} alt={name} roundedCircle style={{ width: "100px", height: "100px" }} />
                    ) : (
                        <UserPlaceholder width="100px" height="100px" />
                    )}
                    <span className="imgUploadBtn">
                        <CameraSVG onClick={() => imageInputRef.current.click()} />
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e.target.files[0] ?? null)}
                    />
                </span>
                <Form className="w-100 userUpdateForm">
                    <FloatingLabel controlId="userName" label="Name" className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleNameChange}
                            disabled={!nameEditable}
                            style={{ position: "relative" }}
                        />
                        {nameError && <span className="errMsg">{nameError}</span>}
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "30px",
                                height: "58px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => setNameEditable(true)}
                        >
                            {!nameEditable && <EditSVG style={{ width: "30px", height: "30px" }} />}
                        </span>
                    </FloatingLabel>
                    <FloatingLabel controlId="userEmail" label="Email Address" className="mb-2">
                        <Form.Control type="email" placeholder="sample@mail.com" value={user.email} disabled />
                    </FloatingLabel>
                    <Button variant="link" className="mb-2" onClick={() => setUpdatePassword(true)}>
                        Update Password
                    </Button>
                    {updatePassword && (
                        <>
                            <FloatingLabel controlId="userPassword" label="Password">
                                <Form.Control
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={validatePassword}
                                    style={{ position: "relative" }}
                                    className="mb-2"
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
                            <FloatingLabel controlId="userConfPassword" label="Confirm Password">
                                <Form.Control
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confPassword}
                                    onChange={(e) => setConfPassword(e.target.value)}
                                    onBlur={validateConfirmPassword}
                                    style={{ position: "relative" }}
                                    className="mb-2"
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
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <Button onClick={handleSubmit} variant={isModified ? "primary" : "disabled"} disabled={!isModified}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
