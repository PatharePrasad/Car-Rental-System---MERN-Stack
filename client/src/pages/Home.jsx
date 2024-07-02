/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, FloatingLabel, Form, Image, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LogoSVG, UserPlaceholder } from "../assets";
import { Bookings, NewBooking, UserProfile } from "../components";
import { useApiPrivate, useSessionStorage } from "../hooks";
import "./Home.sass";
import PulseLoader from "react-spinners/PulseLoader";

export default function Home() {
    const [cars, setCars] = useState([]);
    const [user, setUser] = useState({});
    const [searchText, setSearchText] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [seats, setSeats] = useState("");
    const [priceRange, setPriceRange] = useState([1000, 10000]);
    const [selectedCar, setSelectedCar] = useState();
    const [params, setParams] = useState({});
    const [showUserModal, setShowUserModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showNewBookingModal, setShowNewBookingModel] = useState(false);
    const { getItem, removeItem } = useSessionStorage();
    const { getCars, getUserInfo } = useApiPrivate();
    const itemCrRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authKey = getItem("LOGGED_IN");
        if (!authKey) navigate("/authenticate", { replace: true });
        fetchCars();
        fetchUser();
    }, []);

    useEffect(() => {
        fetchCars();
    }, [params]);

    const fetchUser = async () => {
        const userInfo = await getUserInfo();
        setUser(userInfo);
    };

    const fetchCars = async () => {
        const allCars = await getCars(params);
        setCars(allCars && allCars?.length > 0 ? allCars : []);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange((prevRange) => {
            const newRange = [...prevRange];
            if (name === "minPrice") newRange[0] = Number(value);
            else if (name === "maxPrice") newRange[1] = Number(value);
            return newRange;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const localParams = {};

        if (searchText !== "") localParams.searchText = searchText;
        if (fuelType !== "") localParams.fuel = fuelType;
        if (seats) localParams.numSeats = seats;
        if (priceRange[0] !== 1000 || priceRange[1] !== 100000) {
            localParams.minPrice = priceRange[0];
            localParams.maxPrice = priceRange[1];
        }
        console.table({ searchText, fuelType, seats, priceRange });
        setParams(localParams);
        console.log("D", localParams);
    };

    const handleReset = () => {
        setSearchText("");
        setFuelType("");
        setSeats("");
        setPriceRange([1000, 10000]);
        setParams({});
    };

    const logout = () => {
        removeItem("LOGGED_IN");
        navigate("/authenticate", { replace: true });
    };

    return (
        <>
            <section className="sheet home">
                <Navbar className="nav">
                    <Navbar.Brand href="/">
                        <LogoSVG />
                    </Navbar.Brand>
                    <div className="justify-end">
                        <ButtonGroup>
                            <Button
                                variant="ghost"
                                onClick={() => setShowUserModal(true)}
                                style={{ position: "relative", display: "flex", alignItems: "center", gap: "5px" }}
                            >
                                <span
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        display: "block",
                                        borderRadius: "50%",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    {user.imgSrc ? <Image roundedCircle src={user.imgSrc} alt={user.name} /> : <UserPlaceholder />}
                                </span>
                                {user.name}
                            </Button>
                            <Button variant="ghost" onClick={() => setShowBookingModal(true)} style={{ position: "relative" }}>
                                My Bookings
                            </Button>
                            <Button variant="ghost" onClick={logout}>
                                Logout
                            </Button>
                        </ButtonGroup>
                    </div>
                </Navbar>
                <div className="search">
                    <h3>Filters</h3>
                    <Form className="w-100" onSubmit={handleSubmit}>
                        <FloatingLabel controlId="searchText" label="Search" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </FloatingLabel>
                        <div className="mb-2">
                            <label>Fuel Type</label>
                            <Form.Check type="radio" value="petrol" onChange={(e) => setFuelType(e.target.value)} label="Petrol" />
                            <Form.Check type="radio" value="diesel" onChange={(e) => setFuelType(e.target.value)} label="Diesel" />
                        </div>
                        <div className="mb-2">
                            <label>Number of seats</label>
                            <Form.Select value={seats} onChange={(e) => setSeats(e.target.value)}>
                                <option value="">Select seats</option>
                                {[2, 4, 5, 6, 7, 8].map((seats) => (
                                    <option key={`seats-${seats}`} value={seats}>
                                        {seats}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                        <div className="mb-2">
                            <label>Price Range</label>
                            <Form.Control
                                type="number"
                                placeholder="Min Value"
                                className="mb-2"
                                value={priceRange[0]}
                                name="minPrice"
                                min="1000"
                                max="100000"
                                step="1000"
                                onChange={handlePriceChange}
                            />
                            <Form.Control
                                type="number"
                                placeholder="Max Value"
                                value={priceRange[1]}
                                name="maxPrice"
                                min="1000"
                                max="100000"
                                step="1000"
                                onChange={handlePriceChange}
                            />
                        </div>
                        <Button variant="primary" type="submit" className="w-100 mb-2">
                            Search
                        </Button>
                        <Button variant="danger" type="reset" onClick={handleReset} className="w-100">
                            Reset
                        </Button>
                    </Form>
                </div>
                <div className="items" id="itemsCr" ref={itemCrRef}>
                    <h2>All Cars</h2>
                    <div className="cr">
                        {cars.length > 0 ? (
                            cars.map((car, i) => (
                                <div className="itemCr" key={i}>
                                    <img src={car.imgSrc} alt={car.name} />
                                    <p className="flexCr carName">{car.name}</p>
                                    <span className="flexCr" style={{ gridArea: "type" }}>
                                        {car.fuel.replace(/\b\w/g, (char) => char.toUpperCase())}
                                    </span>
                                    <span className="flexCr" style={{ gridArea: "seats" }}>
                                        {car.seats}&nbsp;seats
                                    </span>
                                    <span className="flexCr" style={{ gridArea: "price" }}>
                                        ₹{car.rent}/hour
                                    </span>
                                    <Button
                                        style={{ gridArea: "book" }}
                                        onClick={() => {
                                            setSelectedCar(car);
                                            setShowNewBookingModel(true);
                                        }}
                                    >
                                        Book now
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <PulseLoader color="#967bb6" style={{ display: "flex", justifyContent: "center", gridColumn: "1 / -1"}} />
                            //<h2 className="danger">No Cars found!</h2>
                        )}
                    </div>
                </div>
                <div className="footer">&copy; 2024</div>
            </section>
            <UserProfile show={showUserModal} handleClose={() => setShowUserModal(false)} user={user} />
            <Bookings show={showBookingModal} handleClose={() => setShowBookingModal(false)} user={user} fetchUser={fetchUser} />
            <NewBooking show={showNewBookingModal} handleClose={() => setShowNewBookingModel(false)} car={selectedCar} />
        </>
    );
}
