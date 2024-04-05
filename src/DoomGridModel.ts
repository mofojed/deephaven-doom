import {
  GridModel,
  GridMouseHandler,
  KeyHandler,
  NullableGridColor,
} from "@deephaven/grid";
import { DoomKeyHandler } from "./DoomKeyHandler";
import { GridKeyboardEvent } from "@deephaven/grid/dist/KeyHandler";
import { DoomMetricCalculator } from "./DoomMetricCalculator";
import NullMouseHandler from "./NullMouseHandler";

/**
 * Play Doom in the Browser using @deephaven/grid with the DoomGridModel!
 */
export class DoomGridModel extends GridModel {
  private width: number;
  private height: number;
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
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.keyHandler = new DoomKeyHandler(this.handleKeyDown, this.handleKeyUp);
    this.metricCalculator = new DoomMetricCalculator();
    this.mouseHandler = new NullMouseHandler();
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
    return "red";
  }

  private handleKeyDown(event: GridKeyboardEvent) {
    console.log("Key down", event.key);
  }

  private handleKeyUp(event: GridKeyboardEvent) {
    console.log("Key up", event.key);
  }
}
