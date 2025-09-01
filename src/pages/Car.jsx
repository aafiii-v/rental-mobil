import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CheckCircle,
    XCircle,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Car,
} from "lucide-react";
import { Link } from "react-router-dom";

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);

    // Popup state
    const [editCar, setEditCar] = useState(null);
    const [deleteCar, setDeleteCar] = useState(null);

    // Notification state
    const [notification, setNotification] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 6;

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Ambil role dari localStorage
    const userRole = localStorage.getItem("role");

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await fetch("https://localhost:44350/api/Car/GetListCar");
            if (!res.ok) throw new Error("Gagal fetch data");
            const data = await res.json();

            const availableCars = data.data.filter((car) => car.isAvailable === "Available");
            setCars(availableCars);
        } catch (err) {
            showNotification("Failed to fetch cars", "error");
            console.error("Error fetch cars:", err);
        } finally {
            setLoading(false);
        }
    };

    // Format harga ke IDR
    const formatPrice = (priceString) => {
        if (!priceString) return "Rp0";
        const price = parseFloat(priceString.replace(/[^\d]/g, ""));
        if (isNaN(price)) return "Rp0";

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Filter berdasarkan search
    const filteredCars = cars.filter(
        (car) =>
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
    const totalPages = Math.ceil(filteredCars.length / carsPerPage);

    // Show notification
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle Update
    const handleUpdateCar = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedCar = {
            id: editCar.id,
            name: formData.get("name"),
            brand: formData.get("brand"),
            type: formData.get("type"),
            year: formData.get("year"),
            rentalPricePerDay: formData.get("rentalPricePerDay"),
            imageUrl: formData.get("imageUrl"),
        };

        try {
            const res = await fetch(`https://localhost:44350/api/Car/UpdateCar/${editCar.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCar),
            });

            if (!res.ok) throw new Error("Failed to update car");

            showNotification("Car updated successfully", "success");
            setEditCar(null);
            fetchCars(); // refresh list
        } catch (err) {
            console.error("Error updating car:", err);
            showNotification("Failed to update car", "error");
        }
    };

    //  Handle Delete
    const handleDeleteCar = async () => {
        try {
            const res = await fetch(`https://localhost:44350/api/Car/DeleteCar/${deleteCar.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete car");

            showNotification("Car deleted successfully", "success");
            setDeleteCar(null);
            fetchCars(); // refresh list
        } catch (err) {
            console.error("Error deleting car:", err);
            showNotification("Failed to delete car", "error");
        }
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Gear background */}
            <motion.img
                src="bg-gear.svg"
                alt="Gear"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="w-[200px] h-[200px] md:w-[500px] md:h-[500px] opacity-20 absolute inset-0 m-auto"
            />

            {/* Notification (semua di bawah) */}
            {notification && (
                <div
                    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 ${notification.type === "success"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                        }`}
                >
                    {notification.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">{notification.message}</span>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col items-center justify-center text-center z-10">
                    <p className="text-gray-300 text-3xl font-semibold">Loading cars...</p>
                </div>
            )}

            {/* No data */}
            {!loading && filteredCars.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center z-10">
                    <p className="text-gray-400 text-2xl font-semibold">No Cars Found</p>
                </div>
            )}

            <div className="w-full max-w-6xl flex flex-col items-center pt-28 mb-3">
                {/* Title */}
                <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
                    Available Cars
                </h2>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 mb-8"
                />

                {/* Add New Car (Admin only) */}
                {userRole === "Admin" && (
                    <Link
                        to={"/form-add-car"}
                        className="absolute right-45 bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition flex items-center gap-2"
                    >
                        <Plus size={18} /> Add New Car
                    </Link>
                )}
            </div>

            {/* Car list */}
            {!loading && filteredCars.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl relative">
                        {currentCars.map((car) => (
                            <motion.div
                                key={car.id}
                                whileHover={{ y: -8, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 250 }}
                                className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg cursor-pointer overflow-hidden group border border-gray-700 hover:border-yellow-400 hover:shadow-yellow-500/40 hover:shadow-2xl transition-all duration-300"
                                onClick={() => setSelectedCar(car)}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={car.imageUrl}
                                        alt="Car Picture"
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-yellow-400 text-xl font-bold">
                                        {car.name}
                                    </h3>
                                    <p className="text-gray-400 italic">{car.brand}</p>
                                    <p className="text-gray-300">{car.type}</p>
                                    <p className="text-white font-semibold mt-2">
                                        {formatPrice(car.rentalPricePerDay)} / hari
                                    </p>

                                    {/* Update & Delete button (Admin only) */}
                                    {userRole === "Admin" && (
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditCar(car);
                                                }}
                                                className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-400 transition flex items-center justify-center gap-2"
                                            >
                                                <Pencil size={16} /> Update
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteCar(car);
                                                }}
                                                className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-400 transition flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex gap-4 mt-8 z-10">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-40 hover:bg-gray-600 flex items-center gap-2"
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        <span className="text-gray-300 font-semibold self-center">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-40 hover:bg-gray-600 flex items-center gap-2"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </>
            )}

            {/* Popup Modal Detail */}
            {selectedCar && (
                <div className="fixed inset-0 backdrop-blur-lg bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full p-6 relative border border-gray-700">
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-white hover:text-red-600 transition"
                            onClick={() => setSelectedCar(null)}
                        >
                            <X size={28} />
                        </button>

                        <img
                            src={selectedCar.imageUrl}
                            alt="Car Detail"
                            className="w-full h-60 object-cover rounded-lg mb-4 shadow-lg"
                        />
                        <h3 className="text-yellow-400 text-2xl font-bold">{selectedCar.name}</h3>
                        <p className="text-gray-400 italic">{selectedCar.brand}</p>
                        <p className="text-gray-300">{selectedCar.type}</p>
                        <p className="text-white font-semibold mt-2">
                            {formatPrice(selectedCar.rentalPricePerDay)} / hari
                        </p>

                        {/* Rent button hanya untuk User */}
                        {userRole === "User" && (
                            <button
                                className="mt-6 w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                                onClick={() =>
                                    showNotification(`Renting ${selectedCar.name}`, "success")
                                }
                            >
                                <Car size={18} /> Rent Now
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Popup Edit Car (Admin only) */}
            {userRole === "Admin" && editCar && (
                <div className="fixed inset-0 backdrop-blur-lg bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full p-6 relative border border-gray-700">
                        <button
                            className="absolute top-4 right-4 text-white hover:text-red-600 transition"
                            onClick={() => setEditCar(null)}
                        >
                            <X size={28} />
                        </button>
                        <h3 className="text-yellow-400 text-2xl font-bold mb-4">Update Car</h3>
                        <form className="space-y-4" onSubmit={handleUpdateCar}>
                            <input
                                type="text"
                                name="name"
                                defaultValue={editCar.name}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            />
                            <input
                                type="text"
                                name="brand"
                                defaultValue={editCar.brand}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            />
                            <input
                                type="text"
                                name="type"
                                defaultValue={editCar.type}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            />
                            <input
                                type="text"
                                name="year"
                                defaultValue={editCar.year}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            />
                            <input
                                type="number"
                                name="rentalPricePerDay"
                                defaultValue={editCar.rentalPricePerDay}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            />
                            <input
                                type="text"
                                name="imageUrl"
                                defaultValue={editCar.imageUrl}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-400 transition"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Popup Delete Confirmation (Admin only) */}
            <AnimatePresence>
                {userRole === "Admin" && deleteCar && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-xl px-6 py-4 flex flex-col md:flex-row items-center gap-4">
                            <p className="text-gray-300 text-center md:text-left">
                                Are you sure you want to delete{" "}
                                <span className="text-red-400 font-semibold">{deleteCar.name}</span>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteCar}
                                    className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-400 transition"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setDeleteCar(null)}
                                    className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Cars;