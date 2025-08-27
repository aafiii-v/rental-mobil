import { Link } from "react-router-dom"
import { motion } from "framer-motion";

const Home = () => {
    return (
        <>
            <section className="font-body bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 min-h-screen flex items-center relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.4)] pt-24 md:pt-12">
                <div className="absolute inset-0 opacity-20 bg-[url('/road-texture.jpg')] bg-cover bg-center"></div>
                <div className="container mx-auto flex flex-col md:flex-row items-center px-6 relative">
                    {/* Kiri: Text */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-xl text-yellow-400 font-semibold mb-2">Revlimit</p>
                        <h1 className="text-4xl font-bold text-white mb-4">Car Rental</h1>
                        <p className="text-gray-300 mb-6 text-justify">
                            Kami hadir untuk memudahkan Anda dalam menemukan kendaraan yang nyaman, aman, dan terjangkau untuk setiap perjalanan.
                            Dengan pilihan mobil yang beragam, layanan yang cepat, dan proses pemesanan yang sederhana, kami berkomitmen memberikan pengalaman terbaik bagi setiap pelanggan.
                            Temukan mobil impian Anda, mulai perjalanan tanpa ribet, dan nikmati layanan rental mobil yang terpercaya bersama kami.
                        </p>
                        <Link
                            to="/booking"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>

                    <motion.img
                        src="Mustang.png"
                        alt="Orange Mustang"
                        initial={{ x: 200, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 max-w-sm mt-10 lg:max-w-lg md:max-w-md flex justify-center drop-shadow-[0_20px_30px_rgba(255,200,0,0.5)]"
                    />
                </div>
            </section>

        </>
    );
}

export default Home;