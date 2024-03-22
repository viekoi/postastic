"use client";

import { useState, useEffect } from "react";

const useIsMobile = (breakPoint: number) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakPoint);
    };

    handleResize(); // Check initially

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakPoint]);

  return isMobile;
};

export default useIsMobile;