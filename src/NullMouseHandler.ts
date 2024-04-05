import { EventHandlerResult, GridMouseHandler } from "@deephaven/grid";

/**
 * Grid mouse handler that just eats all the events
 */
class NullMouseHandler extends GridMouseHandler {
  constructor(order = 50) {
    super(order);
  }

  onDown(): EventHandlerResult {
    return true;
  }

  onUp(): EventHandlerResult {
    return true;
  }

  onMove(): EventHandlerResult {
    return true;
  }

  onEnter(): EventHandlerResult {
    return true;
  }

  onLeave(): EventHandlerResult {
    return true;
  }

  onClick(): EventHandlerResult {
    return true;
  }

  onDoubleClick(): EventHandlerResult {
    return true;
  }

  onContextMenu(): EventHandlerResult {
    return true;
  }

  onWheel(): EventHandlerResult {
    return true;
  }

  onDrag(): EventHandlerResult {
    return true;
  }
}

export default NullMouseHandler;
