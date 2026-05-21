"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  List,
  Wallet,
  ArrowUpDown,
  Calendar,
  Target,
  BarChart3,
  Receipt,
} from "lucide-react";
import { Delta } from "@/components/crypto/delta";
import { fmtUSD } from "@/lib/fmt";
import { cn } from "@/lib/utils";

const NAV_GENERAL = [
  { id: "dashboard",  label: "Ana Sayfa",      icon: Home,       href: "/dashboard" },
  { id: "watchlist",  label: "Varlık Listesi", icon: List,       href: "/watchlist" },
  { id: "portfolio",  label: "Cüzdan",         icon: Wallet,     href: "/portfolio" },
  { id: "trades",     label: "İşlemler",       icon: ArrowUpDown, href: "/trades",  badge: "10" },
  { id: "calendar",   label: "Takvim",         icon: Calendar,   href: "/calendar" },
];

const NAV_FINANCE = [
  { id: "goals",          label: "Hedefler",  icon: Target,   href: "/goals",          badge: "4" },
  { id: "income-expense", label: "Gelir-Gider", icon: BarChart3, href: "/income-expense" },
  { id: "tax",            label: "Vergi",     icon: Receipt,  href: "/tax" },
];

interface SidebarProps {
  totalValue: number;
  totalDelta: number;
}

export function Sidebar({ totalValue, totalDelta }: SidebarProps) {
  const pathname = usePathname();

  const NavItem = ({
    item,
  }: {
    item: { id: string; label: string; icon: React.ElementType; href: string; badge?: string };
  }) => {
    const active = pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-[10px] px-[10px] py-[9px] rounded-[8px] text-[13px] font-medium transition-all duration-150 select-none",
          active
            ? "text-white"
            : "hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--text)]"
        )}
        style={
          active
            ? {
                background: "linear-gradient(135deg, var(--accent-grad-1), var(--accent-grad-2))",
                boxShadow: "0 4px 14px #16a34a40, 0 0 0 1px #ffffff10 inset",
                color: "#fff",
              }
            : undefined
        }
      >
        <Icon size={16} className="flex-shrink-0 opacity-90" />
        <span className="nav-label">{item.label}</span>
        {item.badge && (
          <span
            className="ml-auto text-[10px] font-semibold mono px-[6px] py-[2px] rounded-full"
            style={
              active
                ? { background: "#ffffff20", color: "#fff" }
                : { background: "var(--accent-soft)", color: "var(--accent-color)" }
            }
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className="flex flex-col gap-[6px] sticky top-0 h-screen overflow-y-auto"
      style={{
        width: 232,
        background: "var(--bg-elev)",
        borderRight: "1px solid var(--border-soft)",
        padding: "20px 14px",
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-[10px] pb-[14px] mb-[4px]"
        style={{ borderBottom: "1px solid var(--border-soft)", padding: "6px 8px 14px" }}
      >
        <div
          className="grid place-items-center rounded-[8px] text-white font-bold text-[14px]"
          style={{
            width: 30,
            height: 30,
            background: "linear-gradient(135deg, var(--accent-grad-1), var(--accent-grad-2))",
            boxShadow: "0 0 0 1px #ffffff14 inset, 0 4px 12px #16a34a33",
          }}
        >
          ₿
        </div>
        <div className="brand-text">
          <div className="font-semibold text-[14px] tracking-tight">Cryptolio</div>
          <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 1 }}>Personal tracker</div>
        </div>
      </div>

      {/* Genel */}
      <div
        className="nav-group-label"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "var(--text-mute)",
          textTransform: "uppercase",
          padding: "14px 10px 6px",
        }}
      >
        Genel
      </div>
      {NAV_GENERAL.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}

      {/* Finans */}
      <div
        className="nav-group-label"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "var(--text-mute)",
          textTransform: "uppercase",
          padding: "14px 10px 6px",
        }}
      >
        Finans
      </div>
      {NAV_FINANCE.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}

      {/* Footer: Total balance */}
      <div
        className="mt-auto rounded-[12px] p-[12px]"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
        }}
      >
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 11, color: "var(--text-mute)" }}>Toplam Bakiye</span>
          <span
            className="inline-flex items-center gap-[4px] text-[10px] font-semibold px-[7px] py-[2px] rounded-full"
            style={{ background: "var(--accent-soft)", color: "var(--accent-color)" }}
          >
            <span className="live-dot" />
            Live
          </span>
        </div>
        <div className="mono font-semibold" style={{ fontSize: 22, letterSpacing: "-0.02em", marginTop: 2 }}>
          {fmtUSD(totalValue, 0)}
        </div>
        <div className="extra flex items-center justify-between mt-[8px]" style={{ fontSize: 11, color: "var(--text-mute)" }}>
          <span>24s</span>
          <Delta value={totalDelta} />
        </div>
      </div>
    </aside>
  );
}
