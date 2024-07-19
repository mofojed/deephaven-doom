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
      // Do it square by square like we would in a grid
      // Obviously doing a ctx.putImageData(imageData, 0, 0) would be faster, but we're trying to simulate a grid
      // ctx.putImageData(imageData, 0, 0);
      const { data } = imageData;
      const scale = imageData.width / width;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const colorIndex = (y * imageData.width * scale + x * scale) * 4;
          const r = data[colorIndex];
          const g = data[colorIndex + 1];
          const b = data[colorIndex + 2];
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
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
