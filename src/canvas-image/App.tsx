import { useEffect, useRef } from "react";
import Doom from "../doom/Doom";

const width = 320;
const height = 200;
const pixelSize = 4;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(function initDoom() {
    const doom = new Doom((imageData) => {
      const canvas = canvasRef.current;
      if (canvas == null) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (ctx == null) {
        return;
      }
      // Do it using ctx.putImageData to direct render the image
      // This should be the fastest method
      ctx.scale(pixelSize, pixelSize);
      ctx.putImageData(imageData, 0, 0);
    });
    doom.start();
    window.addEventListener("keydown", doom.keyDown);
    window.addEventListener("keyup", doom.keyUp);
    return () => {
      doom.stop();
      window.removeEventListener("keydown", doom.keyDown);
      window.removeEventListener("keyup", doom.keyUp);
    };
  }, []);

  return (
    <>
      <div
        style={{
          width: width * pixelSize,
          height: height * pixelSize,
          position: "relative",
        }}
      >
        <canvas
          width={width * pixelSize}
          height={height * pixelSize}
          ref={canvasRef}
        />
      </div>
    </>
  );
}

export default App;
