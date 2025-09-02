import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    const userId = localStorage.getItem("userId") || "";
    const role = localStorage.getItem("role") || "user";

    useEffect(() => {
        if (role === "Admin") {
            fetchBookingsAdmin();
        } else {
            fetchBookingsUser();
        }
    }, []);

    // === FETCH USER ===
    const fetchBookingsUser = async () => {
        try {
            const res = await fetch(
                `https://localhost:44350/api/Booking/GetBookingByUser/${userId}`
            );
            if (!res.ok) throw new Error("Failed to fetch bookings (user)");

            const response = await res.json();
            const mapped = response.data.map((b) => ({
                id: b.id,
                nama: b.carName,
                brand: b.carBrand,
                tipe: b.carType || "-",
                img: b.carImageUrl || "placeholder.jpg",
                startDate: b.startDate,
                endDate: b.endDate,
                totalPrice: b.totalPrice,
                status: b.status,
            }));

            setBookings(mapped);
        } catch (err) {
            console.error(err);
        }
    };

    // === FETCH ADMIN ===
    const fetchBookingsAdmin = async () => {
        try {
            const res = await fetch(
                "https://localhost:44350/api/Booking/GetAllBookings"
            );
            if (!res.ok) throw new Error("Failed to fetch bookings (admin)");

            const response = await res.json();
            const mapped = response.data.map((b) => ({
                id: b.id,
                nama: b.carName,
                brand: b.carBrand,
                tipe: b.carType || "-",
                img: b.carImageUrl || "placeholder.jpg",
                startDate: b.startDate,
                endDate: b.endDate,
                totalPrice: b.totalPrice,
                status: b.status,
                userName: b.userName, // 👈 tambahan khusus admin
            }));

            setBookings(mapped);
        } catch (err) {
            console.error(err);
        }
    };

    // === CANCEL BOOKING ===
    const confirmCancelBooking = async () => {
        try {
            const res = await fetch(
                `https://localhost:44350/api/Booking/UpdateBooking/${confirmCancelId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify("Cancelled"),
                }
            );

            if (!res.ok) throw new Error("Failed to cancel booking");

            if (role === "admin") {
                await fetchBookingsAdmin();
            } else {
                await fetchBookingsUser();
            }

            setConfirmCancelId(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex flex-col items-center justify-center p-6 pt-35 overflow-hidden">
            <motion.img
                src="bg-gear.svg"
                alt="Gear"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="w-[500px] h-[500px] opacity-40 absolute"
            />

            <h1 className="text-yellow-400 text-3xl font-bold mb-6 z-10 relative">
                Booking List
            </h1>

            {bookings.length === 0 && (
                <div className="relative flex flex-col items-center justify-center text-center">
                    <p className="text-gray-400 text-2xl font-semibold">No Booking Yet</p>
                </div>
            )}

            {bookings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl relative">
                    {bookings.map((b) => (
                        <motion.div
                            key={b.id}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={() => setSelectedBooking(b)}
                            className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg cursor-pointer overflow-hidden flex flex-col"
                        >
                            <img
                                src={b.img}
                                alt={b.nama}
                                className="w-full h-48 object-cover group-hover:opacity-90 transition"
                            />
                            <div className="p-4 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="text-yellow-400 text-xl font-bold">{b.nama}</h3>
                                    <p className="text-gray-300">Type: {b.tipe}</p>
                                    <p className="text-gray-300">Brand: {b.brand}</p>
                                    {role === "Admin" && (
                                        <p className="text-gray-300">Renter: {b.userName}</p>
                                    )}
                                    <p className="text-gray-400 text-sm">Status: {b.status}</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmCancelId(b.id);
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg w-full"
                                    >
                                        Batalkan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                </div>
            )}

            {/* Popup detail booking */}
            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        className="fixed inset-0 backdrop-blur-lg bg-black/40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedBooking(null)}
                    >
                        <motion.div
                            className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                                Booking Detail
                            </h2>
                            <div className="mb-4">
                                <img
                                    src={selectedBooking.img}
                                    alt={selectedBooking.nama}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                                <p className="text-gray-300 mb-1">
                                    Car: {selectedBooking.nama} ({selectedBooking.brand})
                                </p>
                                <p className="text-gray-300 mb-1">
                                    Type: {selectedBooking.tipe}
                                </p>
                                {role === "Admin" && (
                                    <p className="text-gray-300 mb-1">
                                        Renter: {selectedBooking.userName}
                                    </p>
                                )}
                                <p className="text-gray-300 mb-1">
                                    Rental Start: {selectedBooking.startDate}
                                </p>
                                <p className="text-gray-300 mb-1">
                                    Rental End: {selectedBooking.endDate}
                                </p>
                                <p className="text-yellow-400 font-bold mb-1">
                                    Total Price: {selectedBooking.totalPrice}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Status: {selectedBooking.status}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg w-full"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Popup konfirmasi cancel */}
            <AnimatePresence>
                {confirmCancelId && (
                    <motion.div
                        className="fixed inset-0 backdrop-blur-lg bg-black/40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirmCancelId(null)}
                    >
                        <motion.div
                            className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-yellow-400 mb-4">
                                Konfirmasi
                            </h2>
                            <p className="text-gray-300 mb-6">
                                Apakah kamu yakin ingin membatalkan booking ini?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmCancelBooking}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setConfirmCancelId(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
                                >
                                    No
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Booking;
