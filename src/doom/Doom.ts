import doomUrl from "./doom.wasm?url";

// Width of the game screen. Not sure how to set this dynamically, or if it's possible to.
const WIDTH = 640;
const HEIGHT = 400;

type DoomInstance = {
  main: () => void;
  add_browser_event: (event: number, keyCode: number) => void;
  doom_loop_step: () => void;
};

function getDoomKeyCode(event: KeyboardEvent): number {
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

class Doom {
  private readonly onUpdate: (imageData: ImageData) => void;
  private readonly memory: WebAssembly.Memory;
  private animationFrameId: number | null = null;
  private doomInstance: DoomInstance | null = null;

  /**
   * Create a new Doom instance
   *
   * @param onUpdate Callback to update the screen with new image data
   */
  constructor(onUpdate: (imageData: ImageData) => void) {
    this.consoleErrorString = this.consoleErrorString.bind(this);
    this.consoleLogString = this.consoleLogString.bind(this);
    this.handleDrawScreen = this.handleDrawScreen.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.onUpdate = onUpdate;

    this.memory = new WebAssembly.Memory({ initial: 108 });
  }

  /** Start the Doom instance and loop rendering */
  async start() {
    const response = await fetch(doomUrl);

    const wasm = await WebAssembly.instantiateStreaming(response, {
      env: { memory: this.memory },
      js: {
        js_console_log: this.consoleLogString,
        js_stdout: this.consoleLogString,
        js_stderr: this.consoleErrorString,
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
    this.startRenderLoop();
  }

  /** Stop the render loop */
  async stop() {
    this.stopRenderLoop();
  }

  private startRenderLoop() {
    const render = () => {
      if (this.doomInstance === null) {
        throw new Error("Doom instance is null");
      }
      this.doomInstance.doom_loop_step();
      this.animationFrameId = window.requestAnimationFrame(render);
    };

    this.animationFrameId = window.requestAnimationFrame(render);
  }

  /** Send a keydown event to the doom instance */
  keyDown(event: KeyboardEvent) {
    if (this.doomInstance === null) {
      throw new Error("Doom instance is null");
    }
    this.doomInstance.add_browser_event(0, getDoomKeyCode(event));
  }

  /** Send a keyup event to the doom instance */
  keyUp(event: KeyboardEvent) {
    if (this.doomInstance === null) {
      throw new Error("Doom instance is null");
    }
    this.doomInstance.add_browser_event(1, getDoomKeyCode(event));
  }

  private stopRenderLoop() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
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
    const rawData = new Uint8ClampedArray(
      this.memory.buffer,
      ptr,
      WIDTH * HEIGHT * 4
    );

    const imageData = new ImageData(rawData, WIDTH, HEIGHT);

    this.onUpdate(imageData);
  }
}

export default Doom;
