import { COIN_NAMES } from "@/lib/data";
import { CoinLogo } from "./coin-logo";

interface CoinProps {
  sym: string;
  sub?: string;
}

export function Coin({ sym, sub }: CoinProps) {
  return (
    <div className="flex items-center gap-[10px]">
      <CoinLogo sym={sym} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{COIN_NAMES[sym] || sym}</div>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>
          {sub ?? sym + "/USDT"}
        </div>
      </div>
    </div>
  );
}
