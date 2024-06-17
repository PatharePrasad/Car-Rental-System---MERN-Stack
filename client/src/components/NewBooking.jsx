import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, FormControl, Modal } from "react-bootstrap";
import { useApiPrivate } from "../hooks";
import "./NewBooking.sass";

dayjs.extend(isBetween);

export default function NewBooking({ show, handleClose, car }) {
    const [bookingStartTime, setBookingStartTime] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
    const [bookingEndTime, setBookingEndTime] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
    const [bookingErr, setBookingErr] = useState("");
    const [bookingHours, setBookingHours] = useState(1);
    const [showBookingBtn, setShowBookingBtn] = useState(false);

    const { newBooking } = useApiPrivate();

    const handleDateTimeChange = (e, setter) => {
        let dateTime = dayjs(e.target.value);
        const minute = dateTime.minute();
        if (minute > 30) dateTime.add(1, "hour");
        dateTime = dateTime.minute(0).second(0).millisecond(0);
        setter(dateTime.format("YYYY-MM-DDTHH:mm"));
    };

    useEffect(() => {
        let now = dayjs();
        if (now.minute > 30) now.add(1, "hour");
        now = now.minute(0).second(0).millisecond(0);
        setBookingStartTime(now.format("YYYY-MM-DDTHH:mm"));
        setBookingEndTime(now.add(1, "hour").format("YYYY-MM-DDTHH:mm"));
    }, [show]);

    const checkAvailability = (e) => {
        e.preventDefault();
        if (bookingStartTime === bookingEndTime) {
            setBookingErr("Start Date & End Date cannot be same!");
            return;
        }
        const startTime = dayjs(bookingStartTime);
        const endTime = dayjs(bookingEndTime);

        const diffHours = endTime.diff(startTime, "hours");
        if (diffHours < 1) {
            setBookingErr("Booking should be of minimum 1 hour!");
            return;
        }
        if (diffHours > 48) {
            setBookingErr("Booking can be of maximum 2 days!");
            return;
        }
        const isBookingDateInRange = car.bookingDetails.some((booking) => {
            const bookingFrom = dayjs(booking.from);
            const bookingTo = dayjs(booking.to);
            return (
                startTime.isBetween(bookingFrom, bookingTo, "minute", "[]") ||
                endTime.isBetween(bookingFrom, bookingTo, "minute", "[]") ||
                bookingFrom.isBetween(startTime, endTime, "minute", "[]") ||
                bookingTo.isBetween(startTime, endTime, "minute", "[]")
            );
        });
        if (isBookingDateInRange) return setBookingErr("Car is booked for selected date!");
        setBookingErr("");
        setBookingHours(diffHours);
        setShowBookingBtn(true);
    };

    const closeModal = () => {
        setBookingErr("");
        setBookingHours(1);
        setShowBookingBtn(false);
        handleClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.table({ carId: car.id, bookingStartTime, bookingEndTime, bookingHours });
        const data = await newBooking({ carId: car.id, bookingStartTime, bookingEndTime, bookingHours });
        if (data.next === "redirect") {
            window.open(data.url, "_blank");
            closeModal();
        } else alert(data.message || "Something went wrong!");
    };

    return (
        car && (
            <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false} className="newBookingModal">
                <Modal.Header closeButton>
                    <Modal.Title>New Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body className="newBookingCr">
                    <img src={car.imgSrc} alt={car.name} />
                    <h2>{car.name}</h2>
                    <span>Fuel Type:&nbsp;{car.fuel.replace(/\b\w/g, (char) => char.toUpperCase())}</span>
                    <span>Seats:&nbsp;{car.seats}</span>
                    <Form className="w-100 mt-3" onSubmit={handleSubmit}>
                        <div className="mb-3 cr">
                            <FloatingLabel controlId="bookingStartTime" label="From">
                                <FormControl
                                    type="datetime-local"
                                    value={bookingStartTime}
                                    onChange={(e) => setBookingStartTime(e.target.value)}
                                    onBlur={(e) => handleDateTimeChange(e, setBookingStartTime)}
                                    disabled={showBookingBtn}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="bookingEndTime" label="To">
                                <FormControl
                                    type="datetime-local"
                                    value={bookingEndTime}
                                    onChange={(e) => setBookingEndTime(e.target.value)}
                                    onBlur={(e) => handleDateTimeChange(e, setBookingEndTime)}
                                    disabled={showBookingBtn}
                                />
                            </FloatingLabel>
                        </div>
                        {!showBookingBtn && (
                            <>
                                <Button onClick={checkAvailability} style={{ marginRight: "2px" }}>
                                    Check Availability
                                </Button>
                                <i className="errMsg">{bookingErr}</i>
                            </>
                        )}
                        {showBookingBtn && (
                            <>
                                <h4>Booking Summary</h4>
                                <div>
                                    <div className="rows">
                                        <span>Rent: </span>
                                        <span>₹{car.rent}/hour</span>
                                    </div>
                                    <div className="rows">
                                        <span>Booking for: </span>
                                        <span>{bookingHours} hours</span>
                                    </div>
                                    <div className="rows">
                                        <span>Total Cost:</span>
                                        <span>₹{(car.rent ?? 0) * bookingHours}</span>
                                    </div>
                                </div>
                                <div className="decisionBtnGrp">
                                    <Button variant="secondary" onClick={() => setShowBookingBtn(false)}>
                                        Change Details
                                    </Button>
                                    <Button type="submit">Book Now</Button>
                                </div>
                            </>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
        )
    );
}
