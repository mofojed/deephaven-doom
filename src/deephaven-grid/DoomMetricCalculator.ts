import { GridMetricCalculator } from "@deephaven/grid";

export class DoomMetricCalculator extends GridMetricCalculator {
  getRowHeight(): number {
    return 1;
  }
  getColumnWidth(): number {
    return 1;
  }
}
