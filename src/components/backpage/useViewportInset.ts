"use client";

import { useEffect, useState } from "react";

/**
 * How much of the layout viewport is currently hidden — in practice, the height
 * of the on-screen keyboard.
 *
 * `window.innerHeight` does not change when a phone keyboard opens, so a widget
 * that needs to stay visible above it has to measure the *visual* viewport
 * instead. Supported everywhere that matters (iOS 13+, Chrome 61+); returns 0
 * where it is missing, which is the correct no-keyboard answer.
 */
export function useViewportInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}
