import { useEffect, useState } from "react";

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = (e: MediaQueryListEvent) => {
    setTargetReached(e.matches);
  };

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    setTargetReached(media.matches);

    media.addEventListener("change", updateTarget);

    return () => media.removeEventListener("change", updateTarget);
  }, [width]);

  return targetReached;
};

export default useMediaQuery;
