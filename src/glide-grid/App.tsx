import {
  CustomCell,
  CustomRenderer,
  DataEditor,
  DataEditorRef,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Doom from "../doom/Doom";

const width = 320;
const height = 200;
const pixelSize = 4;
const headerSize = 20;

type RenderCell = CustomCell<string>;

function App() {
  const gridRef = useRef<DataEditorRef>(null);
  const gridData = useMemo(() => {
    const newData: RenderCell[][] = [];
    for (let r = 0; r < height; r++) {
      const row: RenderCell[] = [];
      for (let c = 0; c < width; c++) {
        row.push({
          kind: GridCellKind.Custom,
          copyData: "",
          data: "", // Will fill in with the color of the cell when it's available
          allowOverlay: false,
        });
      }
      newData.push(row);
    }
    return newData;
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
        const newUpdates: { cell: Item }[] = [];
        for (let r = 0; r < height; r++) {
          const row = gridData[r];
          for (let c = 0; c < width; c++) {
            const colorIndex = (r * imageData.width * scale + c * scale) * 4;
            const color = `rgba(${data[colorIndex]}, ${data[colorIndex + 1]}, ${
              data[colorIndex + 2]
            })`;
            const cell = row[c] as RenderCell;
            if (cell.data !== color) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (cell as any).data = color;
              newUpdates.push({ cell: [c, r] });
            }
          }
        }
        if (newUpdates.length > 0) {
          gridRef.current?.updateCells(newUpdates);
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
    },
    [gridData]
  );

  const experimentalOptions = useMemo(() => {
    return { disableAccessibilityTree: true, disableMinimumCellWidth: true };
  }, []);

  const cellRenderer: CustomRenderer<RenderCell> = useMemo(() => {
    return {
      kind: GridCellKind.Custom,
      isMatch: (cell): cell is RenderCell => cell.kind === GridCellKind.Custom,
      draw: (args, cell) => {
        const { ctx, rect } = args;
        ctx.fillStyle = (cell as RenderCell).data as string;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      },
    };
  }, []);

  const customRenderers = useMemo(() => {
    return [cellRenderer];
  }, [cellRenderer]);

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
        customRenderers={customRenderers}
        experimental={experimentalOptions}
        columns={columns}
        rowHeight={pixelSize}
        rows={height}
        ref={gridRef}
      />
    </div>
  );
}

export default App;
