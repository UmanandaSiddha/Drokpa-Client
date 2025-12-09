"use client";

import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";

export default function useLocoScroll() {
  useEffect(() => {
    const scrollEl = document.querySelector(
      "[data-scroll-container]"
    ) as HTMLElement;

    if (!scrollEl) return;

    const scroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      lerp: 0.88,
      multiplier: 1.0,
    });

    return () => {
      scroll.destroy();
    };
  }, []);
}
