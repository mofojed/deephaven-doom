import { useCallback, useMemo, useRef } from "react";
import "./App.css";
import { DoomGridModel } from "./DoomGridModel";
import { Grid, GridThemeType } from "@deephaven/grid";

function App() {
  // const memory = useMemo(() => new WebAssembly.Memory({ initial: 108 }), []);
  const gridRef = useRef<Grid>(null);
  const width = 640;
  const height = 400;
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

  const mouseHandlers = useMemo(() => {
    return [model.mouseHandler];
  }, [model]);

  const theme = useMemo(
    (): Partial<GridThemeType> => ({
      autoSizeRows: false,
      autoSizeColumns: false,
      rowHeight: 2,
      columnWidth: 2,
      rowHeaderWidth: 0,
      columnHeaderHeight: 0,
      gridColumnColor: null,
      gridRowColor: null,
      rowHoverBackgroundColor: null,
      columnHoverBackgroundColor: null,
      scrollBarSize: 0,
    }),
    []
  );

  return (
    <>
      <div
        style={{ width: width * 2, height: height * 2, position: "relative" }}
      >
        <Grid
          ref={gridRef}
          model={model}
          keyHandlers={keyHandlers}
          mouseHandlers={mouseHandlers}
          theme={theme}
        />
      </div>
    </>
  );
}

export default App;
