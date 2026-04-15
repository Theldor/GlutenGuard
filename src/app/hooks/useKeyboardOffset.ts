import { useState, useEffect } from "react";

/**
 * Returns the current keyboard height in pixels by comparing
 * window.innerHeight with the Visual Viewport height.
 * When the on-screen keyboard is closed the offset is 0.
 */
export function useKeyboardOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // On iOS the vv.offsetTop shifts; on Android vv.height shrinks.
      const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
      setOffset(Math.max(0, keyboardHeight));
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return offset;
}
