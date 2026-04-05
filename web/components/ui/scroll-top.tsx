"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="fixed bottom-10 right-4 group">
            <button
                onClick={scrollToTop}
                className={`relative p-4 rounded-full bg-red-900 hover:bg-red-700 shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 ${
                    isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-8 h-8 text-white" />

                {/* Tooltip */}
                <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-red-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Scroll to top
                </span>
            </button>
        </div>
    );
};

export default ScrollToTopButton;