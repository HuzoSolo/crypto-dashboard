import { COIN_COLORS } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CoinLogoProps {
  sym: string;
  size?: number;
  className?: string;
}

export function CoinLogo({ sym, size = 28, className }: CoinLogoProps) {
  const color = COIN_COLORS[sym] || "#666";
  return (
    <div
      className={cn("grid place-items-center rounded-full font-bold text-white flex-shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: size * 0.4,
        boxShadow: "0 0 0 1px #ffffff10 inset",
      }}
    >
      {sym[0]}
    </div>
  );
}
