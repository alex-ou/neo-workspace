export const formatNumber = (x?: number) => Number(x?.toFixed(0));

export interface ViewBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
export function getViewBounds(elem?: HTMLElement) {
  const rect = elem?.getBoundingClientRect();
  return {
    x: formatNumber(rect?.x),
    y: formatNumber(rect?.y),
    width: Math.max(formatNumber(rect?.width) - 1, 0),
    height: Math.max(formatNumber(rect?.height) - 1, 0),
  };
}
