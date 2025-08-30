"use client";
import { useEffect } from "react";

import fluidCursor from "./fluidcursor_template";

const FluidCursor = () => {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className="fixed top-0 left-0 z-2 pointer-events-none">
      <canvas className="w-screen h-screen pointer-events-none" id="fluid" />
    </div>
  );
};

export default FluidCursor;
