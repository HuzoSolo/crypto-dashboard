"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LayoutGrid, Search, RefreshCw, Bell, Sun, Moon, Settings, LogOut, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { authLogout } from "@/lib/api";

interface HeaderProps {
  pageTitle: string;
}

export function Header({ pageTitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const currentUser = useStore((s) => s.currentUser);

  const initials = currentUser
    ? currentUser.username.slice(0, 2).toUpperCase()
    : "—";

  const handleLogout = async () => {
    try { await authLogout(); } catch {}
    router.push("/login");
  };

  return (
    <header
      className="flex items-center gap-[16px] sticky top-0 z-10"
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-soft)",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        backdropFilter: "blur(12px)",
        height: 56,
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-[10px]" style={{ fontSize: 15, fontWeight: 600 }}>
        <div
          className="grid place-items-center rounded-[7px]"
          style={{
            width: 28,
            height: 28,
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            color: "var(--text-dim)",
          }}
        >
          <LayoutGrid size={14} />
        </div>
        <span>{pageTitle}</span>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-[8px] ml-[24px] flex-1"
        style={{
          maxWidth: 380,
          padding: "8px 12px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          borderRadius: 10,
          color: "var(--text-dim)",
          fontSize: 13,
        }}
      >
        <Search size={14} />
        <input
          placeholder="Ara: coin, işlem, etiket…"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            flex: 1,
            color: "var(--text)",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        />
        <span
          style={{
            fontSize: 10,
            color: "var(--text-mute)",
            border: "1px solid var(--border-soft)",
            padding: "1px 5px",
            borderRadius: 4,
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Tools */}
      <div className="ml-auto flex items-center gap-[10px]">
        <IconBtn title="Yenile">
          <RefreshCw size={15} />
        </IconBtn>
        <div style={{ position: "relative" }}>
          <IconBtn title="Bildirimler">
            <Bell size={15} />
          </IconBtn>
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--loss)",
            }}
          />
        </div>
        <IconBtn title="Tema değiştir" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </IconBtn>
        <IconBtn title="Ayarlar">
          <Settings size={15} />
        </IconBtn>

        {/* User chip */}
        <div
          className="flex items-center gap-[8px]"
          style={{
            padding: "4px 10px 4px 4px",
            border: "1px solid var(--border-soft)",
            background: "var(--bg-card)",
            borderRadius: 999,
          }}
        >
          <div
            className="grid place-items-center rounded-full text-white font-bold"
            style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              fontSize: 11,
            }}
          >
            {initials}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {currentUser ? currentUser.username : "…"}
          </span>
          <ChevronDown size={12} style={{ color: "var(--text-mute)" }} />
        </div>

        {/* Logout */}
        <IconBtn title="Çıkış yap" onClick={handleLogout}>
          <LogOut size={15} />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      className="grid place-items-center transition-all duration-150 hover:-translate-y-px"
      style={{
        width: 36,
        height: 36,
        border: "1px solid var(--border-soft)",
        background: "var(--bg-card)",
        borderRadius: 9,
        color: "var(--text-dim)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-color)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-soft)";
      }}
    >
      {children}
    </button>
  );
}
