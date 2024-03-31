"use client";
import { createContext, useState, useEffect, useContext } from "react";

// Create the context
type IsMobileContextType = {
  isMobile: boolean;
};

const IsMobileContext = createContext<IsMobileContextType>({
  isMobile: false,
});

export const useIsMobile = () => {
  return useContext(IsMobileContext);
};

// Create the context provider component
export const IsMobileProvider = ({
  children,
  breakPoint,
}: {
  children: React.ReactNode;
  breakPoint: number;
}) => {
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

  return (
    <IsMobileContext.Provider value={{ isMobile: isMobile }}>
      {children}
    </IsMobileContext.Provider>
  );
};
