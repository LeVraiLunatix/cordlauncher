import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { RefObject } from "react";
import { cn } from "../../lib/cn";
import { springSoft } from "../../lib/motion";
import { WindowControls } from "./WindowControls";

type TitleBarProps = {
  query: string;
  onQuery: (q: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
};

/**
 * Barre de titre maison. `data-tauri-drag-region="deep"` : on déplace la
 * fenêtre en tirant n'importe où dans la barre, sauf sur ce qui est
 * cliquable (champ, boutons) — Tauri 2.11 les exclut tout seul. Double-clic
 * = agrandir/restaurer, comme une vraie barre Windows.
 */
export function TitleBar({ query, onQuery, searchRef }: TitleBarProps) {
  return (
    <motion.header
      data-tauri-drag-region="deep"
      className="relative z-20 grid h-[52px] shrink-0 grid-cols-[1fr_auto_1fr] items-center"
      // Pas d'opacité sur la barre elle-même : elle contient le champ en
      // verre, qui perdrait son flou pendant le fondu (cf. styles.css).
      initial={{ y: -14 }}
      animate={{ y: 0, transition: { ...springSoft, delay: 0.05 } }}
    >
      <div className="flex items-center gap-2.5 pl-5">
        <motion.img
          layoutId="brand-logo"
          src="/logos/cordsuite.png"
          alt=""
          draggable={false}
          className="size-[22px] rounded-[6px] shadow-[0_2px_10px_-2px_rgb(110_88_240/0.7)]"
          transition={{ type: "spring", stiffness: 170, damping: 22 }}
        />
        <motion.span
          className="font-display text-[13.5px] font-semibold tracking-[-0.01em]"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0, transition: { ...springSoft, delay: 0.25 } }}
        >
          Cord<span className="text-fg-muted">Launcher</span>
        </motion.span>
      </div>

      <SearchField query={query} onQuery={onQuery} inputRef={searchRef} />

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.15 } }}
      >
        <WindowControls />
      </motion.div>
    </motion.header>
  );
}

function SearchField({
  query,
  onQuery,
  inputRef,
}: {
  query: string;
  onQuery: (q: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <motion.label
      className={cn(
        "glass glass-rim group relative flex h-9 w-[380px] items-center gap-2.5 rounded-full pr-2 pl-3.5 [--glass-blur:20px]",
        "transition-[width,background-color] duration-500 ease-(--ease-glass) focus-within:w-[440px] focus-within:bg-[var(--glass-fill-hover)]",
      )}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1, transition: { ...springSoft, delay: 0.12 } }}
    >
      <Search className="size-4 shrink-0 text-fg-subtle transition-colors group-focus-within:text-fg" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onQuery("");
            e.currentTarget.blur();
          }
        }}
        placeholder="Rechercher dans la suite…"
        spellCheck={false}
        className="relative z-[3] h-full min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-subtle"
      />
      <AnimatePresence mode="popLayout" initial={false}>
        {query ? (
          <motion.button
            key="clear"
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => onQuery("")}
            className="relative z-[3] grid size-6 place-items-center rounded-full bg-[var(--control)] text-fg-muted hover:bg-[var(--control-hover)] hover:text-fg"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <X className="size-3.5" />
          </motion.button>
        ) : (
          <motion.kbd
            key="kbd"
            className="relative z-[3] rounded-md bg-[var(--control)] px-1.5 py-0.5 font-mono text-[10.5px] text-fg-subtle ring-1 ring-[var(--line)] ring-inset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Ctrl K
          </motion.kbd>
        )}
      </AnimatePresence>
    </motion.label>
  );
}
