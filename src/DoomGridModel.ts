import {
  GridModel,
  GridMouseHandler,
  KeyHandler,
  NullableGridColor,
} from "@deephaven/grid";
import doomUrl from "./assets/doom.wasm?url";
import { DoomKeyHandler } from "./DoomKeyHandler";
import { GridKeyboardEvent } from "@deephaven/grid/dist/KeyHandler";
import { DoomMetricCalculator } from "./DoomMetricCalculator";
import NullMouseHandler from "./NullMouseHandler";

type DoomInstance = {
  main: () => void;
  add_browser_event: (event: number, keyCode: number) => void;
  doom_loop_step: () => void;
};

function getDoomKeyCode(event: GridKeyboardEvent): number {
  const { keyCode } = event;

  // Doom seems to use mostly the same keycodes, except for the following (maybe I'm missing a few.)
  switch (keyCode) {
    case 8:
      return 127; // KEY_BACKSPACE
    case 17:
      return 0x80 + 0x1d; // KEY_RCTRL
    case 18:
      return 0x80 + 0x38; // KEY_RALT
    case 37:
      return 0xac; // KEY_LEFTARROW
    case 38:
      return 0xad; // KEY_UPARROW
    case 39:
      return 0xae; // KEY_RIGHTARROW
    case 40:
      return 0xaf; // KEY_DOWNARROW
    default:
      if (keyCode >= 65 /*A*/ && keyCode <= 90 /*Z*/) {
        return keyCode + 32; // ASCII to lower case
      }
      if (keyCode >= 112 /*F1*/ && keyCode <= 123 /*F12*/) {
        return keyCode + 75; // KEY_F1
      }
      return keyCode;
  }
}

/**
 * Play Doom in the Browser using @deephaven/grid with the DoomGridModel!
 */
export class DoomGridModel extends GridModel {
  private width: number;
  private height: number;
  private memory: WebAssembly.Memory;
  private imageData: ImageData | null = null;
  private doomInstance: DoomInstance | null = null;

  readonly keyHandler: KeyHandler;
  readonly metricCalculator: DoomMetricCalculator;
  readonly mouseHandler: GridMouseHandler;

  constructor(
    { width, height }: { width: number; height: number } = {
      width: 640,
      height: 400,
    }
  ) {
    super();
    this.width = width;
    this.height = height;
    this.consoleErrorString = this.consoleErrorString.bind(this);
    this.consoleLogString = this.consoleLogString.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleDrawScreen = this.handleDrawScreen.bind(this);
    this.keyHandler = new DoomKeyHandler(this.handleKeyDown, this.handleKeyUp);
    this.metricCalculator = new DoomMetricCalculator();
    this.mouseHandler = new NullMouseHandler();
    this.memory = new WebAssembly.Memory({ initial: 108 });

    this.initDoom();
  }

  private async initDoom() {
    const response = await fetch(doomUrl);
    const wasm = await WebAssembly.instantiateStreaming(response, {
      env: { memory: this.memory },
      js: {
        js_console_log: this.consoleLogString,
        js_stdout: this.consoleLogString,
        js_stderr: this.consoleLogString,
        js_milliseconds_since_start: () => performance.now(),
        js_draw_screen: this.handleDrawScreen,
      },
    });
    console.log("Obj is", wasm);
    console.log("instance is", wasm.instance);
    console.log("module is ", wasm.module);
    console.log("exports is", wasm.instance.exports);

    const doomInstance = wasm.instance.exports as DoomInstance;
    doomInstance.main();

    this.doomInstance = doomInstance;

    function step() {
      // console.log("step");
      doomInstance.doom_loop_step();
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  private readWasmString(offset: number, length: number): string {
    const bytes = new Uint8Array(this.memory.buffer, offset, length);
    return new TextDecoder("utf8").decode(bytes);
  }

  private consoleLogString(offset: number, length: number): void {
    const string = this.readWasmString(offset, length);
    console.log('"' + string + '"');
  }

  private consoleErrorString(offset: number, length: number): void {
    const string = this.readWasmString(offset, length);
    console.error('"' + string + '"');
  }

  private handleDrawScreen(ptr: number): void {
    // console.log("in draw screen");
    const rawData = new Uint8ClampedArray(
      this.memory.buffer,
      ptr,
      this.width * this.height * 4
    );

    this.imageData = new ImageData(rawData, this.width, this.height);

    // console.log("this.imageData is", this.imageData.data);
  }

  get rowCount(): number {
    return this.height;
  }

  get columnCount(): number {
    return this.width;
  }

  textForCell(): string {
    return "";
  }

  textForColumnHeader(): string | undefined {
    return "";
  }

  backgroundColorForCell(column: number, row: number): NullableGridColor {
    // const frame = context.getImageData(0, 0, width, height);
    // const l = frame.data.length / 4;

    // for (let i = 0; i < l; i++) {
    //   const grey =
    //     (frame.data[i * 4 + 0] +
    //       frame.data[i * 4 + 1] +
    //       frame.data[i * 4 + 2]) /
    //     3;

    //   frame.data[i * 4 + 0] = grey;
    //   frame.data[i * 4 + 1] = grey;
    //   frame.data[i * 4 + 2] = grey;
    // }

    // Need to get the color from the imageData. It's a one dimensional array of RGBA values, from top-left to bottom-right.
    // The color for the cell at column, row is at index (row * width + column) * 4.
    // The color for the red channel is at index (row * width + column) * 4.
    // The color for the green channel is at index (row * width + column) * 4 + 1.
    // The color for the blue channel is at index (row * width + column) * 4 + 2.
    // The color for the alpha channel is at index (row * width + column) * 4 + 3.
    // return "red";
    // console.log("Image data blah", this.imageData);
    const r = this.imageData?.data[(row * this.width + column) * 4];
    const g = this.imageData?.data[(row * this.width + column) * 4 + 1];
    const b = this.imageData?.data[(row * this.width + column) * 4 + 2];
    return `rgba(${r}, ${g}, ${b}, 255)`;
  }

  private handleKeyDown(event: GridKeyboardEvent) {
    console.log("Key down", event.key);
    this.doomInstance?.add_browser_event(0, getDoomKeyCode(event));
  }

  private handleKeyUp(event: GridKeyboardEvent) {
    console.log("Key up", event.key);
    this.doomInstance?.add_browser_event(1, getDoomKeyCode(event));
  }
}
