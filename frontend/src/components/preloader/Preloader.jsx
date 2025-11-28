import React, { useEffect, useRef } from "react";
import "./preloader.css";
import { gsap, Expo } from "gsap";

const Preloader = ({ show }) => {
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!show) return;

        const overlays = wrapRef.current.querySelectorAll(".overlay");
        gsap.to(overlays, {
        duration: 1.2,
        left: "100%",
        ease: Expo.easeInOut,
        });

        setTimeout(() => {
        gsap.to(wrapRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
            wrapRef.current.style.display = "none";
            },
        });
        }, 1200);

    }, [show]);

    return (
        <div
        ref={wrapRef}
        className="loader-wrap"
        style={{ display: show ? "block" : "none" }}
        >
        <div className="layer layer-one"><span className="overlay"></span></div>
        <div className="layer layer-two"><span className="overlay"></span></div>
        <div className="layer layer-three"><span className="overlay"></span></div>
        </div>
    );
};

export default Preloader;
