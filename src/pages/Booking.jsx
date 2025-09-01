import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Booking = () => {
    // Awal kosong (nanti ambil dari API C#)
    const [bookings, setBookings] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

    return (
        <section className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex items-center justify-center p-6 overflow-hidden">
            {/* Gear background (selalu ada) */}
            <motion.img
                src="bg-gear.svg"
                alt="Gear"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="w-[500px] h-[500px] opacity-40 absolute"
            />

            {/* Kalau kosong */}
            {bookings.length === 0 && (
                <div className="relative flex flex-col items-center justify-center text-center z-10">
                    <p className="text-gray-400 text-2xl font-semibold">
                        No Booking Yet
                    </p>
                </div>
            )}

            {/* Kalau ada booking */}
            {bookings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
                    {bookings.map((car) => (
                        <motion.div
                            key={car.id}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={() => setSelectedCar(car)}
                            className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg cursor-pointer overflow-hidden group"
                        >
                            <img
                                src={car.img}
                                alt={car.nama}
                                className="w-full h-48 object-cover group-hover:opacity-90 transition"
                            />
                            <div className="p-4">
                                <h3 className="text-yellow-400 text-xl font-bold">{car.nama}</h3>
                                <p className="text-gray-300">{car.tipe}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Popup detail mobil */}
            <AnimatePresence>
                {selectedCar && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCar(null)}
                    >
                        <motion.div
                            className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedCar.img}
                                alt={selectedCar.nama}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                                {selectedCar.nama}
                            </h2>
                            <p className="text-gray-300 mb-4">{selectedCar.deskripsi}</p>
                            <button
                                onClick={() => setSelectedCar(null)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Booking;
