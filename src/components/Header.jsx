import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // Ambil data name dari localStorage
    const userName = localStorage.getItem("name") || "Guest";

    return (
        <>
            <header className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 fixed w-full top-0 z-10 shadow-[0_4px_30px_rgba(255,200,0,0.4)]">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    <h1 className="font-heading md:text-5xl font-bold text-yellow-400 hover:text-yellow-200 transition-colors flex items-center gap-3">
                        <motion.img
                            src="Logo.png"
                            alt="Logo"
                            initial={{ x: -200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-10 h-10 md:w-16 md:h-16 object-contain"
                        />
                        <Link to={"/"}>CAR-RENT</Link>
                    </h1>

                    {/* Nav Desktop */}
                    <nav className="font-heading hidden md:flex gap-6 font-medium items-center">
                        <Link
                            to={"/"}
                            className="text-2xl text-yellow-400 hover:text-yellow-200 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to={"/about"}
                            className="text-2xl text-yellow-400 hover:text-yellow-200 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to={"/car"}
                            className="text-2xl text-yellow-400 hover:text-yellow-200 transition-colors"
                        >
                            Cars
                        </Link>
                        <Link
                            to={"/booking"}
                            className="text-2xl text-yellow-400 hover:text-yellow-200 transition-colors"
                        >
                            Booking
                        </Link>

                        {/* Tombol Profil Bulat hanya untuk Desktop */}
                        <div className="flex flex-col items-center">
                            <Link
                                to="/profile"
                                className="hidden md:flex w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-400 items-center justify-center hover:bg-yellow-500 transition"
                            >
                                <User size={20} className="text-white" />
                            </Link>
                            {/* Label nama dari localStorage */}
                            <span className="text-sm text-yellow-400 mt-1">{userName}</span>
                        </div>
                    </nav>

                    {/* Hamburger */}
                    <button
                        className="md:hidden text-yellow-400"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-[0_4px_30px_rgba(255,200,0,0.4)]">
                        <div className="flex flex-col items-center gap-4 py-4">
                            <Link
                                to={"/"}
                                className="text-white hover:text-yellow-400"
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to={"/about"}
                                className="text-white hover:text-yellow-400"
                                onClick={() => setMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                to={"/booking"}
                                className="text-white hover:text-yellow-400"
                                onClick={() => setMenuOpen(false)}
                            >
                                Booking
                            </Link>
                            {/* Mobile: Teks Profile */}
                            <Link
                                to={"/profile"}
                                className="text-white hover:text-yellow-400"
                                onClick={() => setMenuOpen(false)}
                            >
                                Profile
                            </Link>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
