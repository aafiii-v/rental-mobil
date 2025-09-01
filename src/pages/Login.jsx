import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("https://localhost:44350/api/User/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserName: form.username,
                    PasswordHash: form.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Simpan token & userId
                localStorage.setItem("token", data.data.setToken);
                localStorage.setItem("userId", data.data.id);
                localStorage.setItem("currentUser", JSON.stringify({ username: form.username }));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", data.data.role);

                // Navigasi ke parent / (Home otomatis)
                navigate("/", { replace: true });
            } else {
                setMessage(data.StatusDesc || "Login failed");
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
                        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Login</h2>
                        {message && <p className="mb-4 text-red-500">{message}</p>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={form.username}
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
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-gray-300">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-yellow-400 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>

                    <div className="hidden md:block flex-1 pr-12">
                        <img src="Logo.png" alt="Car" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;