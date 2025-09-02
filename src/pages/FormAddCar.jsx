import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StepBack } from "lucide-react";

const FormAddCar = () => {
    const [formData, setFormData] = useState({
        brand: "",
        name: "",
        type: "",
        year: "",
        rentalPricePerDay: "",
        imageUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // 🔒 Guard: cek role user dari localStorage
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "Admin") {
            navigate("/car"); // kalau bukan Admin, balikin ke halaman car
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`http://localhost:5234/api/Car/AddCar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Response Error:", errorText);
                throw new Error("Failed to add car");
            }

            const result = await response.json();
            console.log("Car successfully added:", result);

            setSuccess(true);

            // Delay 3 detik sebelum redirect
            setTimeout(() => {
                navigate("/car");
            }, 3000);
        } catch (err) {
            setError(err.message);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-900 flex items-center justify-center relative p-6 overflow-hidden">
            {/* Tombol Back */}
            <button
                onClick={() => navigate("/car")}
                className="flex absolute top-[142px] left-100 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                <StepBack /> Back
            </button>

            {/* Mobil kiri */}
            <motion.img
                src="Logo.png"
                alt="Car Left"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="hidden md:block w-76 absolute left-20"
            />

            {/* Mobil kanan */}
            <motion.img
                src="Mustang.png"
                alt="Car Right"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="hidden md:block w-78 absolute right-20"
            />

            {/* Form */}
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg relative -mb-12">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Add New Car</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Car Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                    />
                    <input
                        type="text"
                        name="year"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                    />
                    <input
                        type="number"
                        name="rentalPricePerDay"
                        placeholder="Rental Price Per Day"
                        value={formData.rentalPricePerDay}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                    />
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
                    />

                    {/* Pesan Error */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {/* Pesan Sukses */}
                    {success && (
                        <p className="text-green-400 text-sm font-semibold">
                            ✅ Car successfully added! Redirecting...
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default FormAddCar;
