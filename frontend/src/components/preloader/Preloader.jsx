import React, { useEffect, useRef } from "react";
import "./preloader.css";

const Preloader = ({ show }) => {
    if(!show) return null

    return (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black z-50">
            <div className="loader-wrapper">
                <span className="loader-letter">P</span>
                <span className="loader-letter">R</span>
                <span className="loader-letter">O</span>
                <span className="loader-letter">L</span>
                <span className="loader-letter">O</span>
                <span className="loader-letter">C</span>
                <span className="loader-letter">K</span>
                <span className="loader-letter">E</span>
                <span className="loader-letter">R</span>
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default Preloader;
