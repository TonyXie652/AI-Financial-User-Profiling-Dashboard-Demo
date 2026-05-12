import { useEffect, useRef, useState } from "react";

export function useElasticScroll({ maxOffset = 34, strength = 0.14 } = {}) {
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);
  const [elasticOffset, setElasticOffset] = useState(0);

  const handleElasticWheel = (event) => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;

    const atTop = scrollArea.scrollTop <= 0;
    const atBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1;
    const pullingPastTop = atTop && event.deltaY < 0;
    const pullingPastBottom = atBottom && event.deltaY > 0;

    if (!pullingPastTop && !pullingPastBottom) return;

    const direction = pullingPastTop ? 1 : -1;
    const nextOffset = Math.max(
      -maxOffset,
      Math.min(maxOffset, direction * Math.min(maxOffset, Math.abs(event.deltaY) * strength))
    );

    setElasticOffset(nextOffset);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setElasticOffset(0);
    }, 90);
  };

  const resetElasticOffset = () => setElasticOffset(0);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return {
    elasticOffset,
    handleElasticWheel,
    resetElasticOffset,
    scrollRef,
  };
}
