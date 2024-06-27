import {
  DataEditor,
  DataEditorRef,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  TextCell,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Doom from "../doom/Doom";

const width = 320;
const height = 200;
const pixelSize = 4;
const headerSize = 20;

function App() {
  const gridRef = useRef<DataEditorRef>(null);
  const gridData = useMemo(() => {
    const newData: TextCell[][] = [];
    for (let r = 0; r < height; r++) {
      const row: TextCell[] = [];
      for (let c = 0; c < width; c++) {
        row.push({
          kind: GridCellKind.Text,
          displayData: "",
          themeOverride: {
            bgCell: "transparent",
          },
          data: "",
          allowOverlay: false,
        });
      }
      newData.push(row);
    }
    return newData;
  }, []);

  const cellUpdates = useMemo(() => {
    const updates: { cell: Item }[] = [];

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        updates.push({ cell: [c, r] });
      }
    }
    return updates;
  }, []);

  const columns: GridColumn[] = Array.from({ length: width }, (_, i) => ({
    title: `${i}`,
    width: pixelSize,
  }));

  const getCell: (cell: Item) => GridCell = useCallback(
    (cell: Item) => {
      const [col, row] = cell;
      return gridData[row][col];
    },
    [gridData]
  );

  useEffect(
    function initDoom() {
      const doom = new Doom((imageData) => {
        // Update the rowData with the new image data
        const { data } = imageData;
        const scale = imageData.width / width;
        for (let r = 0; r < height; r++) {
          const row = gridData[r];
          for (let c = 0; c < width; c++) {
            const colorIndex = (r * imageData.width * scale + c * scale) * 4;
            const color = `rgba(${data[colorIndex]}, ${data[colorIndex + 1]}, ${
              data[colorIndex + 2]
            })`;
            row[c].themeOverride!.bgCell = color;
          }
        }
        gridRef.current?.updateCells(cellUpdates);
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
    [cellUpdates, gridData]
  );

  return (
    <div
      style={{
        width: width * pixelSize + headerSize,
        height: height * pixelSize + headerSize,
        position: "relative",
      }}
    >
      <DataEditor
        getCellContent={getCell}
        columns={columns}
        rowHeight={pixelSize}
        rows={height}
        ref={gridRef}
      />
    </div>
  );
}

export default App;
