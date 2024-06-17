import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import { useLocation } from "react-router-dom";
import "./Auth.sass";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";

export default function Auth() {
    const location = useLocation();
    const [index, setIndex] = useState(0);
    const [email, setEmail] = useState("");
    const { routeIndex, routeEmail } = location.state || {};

    useEffect(() => {
        if (routeIndex) setIndex(routeIndex);
        if (routeEmail) setEmail(routeEmail);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section>
            <Stack direction="horizontal" className="sheet bg-black">
                <Image
                    src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
                    fluid
                    style={{ height: "90vh", width: "auto" }}
                />
                <div className="p-2 bg-black w-100 h-100" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Carousel indicators={false} controls={false} activeIndex={index}>
                        <Carousel.Item>
                            <Login setActiveIndex={setIndex} />
                        </Carousel.Item>
                        <Carousel.Item>
                            <Register setEmailParent={setEmail} setActiveIndex={setIndex} />
                        </Carousel.Item>
                        <Carousel.Item>
                            <ResetPassword email={email} setActiveIndex={setIndex} />
                        </Carousel.Item>
                    </Carousel>
                </div>
            </Stack>
        </section>
    );
}
