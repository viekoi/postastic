"use client";
import { useState, useEffect } from "react";

const useIsMobile = (breakPoint: number) => {
  if (typeof window !== "undefined") {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakPoint);
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < breakPoint);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return isMobile;
  } else return false;
};

export default useIsMobile;
