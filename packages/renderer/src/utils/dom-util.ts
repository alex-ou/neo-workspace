export const formatNumber = (x?: number) => Number(x?.toFixed(0));

export function getViewBounds(elem?: HTMLElement) {
  const rect = elem?.getBoundingClientRect();
  return {
    x: formatNumber(rect?.x),
    y: formatNumber(rect?.y),
    width: formatNumber(rect?.width),
    height: formatNumber(rect?.height),
  };
}
