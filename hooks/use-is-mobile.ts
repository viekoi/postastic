"use client"
import { useState, useEffect } from "react";

const useIsMobile = (breakPoint: number) => {

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
};

export default useIsMobile;
