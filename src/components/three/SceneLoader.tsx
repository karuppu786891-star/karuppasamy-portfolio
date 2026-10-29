"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Gradient fallback shown while the 3D scene loads, or when WebGL is unavailable. */
function Fallback() {
  return (
    <div aria-hidden className="absolute inset-0 mesh-bg">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[90px]" />
    </div>
  );
}

/** Fixed full-screen background 3D scene, lazy-loaded after first paint. */
export default function SceneLoader() {
  const [state, setState] = useState<"idle" | "webgl" | "none">("idle");

  useEffect(() => {
    if (!hasWebGL()) {
      setState("none");
      return;
    }
    // defer heavy 3D work until the browser is idle so the first paint is instant
    const start = () => setState("webgl");
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start);
    else setTimeout(start, 200);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Fallback />
      {state === "webgl" && <Scene />}
    </div>
  );
}
