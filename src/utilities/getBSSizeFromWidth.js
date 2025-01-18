import { useEffect, useState } from "react";

export const useBSSizeFromWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const detectSize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []);

  if (windowWidth > 768) return "lg";

  if (windowWidth > 576) return "md";

  return "sm";
};
