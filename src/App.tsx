import { useCallback, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { DoomGridModel } from "./DoomGridModel";
import { Grid, GridThemeType } from "@deephaven/grid";

function App() {
  // const memory = useMemo(() => new WebAssembly.Memory({ initial: 108 }), []);
  const gridRef = useRef<Grid>(null);
  const width = 640;
  const height = 400;
  const model = useMemo(() => new DoomGridModel({ width, height }), []);

  // const readWasmString = useCallback(
  //   (offset: number, length: number) => {
  //     const bytes = new Uint8Array(memory.buffer, offset, length);
  //     return new TextDecoder("utf8").decode(bytes);
  //   },
  //   [memory]
  // );

  // const consoleLogString = useCallback(
  //   (offset: number, length: number) => {
  //     const string = readWasmString(offset, length);
  //     console.log('"' + string + '"');
  //   },
  //   [readWasmString]
  // );

  // const drawScreen = useCallback(
  //   (ptr) => {
  //     console.log("in draw screen");
  //     const rawData = new Uint8ClampedArray(
  //       memory.buffer,
  //       ptr,
  //       width * height * 4
  //     );
  //     const imageData = new ImageData(rawData, width, height);

  //     const canvasContext = canvas.current?.getContext("2d");
  //     canvasContext?.putImageData(imageData, 0, 0);

  //     console.log("drawCanvas", ptr);
  //   },
  //   [memory.buffer]
  // );

  // const importObject = useMemo(
  //   () => ({
  //     env: { memory },
  //     js: {
  //       js_console_log: consoleLogString,
  //       js_stdout: consoleLogString,
  //       js_stderr: consoleLogString,
  //       js_milliseconds_since_start: () => performance.now(),
  //       js_draw_screen: drawScreen,
  //     },
  //   }),
  //   [consoleLogString, drawScreen, memory]
  // );

  // useEffect(() => {
  //   (async () => {
  //     const obj = await WebAssembly.instantiateStreaming(
  //       fetch(doomUrl),
  //       importObject
  //     );
  //     console.log("Obj is", obj);
  //     console.log("instance is", obj.instance);
  //     console.log("module is ", obj.module);
  //     console.log("exports is", obj.instance.exports);
  //     obj.instance.exports.main();

  //     function step() {
  //       obj.instance.exports.doom_loop_step();
  //       window.requestAnimationFrame(step);
  //     }
  //     window.requestAnimationFrame(step);
  //   })();
  // }, [importObject]);

  /** Start the draw loop */
  useEffect(() => {
    (async () => {
      function step() {
        gridRef.current?.forceUpdate();
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    })();
  }, []);

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
    }),
    []
  );

  return (
    <>
      <div style={{ width, height, position: "relative" }}>
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
