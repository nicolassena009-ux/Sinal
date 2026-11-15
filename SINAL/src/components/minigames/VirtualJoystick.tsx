import { useRef, useState, useCallback, useEffect } from "react";
import {
  calculateJoystickVector,
  clampKnobPosition,
  type JoystickVector,
  DEFAULT_DEADZONE,
} from "./joystick";

export interface VirtualJoystickProps {
  onChange: (vector: JoystickVector) => void;
  disabled?: boolean;
  size?: number; // Diâmetro da base em pixels (padrão: 120px)
  knobSize?: number; // Diâmetro do botão central em pixels (padrão: 48px)
  deadzone?: number;
  className?: string;
}

export function VirtualJoystick({
  onChange,
  disabled = false,
  size = 120,
  knobSize = 48,
  deadzone = DEFAULT_DEADZONE,
  className = "",
}: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  const maxRadius = (size - knobSize) / 2;

  const resetJoystick = useCallback(() => {
    activePointerId.current = null;
    setKnobPos({ x: 0, y: 0 });
    setIsPressed(false);
    onChange({ x: 0, y: 0, magnitude: 0, angle: 0, active: false });
  }, [onChange]);

  // Se o joystick for desabilitado (ex.: jogo pausado), reseta imediatamente
  useEffect(() => {
    if (disabled) {
      resetJoystick();
    }
  }, [disabled, resetJoystick]);

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseRef.current) return;
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      const vector = calculateJoystickVector(dx, dy, maxRadius, deadzone);
      const { visualX, visualY } = clampKnobPosition(dx, dy, maxRadius);

      setKnobPos({ x: visualX, y: visualY });
      onChange(vector);
    },
    [maxRadius, deadzone, onChange],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || activePointerId.current !== null) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignora erro em browsers que não suportam setPointerCapture em certos elementos
    }

    activePointerId.current = e.pointerId;
    setIsPressed(true);
    updatePointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    e.preventDefault();
    e.stopPropagation();
    updatePointer(e.clientX, e.clientY);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Fallback seguro
    }

    resetJoystick();
  };

  return (
    <div
      ref={baseRef}
      role="group"
      aria-label="Joystick virtual analógico para movimentação"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        touchAction: "none",
      }}
      className={`relative select-none rounded-full border-2 border-white/30 bg-black/35 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors ${
        disabled ? "opacity-40 pointer-events-none" : "cursor-grab active:cursor-grabbing"
      } ${className}`}
    >
      {/* Círculo guia interno e marcadores direcionais sutis */}
      <div
        className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"
        style={{ margin: `${knobSize / 2}px` }}
      />
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1 w-1.5 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-1 w-1.5 rounded-full bg-white/40 pointer-events-none" />

      {/* Botão Central Móvel (Thumb Knob) */}
      <div
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          left: `calc(50% - ${knobSize / 2}px)`,
          top: `calc(50% - ${knobSize / 2}px)`,
          transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
          transition: isPressed ? "none" : "transform 0.18s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
        className={`absolute rounded-full border-2 border-white/80 bg-gradient-to-b from-white/95 to-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.45)] pointer-events-none flex items-center justify-center ${
          isPressed ? "scale-95 border-[color:var(--amarelo)]" : ""
        }`}
      >
        {/* Detalhe central no botão */}
        <div className="h-4 w-4 rounded-full bg-[color:var(--roxo)]/30 border border-white/60" />
      </div>
    </div>
  );
}

