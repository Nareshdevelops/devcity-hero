import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

const XP_PER_LEVEL = 1000;

type GameState = {
  xp: number;
  level: number;
  xpInLevel: number;
  discovered: string[];
  unlocked: string[];
  award: (key: string, amount: number, label?: string) => void;
  unlockAchievement: (key: string, name: string, amount: number) => void;
};

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(250);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  const award = useCallback((key: string, amount: number, label?: string) => {
    setDiscovered((prev) => {
      if (prev.includes(key)) return prev;
      setXp((x) => x + amount);
      if (label) {
        toast.success(label, { description: `+${amount} XP (game score)` });
      }
      return [...prev, key];
    });
  }, []);

  const unlockAchievement = useCallback((key: string, name: string, amount: number) => {
    setUnlocked((prev) => {
      if (prev.includes(key)) return prev;
      setXp((x) => x + amount);
      toast("ACHIEVEMENT UNLOCKED", { description: `${name} · +${amount} XP` });
      return [...prev, key];
    });
  }, []);

  const value = useMemo<GameState>(
    () => ({
      xp,
      level: Math.floor(xp / XP_PER_LEVEL) + 1,
      xpInLevel: xp % XP_PER_LEVEL,
      discovered,
      unlocked,
      award,
      unlockAchievement,
    }),
    [xp, discovered, unlocked, award, unlockAchievement],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export const XP_GOAL = XP_PER_LEVEL;
