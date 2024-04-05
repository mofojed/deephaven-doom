import { useCallback, useMemo, useRef } from "react";
import "./App.css";
import { DoomGridModel } from "./DoomGridModel";
import { Grid, GridThemeType } from "@deephaven/grid";

function App() {
  const gridRef = useRef<Grid>(null);
  const width = 320;
  const height = 200;
  const pixelSize = 4;
  const onUpdate = useCallback(() => {
    gridRef.current?.forceUpdate();
  }, []);
  const model = useMemo(
    () => new DoomGridModel({ width, height, onUpdate }),
    [onUpdate]
  );

  const keyHandlers = useMemo(() => {
    return [model.keyHandler];
  }, [model]);

  // Enable to stop all mouse events
  // I have it turned off so you can still do selection in the grid, which kind of shows that it's more grid like.
  // const mouseHandlers = useMemo(() => {
  //   return [model.mouseHandler];
  // }, [model]);

  const theme = useMemo(
    (): Partial<GridThemeType> => ({
      autoSizeRows: false,
      autoSizeColumns: false,
      rowHeight: pixelSize,
      columnWidth: pixelSize,
      rowHeaderWidth: 0,
      columnHeaderHeight: 0,
      gridColumnColor: null,
      gridRowColor: null,
      rowHoverBackgroundColor: null,
      columnHoverBackgroundColor: null,
      scrollBarSize: 0,
      rowBackgroundColors: "transparent",
    }),
    []
  );

  return (
    <>
      <div
        style={{
          width: width * pixelSize,
          height: height * pixelSize,
          position: "relative",
        }}
      >
        <Grid
          ref={gridRef}
          model={model}
          keyHandlers={keyHandlers}
          // mouseHandlers={mouseHandlers}
          theme={theme}
        />
      </div>
    </>
  );
}

export default App;
