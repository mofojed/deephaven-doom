import { useCallback, useEffect, useRef } from "react";
import "regular-table";
import { RegularTableElement } from "regular-table";
import "regular-table/dist/css/material.css";
import "./App.css";
import Doom from "../doom/Doom";

const width = 160;
const height = 100;
const pixelSize = 10;

function App() {
  const tableRef = useRef<RegularTableElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  // It's so slow, we need to skip frames
  const nextRenderTime = useRef<number>(0);
  const setRegularTable = useCallback(
    async (table: RegularTableElement | null) => {
      tableRef.current = table;

      // Following Canvas example in regular-table docs: https://finos.github.io/regular-table/block/?example=canvas_data_model
      table?.addStyleListener(() => {
        const tds = table.querySelectorAll("td");
        for (const td of tds) {
          td.style.backgroundColor = td.textContent ?? "";
          td.innerHTML = " ";
        }
      });

      table?.setDataListener(async (x0, y0, x1, y1) => {
        const data = [];
        if (imageDataRef.current !== null) {
          const imageData = imageDataRef.current.data;
          const scale = imageDataRef.current.width / width;
          for (let x = x0; x < x1; x++) {
            const column: string[] = [];
            data.push(column);
            for (let y = y0; y < y1; y++) {
              const colorIndex = Math.floor(
                (y * imageDataRef.current.width * scale + x * scale) * 4
              );
              const r = imageData[colorIndex];
              const g = imageData[colorIndex + 1];
              const b = imageData[colorIndex + 2];
              column.push(`rgb(${r},${g},${b})`);
            }
          }
        }
        return {
          num_columns: width,
          num_rows: height,
          data,
        };
      });
      await table?.draw();
    },
    []
  );

  useEffect(function initDoom() {
    const doom = new Doom((imageData) => {
      imageDataRef.current = imageData;
      const now = performance.now();
      if (now < nextRenderTime.current) {
        // Drop the frame
        return;
      }
      tableRef.current?.draw();
      const renderTime = performance.now() - now;
      nextRenderTime.current = now + renderTime;
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
        <regular-table ref={setRegularTable} />
      </div>
    </>
  );
}

export default App;
