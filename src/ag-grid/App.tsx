import { useEffect, useMemo, useRef } from "react";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import styles from "@ag-grid-community/styles/ag-grid.css?inline"; // Core CSS
import quartzStyles from "@ag-grid-community/styles/ag-theme-quartz.css?inline"; // Theme
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import Doom from "../doom/Doom";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const width = 160;
const height = 100;
const pixelSize = 10;
const headerSize = 20;

function App() {
  const gridRef = useRef<AgGridReact>(null);

  // We create the data structure once, we'll just copy values into it when we get updates
  const rowData = useMemo(() => {
    const data = [];
    for (let i = 0; i < height; i++) {
      const row: Record<string, string> = {};
      for (let j = 0; j < width; j++) {
        row[`${j}`] = "";
      }
      data.push(row);
    }
    return data;
  }, []);

  const colDefs: ColDef[] = useMemo(() => {
    return Array.from({ length: width }, (_, i) => ({
      headerName: ``,
      field: `${i}`,
      width: pixelSize,
      cellStyle: (params) => {
        const value = params.value;
        return {
          color: "transparent",
          backgroundColor: value,
        };
      },
    }));
  }, []);

  useEffect(
    function initDoom() {
      const doom = new Doom((imageData) => {
        // Update the rowData with the new image data
        const { data } = imageData;
        const scale = imageData.width / width;
        for (let r = 0; r < height; r++) {
          const row = rowData[r];
          for (let c = 0; c < width; c++) {
            const colorIndex = (r * imageData.width * scale + c * scale) * 4;
            row[`${c}`] = `rgba(${data[colorIndex]}, ${data[colorIndex + 1]}, ${
              data[colorIndex + 2]
            })`;
          }
        }
        gridRef.current?.api.refreshCells({
          force: true,
          suppressFlash: true,
        });
      });
      doom.start();
      window.addEventListener("keydown", doom.keyDown);
      window.addEventListener("keyup", doom.keyUp);
      return () => {
        doom.stop();
        window.removeEventListener("keydown", doom.keyDown);
        window.removeEventListener("keyup", doom.keyUp);
      };
    },
    [rowData]
  );

  return (
    <>
      <style>{styles}</style>
      <style>{quartzStyles}</style>
      <div
        style={{
          width: width * pixelSize + headerSize,
          height: height * pixelSize + headerSize,
          position: "relative",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          rowHeight={pixelSize}
        />
      </div>
    </>
  );
}

export default App;
