import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!token || !userId) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`https://localhost:44350/api/User/GetUserById/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();

                if (!data.data) {
                    setFailed(true);
                    return;
                }

                setUser(data.data);
                setForm({
                    name: data.data.name,
                    userName: data.data.userName,
                    email: data.data.email,
                    phoneNumber: data.data.phoneNumber,
                    role: data.data.role,
                });
            } catch (err) {
                console.error(err);
                setFailed(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token, userId, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleEditChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        setErrorMessage("");
        try {
            const bodyData = { ...form };
            if (user.role !== "User" && password.trim() !== "") {
                bodyData.passwordHash = password;
            }

            const res = await fetch(`https://localhost:44350/api/User/UpdateUser/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.StatusDesc || "Update failed");

            setUser(data.data);
            setEditMode(false);
            setPassword("");
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message);
        }
    };

    // loading screen
    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"
                />
                <p className="ml-4 text-yellow-400 text-lg font-semibold">Loading Profile...</p>
            </section>
        );
    }

    if (failed) {
        return (
            <section className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex items-center justify-center p-6 overflow-hidden">
                <motion.img
                    src="bg-gear.svg"
                    alt="Gear"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="w-[500px] h-[500px] opacity-40 absolute"
                />

                <div className="relative flex flex-col items-center justify-center text-center z-10">
                    <p className="text-gray-400 text-2xl font-semibold">
                        Profile not available
                    </p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Back to Login
                    </button>
                </div>
            </section>
        );
    }

    if (!user) return null; // kalau udah loading selesai tapi user null, return kosong aja

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex items-center justify-center px-6 pt-30 pb-8 relative">
            {/* Mobil kiri */}
            <motion.img
                src="Logo.png"
                alt="Car Left"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute left-20 top-1/2 -translate-y-1/2 w-40 md:w-60"
            />
            {/* Mobil kanan */}
            <motion.img
                src="Mustang.png"
                alt="Car Right"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute right-18 top-1/2 -translate-y-1/2 w-40 md:w-64"
            />

            {/* Profile Card */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg text-white flex flex-col relative">
                <h2 className="text-3xl font-bold text-yellow-400 text-center">
                    Profile
                </h2>

                {/* Data Readonly */}
                <div className="flex flex-col gap-4">
                    {["name", "userName", "email", "phoneNumber", "role"].map((field) => {
                        if (field === "role" && user.role !== "Admin") return null;
                        return (
                            <div key={field} className="flex flex-col">
                                <label className="mb-1 text-yellow-400 font-semibold">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type={field === "email" ? "email" : "text"}
                                    value={user[field]}
                                    readOnly
                                    className="bg-gray-900 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-8 gap-8 font-semibold">
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded flex-1"
                    >
                        Update
                    </button>

                    {role === "Admin" && (
                        <Link
                            to="/manager"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded flex-1 text-center block"
                        >
                            Manage Users
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded flex-1"
                    >
                        Logout
                    </button>
                </div>

                {/* Modal Edit */}
                {editMode && (
                    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-20 pointer-events-auto">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-4">
                            <h3 className="text-2xl text-yellow-400 font-bold text-center">
                                Update Profile
                            </h3>
                            {errorMessage && (
                                <p className="text-red-500 text-center">{errorMessage}</p>
                            )}

                            <div className="flex flex-col gap-3">
                                {["name", "userName", "email", "phoneNumber"].map(
                                    (field) => (
                                        <div key={field} className="flex flex-col">
                                            <label className="text-yellow-400 font-semibold">
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                            <input
                                                type={field === "email" ? "email" : "text"}
                                                name={field}
                                                value={form[field] || ""}
                                                onChange={handleEditChange}
                                                className="bg-gray-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                    )
                                )}

                                {user.role !== "User" && (
                                    <>
                                        <label className="text-yellow-400 font-semibold">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-gray-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="Isi jika ingin mengganti password"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;