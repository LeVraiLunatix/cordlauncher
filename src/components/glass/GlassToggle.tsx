import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "../../lib/cn";

type GlassToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  className?: string;
};

const TRACK_W = 50;
const TRACK_H = 30;
const PAD = 3;
const KNOB = TRACK_H - PAD * 2;
const KNOB_PRESSED = KNOB + 7;

/**
 * Interrupteur façon iOS : la piste se remplit du dégradé en fondu, la
 * pastille glisse sur un ressort — et s'étire pendant qu'on appuie, comme
 * une goutte qu'on pousse.
 */
export function GlassToggle({ checked, onChange, disabled, label, className }: GlassToggleProps) {
  const [pressed, setPressed] = useState(false);
  const knobW = pressed ? KNOB_PRESSED : KNOB;
  const x = checked ? TRACK_W - PAD * 2 - knobW : 0;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={cn(
        "glass-inset relative shrink-0 rounded-full transition-opacity disabled:opacity-40",
        className,
      )}
      style={{ width: TRACK_W, height: TRACK_H, padding: PAD }}
    >
      <motion.span
        aria-hidden
        className="tint-fill absolute inset-0 rounded-full"
        initial={false}
        animate={{ opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        aria-hidden
        className="relative block rounded-full"
        style={{
          height: KNOB,
          background: "var(--knob)",
          boxShadow:
            "0 3px 8px rgb(0 0 0 / 0.25), 0 1px 2px rgb(0 0 0 / 0.2), inset 0 -1px 1px rgb(0 0 0 / 0.06)",
        }}
        initial={false}
        animate={{ x, width: knobW }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
      />
    </button>
  );
}
