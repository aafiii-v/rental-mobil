import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FormBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        rentalStart: "",
        rentalEnd: "",
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [notification, setNotification] = useState("");

    const userId = localStorage.getItem("userId") || "";
    const userName = localStorage.getItem("name") || "";

    useEffect(() => {
        fetchCarDetail();
    }, []);

    useEffect(() => {
        if (formData.rentalStart && formData.rentalEnd && car) {
            const start = new Date(formData.rentalStart);
            const end = new Date(formData.rentalEnd);

            if (end < start) {
                setTotalPrice(0);
                setError("End date cannot be before start date");
                return;
            }

            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 0);
            const pricePerDay = parseFloat(car.rentalPricePerDay);
            setTotalPrice(diffDays * pricePerDay);
            setError("");
        } else {
            setTotalPrice(0);
            setError("");
        }
    }, [formData.rentalStart, formData.rentalEnd, car]);

    const fetchCarDetail = async () => {
        try {
            const res = await fetch(`http://localhost:5234/api/Car/GetCarById/${id}`);
            if (!res.ok) throw new Error("Failed to fetch car detail");
            const data = await res.json();
            setCar(data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (totalPrice <= 0) return;
        setShowPopup(true);
    };

    const handleConfirmBooking = async () => {
        const bookingData = {
            UserId: userId,
            CarId: id,
            StartDate: formData.rentalStart,
            EndDate: formData.rentalEnd,
            TotalPrice: totalPrice.toString(),
            Status: "Pending",
        };

        try {
            const res = await fetch(`http://localhost:5234/api/Booking/CreateBooking`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });

            if (!res.ok) throw new Error("Failed to create booking");

            setNotification("Booking successful!");
            setShowPopup(false);

            setTimeout(() => {
                setNotification("");
                navigate("/booking");
            }, 1500);
        } catch (err) {
            console.error(err);
            setNotification("Booking failed!");
            setShowPopup(false);
            setTimeout(() => setNotification(""), 3000);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading car data...</div>;
    if (!car) return <div className="flex items-center justify-center min-h-screen text-white">Car not found.</div>;

    return (
        <section className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex flex-col items-center justify-center p-6">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
                <button
                    className="absolute top-4 right-4 text-white hover:text-red-600 transition"
                    onClick={() => navigate(-1)}
                >
                    <X size={28} />
                </button>

                <h2 className="text-yellow-400 text-2xl font-bold mb-4">Book Car</h2>

                <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-white font-semibold">{car.name}</p>
                    <p className="text-gray-400 italic">{car.brand}</p>
                    <p className="text-gray-300">{car.type}</p>
                    <p className="text-white font-semibold mt-1">Price per Day: {car.rentalPricePerDay}</p>
                    {totalPrice > 0 && <p className="text-yellow-400 font-bold mt-2">Total Price: {totalPrice}</p>}
                </div>

                {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={userName}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white cursor-not-allowed"
                    />

                    <div className="flex flex-col">
                        <label htmlFor="rentalStart" className="text-gray-300 font-semibold mb-1">Start Date</label>
                        <input
                            type="date"
                            id="rentalStart"
                            name="rentalStart"
                            value={formData.rentalStart}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="rentalEnd" className="text-gray-300 font-semibold mb-1">End Date</label>
                        <input
                            type="date"
                            id="rentalEnd"
                            name="rentalEnd"
                            value={formData.rentalEnd}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition"
                        disabled={totalPrice <= 0 || error !== ""}
                    >
                        Submit
                    </button>
                </form>
            </div>

            {notification && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    {notification}
                </div>
            )}

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className="fixed inset-0 backdrop-blur-lg bg-opacity-60 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="text-yellow-400 text-xl font-bold mb-4">Confirm Booking</h3>
                            <p className="text-white mb-1">Car: {car.name} ({car.brand})</p>
                            <p className="text-white mb-1">Type: {car.type}</p>
                            <p className="text-white mb-1">Rental Start: {formData.rentalStart}</p>
                            <p className="text-white mb-1">Rental End: {formData.rentalEnd}</p>
                            <p className="text-yellow-400 font-bold mb-4">Total Price: {totalPrice}</p>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                                    onClick={handleConfirmBooking}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default FormBooking;
