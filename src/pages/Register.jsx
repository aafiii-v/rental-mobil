import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`http://localhost:5234/api/User/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: form.name,
                    UserName: form.username,
                    Email: form.email,
                    PhoneNumber: form.phoneNumber,
                    PasswordHash: form.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful!");
                setForm({ name: "", username: "", email: "", phoneNumber: "", password: "" });
                navigate("/login");
            } else {
                setMessage(data.StatusDesc || "Registration failed");
            }
        } catch (err) {
            setMessage("Error: " + err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 flex items-center justify-center px-6">
            <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
                <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 text-center">
                    Revlimit Car Rental
                </h1>

                <div className="flex flex-col md:flex-row w-full rounded-xl overflow-hidden shadow-2xl bg-gray-800">
                    <div className="flex-1 p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Register</h2>
                        {message && <p className="mb-4 text-red-500">{message}</p>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-gray-900"
                                required
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-gray-900"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-gray-900"
                                required
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-gray-900"
                                required
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-gray-900"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 transition"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-gray-300">
                            Already have an account?{" "}
                            <Link to="/login" className="text-yellow-400 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="hidden md:block flex-1 pr-12 pt-18">
                        <img src="Logo.png" alt="Car" className="w-2xl object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
