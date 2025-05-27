'use client';

import { useEffect, useRef } from "react";

const VantaBirds = () => {
  const vantaRef = useRef(null); // Reference to the container div
  const vantaEffect = useRef(null); // Reference to the Vanta effect instance

  useEffect(() => {
    // Ensure VANTA and THREE are loaded and the effect is not already initialized
    if (typeof window !== "undefined" && window.VANTA && window.THREE && vantaRef.current && !vantaEffect.current) {
      vantaEffect.current = window.VANTA.BIRDS({
        el: vantaRef.current, // Attach the effect to the container div
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x7192f, // Background color in hexadecimal
      });
    }

    // Cleanup the effect when the component is unmounted
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -1, // Ensure it appears behind other content
      }}
    />
  );
};

export default VantaBirds;