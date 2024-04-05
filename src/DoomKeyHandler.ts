import { EventHandlerResult, KeyHandler } from "@deephaven/grid";
import { GridKeyboardEvent } from "@deephaven/grid/dist/KeyHandler";

export type KeyboardListener = (event: GridKeyboardEvent) => void;

export class DoomKeyHandler extends KeyHandler {
  private onKeyDown: KeyboardListener;
  private onKeyUp: KeyboardListener;

  constructor(
    onKeyDown: KeyboardListener,
    onKeyUp: KeyboardListener,
    order = 50
  ) {
    // We want this key handler to be very high priority, so we set the order to 50
    super(order);

    this.onKeyDown = onKeyDown;
    this.onKeyUp = onKeyUp;
  }

  onDown(event: GridKeyboardEvent): EventHandlerResult {
    this.onKeyDown(event);
    return true;
  }

  onUp(event: GridKeyboardEvent): EventHandlerResult {
    this.onKeyUp(event);
    return true;
  }
}
