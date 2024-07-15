import {
  GridModel,
  GridMouseHandler,
  KeyHandler,
  NullableGridColor,
} from "@deephaven/grid";
import { DoomKeyHandler } from "./DoomKeyHandler";
import { GridKeyboardEvent } from "@deephaven/grid/dist/KeyHandler";
import NullMouseHandler from "../NullMouseHandler";
import Doom from "../doom/Doom";

/**
 * Play Doom in the Browser using @deephaven/grid with the DoomGridModel!
 */
export class DoomGridModel extends GridModel {
  private readonly width: number;
  private readonly height: number;
  private scale: number = 1;
  private readonly onUpdate: () => void;
  private imageData: ImageData | null = null;
  private doom: Doom | null = null;

  readonly keyHandler: KeyHandler;
  readonly mouseHandler: GridMouseHandler;

  constructor({
    width,
    height,
    onUpdate,
  }: {
    width: number;
    height: number;
    /** Triggered when there's an update to the screen */
    onUpdate: () => void;
  }) {
    super();
    this.width = width;
    this.height = height;
    this.onUpdate = onUpdate;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.keyHandler = new DoomKeyHandler(this.handleKeyDown, this.handleKeyUp);
    this.mouseHandler = new NullMouseHandler();

    this.initDoom();
  }

  private async initDoom() {
    this.doom = new Doom((imageData) => {
      this.imageData = imageData;
      this.scale = imageData.width / this.width;
      this.onUpdate();
    });
    await this.doom.start();
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
    if (this.imageData == null) {
      return "";
    }

    const { width, data } = this.imageData;

    // Gets the background colour from the image data
    const colorIndex = (row * width * this.scale + column * this.scale) * 4;
    const r = data[colorIndex];
    const g = data[colorIndex + 1];
    const b = data[colorIndex + 2];
    return `rgba(${r}, ${g}, ${b})`;
  }

  private handleKeyDown(event: GridKeyboardEvent) {
    console.log("Key down", event.key);
    this.doom?.keyDown(event instanceof Event ? event : event.nativeEvent);
  }

  private handleKeyUp(event: GridKeyboardEvent) {
    console.log("Key up", event.key);
    this.doom?.keyUp(event instanceof Event ? event : event.nativeEvent);
  }
}
