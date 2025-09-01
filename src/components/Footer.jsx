import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-gray-300 pt-10 pb-6">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-heading font-bold text-yellow-400 mb-4">
                        CAR-RENT
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Solusi rental mobil terpercaya. Temukan mobil impian Anda 
                        dengan mudah, cepat, dan aman bersama kami.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
                        <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
                        <li><Link to="/booking" className="hover:text-yellow-400">Booking</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Contact Me</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <MapPin size={18} className="text-yellow-400" />
                            <span>Jl. Dakota No. 8A, Kota Bandung</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-yellow-400" />
                            <span>+62 853 3816 6188</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-yellow-400" />
                            <span>afinaufalrizkyyang24@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>

            {/* Bottom */}
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} CAR-RENT. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-yellow-400"><Facebook size={25} /></a>
                    <a href="https://www.instagram.com/xyz.007.__/" target="blank" className="hover:text-yellow-400"><Instagram size={25} /></a>
                    <a href="#" className="hover:text-yellow-400"><Twitter size={25} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
