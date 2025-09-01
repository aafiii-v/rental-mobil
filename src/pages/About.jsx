import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const About = () => {
    return (
        <section className="font-body bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-28 pb-12 md:pb-10 md:pt-34 md:p-28 relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('/road-texture.jpg')] bg-cover bg-center"></div>

            <div className="container mx-auto px-6 relative space-y-20">
                {/* Judul */}
                <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 text-center mb-10">
                    About Us
                </h2>

                {/* Bagian 1 - Sejarah berdiri */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <motion.div
                        initial={{ x: -200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-gray-300 text-justify leading-relaxed"
                    >
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
                            Sejarah Kami
                        </h3>
                        <p>
                            Revlimit Car Rental berdiri sejak tahun 2015 dengan misi menghadirkan
                            layanan rental mobil sport dan supercar yang bisa diakses siapa saja.
                            Berawal dari 3 unit mobil sport, kini kami berkembang menjadi salah
                            satu penyedia terpercaya dengan armada puluhan unit yang selalu siap
                            digunakan.
                        </p>
                    </motion.div>

                    <motion.img
                        src="Showroom.jpeg"
                        alt="Dokumentasi Sejarah"
                        initial={{ x: 200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 max-w-md rounded-xl shadow-lg drop-shadow-[0_20px_30px_rgba(255,200,0,0.4)]"
                    />
                </div>

                {/* Bagian 2 - Perawatan */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                    <motion.div
                        initial={{ x: 200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-gray-300 text-justify leading-relaxed"
                    >
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
                            Perawatan Armada
                        </h3>
                        <p>
                            Semua mobil kami menjalani perawatan rutin sesuai standar pabrikan.
                            Setiap unit diperiksa mesin, suspensi, rem, kelistrikan, hingga
                            interior dan eksterior. Kami hanya menggunakan oli, ban, dan suku cadang
                            orisinil agar performa tetap maksimal.
                        </p>
                    </motion.div>

                    <motion.img
                        src="Maintenance.jpeg"
                        alt="Dokumentasi Perawatan"
                        initial={{ x: -200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 max-w-md rounded-xl shadow-lg drop-shadow-[0_20px_30px_rgba(255,200,0,0.4)]"
                    />
                </div>

                {/* Bagian 3 - Teknis & Layanan */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <motion.div
                        initial={{ x: -200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-gray-300 text-justify leading-relaxed"
                    >
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
                            Teknis & Layanan
                        </h3>
                        <p>
                            Tim teknisi berpengalaman selalu memastikan mobil siap jalan dengan
                            standar keselamatan tinggi. Selain itu, customer support tersedia 24 jam
                            untuk membantu pemesanan, konsultasi, dan penanganan darurat. Kami
                            berkomitmen menjaga keamanan dan kenyamanan pelanggan dalam setiap
                            perjalanan.
                        </p>
                    </motion.div>

                    <motion.img
                        src="Logo.png"
                        alt="Dokumentasi Servis"
                        initial={{ x: 200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 max-w-md rounded-xl shadow-lg drop-shadow-[0_20px_30px_rgba(255,200,0,0.4)]"
                    />
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <Link
                        to="/car"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-colors"
                    >
                        Booking Sekarang
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default About;
