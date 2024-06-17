import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { useApiPrivate } from "../hooks";

export default function Bookings({ show, handleClose, user, fetchUser }) {
    const [myBookings, setMyBookings] = useState([]);
    const { cancelBooking, retryBooking } = useApiPrivate();

    useEffect(() => {
        if (user && user.bookingDetails) {
            const revisedDetails = user.bookingDetails.map((booking) => {
                const startTime = dayjs(booking.from);
                const endTime = dayjs(booking.to);
                const diffHours = endTime.diff(startTime, "hours");
                return { ...booking, hours: diffHours, totalPrice: parseInt(booking.carRent) * diffHours };
            });
            console.table(revisedDetails);
            setMyBookings(revisedDetails);
        }
    }, [user, show]);

    const getStatusVariant = (status) => {
        const statusVariants = {
            completed: "success",
            pending: "warning",
            failed: "danger",
            canceled: "secondary",
        };
        return statusVariants[status] || "primary";
    };

    const handleRetryPayment = async (bookingId) => {
        console.log("Retry payment for booking ID:", bookingId);
        const data = await retryBooking(bookingId);
        if (data.next === "redirect") {
            window.open(data.url, "_blank");
            handleClose();
        } else alert(data.message || "Something went wrong!");
    };

    const handleCancelBooking = async (bookingId) => {
        console.log("Cancel booking ID:", bookingId);
        const res = await cancelBooking(bookingId);
        alert(res.message);
        if (res.next === "home") {
            fetchUser();
            handleClose();
        }
    };

    const renderActions = (booking) => {
        const currentTime = dayjs();
        const bookingEndTime = dayjs(booking.to);
        if (booking.status === "pending" || (booking.status === "failed" && bookingEndTime.isAfter(currentTime))) {
            return (
                <Button variant="danger" onClick={() => handleRetryPayment(booking.bookingId)} size="sm">
                    Retry
                </Button>
            );
        }
        if (booking.status === "completed" && bookingEndTime.isAfter(currentTime)) {
            return (
                <Button variant="warning" onClick={() => handleCancelBooking(booking.bookingId)} size="sm">
                    Cancel
                </Button>
            );
        }
        return null;
    };

    return (
        <Modal show={show} className="bookingsModal">
            <Modal.Header>
                <Modal.Title>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {myBookings.length > 0 ? (
                    <>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Car Name</th>
                                    <th>Booked from</th>
                                    <th>Booked till</th>
                                    <th>Booked for</th>
                                    <th>Rent</th>
                                    <th>Total Rent</th>
                                    <th>Payment status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBookings.map((booking, key) => (
                                    <tr>
                                        <td>{key + 1}</td>
                                        <td>{booking.carName}</td>
                                        <td>{dayjs(booking.from).format("DD/MM/YYYY, hh:mm a")}</td>
                                        <td>{dayjs(booking.to).format("DD/MM/YYYY, hh:mm a")}</td>
                                        <td style={{ textAlign: "center" }}>{booking.hours} hours</td>
                                        <td style={{ textAlign: "center" }}>₹{booking.carRent}</td>
                                        <td style={{ textAlign: "center" }}>₹{booking.totalPrice}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <Badge bg={getStatusVariant(booking.status)}>{booking.status}</Badge>
                                        </td>
                                        <td>{renderActions(booking)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <i>No bookings found!</i>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
