import { Link, UseNavigate } from "react-router-dom";

const Header = () => {
    const navigate = UseNavigate();
    return (
        <>
            <header className="bg-white shadow-md fixed w-full top-0 z-10">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">

                    {/* Kiri: Logo */}
                    <h1 className="text-3xl font-bold text-yellow-600">
                        <Link to={"/"}>CAR-RENT</Link>
                    </h1>

                    {/* Tengah: Search Input */}
                    <div className="flex-1 mx-6">
                        <input
                            type="text"
                            placeholder="Search cars..."
                            className="w-full max-w-md mx-auto block px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Kanan: Nav */}
                    <nav className="flex gap-6 font-medium">
                        <Link
                            to={"/home"}
                            className="hover:text-yellow-500"
                        >
                            Home
                        </Link>
                        <Link
                            to={"/booking"}
                            className="hover:text-yellow-500"
                        >
                            Booking
                        </Link>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default Header;