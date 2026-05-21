export const fmtUSD = (v: number, dec = 2) =>
  (v < 0 ? "-" : "") +
  "$" +
  Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

export const fmtNum = (v: number, dec = 2) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

export const fmtCompact = (v: number) => {
  if (Math.abs(v) >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  if (Math.abs(v) >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
  return fmtUSD(v);
};

export const fmtPct = (v: number, dec = 2) =>
  (v >= 0 ? "+" : "") + v.toFixed(dec) + "%";

export const fmtPrice = (p: number) =>
  p < 1
    ? p.toFixed(4)
    : p.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
